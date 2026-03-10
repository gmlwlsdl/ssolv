'use client';

import StorybookPreview from '@/app/storybook/_components/StorybookPreview';
import { useStoryControls } from '@/app/storybook/_hooks/useStoryControls';
import ParticipantProgressIndicator from '@/components/ui/ParticipantProgressIndicator';

import type { StoryConfig } from '@/app/storybook/_types/story';

const config: StoryConfig = {
  title: 'ParticipantProgressIndicator',
  description: '설문 완료 인원 / 전체 인원 progress bar. 말풍선 + 화살표 표시.',
  component: ParticipantProgressIndicator,
  controls: {
    surveyCompletedParticipants: {
      type: 'range',
      label: 'completed',
      min: 0,
      max: 10,
      default: 3,
    },
    totalParticipants: { type: 'range', label: 'total', min: 1, max: 10, default: 8 },
    isSurveyClosed: { type: 'toggle', label: 'isSurveyClosed', default: false },
  },
  variants: [
    {
      label: '진행 중',
      props: { surveyCompletedParticipants: 3, totalParticipants: 8, isSurveyClosed: false },
    },
    {
      label: '마감',
      props: { surveyCompletedParticipants: 5, totalParticipants: 8, isSurveyClosed: true },
    },
    {
      label: '전원 완료',
      props: { surveyCompletedParticipants: 8, totalParticipants: 8, isSurveyClosed: true },
    },
  ],
};

const ParticipantProgressStoryPage = () => {
  useStoryControls(config);
  return <StorybookPreview config={config} />;
};

export default ParticipantProgressStoryPage;
