'use client';

import { useStorybookStore } from '@/app/storybook/_store/storybook.store';
import { cn } from '@/lib/cn';

import type { ControlDef } from '@/app/storybook/_types/story';

const ControlRow = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex items-center justify-between gap-2 border-b border-neutral-200 py-2">
    <span className="shrink-0 label-2 font-medium text-neutral-800">{label}</span>
    <div className="flex min-w-0 flex-1 justify-end">{children}</div>
  </div>
);

const ControlInput = ({
  def,
  value,
  onChange,
}: {
  def: ControlDef;
  value: unknown;
  onChange: (v: unknown) => void;
}) => {
  if (def.type === 'select') {
    return (
      <select
        value={String(value)}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-md border border-neutral-300 bg-white px-2 py-1 label-2 text-neutral-1400 focus:border-orange-500 focus:outline-none"
      >
        {def.options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    );
  }

  if (def.type === 'toggle') {
    return (
      <button
        type="button"
        role="switch"
        aria-checked={Boolean(value)}
        onClick={() => onChange(!value)}
        className={cn(
          'relative h-6 w-10 rounded-full transition-colors',
          value ? 'bg-orange-500' : 'bg-neutral-400'
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform',
            value ? 'left-[calc(100%-22px)]' : 'left-0.5'
          )}
        />
      </button>
    );
  }

  if (def.type === 'text') {
    return (
      <input
        type="text"
        value={String(value ?? '')}
        onChange={(e) => onChange(e.target.value)}
        className="w-32 rounded-md border border-neutral-300 bg-white px-2 py-1 label-2 text-neutral-1400 focus:border-orange-500 focus:outline-none"
      />
    );
  }

  if (def.type === 'range') {
    return (
      <div className="flex items-center gap-2">
        <input
          type="range"
          min={def.min}
          max={def.max}
          step={def.step ?? 1}
          value={Number(value)}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-24 accent-orange-500"
        />
        <span className="w-6 text-center label-2 text-neutral-800">{String(value)}</span>
      </div>
    );
  }

  return null;
};

const StorybookControls = () => {
  const { currentStory, currentProps, setProp, resetProps } = useStorybookStore();

  if (!currentStory || Object.keys(currentStory.controls).length === 0) {
    return (
      <div className="flex h-full items-center justify-center p-4">
        <p className="text-center label-2 text-neutral-500">
          이 페이지에는 조작 가능한 Controls가 없어요.
        </p>
      </div>
    );
  }

  const childrenVal = currentProps['children'];
  const snippet = Object.entries(currentProps)
    .filter(([key]) => key !== 'children')
    .map(([key, val]) => {
      if (typeof val === 'boolean') return `  ${key}${val ? '' : '={false}'}`;
      if (typeof val === 'number') return `  ${key}={${val}}`;
      return `  ${key}="${val}"`;
    })
    .join('\n');

  return (
    <div className="no-scrollbar flex h-full flex-col overflow-y-auto p-4">
      <div className="mb-4 flex items-center justify-between">
        <p className="label-1 font-semibold text-neutral-1400">Controls</p>
        <button
          onClick={resetProps}
          className="label-2 text-neutral-600 transition-colors hover:text-orange-500"
        >
          Reset
        </button>
      </div>

      <div className="flex flex-col">
        {Object.entries(currentStory.controls).map(([key, def]) => (
          <ControlRow key={key} label={def.label}>
            <ControlInput def={def} value={currentProps[key]} onChange={(v) => setProp(key, v)} />
          </ControlRow>
        ))}
      </div>

      <div className="mt-6">
        <p className="mb-2 label-2 font-semibold text-neutral-600 uppercase">Code</p>
        <pre className="overflow-x-auto rounded-lg bg-neutral-200 p-3 text-[11px] text-neutral-1400">
          {`<${currentStory.title}\n${snippet}\n>\n  ${childrenVal ?? ''}\n</${currentStory.title}>`}
        </pre>
      </div>
    </div>
  );
};

export default StorybookControls;
