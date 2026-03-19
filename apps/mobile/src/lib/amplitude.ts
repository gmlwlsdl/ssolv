import * as amplitude from '@amplitude/analytics-react-native';

const AMPLITUDE_API_KEY = process.env.EXPO_PUBLIC_AMPLITUDE_API_KEY;

if (!AMPLITUDE_API_KEY) {
  throw new Error('EXPO_PUBLIC_AMPLITUDE_API_KEY 환경 변수가 설정되지 않았습니다.');
}

amplitude.init(AMPLITUDE_API_KEY);

export default amplitude;
