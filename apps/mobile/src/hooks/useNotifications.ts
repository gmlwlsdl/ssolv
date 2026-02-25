import { RefObject, useCallback, useEffect, useRef } from 'react';

import messaging from '@react-native-firebase/messaging';
import { Alert } from 'react-native';
import { WebView } from 'react-native-webview';

/** 네이티브 → WebView 메시지 타입 */
type FCMTokenMessage = { type: 'fcmToken'; token: string };
type NotificationOpenedMessage = { type: 'notificationOpened'; data: Record<string, string> };
export type NativeToWebMessage = FCMTokenMessage | NotificationOpenedMessage;

interface UseNotificationsProps {
  webViewRef: RefObject<WebView | null>;
}

/**
 * @description 직렬화된 메시지를 WebView의 `nativeMessage` 이벤트로 디스패치합니다.
 */
const injectMessage = (
  webViewRef: RefObject<WebView | null>,
  message: NativeToWebMessage
): void => {
  webViewRef.current?.injectJavaScript(`
    (function() {
      try {
        window.dispatchEvent(new MessageEvent('nativeMessage', {
          data: ${JSON.stringify(JSON.stringify(message))}
        }));
      } catch(e) {}
    })();
    true;
  `);
};

/**
 * @description Firebase Cloud Messaging 푸시 알림 훅.
 *
 * - 알림 권한 요청 및 FCM 토큰 발급
 * - WebView 로드 완료 후 FCM 토큰을 WebView로 전달 (`nativeMessage` 이벤트)
 * - 포그라운드 / 백그라운드 / 종료 상태 알림 이벤트 처리
 *
 * @param webViewRef WebView 컴포넌트의 ref
 * @returns `onWebViewLoad` - WebView의 `onLoadEnd` prop에 연결해야 합니다.
 *
 * @sideeffect FCM 권한 요청 다이얼로그 표시, Firebase 리스너 등록
 */
export const useNotifications = ({ webViewRef }: UseNotificationsProps) => {
  /** WebView 준비 전 수신된 메시지를 보관하는 큐 */
  const pendingRef = useRef<NativeToWebMessage[]>([]);
  const isReadyRef = useRef(false);

  /**
   * @description WebView 준비 여부에 따라 즉시 전송하거나 큐에 보관합니다.
   */
  const send = useCallback(
    (message: NativeToWebMessage) => {
      if (isReadyRef.current) {
        injectMessage(webViewRef, message);
      } else {
        pendingRef.current.push(message);
      }
    },
    [webViewRef]
  );

  /**
   * @description WebView `onLoadEnd`에 연결합니다.
   * 큐에 쌓인 대기 메시지를 모두 WebView로 전송합니다.
   */
  const onWebViewLoad = useCallback(() => {
    isReadyRef.current = true;
    pendingRef.current.forEach((msg) => injectMessage(webViewRef, msg));
    pendingRef.current = [];
  }, [webViewRef]);

  // 권한 요청 + 토큰 발급
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
        console.warn('[FCM] 디바이스 토큰:', token);
        send({ type: 'fcmToken', token });
      } catch (err) {
        console.error('[FCM] 토큰 발급 실패:', err);
      }
    };

    init();

    const unsubscribeRefresh = messaging().onTokenRefresh((token) => {
      send({ type: 'fcmToken', token });
    });

    return () => unsubscribeRefresh();
  }, [send]);

  // 알림 이벤트 처리
  useEffect(() => {
    // 종료 상태에서 알림 탭으로 앱 시작
    messaging()
      .getInitialNotification()
      .then((msg) => {
        if (msg?.data) {
          send({ type: 'notificationOpened', data: msg.data as Record<string, string> });
        }
      });

    // 백그라운드 상태에서 알림 탭
    const unsubscribeOpened = messaging().onNotificationOpenedApp((msg) => {
      if (msg?.data) {
        send({ type: 'notificationOpened', data: msg.data as Record<string, string> });
      }
    });

    // 포그라운드 알림 수신
    const unsubscribeForeground = messaging().onMessage(async (msg) => {
      // 포그라운드에서는 시스템 배너가 표시되지 않으므로 Alert으로 대체
      Alert.alert(msg.notification?.title ?? '알림', msg.notification?.body ?? '');

      if (msg.data) {
        send({ type: 'notificationOpened', data: msg.data as Record<string, string> });
      }
    });

    return () => {
      unsubscribeOpened();
      unsubscribeForeground();
    };
  }, [send]);

  return { onWebViewLoad };
};
