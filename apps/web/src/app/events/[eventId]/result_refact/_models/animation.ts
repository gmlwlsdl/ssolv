export type AnimationPhase = 'stacking' | 'transitioning' | 'fanToSingle' | 'carousel';

export interface AnimationControllerReturn {
  phase: AnimationPhase;
  setPhase: (phase: AnimationPhase) => void;
  currentCard: number;
  setCurrentCard: (index: number) => void;
}
