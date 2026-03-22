'use client';

import { useEffect, useRef } from 'react';

import { usePathname } from 'next/navigation';

import { FCM_TOKEN_STORAGE_KEY, registerFcmToken } from '@/services/notification/fcm-token';

import type { FcmPlatform } from '@/data/models/notification';

const detectPlatform = (): FcmPlatform => {
  const ua = navigator.userAgent.toLowerCase();
  return /iphone|ipad|ipod/.test(ua) ? 'ios' : 'android';
};

/**
 * 로그인 후 미등록 FCM 토큰을 자동 등록하는 훅.
 *
 * - 최초 마운트 시 (이미 로그인된 상태): 바로 등록 시도
 * - /login → 다른 페이지 전환 시 (로그인 완료): 등록 시도
 * - 로그아웃 후 재로그인 시에도 동일하게 동작
 */
const usePendingFcmToken = () => {
  const pathname = usePathname();
  const prevPathname = useRef<string | null>(null);

  useEffect(() => {
    const prev = prevPathname.current;
    const isFirstMount = prev === null;
    const isAfterLogin = prev === '/login';
    prevPathname.current = pathname;

    if (pathname === '/login') return;
    if (!isFirstMount && !isAfterLogin) return;

    const token = localStorage.getItem(FCM_TOKEN_STORAGE_KEY);
    if (!token) return;

    registerFcmToken({ fcmToken: token, platform: detectPlatform() }).catch(() => {
      // 등록 실패 시 무시 (다음 로그인 시 재시도)
    });
  }, [pathname]);
};

export default usePendingFcmToken;
