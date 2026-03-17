import { RefObject, useCallback, useRef } from 'react';

import { WebView } from 'react-native-webview';

import type { NativeToWebMessage } from './useNotifications';

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
 * @description WebView를 딥링크 경로로 직접 이동시킵니다.
 *
 * nativeMessage 이벤트 방식은 React useEffect 리스너 등록 타이밍에 따라
 * 이벤트가 유실될 수 있어, window.location.replace를 사용합니다.
 */
const injectNavigate = (webViewRef: RefObject<WebView | null>, path: string): void => {
  webViewRef.current?.injectJavaScript(`
    (function() {
      try { window.location.replace(${JSON.stringify(path)}); } catch(e) {}
    })();
    true;
  `);
};

/**
 * @description 메시지 타입에 따라 올바른 WebView 전송 방식을 선택합니다.
 *
 * - `notificationOpened`: window.location.replace로 직접 이동 (이벤트 유실 방지)
 * - 그 외: nativeMessage 이벤트로 전달
 */
const dispatchMessage = (
  webViewRef: RefObject<WebView | null>,
  message: NativeToWebMessage
): void => {
  if (message.type === 'notificationOpened') {
    injectNavigate(webViewRef, message.data.path);
  } else {
    injectMessage(webViewRef, message);
  }
};

interface UseWebViewMessageQueueProps {
  webViewRef: RefObject<WebView | null>;
}

/**
 * @description WebView 준비 전 메시지를 큐에 보관하고, 준비 후 일괄 전송하는 훅.
 *
 * @param webViewRef WebView 컴포넌트의 ref
 * @returns `send` - 메시지 전송 함수, `onWebViewLoad` - WebView `onLoadEnd` prop에 연결
 */
export const useWebViewMessageQueue = ({ webViewRef }: UseWebViewMessageQueueProps) => {
  const pendingRef = useRef<NativeToWebMessage[]>([]);
  const isReadyRef = useRef(false);

  /**
   * @description WebView 준비 여부에 따라 즉시 전송하거나 큐에 보관합니다.
   */
  const send = useCallback(
    (message: NativeToWebMessage) => {
      if (isReadyRef.current) {
        dispatchMessage(webViewRef, message);
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
    pendingRef.current.forEach((msg) => dispatchMessage(webViewRef, msg));
    pendingRef.current = [];
  }, [webViewRef]);

  return { send, onWebViewLoad };
};
