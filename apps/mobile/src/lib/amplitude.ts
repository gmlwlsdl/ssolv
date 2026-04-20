import * as amplitude from '@amplitude/analytics-react-native';

const AMPLITUDE_API_KEY = process.env.EXPO_PUBLIC_AMPLITUDE_API_KEY;

if (!AMPLITUDE_API_KEY) {
  throw new Error('EXPO_PUBLIC_AMPLITUDE_API_KEY 환경 변수가 설정되지 않았습니다.');
}

/**
 * Amplitude를 초기화합니다.
 * iOS에서는 반드시 ATT 권한 요청 이후에 호출해야 합니다.
 * ATT 권한 허용 여부는 OS 레벨에서 SDK가 자동으로 반영합니다.
 */
export const initAmplitude = () => {
  amplitude.init(AMPLITUDE_API_KEY);
};

export default amplitude;
