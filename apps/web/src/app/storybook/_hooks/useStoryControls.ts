'use client';

import { useEffect } from 'react';

import { useStorybookStore } from '@/app/storybook/_store/storybook.store';

import type { StoryConfig } from '@/app/storybook/_types/story';

/**
 * 컴포넌트 스토리 페이지에서 호출.
 * config를 스토어에 등록하고 현재 조작 중인 props를 반환.
 */
export const useStoryControls = (config: StoryConfig) => {
  const { setStory, currentProps, currentStory } = useStorybookStore();

  useEffect(() => {
    if (currentStory?.title !== config.title) {
      setStory(config);
    }
  }, [config.title]); // eslint-disable-line react-hooks/exhaustive-deps

  return currentProps;
};
