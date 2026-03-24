import { useEffect } from 'react';

import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';

const APNS_POLL_INTERVAL_MS = 500;
const APNS_MAX_ATTEMPTS = 10; // 최대 5초 대기
const APNS_RETRY_DELAY_MS = 10_000; // 타임아웃 후 재시도 대기

/**
 * @description iOS에서 APNs 토큰이 준비될 때까지 폴링으로 대기.
 *
 * FCM 토큰 발급 전 APNs 토큰이 없으면 `[messaging/unknown] No APNS token` 오류가 발생하므로
 * 준비 여부를 확인한 뒤 진행해야 합니다.
 *
 * @returns APNs 토큰 (준비 완료) 또는 null (타임아웃)
 */
const waitForApnsToken = async (isCancelled: () => boolean): Promise<string | null> => {
  for (let attempt = 0; attempt < APNS_MAX_ATTEMPTS; attempt++) {
    if (isCancelled()) return null;
    const apnsToken = await messaging().getAPNSToken();
    if (apnsToken) return apnsToken;
    if (attempt < APNS_MAX_ATTEMPTS - 1) {
      await new Promise((resolve) => setTimeout(resolve, APNS_POLL_INTERVAL_MS));
    }
  }
  return null;
};

/**
 * @description FCM 토큰 생애주기를 관리하는 훅.
 *
 * - 권한 요청 및 초기 토큰 발급
 * - iOS: APNs 토큰 준비 대기 후 FCM 토큰 발급. 타임아웃 시 10초 후 1회 재시도.
 * - 토큰 갱신 구독
 *
 * @param onToken - 토큰이 발급/갱신될 때 호출되는 콜백
 *
 * @sideeffect FCM 권한 요청 다이얼로그 표시, Firebase 리스너 등록
 */
export const useFcmToken = (onToken: (token: string) => void) => {
  useEffect(() => {
    let cancelled = false;
    let retryTimer: ReturnType<typeof setTimeout> | null = null;

    const fetchFcmToken = async (): Promise<boolean> => {
      if (Platform.OS === 'ios') {
        const apnsToken = await waitForApnsToken(() => cancelled);
        if (!apnsToken) return false;
      }

      if (cancelled) return false;
      const token = await messaging().getToken();
      if (cancelled) return false;
      onToken(token);
      return true;
    };

    const init = async () => {
      const status = await messaging().requestPermission();
      const granted =
        status === messaging.AuthorizationStatus.AUTHORIZED ||
        status === messaging.AuthorizationStatus.PROVISIONAL;

      if (!granted) return;

      try {
        await messaging().registerDeviceForRemoteMessages();
        const success = await fetchFcmToken();

        if (!success && !cancelled) {
          retryTimer = setTimeout(async () => {
            try {
              await fetchFcmToken();
            } catch (err) {
              console.error('[FCM] 토큰 발급 재시도 실패:', err);
            }
          }, APNS_RETRY_DELAY_MS);
        }
      } catch (err) {
        console.error('[FCM] 토큰 발급 실패:', err);
      }
    };

    init();

    const unsubscribeRefresh = messaging().onTokenRefresh(onToken);
    return () => {
      cancelled = true;
      unsubscribeRefresh();
      if (retryTimer) clearTimeout(retryTimer);
    };
  }, [onToken]);
};
