import { useRef, useState } from 'react';

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

import SplashScreen from './components/SplashScreen';
import { useNotifications } from './hooks/useNotifications';
import { useWebViewHandlers } from './hooks/useWebViewHandlers';

const WEB_APP_URL = process.env.EXPO_PUBLIC_WEB_URL;

if (!WEB_APP_URL) {
  throw new Error('EXPO_PUBLIC_WEB_URL 환경 변수가 설정되지 않았습니다.');
}

const App = () => {
  const webViewRef = useRef<WebView>(null);
  const [isWebViewLoaded, setIsWebViewLoaded] = useState(false);

  const { handleShouldStartLoadWithRequest, handleWebViewError } = useWebViewHandlers({
    webViewRef,
    webAppUrl: WEB_APP_URL,
  });

  const { onWebViewLoad } = useNotifications({ webViewRef });

  const handleWebViewLoad = () => {
    onWebViewLoad();
    setIsWebViewLoaded(true);
  };

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <WebView
          ref={webViewRef}
          source={{ uri: WEB_APP_URL }}
          style={styles.webview}
          onLoadEnd={handleWebViewLoad}
          onShouldStartLoadWithRequest={handleShouldStartLoadWithRequest}
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
        <StatusBar style="auto" />
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
});

export default App;
