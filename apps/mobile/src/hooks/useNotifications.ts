import { RefObject, useCallback } from 'react';

import { WebView } from 'react-native-webview';

import { useFcmNotificationEvents } from './useFcmNotificationEvents';
import { useFcmToken } from './useFcmToken';
import { useWebViewMessageQueue } from './useWebViewMessageQueue';

/** 네이티브 → WebView 메시지 타입 */
type FCMTokenMessage = { type: 'fcmToken'; token: string };
type NotificationOpenedMessage = { type: 'notificationOpened'; data: { path: string } };
export type NativeToWebMessage = FCMTokenMessage | NotificationOpenedMessage;

interface UseNotificationsProps {
  webViewRef: RefObject<WebView | null>;
}

/**
 * @description Firebase Cloud Messaging 푸시 알림 훅.
 *
 * FCM 토큰 생애주기(`useFcmToken`), 알림 이벤트 처리(`useFcmNotificationEvents`),
 * WebView 메시지 큐(`useWebViewMessageQueue`)를 조합합니다.
 *
 * @param webViewRef WebView 컴포넌트의 ref
 * @returns `onWebViewLoad` - WebView의 `onLoadEnd` prop에 연결해야 합니다.
 */
export const useNotifications = ({ webViewRef }: UseNotificationsProps) => {
  const { send, onWebViewLoad } = useWebViewMessageQueue({ webViewRef });

  const handleToken = useCallback((token: string) => send({ type: 'fcmToken', token }), [send]);

  const handlePath = useCallback(
    (path: string) => send({ type: 'notificationOpened', data: { path } }),
    [send]
  );

  useFcmToken(handleToken);
  useFcmNotificationEvents(handlePath);

  return { onWebViewLoad };
};
