'use client';

import { useState } from 'react';

import StorybookPreview from '@/app/storybook/_components/StorybookPreview';
import { useStoryControls } from '@/app/storybook/_hooks/useStoryControls';
import StepperInput from '@/components/ui/StepperInput';

import type { StoryConfig } from '@/app/storybook/_types/story';

const StepperInputWrapper = ({ min, max }: { min: number; max: number }) => {
  const [value, setValue] = useState(min);
  return <StepperInput value={value} onChange={setValue} min={min} max={max} />;
};

const config: StoryConfig = {
  title: 'StepperInput',
  description: '+/- 버튼으로 숫자를 조작하는 입력 필드. min/max로 범위 제한.',
  component: StepperInputWrapper,
  controls: {
    min: { type: 'range', label: 'min', min: 0, max: 10, default: 2 },
    max: { type: 'range', label: 'max', min: 1, max: 50, default: 20 },
  },
  variants: [
    { label: 'Default (2~20)', props: { min: 2, max: 20 } },
    { label: 'Narrow (1~5)', props: { min: 1, max: 5 } },
  ],
};

const StepperInputStoryPage = () => {
  useStoryControls(config);
  return <StorybookPreview config={config} />;
};

export default StepperInputStoryPage;
