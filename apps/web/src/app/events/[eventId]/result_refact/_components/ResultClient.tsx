'use client';

import { useState } from 'react';

import { AnimatePresence } from 'framer-motion';

import FanToSingleAnimation from '@/app/events/[eventId]/result_refact/_components/animations/FanToSingleAnimation';
import { RestaurantCarousel } from '@/app/events/[eventId]/result_refact/_components/animations/RestaurantCarouselAnimation';
import TransitioningAnimation from '@/app/events/[eventId]/result_refact/_components/animations/TransitioningAnimation';
import { AnimationPhase } from '@/app/events/[eventId]/result_refact/_models/animation';
import { Restaurant, Surveys } from '@/app/events/[eventId]/result_refact/_models/result';

import { CardStackAnimation } from './animations/CardStackAnimation';

interface RecommendationsResultClientProps {
  surveys: Surveys;
  restaurants: Restaurant[];
}
const ResultClient = ({ surveys, restaurants }: RecommendationsResultClientProps) => {
  const [phase, setPhase] = useState<AnimationPhase>('stacking');

  return (
    <AnimatePresence mode="wait" initial={false}>
      {phase === 'stacking' && (
        <CardStackAnimation
          key="stacking"
          cards={surveys}
          onComplete={() => setPhase('transitioning')}
        />
      )}
      {phase === 'transitioning' && (
        <TransitioningAnimation key="transitioning" onComplete={() => setPhase('fanToSingle')} />
      )}
      {phase === 'fanToSingle' && (
        <FanToSingleAnimation
          key="fanToSingle"
          restaurants={restaurants}
          onComplete={() => setPhase('carousel')}
        />
      )}
      {phase === 'carousel' && <RestaurantCarousel key="carousel" restaurants={restaurants} />}
    </AnimatePresence>
  );
};

export default ResultClient;
