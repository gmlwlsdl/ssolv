'use client';

import { useEffect } from 'react';

import { useRouter } from 'next/navigation';

import { FCM_TOKEN_STORAGE_KEY, registerFcmToken } from '@/services/notification';

import type { FcmPlatform } from '@/data/models/notification';

type NativeMessageEvent =
  | { type: 'fcmToken'; token: string }
  | { type: 'notificationOpened'; data: { path: string } };

/**
 * iOS/Android 여부를 userAgent로 감지
 *
 * @returns FCM 플랫폼 타입
 *
 * @todo 모바일 앱에서 nativeMessage에 platform 필드를 추가하면 이 함수는 제거 예정
 */
const detectPlatform = (): FcmPlatform => {
  const ua = navigator.userAgent.toLowerCase();
  return /iphone|ipad|ipod/.test(ua) ? 'ios' : 'android';
};

/**
 * 모바일 앱(React Native WebView)에서 전송하는 `nativeMessage` 이벤트를 처리하는 훅
 *
 * - `fcmToken`: localStorage 저장 및 백엔드 FCM 토큰 등록
 * - `notificationOpened`: 알림 딥링크 경로로 라우팅
 */
const useNativeMessage = () => {
  const router = useRouter();

  useEffect(() => {
    const handleNativeMessage = async (event: MessageEvent) => {
      let parsed: NativeMessageEvent;

      try {
        parsed = JSON.parse(event.data as string) as NativeMessageEvent;
      } catch {
        return;
      }

      if (parsed.type === 'fcmToken') {
        const { token } = parsed;
        localStorage.setItem(FCM_TOKEN_STORAGE_KEY, token);

        try {
          await registerFcmToken({ fcmToken: token, platform: detectPlatform() });
        } catch (error) {
          console.error('FCM 토큰 등록 실패:', error instanceof Error ? error.message : error);
        }
        return;
      }

      if (parsed.type === 'notificationOpened') {
        router.push(parsed.data.path);
      }
    };

    window.addEventListener('nativeMessage', handleNativeMessage as unknown as EventListener);
    return () => {
      window.removeEventListener('nativeMessage', handleNativeMessage as unknown as EventListener);
    };
  }, [router]);
};

export default useNativeMessage;
