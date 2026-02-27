'use client';

import StorybookPreview from '@/app/storybook/_components/StorybookPreview';
import { useStoryControls } from '@/app/storybook/_hooks/useStoryControls';
import AvatarIcon from '@/components/ui/AvatarIcon';

import type { StoryConfig } from '@/app/storybook/_types/story';

const AVATAR_OPTIONS = [
  'default',
  'banana',
  'broccoli',
  'carrot',
  'lemon',
  'mushroom',
  'paprika',
  'pear',
  'tomato',
  'turnip',
] as const;

const config: StoryConfig = {
  title: 'AvatarIcon',
  description: '채소/과일 아바타 아이콘. 기본 48×48px. className으로 크기 조정.',
  component: AvatarIcon,
  controls: {
    variant: {
      type: 'select',
      label: 'variant',
      options: [...AVATAR_OPTIONS],
      default: 'default',
    },
  },
  variants: AVATAR_OPTIONS.map((v) => ({
    label: v,
    props: { variant: v },
  })),
};

const AvatarIconStoryPage = () => {
  useStoryControls(config);
  return <StorybookPreview config={config} />;
};

export default AvatarIconStoryPage;
