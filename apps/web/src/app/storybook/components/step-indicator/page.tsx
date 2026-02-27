'use client';

import StorybookPreview from '@/app/storybook/_components/StorybookPreview';
import { useStoryControls } from '@/app/storybook/_hooks/useStoryControls';
import StepIndicator from '@/components/ui/StepIndicator';

import type { StoryConfig } from '@/app/storybook/_types/story';

const config: StoryConfig = {
  title: 'StepIndicator',
  description: '진행 단계를 나타내는 progress bar. value/total 비율로 너비 계산.',
  component: StepIndicator,
  controls: {
    value: { type: 'range', label: 'value', min: 0, max: 10, default: 3 },
    total: { type: 'range', label: 'total', min: 1, max: 10, default: 5 },
  },
  variants: [
    { label: '0%', props: { value: 0, total: 5 } },
    { label: '40%', props: { value: 2, total: 5 } },
    { label: '80%', props: { value: 4, total: 5 } },
    { label: '100%', props: { value: 5, total: 5 } },
  ],
};

const StepIndicatorStoryPage = () => {
  useStoryControls(config);
  return <StorybookPreview config={config} />;
};

export default StepIndicatorStoryPage;
