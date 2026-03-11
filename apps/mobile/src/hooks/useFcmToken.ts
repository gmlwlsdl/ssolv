import { useEffect } from 'react';

import messaging from '@react-native-firebase/messaging';

/**
 * @description FCM 토큰 생애주기를 관리하는 훅.
 *
 * - 권한 요청 및 초기 토큰 발급
 * - 토큰 갱신 구독
 *
 * @param onToken - 토큰이 발급/갱신될 때 호출되는 콜백
 *
 * @sideeffect FCM 권한 요청 다이얼로그 표시, Firebase 리스너 등록
 */
export const useFcmToken = (onToken: (token: string) => void) => {
  useEffect(() => {
    const init = async () => {
      const status = await messaging().requestPermission();
      const granted =
        status === messaging.AuthorizationStatus.AUTHORIZED ||
        status === messaging.AuthorizationStatus.PROVISIONAL;

      if (!granted) return;

      try {
        await messaging().registerDeviceForRemoteMessages();
        const token = await messaging().getToken();
        onToken(token);
      } catch (err) {
        console.error('[FCM] 토큰 발급 실패:', err);
      }
    };

    init();

    const unsubscribeRefresh = messaging().onTokenRefresh(onToken);
    return () => unsubscribeRefresh();
  }, [onToken]);
};
