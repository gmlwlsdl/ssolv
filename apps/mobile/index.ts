import messaging from '@react-native-firebase/messaging';
import { registerRootComponent } from 'expo';

import App from './src/App';

// 백그라운드/종료 상태의 FCM 데이터 메시지 처리 핸들러
// registerRootComponent 이전에 반드시 등록해야 합니다
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.warn('[FCM] 백그라운드 메시지 수신:', remoteMessage.messageId);
});

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
