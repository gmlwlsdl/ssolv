'use client';

import StorybookPreview from '@/app/storybook/_components/StorybookPreview';
import { useStoryControls } from '@/app/storybook/_hooks/useStoryControls';
import Toggle from '@/components/ui/Toggle';

import type { StoryConfig } from '@/app/storybook/_types/story';

const config: StoryConfig = {
  title: 'Toggle',
  description: '50×30px 스위치. checked 상태를 외부에서 제어합니다.',
  component: Toggle,
  controls: {
    checked: { type: 'toggle', label: 'checked', default: false },
  },
  variants: [
    { label: 'Off', props: { checked: false, onChange: () => {} } },
    { label: 'On', props: { checked: true, onChange: () => {} } },
  ],
};

const ToggleStoryPage = () => {
  useStoryControls(config);
  return <StorybookPreview config={config} />;
};

export default ToggleStoryPage;
