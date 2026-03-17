'use client';

import { useEffect, useRef } from 'react';

import amplitude from '@/lib/amplitude';

/**
 * 네이티브 앱이 웹뷰를 열 때 URL 파라미터로 전달하는 공통 속성을 파싱하여
 * Amplitude userProperties에 세팅하는 훅
 *
 * 예) https://ssolv.site?platform=ios&app_version=1.2.0&device_id=abc123
 *
 * - platform, app_version → setUserProperties (모든 이벤트에 자동 삽입)
 * - device_id → setDeviceId (앱↔웹 사용자 연결)
 * - 파라미터가 없으면 브라우저 직접 접속으로 판단하여 아무 것도 하지 않음
 */
export const useCommonProperties = () => {
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialized.current) return;

    const params = new URLSearchParams(window.location.search);
    const platform = params.get('platform');
    const appVersion = params.get('app_version');
    const deviceId = params.get('device_id');

    if (!platform) return;

    hasInitialized.current = true;

    const identify = new amplitude.Identify();
    identify.set('platform', platform);
    identify.set('container', 'webview');

    if (appVersion) {
      identify.set('app_version', appVersion);
    }

    amplitude.identify(identify);

    if (deviceId) {
      amplitude.setDeviceId(deviceId);
    }
  }, []);
};
