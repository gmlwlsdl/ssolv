import { RefObject, useCallback } from 'react';

import * as Linking from 'expo-linking';
import { WebView } from 'react-native-webview';

import type {
  WebViewErrorEvent,
  WebViewHttpErrorEvent,
  WebViewOpenWindowEvent,
} from 'react-native-webview/lib/WebViewTypes';

interface UseWebViewHandlersProps {
  webViewRef: RefObject<WebView | null>;
  webAppUrl: string;
  onPopupOpen: (url: string) => void;
}

const KAKAO_DOMAIN = 'kakao.com';
/** 카카오링크/카카오톡 공유 시 앱을 직접 실행하는 커스텀 URL 스킴 목록 */
const KAKAO_CUSTOM_SCHEMES = new Set(['kakaolink', 'kakaokompassauth', 'kakaotalk']);

const APPLE_DOMAIN = 'appleid.apple.com';

/**
 * @description WebView 관련 핸들러들을 제공하는 커스텀 훅으로,
 * WebView의 페이지 로드 요청 처리 및 에러 발생 시 동작을 정의합니다.
 *
 * @author 박희진
 */

export const useWebViewHandlers = ({
  webViewRef,
  webAppUrl,
  onPopupOpen,
}: UseWebViewHandlersProps) => {
  /**
   * @description WebView에서 페이지 로드를 시작하기 전에 호출되는 핸들러로,
   * 웹앱 URL, 카카오 전체 도메인(*.kakao.com)은 WebView에서 처리하고,
   * 카카오 커스텀 URL 스킴(kakaolink://)은 네이티브 앱으로 전달하며,
   * 그 외 외부 링크는 기본 브라우저에서 처리합니다.
   */
  const handleShouldStartLoadWithRequest = useCallback(
    (request: { url: string }): boolean => {
      const { url } = request;

      try {
        const urlObj = new URL(url);
        const webAppHost = new URL(webAppUrl).hostname;
        const scheme = urlObj.protocol.replace(':', '');

        // 웹앱 자체 도메인 허용
        if (urlObj.hostname === webAppHost) return true;

        // 카카오 커스텀 URL 스킴(kakaolink://, kakaotalk:// 등) → 카카오톡 앱으로 전달
        if (KAKAO_CUSTOM_SCHEMES.has(scheme)) {
          Linking.openURL(url);
          return false;
        }

        // 카카오 전체 도메인 허용 (kakao.com 및 모든 서브도메인)
        // 공유 플로우 중 sharer.kakao.com 외 다른 서브도메인을 거치는 경우 대응
        if (urlObj.hostname === KAKAO_DOMAIN || urlObj.hostname.endsWith(`.${KAKAO_DOMAIN}`)) {
          return true;
        }

        // Apple 로그인 도메인 허용 (appleid.apple.com)
        // response_mode: form_post 방식으로 콜백이 처리되므로 WebView 내에서 유지
        if (urlObj.hostname === APPLE_DOMAIN) {
          return true;
        }
      } catch {
        // URL 파싱 실패 시 경고 로그 출력
        console.warn('Invalid URL:', url);
      }

      // 외부 링크는 기본 브라우저에서 열기
      Linking.openURL(url);
      return false;
    },
    [webAppUrl]
  );

  /**
   * @description WebView 로드 중 에러가 발생했을 때 호출되는 핸들러로,
   * 에러 발생 시 로딩을 멈추고 에러 페이지로 이동시킵니다.
   */
  const handleWebViewError = useCallback(
    (syntheticEvent: WebViewErrorEvent | WebViewHttpErrorEvent) => {
      const { nativeEvent } = syntheticEvent;
      console.warn('WebView load error:', nativeEvent);

      if (webViewRef.current) {
        webViewRef.current.stopLoading?.();

        const errorUrl = `${webAppUrl}/error`;

        webViewRef.current.injectJavaScript(`
          window.location.href = "${errorUrl}";
          true;
        `);
      }
    },
    [webViewRef, webAppUrl]
  );

  /**
   * @description WebView에서 window.open()이 호출될 때 실행되는 핸들러로,
   * 카카오 공유 등 팝업 URL을 인터셉트하여 오버레이 팝업 WebView에서 처리합니다.
   * iOS에서 window.open()이 외부 브라우저로 열리는 문제를 방지합니다.
   */
  const handleOpenWindow = useCallback(
    (syntheticEvent: WebViewOpenWindowEvent) => {
      const { targetUrl } = syntheticEvent.nativeEvent;
      if (targetUrl) {
        onPopupOpen(targetUrl);
      }
    },
    [onPopupOpen]
  );

  return {
    handleShouldStartLoadWithRequest,
    handleWebViewError,
    handleOpenWindow,
  };
};
