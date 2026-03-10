import { create } from 'zustand';

import type { StoryConfig } from '@/app/storybook/_types/story';

interface StorybookState {
  currentStory: StoryConfig | null;
  currentProps: Record<string, unknown>;
  setStory: (config: StoryConfig) => void;
  setProps: (props: Record<string, unknown>) => void;
  setProp: (key: string, value: unknown) => void;
  resetProps: () => void;
  clearStory: () => void;
}

const buildDefaultProps = (config: StoryConfig): Record<string, unknown> =>
  Object.fromEntries(Object.entries(config.controls).map(([key, def]) => [key, def.default]));

export const useStorybookStore = create<StorybookState>((set, get) => ({
  currentStory: null,
  currentProps: {},

  setStory: (config) => set({ currentStory: config, currentProps: buildDefaultProps(config) }),

  setProps: (props) => set({ currentProps: props }),

  setProp: (key, value) =>
    set((state) => ({ currentProps: { ...state.currentProps, [key]: value } })),

  resetProps: () => {
    const { currentStory } = get();
    if (currentStory) set({ currentProps: buildDefaultProps(currentStory) });
  },

  clearStory: () => set({ currentStory: null, currentProps: {} }),
}));
