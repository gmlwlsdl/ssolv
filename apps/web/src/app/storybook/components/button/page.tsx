'use client';

import StorybookPreview from '@/app/storybook/_components/StorybookPreview';
import { useStoryControls } from '@/app/storybook/_hooks/useStoryControls';
import Button from '@/components/ui/Button';

import type { StoryConfig } from '@/app/storybook/_types/story';

const config: StoryConfig = {
  title: 'Button',
  description: '주요 CTA 버튼. theme × status 조합으로 모든 상태를 표현합니다.',
  component: Button,
  controls: {
    theme: {
      type: 'select',
      label: 'theme',
      options: ['cta-gradient', 'orange', 'orange-light', 'gray'],
      default: 'cta-gradient',
    },
    status: {
      type: 'select',
      label: 'status',
      options: ['normal', 'disabled'],
      default: 'normal',
    },
    children: { type: 'text', label: 'label', default: '다음으로' },
  },
  variants: [
    { label: 'CTA Gradient', props: { theme: 'cta-gradient', children: '다음으로' } },
    { label: 'Orange', props: { theme: 'orange', children: '확인' } },
    { label: 'Orange Light', props: { theme: 'orange-light', children: '선택' } },
    { label: 'Gray', props: { theme: 'gray', children: '취소' } },
    { label: 'Disabled', props: { theme: 'orange', status: 'disabled', children: '비활성' } },
  ],
};

const ButtonStoryPage = () => {
  useStoryControls(config);
  return <StorybookPreview config={config} />;
};

export default ButtonStoryPage;
