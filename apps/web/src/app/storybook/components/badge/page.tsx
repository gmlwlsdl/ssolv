'use client';

import StorybookPreview from '@/app/storybook/_components/StorybookPreview';
import { useStoryControls } from '@/app/storybook/_hooks/useStoryControls';
import Badge from '@/components/ui/Badge';

import type { StoryConfig } from '@/app/storybook/_types/story';

const config: StoryConfig = {
  title: 'Badge',
  description: '카테고리, 태그 등 짧은 레이블 표시용.',
  component: Badge,
  controls: {
    children: { type: 'text', label: 'label', default: '한식' },
  },
  variants: [
    { label: '한식', props: { children: '한식' } },
    { label: '일식', props: { children: '일식' } },
    { label: '중식', props: { children: '중식' } },
    { label: '양식', props: { children: '양식' } },
  ],
};

const BadgeStoryPage = () => {
  useStoryControls(config);
  return <StorybookPreview config={config} />;
};

export default BadgeStoryPage;
