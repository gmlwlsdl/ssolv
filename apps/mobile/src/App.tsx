import { useEffect, useRef, useState } from 'react';

import Constants from 'expo-constants';
import * as ExpoSplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { requestTrackingPermissionsAsync } from 'expo-tracking-transparency';
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

import SplashScreen from './components/SplashScreen';
import { useNotifications } from './hooks/useNotifications';
import { useWebViewHandlers } from './hooks/useWebViewHandlers';
import amplitude, { initAmplitude } from './lib/amplitude';
import { track } from './lib/analytics';

ExpoSplashScreen.preventAutoHideAsync();

const WEB_APP_URL = process.env.EXPO_PUBLIC_WEB_URL;

if (!WEB_APP_URL) {
  throw new Error('EXPO_PUBLIC_WEB_URL 환경 변수가 설정되지 않았습니다.');
}

/**
 * 웹뷰 URL에 앱 공통 속성을 파라미터로 추가
 * 웹에서 useCommonProperties가 이 값들을 파싱하여 Amplitude에 세팅
 * Amplitude 초기화 이후 호출해야 device_id를 올바르게 포함합니다.
 */
const buildWebViewUrl = (): string => {
  const url = new URL(WEB_APP_URL);
  const appVersion = Constants.expoConfig?.version ?? '1.0.0';
  const deviceId = amplitude.getDeviceId();

  url.searchParams.set('platform', Platform.OS);
  url.searchParams.set('app_version', appVersion);

  if (deviceId) {
    url.searchParams.set('device_id', deviceId);
  }

  return url.toString();
};

/** @description window.close() 호출 시 팝업을 닫기 위해 주입하는 스크립트 */
const POPUP_INJECTED_JAVASCRIPT = `
  (function() {
    var originalClose = window.close.bind(window);
    window.close = function() {
      window.ReactNativeWebView.postMessage('window.close');
      originalClose();
    };
  })();
  true;
`;

const App = () => {
  const webViewRef = useRef<WebView>(null);
  const [isWebViewLoaded, setIsWebViewLoaded] = useState(false);
  const [popupUrl, setPopupUrl] = useState<string | null>(null);
  const [webViewUrl, setWebViewUrl] = useState<string | null>(null);

  useEffect(() => {
    const initialize = async () => {
      if (Platform.OS === 'ios') {
        await requestTrackingPermissionsAsync();
      }

      initAmplitude();
      setWebViewUrl(buildWebViewUrl());
      track.appOpen({ is_cold_start: true });
    };

    initialize();
  }, []);

  const { handleShouldStartLoadWithRequest, handleWebViewError, handleOpenWindow } =
    useWebViewHandlers({
      webViewRef,
      webAppUrl: WEB_APP_URL,
      onPopupOpen: setPopupUrl,
    });

  const { onWebViewLoad } = useNotifications({ webViewRef });

  const handleWebViewLoad = () => {
    onWebViewLoad();
    setIsWebViewLoaded(true);
  };

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        {webViewUrl && (
          <WebView
            ref={webViewRef}
            source={{ uri: webViewUrl }}
            style={styles.webview}
            onLoadEnd={handleWebViewLoad}
            onShouldStartLoadWithRequest={handleShouldStartLoadWithRequest}
            onOpenWindow={handleOpenWindow}
            onError={handleWebViewError}
            onHttpError={handleWebViewError}
            javaScriptEnabled
            domStorageEnabled
            startInLoadingState
            scalesPageToFit
            keyboardDisplayRequiresUserAction={false}
            mixedContentMode="compatibility"
            thirdPartyCookiesEnabled
            sharedCookiesEnabled
            incognito={false}
            cacheEnabled
          />
        )}
        <StatusBar style="auto" />
        {popupUrl && (
          <View style={StyleSheet.absoluteFillObject}>
            <TouchableOpacity
              style={styles.popupCloseButton}
              onPress={() => setPopupUrl(null)}
              activeOpacity={0.7}
            />
            <WebView
              source={{ uri: popupUrl }}
              style={styles.webview}
              onShouldStartLoadWithRequest={handleShouldStartLoadWithRequest}
              onMessage={(event) => {
                if (event.nativeEvent.data === 'window.close') {
                  setPopupUrl(null);
                }
              }}
              injectedJavaScript={POPUP_INJECTED_JAVASCRIPT}
              javaScriptEnabled
              domStorageEnabled
              sharedCookiesEnabled
              thirdPartyCookiesEnabled
            />
          </View>
        )}
      </View>
      <SplashScreen visible={!isWebViewLoaded} />
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  popupCloseButton: {
    height: 44,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});

export default App;
