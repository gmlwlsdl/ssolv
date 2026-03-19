import { useEffect } from 'react';

import messaging from '@react-native-firebase/messaging';
import { Alert } from 'react-native';

import { track } from '../lib/analytics';

/** FCM 알림 타입 → 딥링크 경로 맵 */
const NOTIFICATION_PATH_MAP: Record<string, (meetingToken: string) => string> = {
  MEETING_RESULT_READY: (token) => `/meetings/${token}/result/overview`,
};

/**
 * @description FCM data 필드에서 딥링크 경로를 결정합니다.
 *
 * - FCM data에 `path`가 포함된 경우 그대로 사용합니다.
 * - 없는 경우 `type + meetingToken`으로 경로를 생성합니다.
 *
 * @param data - FCM 메시지의 data 필드
 * @returns 딥링크 경로 (결정 불가 시 undefined)
 */
const resolveNotificationPath = (data: Record<string, string>): string | undefined => {
  if (data.path) return data.path;

  const { type, meetingToken } = data;
  if (!type || !meetingToken) return undefined;

  return NOTIFICATION_PATH_MAP[type]?.(meetingToken);
};

/**
 * @description FCM 알림 이벤트(종료/백그라운드/포그라운드)를 처리하는 훅.
 *
 * @param onPath - 딥링크 경로가 결정됐을 때 호출되는 콜백
 *
 * @sideeffect Firebase 리스너 등록, 포그라운드 알림 Alert 표시
 */
export const useFcmNotificationEvents = (onPath: (path: string) => void) => {
  useEffect(() => {
    // 종료 상태에서 알림 탭으로 앱 시작
    messaging()
      .getInitialNotification()
      .then((msg) => {
        if (!msg?.data) return;
        const data = msg.data as Record<string, string>;
        const path = resolveNotificationPath(data);
        if (path) {
          track.pushOpened({
            push_type: data.type ?? 'unknown',
            ...(data.meetingToken && { meeting_id: data.meetingToken }),
          });
          onPath(path);
        }
      });

    // 백그라운드 상태에서 알림 탭
    const unsubscribeOpened = messaging().onNotificationOpenedApp((msg) => {
      if (!msg?.data) return;
      const data = msg.data as Record<string, string>;
      const path = resolveNotificationPath(data);
      if (path) {
        track.pushOpened({
          push_type: data.type ?? 'unknown',
          ...(data.meetingToken && { meeting_id: data.meetingToken }),
        });
        onPath(path);
      }
    });

    // 포그라운드 알림 수신 - 시스템 배너가 표시되지 않으므로 Alert으로 대체
    // 사용자가 '확인' 버튼을 탭했을 때만 딥링크로 이동
    const unsubscribeForeground = messaging().onMessage(async (msg) => {
      const data = msg.data as Record<string, string> | undefined;
      const path = data ? resolveNotificationPath(data) : undefined;

      Alert.alert(
        msg.notification?.title ?? '알림',
        msg.notification?.body ?? '',
        path
          ? [
              { text: '나중에', style: 'cancel' },
              {
                text: '확인',
                onPress: () => {
                  track.pushOpened({
                    push_type: data?.type ?? 'unknown',
                    ...(data?.meetingToken && { meeting_id: data.meetingToken }),
                  });
                  onPath(path);
                },
              },
            ]
          : [{ text: '확인' }]
      );
    });

    return () => {
      unsubscribeOpened();
      unsubscribeForeground();
    };
  }, [onPath]);
};
