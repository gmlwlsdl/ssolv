'use client';

import * as amplitude from '@amplitude/unified';

function initAmplitude() {
  if (typeof window !== 'undefined') {
    const apiKey = process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY;
    if (!apiKey) {
      throw new Error('NEXT_PUBLIC_AMPLITUDE_API_KEY 환경 변수가 설정되지 않았습니다.');
    }

    amplitude.initAll(apiKey, {
      analytics: {
        autocapture: {
          sessions: true,
          pageViews: false,
          formInteractions: false,
          fileDownloads: false,
          elementInteractions: false,
        },
      },
      sessionReplay: { sampleRate: 1 },
    });
  }
}

initAmplitude();

export const Amplitude = () => null;

export default amplitude;
