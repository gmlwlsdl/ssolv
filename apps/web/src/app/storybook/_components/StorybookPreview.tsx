'use client';

import { useState } from 'react';

import { useStorybookStore } from '@/app/storybook/_store/storybook.store';
import { cn } from '@/lib/cn';

import type { StoryConfig, VariantDef } from '@/app/storybook/_types/story';

type BgMode = 'white' | 'gray' | 'dark';

const BG_CLASSES: Record<BgMode, string> = {
  white: 'bg-white',
  gray: 'bg-neutral-200',
  dark: 'bg-neutral-1500',
};

const VariantCard = ({ variant, config }: { variant: VariantDef; config: StoryConfig }) => {
  const bg = variant.background ?? 'white';
  const Component = config.component;

  return (
    <div className="flex flex-col gap-2">
      <div
        className={cn(
          'flex min-h-[80px] items-center justify-center rounded-xl border border-neutral-300 p-4',
          BG_CLASSES[bg]
        )}
      >
        <Component {...variant.props} />
      </div>
      <p className="text-center label-2 text-neutral-600">{variant.label}</p>
    </div>
  );
};

interface StorybookPreviewProps {
  config: StoryConfig;
}

const StorybookPreview = ({ config }: StorybookPreviewProps) => {
  const currentProps = useStorybookStore((s) => s.currentProps);
  const [playgroundBg, setPlaygroundBg] = useState<BgMode>('white');
  const Component = config.component;

  return (
    <div className="flex flex-col gap-8 p-6">
      <div>
        <h1 className="heading-4 font-bold text-neutral-1600">{config.title}</h1>
        {config.description && <p className="mt-1 body-3 text-neutral-700">{config.description}</p>}
      </div>

      {config.variants && config.variants.length > 0 && (
        <section>
          <h2 className="mb-4 label-1 font-semibold tracking-wide text-neutral-600 uppercase">
            Variants
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {config.variants.map((v) => (
              <VariantCard key={v.label} variant={v} config={config} />
            ))}
          </div>
        </section>
      )}

      {Object.keys(config.controls).length > 0 && (
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="label-1 font-semibold tracking-wide text-neutral-600 uppercase">
              Playground
            </h2>
            <div className="flex gap-1">
              {(['white', 'gray', 'dark'] as BgMode[]).map((bg) => (
                <button
                  key={bg}
                  onClick={() => setPlaygroundBg(bg)}
                  className={cn(
                    'rounded-md px-2 py-1 label-2 transition-colors',
                    playgroundBg === bg
                      ? 'bg-orange-100 font-semibold text-orange-600'
                      : 'text-neutral-600 hover:bg-neutral-200'
                  )}
                >
                  {bg}
                </button>
              ))}
            </div>
          </div>
          <div
            className={cn(
              'flex min-h-[160px] items-center justify-center rounded-xl border border-neutral-300 p-8',
              BG_CLASSES[playgroundBg]
            )}
          >
            <Component {...currentProps} />
          </div>
        </section>
      )}
    </div>
  );
};

export default StorybookPreview;
