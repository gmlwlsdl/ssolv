'use client';

import * as amplitude from '@amplitude/unified';

function initAmplitude() {
  if (typeof window !== 'undefined') {
    amplitude.initAll(process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY!, {
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
