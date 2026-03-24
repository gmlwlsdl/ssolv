'use client';

import { useEffect, useRef } from 'react';

import { usePathname } from 'next/navigation';

import { PAGE_TYPES } from './events';
import { track } from './track';

import type { PageType } from './events';

/**
 * pathname → page_type 매핑 테이블
 * 등록되지 않은 경로는 page_view를 발화하지 않음 (allowlist 역할)
 */
const PAGE_TYPE_MAP: Record<string, PageType> = {
  '/login': PAGE_TYPES.login,
  '/': PAGE_TYPES.home,
  '/meetings/create': PAGE_TYPES.meeting_create,
};

/**
 * 동적 라우트 매핑 (정규식 기반)
 * [token] 등 동적 세그먼트가 포함된 경로 처리
 */
const DYNAMIC_PAGE_ROUTES: { pattern: RegExp; pageType: PageType; tokenGroup: number }[] = [
  {
    pattern: /^\/meetings\/([^/]+)\/survey$/,
    pageType: PAGE_TYPES.survey,
    tokenGroup: 1,
  },
  {
    pattern: /^\/meetings\/([^/]+)\/result\/overview$/,
    pageType: PAGE_TYPES.meeting_room,
    tokenGroup: 1,
  },
  {
    pattern: /^\/meetings\/([^/]+)\/result\/restaurants$/,
    pageType: PAGE_TYPES.restaurant_list,
    tokenGroup: 1,
  },
  {
    pattern: /^\/meetings\/([^/]+)\/result\/analysis$/,
    pageType: PAGE_TYPES.recommendation,
    tokenGroup: 1,
  },
];

function resolvePageView(pathname: string): { pageType: PageType; meetingId?: string } | null {
  const staticMatch = PAGE_TYPE_MAP[pathname];
  if (staticMatch) {
    return { pageType: staticMatch };
  }

  for (const route of DYNAMIC_PAGE_ROUTES) {
    const match = pathname.match(route.pattern);
    if (match) {
      return {
        pageType: route.pageType,
        meetingId: match[route.tokenGroup],
      };
    }
  }

  return null;
}

/**
 * pathname 변경 시 자동으로 page_view 이벤트를 발화하는 훅
 * layout에 1회 마운트하면 모든 페이지 전환을 자동 추적
 */
export const usePageView = () => {
  const pathname = usePathname();
  const prevPathRef = useRef<string | null>(null);

  useEffect(() => {
    if (pathname === prevPathRef.current) return;
    prevPathRef.current = pathname;

    const resolved = resolvePageView(pathname);
    if (!resolved) return;

    track.pageView({
      page_type: resolved.pageType,
      ...(resolved.meetingId && { meeting_id: resolved.meetingId }),
    });
  }, [pathname]);
};
