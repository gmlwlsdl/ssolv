import { useEffect, useRef, useState } from 'react';

import Constants from 'expo-constants';
import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { WebView, WebViewMessageEvent } from 'react-native-webview';

import { useNotifications } from './hooks/useNotifications';
import { useWebViewHandlers } from './hooks/useWebViewHandlers';
import amplitude from './lib/amplitude';
import { track } from './lib/analytics';
import { injectedJavaScript } from './lib/injectedJavaScript';

type WebViewMessage = {
  type: 'backgroundColor';
  color: string;
};

const WEB_APP_URL = process.env.EXPO_PUBLIC_WEB_URL;

if (!WEB_APP_URL) {
  throw new Error('EXPO_PUBLIC_WEB_URL 환경 변수가 설정되지 않았습니다.');
}

/**
 * 웹뷰 URL에 앱 공통 속성을 파라미터로 추가
 * 웹에서 useCommonProperties가 이 값들을 파싱하여 Amplitude에 세팅
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

const App = () => {
  const webViewRef = useRef<WebView>(null);
  const [backgroundColor, setBackgroundColor] = useState('transparent');

  useEffect(() => {
    track.appOpen({ is_cold_start: true });
  }, []);

  const { handleShouldStartLoadWithRequest, handleWebViewError } = useWebViewHandlers({
    webViewRef,
    webAppUrl: WEB_APP_URL,
  });

  const { onWebViewLoad } = useNotifications({ webViewRef });

  const handleMessage = (event: WebViewMessageEvent) => {
    try {
      const data = JSON.parse(event.nativeEvent.data) as WebViewMessage;

      if (data.type === 'backgroundColor') {
        setBackgroundColor(data.color);
      }
    } catch (error) {
      console.warn('배경색 변경 실패:', error);
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={[styles.container, { backgroundColor }]}
        edges={['top', 'left', 'right']}
      >
        <WebView
          ref={webViewRef}
          source={{ uri: buildWebViewUrl() }}
          style={styles.webview}
          onLoadEnd={onWebViewLoad}
          onShouldStartLoadWithRequest={handleShouldStartLoadWithRequest}
          onError={handleWebViewError}
          onHttpError={handleWebViewError}
          onMessage={handleMessage}
          injectedJavaScript={injectedJavaScript}
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
        <StatusBar style="auto" />
      </SafeAreaView>
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
});

export default App;
