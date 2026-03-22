'use client';

import { useEffect } from 'react';

import { usePathname } from 'next/navigation';

import { FCM_TOKEN_STORAGE_KEY, registerFcmToken } from '@/services/notification/fcm-token';

import type { FcmPlatform } from '@/data/models/notification';

const detectPlatform = (): FcmPlatform => {
  const ua = navigator.userAgent.toLowerCase();
  return /iphone|ipad|ipod/.test(ua) ? 'ios' : 'android';
};

/**
 * 로그인 전 미등록 FCM 토큰을 라우트 변경 시 재등록하는 훅.
 *
 * FCM 토큰은 앱 시작 시 발급되지만, 로그인 전이면 401로 등록 실패합니다.
 * 라우트가 변경될 때마다 localStorage의 토큰을 재시도하여 로그인 후 자동 등록합니다.
 */
const usePendingFcmToken = () => {
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem(FCM_TOKEN_STORAGE_KEY);
    if (!token) return;

    registerFcmToken({ fcmToken: token, platform: detectPlatform() }).catch(() => {
      // 미인증 상태 등 등록 실패 시 무시 (다음 라우트 변경 시 재시도)
    });
  }, [pathname]);
};

export default usePendingFcmToken;
