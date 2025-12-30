import { useEffect } from 'react';

import { motion } from 'framer-motion';

const TRANSITIONING_DURATION = 500;

interface TransitioningProps {
  onComplete: () => void;
}

const TransitioningAnimation = ({ onComplete }: TransitioningProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, TRANSITIONING_DURATION);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
      className="flex-1"
    />
  );
};

export default TransitioningAnimation;
