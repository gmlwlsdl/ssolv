'use client';

import { useStorybookStore } from '@/app/storybook/_store/storybook.store';

import StorybookControls from './StorybookControls';

const StorybookControlsPanel = () => {
  const hasControls = useStorybookStore(
    (s) => !!s.currentStory && Object.keys(s.currentStory.controls).length > 0
  );

  if (!hasControls) return null;

  return (
    <div className="w-[280px] shrink-0 border-l border-neutral-300 bg-neutral-50">
      <StorybookControls />
    </div>
  );
};

export default StorybookControlsPanel;
