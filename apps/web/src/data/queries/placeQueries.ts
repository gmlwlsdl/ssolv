import { createQueryKeys } from '@lukemorales/query-key-factory';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ApiError } from '@/data/models/api';
import {
  getPlaces,
  PlaceLikeRequest,
  PlaceLikeResponse,
  postPlaceLike,
  RecommendedPlaceResponse,
} from '@/services/place';

export const placeQueryKeys = createQueryKeys('place', {
  getPlaces: (token: string) => [token],
});

export const getPlacesQueryOptions = (token: string) => ({
  queryKey: placeQueryKeys.getPlaces(token).queryKey,
  queryFn: () => getPlaces(token),
});

interface MutationContext {
  previousData: RecommendedPlaceResponse | undefined;
  queryKey: readonly unknown[];
}

export const usePlaceLikeMutation = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<PlaceLikeResponse, ApiError, PlaceLikeRequest, MutationContext>({
    mutationFn: (request) => postPlaceLike(request),

    // 옵티미스틱 업데이트
    onMutate: async ({ token, placeId }) => {
      const { queryKey } = placeQueryKeys.getPlaces(token);

      await queryClient.cancelQueries({ queryKey });

      const previousData = queryClient.getQueryData<RecommendedPlaceResponse>(queryKey);

      queryClient.setQueryData<RecommendedPlaceResponse>(queryKey, (old) => {
        if (!old) return old;

        return {
          ...old,
          items: old.items.map((place) => {
            if (place.placeId === placeId) {
              const isCurrentlyLiked = place.isLiked;
              return {
                ...place,
                isLiked: !isCurrentlyLiked,
                likeCount: isCurrentlyLiked ? place.likeCount - 1 : place.likeCount + 1,
              };
            }
            return place;
          }),
        };
      });

      return { previousData, queryKey };
    },

    onError: (_err, _variables, context) => {
      if (context?.previousData && context?.queryKey) {
        queryClient.setQueryData(context.queryKey, context.previousData);
      }
    },

    onSuccess: (response, { token, placeId }) => {
      const { queryKey } = placeQueryKeys.getPlaces(token);

      queryClient.setQueryData<RecommendedPlaceResponse>(queryKey, (old) => {
        if (!old) return old;

        return {
          ...old,
          items: old.items.map((place) => {
            if (place.placeId === placeId) {
              return {
                ...place,
                isLiked: response.isLiked,
                likeCount: response.likeCount,
              };
            }
            return place;
          }),
        };
      });
    },
  });

  return mutation;
};
