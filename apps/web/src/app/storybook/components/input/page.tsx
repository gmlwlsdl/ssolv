'use client';

import StorybookPreview from '@/app/storybook/_components/StorybookPreview';
import { useStoryControls } from '@/app/storybook/_hooks/useStoryControls';
import Input from '@/components/ui/Input';

import type { StoryConfig } from '@/app/storybook/_types/story';

const config: StoryConfig = {
  title: 'Input',
  description: '텍스트 입력 필드. 에러 상태, 클리어 버튼, 검색 타입을 지원합니다.',
  component: Input,
  controls: {
    type: {
      type: 'select',
      label: 'type',
      options: ['text', 'search'],
      default: 'text',
    },
    placeholder: { type: 'text', label: 'placeholder', default: '모임 이름 입력' },
    hasError: { type: 'toggle', label: 'hasError', default: false },
    errorMessage: { type: 'text', label: 'errorMessage', default: '필수 입력 항목입니다.' },
    showClearButton: { type: 'toggle', label: 'showClearButton', default: false },
    helperText: { type: 'text', label: 'helperText', default: '' },
  },
  variants: [
    { label: 'Default', props: { placeholder: '모임 이름 입력' } },
    { label: 'Search', props: { type: 'search', placeholder: '강남역' } },
    { label: 'Error', props: { hasError: true, errorMessage: '필수 입력 항목입니다.' } },
  ],
};

const InputStoryPage = () => {
  useStoryControls(config);
  return <StorybookPreview config={config} />;
};

export default InputStoryPage;
