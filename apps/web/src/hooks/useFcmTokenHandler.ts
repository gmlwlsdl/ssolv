'use client';

import { useCallback } from 'react';

import { FCM_TOKEN_STORAGE_KEY, registerFcmToken } from '@/services/notification/fcm-token';

import type { FcmPlatform } from '@/data/models/notification';

/**
 * iOS/Android 여부를 userAgent로 감지
 *
 * @returns FCM 플랫폼 타입
 *
 * @todo 모바일 앱에서 nativeMessage에 platform 필드를 추가하면 이 함수는 제거 예정
 */
const detectPlatform = (): FcmPlatform => {
  const ua = navigator.userAgent.toLowerCase();
  return /iphone|ipad|ipod/.test(ua) ? 'ios' : 'android';
};

/**
 * FCM 토큰 저장 및 백엔드 등록 훅
 *
 * @returns FCM 토큰을 localStorage에 저장하고 백엔드에 등록하는 핸들러
 *
 * @sideeffect localStorage 저장, 백엔드 API 호출
 */
const useFcmTokenHandler = () => {
  return useCallback(async (token: string) => {
    localStorage.setItem(FCM_TOKEN_STORAGE_KEY, token);

    try {
      await registerFcmToken({ fcmToken: token, platform: detectPlatform() });
    } catch (error) {
      console.error('FCM 토큰 등록 실패:', error instanceof Error ? error.message : error);
    }
  }, []);
};

export default useFcmTokenHandler;
