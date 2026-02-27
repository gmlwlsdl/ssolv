export type ControlDef =
  | { type: 'select'; label: string; options: readonly string[]; default: string }
  | { type: 'toggle'; label: string; default: boolean }
  | { type: 'text'; label: string; default: string }
  | { type: 'range'; label: string; min: number; max: number; step?: number; default: number };

export interface VariantDef {
  label: string;
  props: Record<string, unknown>;
  background?: 'white' | 'gray' | 'dark';
}

export interface StoryConfig {
  title: string;
  description?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: React.ComponentType<any>;
  controls: Record<string, ControlDef>;
  variants?: VariantDef[];
}
