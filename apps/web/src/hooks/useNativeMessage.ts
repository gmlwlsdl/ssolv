'use client';

import { useCallback, useEffect } from 'react';

import { useRouter } from 'next/navigation';

import useFcmTokenHandler from './useFcmTokenHandler';

type NativeMessageEvent =
  | { type: 'fcmToken'; token: string }
  | { type: 'notificationOpened'; data: { path: string } };

/**
 * 모바일 앱(React Native WebView)에서 전송하는 `nativeMessage` 이벤트를 처리하는 훅
 *
 * - `fcmToken`: FCM 토큰 저장 및 백엔드 등록 (`useFcmTokenHandler` 위임)
 * - `notificationOpened`: 알림 딥링크 경로로 라우팅
 */
const useNativeMessage = () => {
  const router = useRouter();
  const handleFcmToken = useFcmTokenHandler();

  const dispatch = useCallback(
    async (parsed: NativeMessageEvent) => {
      if (parsed.type === 'fcmToken') {
        await handleFcmToken(parsed.token);
        return;
      }

      if (parsed.type === 'notificationOpened') {
        router.push(parsed.data.path);
      }
    },
    [handleFcmToken, router]
  );

  useEffect(() => {
    const handleNativeMessage = async (event: MessageEvent) => {
      let parsed: NativeMessageEvent;

      try {
        parsed = JSON.parse(event.data as string) as NativeMessageEvent;
      } catch {
        return;
      }

      await dispatch(parsed);
    };

    window.addEventListener('nativeMessage', handleNativeMessage as unknown as EventListener);
    return () => {
      window.removeEventListener('nativeMessage', handleNativeMessage as unknown as EventListener);
    };
  }, [dispatch]);
};

export default useNativeMessage;
