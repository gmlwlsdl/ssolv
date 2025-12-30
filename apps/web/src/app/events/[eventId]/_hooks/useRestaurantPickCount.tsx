import { parseAsInteger, useQueryState } from 'nuqs';

import {
  ADDITIONAL_RESTAURANT_COUNT,
  INITIAL_RESTAURANT_COUNT,
  MAX_RESTAURANT_COUNT,
} from '@/app/events/[eventId]/_constants/restaurants';

/**
 * 레스토랑 표시 개수를 관리하는 훅
 *
 * @returns {Object}
 * @returns {number} pickCount - 현재 표시할 레스토랑 개수 (기본값: 5)
 * @returns {Function} setPickCount - 레스토랑 개수 직접 설정
 * @returns {Function} increasePickCount - 레스토랑 개수 5개 증가
 * @returns {boolean} canLoadMore - 추가 로드 가능 여부 (최대 10개)
 * @returns {boolean} isDefaultCount - 초기 개수인지 여부
 * @returns {Function} getUrlWithPicks - 주어진 기본 URL에 현재 선택된 레스토랑 개수를 쿼리 파라미터로 추가하여 반환
 */
export const useRestaurantPickCount = () => {
  const [pickCount, setPickCount] = useQueryState(
    'picks',
    parseAsInteger.withDefault(INITIAL_RESTAURANT_COUNT).withOptions({
      history: 'replace',
      clearOnDefault: true,
    })
  );
  const canLoadMore = pickCount < MAX_RESTAURANT_COUNT;
  const isDefaultCount = pickCount === INITIAL_RESTAURANT_COUNT;

  const increasePickCount = () => {
    setPickCount((prev) => prev + ADDITIONAL_RESTAURANT_COUNT);
  };

  const getUrlWithPicks = (baseUrl: string) => {
    if (isDefaultCount) {
      return baseUrl;
    }
    return `${baseUrl}?picks=${pickCount}`;
  };

  return {
    pickCount,
    setPickCount,
    canLoadMore,
    isDefaultCount,
    increasePickCount,
    getUrlWithPicks,
  };
};
