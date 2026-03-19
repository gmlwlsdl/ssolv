'use client';

import { useCommonProperties } from './useCommonProperties';
import { usePageView } from './usePageView';

/**
 * layout에 마운트하여 analytics 훅을 활성화하는 컴포넌트
 * - usePageView: pathname 변경 시 자동 page_view 발화
 * - useCommonProperties: URL 파라미터에서 공통 속성 세팅
 */
const AnalyticsProvider = () => {
  usePageView();
  useCommonProperties();
  return null;
};

export default AnalyticsProvider;
