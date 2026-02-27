# /storybook Design System Viewer Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a Storybook-like 3-panel design system viewer at `/storybook` where designers and developers can explore colors, typography, icons, avatars, and interactive component stories with live prop controls.

**Architecture:** A Next.js App Router nested layout provides the 3-panel shell (sidebar / main / controls). A Zustand store (`useStorybookStore`) bridges the component page and the Controls panel — each component page registers its `StoryConfig` on mount and reads live `currentProps`; the Controls panel writes to the same store. Foundation pages (Colors, Typography, Icons, Avatars) are static server-rendered galleries with no controls.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript 5, Tailwind CSS 4, Zustand, CVA, `next/image`, `next/navigation`

---

## Verification Protocol (no test framework)

After every commit run:

```bash
cd apps/web && pnpm typecheck
```

Expected: `0 errors`. If types fail, fix before moving on.

```bash
pnpm lint
```

Expected: no errors. Then manually open the changed route in the dev server.

---

## Phase 1 — Infrastructure (Tasks 1–7)

---

### Task 1: Types

**Files:**

- Create: `apps/web/src/app/storybook/_types/story.ts`

**Step 1: Create the file**

```typescript
// apps/web/src/app/storybook/_types/story.ts

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
```

**Step 2: Verify**

```bash
cd apps/web && pnpm typecheck
```

**Step 3: Commit**

```bash
git add apps/web/src/app/storybook/_types/story.ts
git commit -m "[Feat] storybook: StoryConfig 타입 시스템 추가"
```

---

### Task 2: Zustand Store

**Files:**

- Create: `apps/web/src/app/storybook/_store/storybook.store.ts`

**Step 1: Create the file**

```typescript
// apps/web/src/app/storybook/_store/storybook.store.ts
import { create } from 'zustand';

import type { StoryConfig } from '@/app/storybook/_types/story';

interface StorybookState {
  currentStory: StoryConfig | null;
  currentProps: Record<string, unknown>;
  setStory: (config: StoryConfig) => void;
  setProps: (props: Record<string, unknown>) => void;
  setProp: (key: string, value: unknown) => void;
  resetProps: () => void;
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
}));
```

**Step 2: Verify**

```bash
cd apps/web && pnpm typecheck
```

**Step 3: Commit**

```bash
git add apps/web/src/app/storybook/_store/storybook.store.ts
git commit -m "[Feat] storybook: Zustand 스토리북 스토어 추가"
```

---

### Task 3: useStoryControls Hook

**Files:**

- Create: `apps/web/src/app/storybook/_hooks/useStoryControls.ts`

**Step 1: Create the file**

```typescript
// apps/web/src/app/storybook/_hooks/useStoryControls.ts
'use client';

import { useEffect } from 'react';

import { useStorybookStore } from '@/app/storybook/_store/storybook.store';
import type { StoryConfig } from '@/app/storybook/_types/story';

/**
 * 컴포넌트 스토리 페이지에서 호출.
 * config를 스토어에 등록하고 현재 조작 중인 props를 반환.
 */
export const useStoryControls = (config: StoryConfig) => {
  const { setStory, currentProps, currentStory } = useStorybookStore();

  useEffect(() => {
    // title로 동일 config인지 확인해 불필요한 리셋 방지
    if (currentStory?.title !== config.title) {
      setStory(config);
    }
  }, [config.title]); // eslint-disable-line react-hooks/exhaustive-deps

  return currentProps;
};
```

**Step 2: Verify**

```bash
cd apps/web && pnpm typecheck
```

**Step 3: Commit**

```bash
git add apps/web/src/app/storybook/_hooks/useStoryControls.ts
git commit -m "[Feat] storybook: useStoryControls 훅 추가"
```

---

### Task 4: StorybookSidebar

**Files:**

- Create: `apps/web/src/app/storybook/_components/StorybookSidebar.tsx`

**Step 1: Create the file**

```typescript
// apps/web/src/app/storybook/_components/StorybookSidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/cn';

const NAV = [
  {
    group: 'Foundations',
    items: [
      { label: 'Colors', href: '/storybook/foundations/colors' },
      { label: 'Typography', href: '/storybook/foundations/typography' },
      { label: 'Icons', href: '/storybook/foundations/icons' },
      { label: 'Avatars', href: '/storybook/foundations/avatars' },
    ],
  },
  {
    group: 'Components',
    items: [
      { label: 'Button', href: '/storybook/components/button' },
      { label: 'Toggle', href: '/storybook/components/toggle' },
      { label: 'Input', href: '/storybook/components/input' },
      { label: 'Badge', href: '/storybook/components/badge' },
      { label: 'Loading', href: '/storybook/components/loading' },
      { label: 'StepIndicator', href: '/storybook/components/step-indicator' },
      { label: 'StepperInput', href: '/storybook/components/stepper-input' },
      { label: 'ParticipantProgress', href: '/storybook/components/participant-progress' },
      { label: 'AvatarIcon', href: '/storybook/components/avatar-icon' },
      { label: 'AvatarList', href: '/storybook/components/avatar-list' },
      { label: 'BottomSheet', href: '/storybook/components/bottom-sheet' },
    ],
  },
  {
    group: 'Modals',
    items: [
      { label: 'ConfirmModal', href: '/storybook/modals/confirm' },
      { label: 'ErrorModal', href: '/storybook/modals/error' },
      { label: 'ReviewModal', href: '/storybook/modals/review' },
      { label: 'CreateMeetingSuccess', href: '/storybook/modals/create-success' },
    ],
  },
  {
    group: 'Survey UI',
    items: [
      { label: 'Chip', href: '/storybook/survey/chip' },
      { label: 'ChipGroup', href: '/storybook/survey/chip-group' },
    ],
  },
] as const;

const StorybookSidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="no-scrollbar h-full overflow-y-auto border-r border-neutral-300 bg-neutral-100 py-6">
      <div className="px-4 pb-4">
        <p className="label-2 font-bold tracking-widest text-neutral-600 uppercase">Storybook</p>
      </div>

      <nav className="flex flex-col gap-6 px-2">
        {NAV.map(({ group, items }) => (
          <div key={group}>
            <p className="mb-1 px-2 text-[10px] font-semibold tracking-wider text-neutral-500 uppercase">
              {group}
            </p>
            <ul className="flex flex-col gap-0.5">
              {items.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className={cn(
                      'block rounded-lg px-2 py-1.5 label-2 font-medium transition-colors',
                      pathname === href
                        ? 'bg-orange-100 font-semibold text-orange-600'
                        : 'text-neutral-1200 hover:bg-neutral-200'
                    )}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default StorybookSidebar;
```

**Step 2: Verify**

```bash
cd apps/web && pnpm typecheck
```

**Step 3: Commit**

```bash
git add apps/web/src/app/storybook/_components/StorybookSidebar.tsx
git commit -m "[Feat] storybook: 사이드바 네비게이션 컴포넌트 추가"
```

---

### Task 5: StorybookControls Panel

**Files:**

- Create: `apps/web/src/app/storybook/_components/StorybookControls.tsx`

**Step 1: Create the file**

```typescript
// apps/web/src/app/storybook/_components/StorybookControls.tsx
'use client';

import { useStorybookStore } from '@/app/storybook/_store/storybook.store';
import type { ControlDef } from '@/app/storybook/_types/story';
import { cn } from '@/lib/cn';

const ControlRow = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className="flex items-center justify-between gap-2 py-2 border-b border-neutral-200">
    <span className="label-2 font-medium text-neutral-800 shrink-0">{label}</span>
    <div className="min-w-0 flex-1 flex justify-end">{children}</div>
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
        <p className="label-2 text-neutral-500 text-center">이 페이지에는 조작 가능한 Controls가 없어요.</p>
      </div>
    );
  }

  const snippet = Object.entries(currentProps)
    .filter(([key]) => key !== 'children')
    .map(([key, val]) => {
      if (typeof val === 'boolean') return `  ${key}${val ? '' : '={false}'}`;
      if (typeof val === 'number') return `  ${key}={${val}}`;
      return `  ${key}="${val}"`;
    })
    .join('\n');

  const childrenVal = currentProps['children'];

  return (
    <div className="no-scrollbar flex h-full flex-col overflow-y-auto p-4">
      <div className="mb-4 flex items-center justify-between">
        <p className="label-1 font-semibold text-neutral-1400">Controls</p>
        <button
          onClick={resetProps}
          className="label-2 text-neutral-600 hover:text-orange-500 transition-colors"
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
```

**Step 2: Verify**

```bash
cd apps/web && pnpm typecheck
```

**Step 3: Commit**

```bash
git add apps/web/src/app/storybook/_components/StorybookControls.tsx
git commit -m "[Feat] storybook: Controls 패널 컴포넌트 추가 (select/toggle/text/range 자동 렌더)"
```

---

### Task 6: StorybookPreview (Variants Gallery + Playground)

**Files:**

- Create: `apps/web/src/app/storybook/_components/StorybookPreview.tsx`

**Step 1: Create the file**

```typescript
// apps/web/src/app/storybook/_components/StorybookPreview.tsx
'use client';

import { useState } from 'react';

import { useStorybookStore } from '@/app/storybook/_store/storybook.store';
import type { StoryConfig, VariantDef } from '@/app/storybook/_types/story';
import { cn } from '@/lib/cn';

type BgMode = 'white' | 'gray' | 'dark';

const BG_CLASSES: Record<BgMode, string> = {
  white: 'bg-white',
  gray: 'bg-neutral-200',
  dark: 'bg-neutral-1500',
};

const VariantCard = ({
  variant,
  config,
}: {
  variant: VariantDef;
  config: StoryConfig;
}) => {
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
      {/* Header */}
      <div>
        <h1 className="heading-4 font-bold text-neutral-1600">{config.title}</h1>
        {config.description && (
          <p className="mt-1 body-3 text-neutral-700">{config.description}</p>
        )}
      </div>

      {/* Variants Gallery */}
      {config.variants && config.variants.length > 0 && (
        <section>
          <h2 className="mb-4 label-1 font-semibold text-neutral-600 uppercase tracking-wide">
            Variants
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {config.variants.map((v) => (
              <VariantCard key={v.label} variant={v} config={config} />
            ))}
          </div>
        </section>
      )}

      {/* Playground */}
      {Object.keys(config.controls).length > 0 && (
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="label-1 font-semibold text-neutral-600 uppercase tracking-wide">
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
```

**Step 2: Verify**

```bash
cd apps/web && pnpm typecheck
```

**Step 3: Commit**

```bash
git add apps/web/src/app/storybook/_components/StorybookPreview.tsx
git commit -m "[Feat] storybook: StorybookPreview 컴포넌트 추가 (Variants 갤러리 + Playground)"
```

---

### Task 7: Layout Shell

**Files:**

- Create: `apps/web/src/app/storybook/layout.tsx`
- Create: `apps/web/src/app/storybook/page.tsx`

**Step 1: Create layout.tsx**

```typescript
// apps/web/src/app/storybook/layout.tsx
import StorybookControls from '@/app/storybook/_components/StorybookControls';
import StorybookSidebar from '@/app/storybook/_components/StorybookSidebar';

export default function StorybookLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-neutral-100">
      {/* Left sidebar */}
      <div className="w-[220px] shrink-0">
        <StorybookSidebar />
      </div>

      {/* Center main */}
      <main className="no-scrollbar flex-1 overflow-y-auto bg-white">
        {children}
      </main>

      {/* Right controls */}
      <div className="w-[280px] shrink-0 border-l border-neutral-300 bg-neutral-50">
        <StorybookControls />
      </div>
    </div>
  );
}
```

**Step 2: Create page.tsx (redirect)**

```typescript
// apps/web/src/app/storybook/page.tsx
import { redirect } from 'next/navigation';

export default function StorybookPage() {
  redirect('/storybook/foundations/colors');
}
```

**Step 3: Verify**

Open `http://localhost:3000/storybook` — should redirect to `/storybook/foundations/colors` (404 for now is fine, layout should render).

```bash
cd apps/web && pnpm typecheck
```

**Step 4: Commit**

```bash
git add 'apps/web/src/app/storybook/layout.tsx' 'apps/web/src/app/storybook/page.tsx'
git commit -m "[Feat] storybook: 3-panel 레이아웃 쉘 및 리다이렉트 페이지 추가"
```

---

## Phase 2 — Foundations (Tasks 8–11)

---

### Task 8: Colors Page

**Files:**

- Create: `apps/web/src/app/storybook/foundations/colors/page.tsx`

**Step 1: Create the file**

```typescript
// apps/web/src/app/storybook/foundations/colors/page.tsx
'use client';

import { useState } from 'react';

import { cn } from '@/lib/cn';

type Palette = {
  name: string;
  shades: { token: string; hex: string }[];
};

const PALETTES: Palette[] = [
  {
    name: 'Neutral',
    shades: [
      { token: 'neutral-100', hex: '#f9fafb' },
      { token: 'neutral-200', hex: '#f4f5f6' },
      { token: 'neutral-300', hex: '#e1e4e8' },
      { token: 'neutral-400', hex: '#d1d5da' },
      { token: 'neutral-500', hex: '#b8bec8' },
      { token: 'neutral-600', hex: '#9ba3b0' },
      { token: 'neutral-700', hex: '#8b929c' },
      { token: 'neutral-800', hex: '#6d7581' },
      { token: 'neutral-900', hex: '#686f7a' },
      { token: 'neutral-1000', hex: '#626872' },
      { token: 'neutral-1100', hex: '#5b626b' },
      { token: 'neutral-1200', hex: '#595e65' },
      { token: 'neutral-1300', hex: '#4f5359' },
      { token: 'neutral-1400', hex: '#3a3d42' },
      { token: 'neutral-1500', hex: '#1d1e20' },
      { token: 'neutral-1600', hex: '#131416' },
    ],
  },
  {
    name: 'Orange (Primary)',
    shades: [
      { token: 'orange-50', hex: '#fff7f5' },
      { token: 'orange-100', hex: '#fff0eb' },
      { token: 'orange-200', hex: '#ffd1c2' },
      { token: 'orange-300', hex: '#ffab8f' },
      { token: 'orange-400', hex: '#ff7e52' },
      { token: 'orange-500', hex: '#ff4f14' },
      { token: 'orange-600', hex: '#e03900' },
      { token: 'orange-700', hex: '#b82f00' },
      { token: 'orange-800', hex: '#8f2400' },
      { token: 'orange-900', hex: '#5c1700' },
      { token: 'orange-1000', hex: '#290a00' },
    ],
  },
  {
    name: 'Red',
    shades: [
      { token: 'red-50', hex: '#fff5f6' },
      { token: 'red-100', hex: '#feebec' },
      { token: 'red-200', hex: '#fdc4c6' },
      { token: 'red-300', hex: '#fb9397' },
      { token: 'red-400', hex: '#f86267' },
      { token: 'red-450', hex: '#f94842' },
      { token: 'red-500', hex: '#f7433c' },
      { token: 'red-600', hex: '#db0911' },
      { token: 'red-700', hex: '#b1070e' },
      { token: 'red-800', hex: '#89050b' },
      { token: 'red-900', hex: '#580307' },
      { token: 'red-1000', hex: '#272003' },
    ],
  },
  {
    name: 'Yellow',
    shades: [
      { token: 'yellow-50', hex: '#fffdd5' },
      { token: 'yellow-100', hex: '#fff6e0' },
      { token: 'yellow-200', hex: '#ffeaad' },
      { token: 'yellow-300', hex: '#ffe47a' },
      { token: 'yellow-400', hex: '#ffd014' },
      { token: 'yellow-500', hex: '#ebb800' },
      { token: 'yellow-600', hex: '#df9600' },
      { token: 'yellow-700', hex: '#b46500' },
      { token: 'yellow-800', hex: '#87500a' },
      { token: 'yellow-900', hex: '#553306' },
      { token: 'yellow-1000', hex: '#261703' },
    ],
  },
  {
    name: 'Green',
    shades: [
      { token: 'green-50', hex: '#f7fdfa' },
      { token: 'green-100', hex: '#effbf5' },
      { token: 'green-200', hex: '#cef3e2' },
      { token: 'green-300', hex: '#a5e9c5' },
      { token: 'green-400', hex: '#7cdea7' },
      { token: 'green-500', hex: '#51d48c' },
      { token: 'green-600', hex: '#2db46c' },
      { token: 'green-700', hex: '#25935e' },
      { token: 'green-800', hex: '#1d724f' },
      { token: 'green-900', hex: '#124932' },
      { token: 'green-1000', hex: '#082115' },
    ],
  },
  {
    name: 'Blue',
    shades: [
      { token: 'blue-50', hex: '#f6f8fe' },
      { token: 'blue-100', hex: '#ebeffa' },
      { token: 'blue-200', hex: '#dde3f7' },
      { token: 'blue-300', hex: '#cfdbf4' },
      { token: 'blue-400', hex: '#abbced' },
      { token: 'blue-500', hex: '#6d89f0' },
      { token: 'blue-600', hex: '#3d62eb' },
      { token: 'blue-700', hex: '#153ccb' },
      { token: 'blue-800', hex: '#17308c' },
      { token: 'blue-900', hex: '#091953' },
      { token: 'blue-1000', hex: '#040b25' },
    ],
  },
];

const GRADIENTS = [
  { name: 'cta-gradient', cls: 'cta-gradient' },
  { name: 'chip-gradient', cls: 'chip-gradient' },
  { name: 'title-gradient', cls: 'title-gradient' },
  { name: 'skeleton-gradient', cls: 'skeleton-gradient' },
];

const ColorSwatch = ({ token, hex }: { token: string; hex: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(hex);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const isLight = ['neutral-100', 'neutral-200', 'neutral-300', 'white', 'orange-50', 'red-50', 'yellow-50', 'green-50', 'blue-50'].some((t) => token.includes(t.split('-')[1] ?? '') && parseInt(token.split('-')[1] ?? '0') <= 200);

  return (
    <button
      onClick={handleCopy}
      title={`${token}: ${hex} — 클릭하여 복사`}
      className={cn(
        'group flex flex-col overflow-hidden rounded-lg border border-neutral-300 transition-transform hover:scale-105 hover:shadow-md'
      )}
    >
      <div className="h-12 w-full" style={{ backgroundColor: hex }} />
      <div className="bg-white px-2 py-1.5 text-left">
        <p className="text-[10px] font-semibold text-neutral-1200">{token}</p>
        <p className="text-[10px] text-neutral-600">{copied ? '✓ Copied!' : hex}</p>
      </div>
    </button>
  );
};

export default function ColorsPage() {
  return (
    <div className="p-6">
      <h1 className="mb-1 heading-4 font-bold text-neutral-1600">Colors</h1>
      <p className="mb-8 body-3 text-neutral-700">스와치를 클릭하면 hex 값이 클립보드에 복사됩니다.</p>

      <div className="flex flex-col gap-10">
        {PALETTES.map((palette) => (
          <section key={palette.name}>
            <h2 className="mb-3 label-1 font-semibold text-neutral-800">{palette.name}</h2>
            <div className="grid grid-cols-4 gap-3 sm:grid-cols-6 lg:grid-cols-8">
              {palette.shades.map((s) => (
                <ColorSwatch key={s.token} token={s.token} hex={s.hex} />
              ))}
            </div>
          </section>
        ))}

        <section>
          <h2 className="mb-3 label-1 font-semibold text-neutral-800">Gradients</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {GRADIENTS.map(({ name, cls }) => (
              <div key={name} className="flex flex-col gap-2">
                <div className={cn('h-16 rounded-lg', cls)} />
                <p className="label-2 text-neutral-700">{name}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
```

**Step 2: Verify**

Open `http://localhost:3000/storybook/foundations/colors`. Colors should display in grid. Click a swatch — hex should copy.

```bash
cd apps/web && pnpm typecheck
```

**Step 3: Commit**

```bash
git add 'apps/web/src/app/storybook/foundations/colors/page.tsx'
git commit -m "[Feat] storybook: Colors 파운데이션 페이지 추가 (56색상 + 그라디언트)"
```

---

### Task 9: Typography Page

**Files:**

- Create: `apps/web/src/app/storybook/foundations/typography/page.tsx`

**Step 1: Create the file**

```typescript
// apps/web/src/app/storybook/foundations/typography/page.tsx

const TYPE_SCALE = [
  { cls: 'display-1', size: '2.875rem', lineHeight: '3.875rem' },
  { cls: 'heading-1', size: '2.125rem', lineHeight: '3rem' },
  { cls: 'heading-2', size: '1.75rem', lineHeight: '2.5rem' },
  { cls: 'heading-3', size: '1.5rem', lineHeight: '2.25rem' },
  { cls: 'heading-4', size: '1.25rem', lineHeight: '2rem' },
  { cls: 'subheading-1', size: '1.25rem', lineHeight: '1.875rem' },
  { cls: 'subheading-2', size: '1.125rem', lineHeight: '1.625rem' },
  { cls: 'subheading-3', size: '1rem', lineHeight: '1.5rem' },
  { cls: 'body-1', size: '1.25rem', lineHeight: '1.875rem' },
  { cls: 'body-2', size: '1.125rem', lineHeight: '1.625rem' },
  { cls: 'body-3', size: '1rem', lineHeight: '1.5rem' },
  { cls: 'label-1', size: '0.875rem', lineHeight: '1.375rem' },
  { cls: 'label-2', size: '0.75rem', lineHeight: '1.25rem' },
] as const;

const SAMPLE_TEXT = '모임을 만들어 보세요';

export default function TypographyPage() {
  return (
    <div className="p-6">
      <h1 className="mb-1 heading-4 font-bold text-neutral-1600">Typography</h1>
      <p className="mb-8 body-3 text-neutral-700">
        모든 텍스트 스케일. letter-spacing: -0.01%
      </p>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-neutral-300">
              <th className="py-2 pr-4 text-left label-2 font-semibold text-neutral-600">Class</th>
              <th className="py-2 pr-4 text-left label-2 font-semibold text-neutral-600">Size</th>
              <th className="py-2 pr-4 text-left label-2 font-semibold text-neutral-600">
                Line Height
              </th>
              <th className="py-2 text-left label-2 font-semibold text-neutral-600">Preview</th>
            </tr>
          </thead>
          <tbody>
            {TYPE_SCALE.map(({ cls, size, lineHeight }) => (
              <tr key={cls} className="border-b border-neutral-200">
                <td className="py-4 pr-4 font-mono text-[11px] text-orange-600">.{cls}</td>
                <td className="py-4 pr-4 label-2 text-neutral-600">{size}</td>
                <td className="py-4 pr-4 label-2 text-neutral-600">{lineHeight}</td>
                <td className="py-4">
                  <span className={`${cls} text-neutral-1400`}>{SAMPLE_TEXT}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <section className="mt-10">
        <h2 className="mb-4 label-1 font-semibold text-neutral-800">Font Weights</h2>
        <div className="flex flex-col gap-3">
          {[
            { weight: 'font-normal', value: '400' },
            { weight: 'font-medium', value: '500' },
            { weight: 'font-semibold', value: '600' },
            { weight: 'font-bold', value: '700' },
          ].map(({ weight, value }) => (
            <div key={weight} className="flex items-baseline gap-4">
              <span className="w-24 font-mono text-[11px] text-orange-600">.{weight}</span>
              <span className="w-8 label-2 text-neutral-500">{value}</span>
              <span className={`body-3 text-neutral-1400 ${weight}`}>{SAMPLE_TEXT}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
```

**Step 2: Verify + Commit**

```bash
git add 'apps/web/src/app/storybook/foundations/typography/page.tsx'
git commit -m "[Feat] storybook: Typography 파운데이션 페이지 추가 (13 스케일 + 웨이트)"
```

---

### Task 10: Icons Page

**Files:**

- Create: `apps/web/src/app/storybook/foundations/icons/page.tsx`

**Step 1: Create the file**

```typescript
// apps/web/src/app/storybook/foundations/icons/page.tsx
'use client';

import { useState } from 'react';

import Image from 'next/image';

import { cn } from '@/lib/cn';

const UTILITY_ICONS = [
  { name: 'arrow', path: '/icons/arrow.svg' },
  { name: 'arrow-green', path: '/icons/arrow-green.svg' },
  { name: 'check', path: '/icons/check.svg' },
  { name: 'exclamation', path: '/icons/exclamation.svg' },
  { name: 'people', path: '/icons/people.svg' },
  { name: 'profile', path: '/icons/profile.svg' },
] as const;

const FOOD_ICONS = [
  { name: '다 괜찮아요', path: '/icons/food/다 괜찮아요.svg' },
  { name: '동남아', path: '/icons/food/동남아.svg' },
  { name: '멕시칸', path: '/icons/food/멕시칸.svg' },
  { name: '베트남 음식', path: '/icons/food/베트남 음식.svg' },
  { name: '분식', path: '/icons/food/분식.svg' },
  { name: '양식', path: '/icons/food/양식.svg' },
  { name: '인도 음식', path: '/icons/food/인도 음식.svg' },
  { name: '일식', path: '/icons/food/일식.svg' },
  { name: '중식', path: '/icons/food/중식.svg' },
  { name: '태국 음식', path: '/icons/food/태국 음식.svg' },
  { name: '한식', path: '/icons/food/한식.svg' },
] as const;

const BRAND_ICONS = [
  { name: 'apple', path: '/images/brand/apple.svg' },
  { name: 'kakao', path: '/images/brand/kakao.svg' },
  { name: 'kakaotalk', path: '/images/brand/kakaotalk.svg' },
  { name: 'solv-wordmark', path: '/images/brand/solv-wordmark.svg' },
] as const;

type Tab = 'utility' | 'food' | 'brand';

const IconCard = ({
  name,
  path,
  size = 40,
}: {
  name: string;
  path: string;
  size?: number;
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const snippet = `<Image src="${path}" alt="${name}" width={${size}} height={${size}} />`;
    await navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      onClick={handleCopy}
      title={`${path} — 클릭하여 Image 코드 복사`}
      className="group flex flex-col items-center gap-2 rounded-xl border border-neutral-300 bg-white p-4 transition-transform hover:scale-105 hover:shadow-md"
    >
      <div className="flex h-10 w-10 items-center justify-center">
        <Image src={path} alt={name} width={size} height={size} className="object-contain" />
      </div>
      <p className="text-center text-[10px] font-medium text-neutral-700">
        {copied ? '✓ Copied!' : name}
      </p>
    </button>
  );
};

export default function IconsPage() {
  const [tab, setTab] = useState<Tab>('utility');

  const tabItems: { key: Tab; label: string; count: number }[] = [
    { key: 'utility', label: 'Utility', count: UTILITY_ICONS.length },
    { key: 'food', label: 'Food', count: FOOD_ICONS.length },
    { key: 'brand', label: 'Brand', count: BRAND_ICONS.length },
  ];

  const icons =
    tab === 'utility' ? UTILITY_ICONS : tab === 'food' ? FOOD_ICONS : BRAND_ICONS;

  return (
    <div className="p-6">
      <h1 className="mb-1 heading-4 font-bold text-neutral-1600">Icons</h1>
      <p className="mb-6 body-3 text-neutral-700">
        아이콘을 클릭하면 Image 컴포넌트 코드가 클립보드에 복사됩니다.
      </p>

      <div className="mb-6 flex gap-2">
        {tabItems.map(({ key, label, count }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={cn(
              'rounded-lg px-4 py-2 label-2 font-medium transition-colors',
              tab === key
                ? 'bg-orange-100 font-semibold text-orange-600'
                : 'text-neutral-700 hover:bg-neutral-200'
            )}
          >
            {label}
            <span className="ml-1.5 text-neutral-500">({count})</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-4 gap-4 sm:grid-cols-6">
        {icons.map((icon) => (
          <IconCard key={icon.name} name={icon.name} path={icon.path} />
        ))}
      </div>
    </div>
  );
}
```

**Step 2: Verify + Commit**

```bash
git add 'apps/web/src/app/storybook/foundations/icons/page.tsx'
git commit -m "[Feat] storybook: Icons 파운데이션 페이지 추가 (Utility/Food/Brand 탭)"
```

---

### Task 11: Avatars Page

**Files:**

- Create: `apps/web/src/app/storybook/foundations/avatars/page.tsx`

**Step 1: Create the file**

```typescript
// apps/web/src/app/storybook/foundations/avatars/page.tsx
import Image from 'next/image';

const AVATARS = [
  'banana', 'broccoli', 'carrot', 'default',
  'lemon', 'mushroom', 'paprika', 'pear', 'tomato', 'turnip',
] as const;

export default function AvatarsPage() {
  return (
    <div className="p-6">
      <h1 className="mb-1 heading-4 font-bold text-neutral-1600">Avatars</h1>
      <p className="mb-8 body-3 text-neutral-700">
        사용자 프로필 아바타. <code className="rounded bg-neutral-200 px-1 py-0.5 text-[11px]">AvatarVariantKey</code> 타입과 1:1 대응.
      </p>

      <div className="grid grid-cols-5 gap-6">
        {AVATARS.map((name) => (
          <div key={name} className="flex flex-col items-center gap-2">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-neutral-300 bg-neutral-100 p-2">
              <Image
                src={`/images/avatar/${name}.svg`}
                alt={name}
                width={48}
                height={48}
                className="object-contain"
              />
            </div>
            <p className="label-2 font-medium text-neutral-700">{name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

**Step 2: Verify + Commit**

```bash
git add 'apps/web/src/app/storybook/foundations/avatars/page.tsx'
git commit -m "[Feat] storybook: Avatars 파운데이션 페이지 추가 (10개 아바타)"
```

---

## Phase 3 — Component Stories (Tasks 12–22)

> **Pattern for every component story:**
>
> 1. Import `StoryConfig`, `StorybookPreview`, `useStoryControls` from storybook internals
> 2. Define `const config: StoryConfig = { ... }` with all controls + variants
> 3. Create a client component that calls `useStoryControls(config)` and renders `<StorybookPreview config={config} />`
> 4. `export default` the client component (also export `config` for completeness)

---

### Task 12: Button Story

**Files:**

- Create: `apps/web/src/app/storybook/components/button/page.tsx`

**Step 1: Create the file**

```typescript
// apps/web/src/app/storybook/components/button/page.tsx
'use client';

import StorybookPreview from '@/app/storybook/_components/StorybookPreview';
import { useStoryControls } from '@/app/storybook/_hooks/useStoryControls';
import type { StoryConfig } from '@/app/storybook/_types/story';
import Button from '@/components/ui/Button';

const config: StoryConfig = {
  title: 'Button',
  description: '주요 CTA 버튼. theme × status 조합으로 모든 상태를 표현합니다.',
  component: Button,
  controls: {
    theme: {
      type: 'select',
      label: 'theme',
      options: ['cta-gradient', 'orange', 'orange-light', 'gray'],
      default: 'cta-gradient',
    },
    status: {
      type: 'select',
      label: 'status',
      options: ['normal', 'disabled'],
      default: 'normal',
    },
    children: { type: 'text', label: 'label', default: '다음으로' },
  },
  variants: [
    { label: 'CTA Gradient', props: { theme: 'cta-gradient', children: '다음으로' } },
    { label: 'Orange', props: { theme: 'orange', children: '확인' } },
    { label: 'Orange Light', props: { theme: 'orange-light', children: '선택' } },
    { label: 'Gray', props: { theme: 'gray', children: '취소' } },
    { label: 'Disabled', props: { theme: 'orange', status: 'disabled', children: '비활성' } },
  ],
};

export default function ButtonStoryPage() {
  const currentProps = useStoryControls(config);
  return <StorybookPreview config={config} />;
}
```

> ⚠️ `useStoryControls` 반환값을 쓰지 않는 것처럼 보이지만 스토어 등록이 목적이므로 의도적. `StorybookPreview` 내부에서 스토어를 구독해 currentProps를 읽음.

**Step 2: Verify + Commit**

Open `http://localhost:3000/storybook/components/button`. Variants gallery + Playground + Controls all work.

```bash
git add 'apps/web/src/app/storybook/components/button/page.tsx'
git commit -m "[Feat] storybook: Button 스토리 페이지 추가"
```

---

### Task 13: Toggle Story

**Files:**

- Create: `apps/web/src/app/storybook/components/toggle/page.tsx`

```typescript
// apps/web/src/app/storybook/components/toggle/page.tsx
'use client';

import StorybookPreview from '@/app/storybook/_components/StorybookPreview';
import { useStoryControls } from '@/app/storybook/_hooks/useStoryControls';
import type { StoryConfig } from '@/app/storybook/_types/story';
import Toggle from '@/components/ui/Toggle';

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

export default function ToggleStoryPage() {
  useStoryControls(config);
  return <StorybookPreview config={config} />;
}
```

**Commit:**

```bash
git add 'apps/web/src/app/storybook/components/toggle/page.tsx'
git commit -m "[Feat] storybook: Toggle 스토리 페이지 추가"
```

---

### Task 14: Input Story

**Files:**

- Create: `apps/web/src/app/storybook/components/input/page.tsx`

```typescript
// apps/web/src/app/storybook/components/input/page.tsx
'use client';

import StorybookPreview from '@/app/storybook/_components/StorybookPreview';
import { useStoryControls } from '@/app/storybook/_hooks/useStoryControls';
import type { StoryConfig } from '@/app/storybook/_types/story';
import Input from '@/components/ui/Input';

const config: StoryConfig = {
  title: 'Input',
  description: '텍스트 입력 필드. 에러 상태, 클리어 버튼, 검색 타입을 지원합니다.',
  component: Input,
  controls: {
    type: {
      type: 'select',
      label: 'type',
      options: ['text', 'search'],
      default: 'text',
    },
    placeholder: { type: 'text', label: 'placeholder', default: '모임 이름 입력' },
    hasError: { type: 'toggle', label: 'hasError', default: false },
    errorMessage: { type: 'text', label: 'errorMessage', default: '필수 입력 항목입니다.' },
    showClearButton: { type: 'toggle', label: 'showClearButton', default: false },
    helperText: { type: 'text', label: 'helperText', default: '' },
  },
  variants: [
    { label: 'Default', props: { placeholder: '모임 이름 입력' } },
    { label: 'Search', props: { type: 'search', placeholder: '강남역' } },
    { label: 'Error', props: { hasError: true, errorMessage: '필수 입력 항목입니다.' } },
    {
      label: 'With Clear',
      props: { showClearButton: true, value: '입력된 값', onChange: () => {} },
    },
  ],
};

export default function InputStoryPage() {
  useStoryControls(config);
  return <StorybookPreview config={config} />;
}
```

**Commit:**

```bash
git add 'apps/web/src/app/storybook/components/input/page.tsx'
git commit -m "[Feat] storybook: Input 스토리 페이지 추가"
```

---

### Task 15: Badge Story

**Files:**

- Create: `apps/web/src/app/storybook/components/badge/page.tsx`

```typescript
// apps/web/src/app/storybook/components/badge/page.tsx
'use client';

import StorybookPreview from '@/app/storybook/_components/StorybookPreview';
import { useStoryControls } from '@/app/storybook/_hooks/useStoryControls';
import type { StoryConfig } from '@/app/storybook/_types/story';
import Badge from '@/components/ui/Badge';

const config: StoryConfig = {
  title: 'Badge',
  description: '카테고리, 태그 등 짧은 레이블 표시용. 단일 children만 지원합니다.',
  component: Badge,
  controls: {
    children: { type: 'text', label: 'label', default: '한식' },
  },
  variants: [
    { label: '한식', props: { children: '한식' } },
    { label: '일식', props: { children: '일식' } },
    { label: '중식', props: { children: '중식' } },
    { label: '양식', props: { children: '양식' } },
  ],
};

export default function BadgeStoryPage() {
  useStoryControls(config);
  return <StorybookPreview config={config} />;
}
```

**Commit:**

```bash
git add 'apps/web/src/app/storybook/components/badge/page.tsx'
git commit -m "[Feat] storybook: Badge 스토리 페이지 추가"
```

---

### Task 16: Loading Story

**Files:**

- Create: `apps/web/src/app/storybook/components/loading/page.tsx`

> Loading은 전체화면 fixed overlay이므로 Controls 없음. 토글 버튼으로 직접 트리거.

```typescript
// apps/web/src/app/storybook/components/loading/page.tsx
'use client';

import { useState } from 'react';

import Loading from '@/components/ui/Loading';

export default function LoadingStoryPage() {
  const [show, setShow] = useState(false);

  return (
    <div className="p-6">
      <h1 className="mb-1 heading-4 font-bold text-neutral-1600">Loading</h1>
      <p className="mb-4 body-3 text-neutral-700">
        전체 화면 Fixed 오버레이 로딩 스피너. 아래 버튼으로 미리보기.
      </p>

      <div className="mb-6 rounded-xl border border-neutral-300 bg-neutral-100 p-4">
        <p className="label-2 text-neutral-600">
          컴포넌트: <code className="rounded bg-neutral-200 px-1 py-0.5 text-[11px]">{'<Loading />'}</code>
        </p>
        <p className="mt-1 label-2 text-neutral-600">Props: 없음 (standalone)</p>
      </div>

      <button
        onClick={() => setShow(true)}
        className="rounded-xl bg-orange-500 px-6 py-3 body-3 font-semibold text-white"
      >
        Loading 오버레이 열기
      </button>

      {show && (
        <div onClick={() => setShow(false)} className="cursor-pointer">
          <Loading />
          <p className="fixed bottom-8 left-1/2 z-[100] -translate-x-1/2 rounded-full bg-white px-4 py-2 label-2 shadow-lg">
            클릭하면 닫힙니다
          </p>
        </div>
      )}
    </div>
  );
}
```

**Commit:**

```bash
git add 'apps/web/src/app/storybook/components/loading/page.tsx'
git commit -m "[Feat] storybook: Loading 스토리 페이지 추가"
```

---

### Task 17: StepIndicator Story

**Files:**

- Create: `apps/web/src/app/storybook/components/step-indicator/page.tsx`

```typescript
// apps/web/src/app/storybook/components/step-indicator/page.tsx
'use client';

import StorybookPreview from '@/app/storybook/_components/StorybookPreview';
import { useStoryControls } from '@/app/storybook/_hooks/useStoryControls';
import type { StoryConfig } from '@/app/storybook/_types/story';
import StepIndicator from '@/components/ui/StepIndicator';

const config: StoryConfig = {
  title: 'StepIndicator',
  description: '진행 단계를 나타내는 progress bar. value/total 비율로 너비 계산.',
  component: StepIndicator,
  controls: {
    value: { type: 'range', label: 'value', min: 0, max: 10, default: 3 },
    total: { type: 'range', label: 'total', min: 1, max: 10, default: 5 },
  },
  variants: [
    { label: '0%', props: { value: 0, total: 5 } },
    { label: '40%', props: { value: 2, total: 5 } },
    { label: '80%', props: { value: 4, total: 5 } },
    { label: '100%', props: { value: 5, total: 5 } },
  ],
};

export default function StepIndicatorStoryPage() {
  useStoryControls(config);
  return <StorybookPreview config={config} />;
}
```

**Commit:**

```bash
git add 'apps/web/src/app/storybook/components/step-indicator/page.tsx'
git commit -m "[Feat] storybook: StepIndicator 스토리 페이지 추가"
```

---

### Task 18: StepperInput Story

**Files:**

- Create: `apps/web/src/app/storybook/components/stepper-input/page.tsx`

> StepperInput은 내부 상태가 있으므로 wrapper 컴포넌트로 감싼다.

```typescript
// apps/web/src/app/storybook/components/stepper-input/page.tsx
'use client';

import { useState } from 'react';

import StorybookPreview from '@/app/storybook/_components/StorybookPreview';
import { useStoryControls } from '@/app/storybook/_hooks/useStoryControls';
import type { StoryConfig } from '@/app/storybook/_types/story';
import StepperInput from '@/components/ui/StepperInput';

// Controls로 min/max 조작, value는 내부 상태
const StepperInputWrapper = ({ min, max }: { min: number; max: number }) => {
  const [value, setValue] = useState(min);
  return <StepperInput value={value} onChange={setValue} min={min} max={max} />;
};

const config: StoryConfig = {
  title: 'StepperInput',
  description: '+/- 버튼으로 숫자를 조작하는 입력 필드. min/max로 범위 제한.',
  component: StepperInputWrapper,
  controls: {
    min: { type: 'range', label: 'min', min: 0, max: 10, default: 2 },
    max: { type: 'range', label: 'max', min: 1, max: 50, default: 20 },
  },
  variants: [
    { label: 'Default (2~20)', props: { min: 2, max: 20 } },
    { label: 'Narrow (1~5)', props: { min: 1, max: 5 } },
  ],
};

export default function StepperInputStoryPage() {
  useStoryControls(config);
  return <StorybookPreview config={config} />;
}
```

**Commit:**

```bash
git add 'apps/web/src/app/storybook/components/stepper-input/page.tsx'
git commit -m "[Feat] storybook: StepperInput 스토리 페이지 추가"
```

---

### Task 19: ParticipantProgressIndicator Story

**Files:**

- Create: `apps/web/src/app/storybook/components/participant-progress/page.tsx`

```typescript
// apps/web/src/app/storybook/components/participant-progress/page.tsx
'use client';

import StorybookPreview from '@/app/storybook/_components/StorybookPreview';
import { useStoryControls } from '@/app/storybook/_hooks/useStoryControls';
import type { StoryConfig } from '@/app/storybook/_types/story';
import ParticipantProgressIndicator from '@/components/ui/ParticipantProgressIndicator';

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

export default function ParticipantProgressStoryPage() {
  useStoryControls(config);
  return <StorybookPreview config={config} />;
}
```

**Commit:**

```bash
git add 'apps/web/src/app/storybook/components/participant-progress/page.tsx'
git commit -m "[Feat] storybook: ParticipantProgressIndicator 스토리 페이지 추가"
```

---

### Task 20: AvatarIcon Story

**Files:**

- Create: `apps/web/src/app/storybook/components/avatar-icon/page.tsx`

```typescript
// apps/web/src/app/storybook/components/avatar-icon/page.tsx
'use client';

import StorybookPreview from '@/app/storybook/_components/StorybookPreview';
import { useStoryControls } from '@/app/storybook/_hooks/useStoryControls';
import type { StoryConfig } from '@/app/storybook/_types/story';
import AvatarIcon from '@/components/ui/AvatarIcon';

const AVATAR_OPTIONS = [
  'default', 'banana', 'broccoli', 'carrot',
  'lemon', 'mushroom', 'paprika', 'pear', 'tomato', 'turnip',
] as const;

const config: StoryConfig = {
  title: 'AvatarIcon',
  description: '채소/과일 아바타 아이콘. 기본 48×48px. className으로 크기 조정.',
  component: AvatarIcon,
  controls: {
    variant: {
      type: 'select',
      label: 'variant',
      options: [...AVATAR_OPTIONS],
      default: 'default',
    },
  },
  variants: AVATAR_OPTIONS.map((v) => ({
    label: v,
    props: { variant: v },
  })),
};

export default function AvatarIconStoryPage() {
  useStoryControls(config);
  return <StorybookPreview config={config} />;
}
```

**Commit:**

```bash
git add 'apps/web/src/app/storybook/components/avatar-icon/page.tsx'
git commit -m "[Feat] storybook: AvatarIcon 스토리 페이지 추가"
```

---

### Task 21: AvatarList Story

**Files:**

- Create: `apps/web/src/app/storybook/components/avatar-list/page.tsx`

> AvatarList는 `Participant[]`를 요구하므로 mock data와 함께 정적 갤러리로 표시.

```typescript
// apps/web/src/app/storybook/components/avatar-list/page.tsx
import AvatarList from '@/components/ui/AvatarList';
import type { Participant } from '@/data/models/meeting';

const MOCK_PARTICIPANTS_3: Participant[] = [
  { userId: 1, attendeeNickname: '딸기', color: 'tomato' },
  { userId: 2, attendeeNickname: '당근', color: 'carrot' },
  { userId: 3, attendeeNickname: '바나나', color: 'banana' },
];

const MOCK_PARTICIPANTS_5: Participant[] = [
  ...MOCK_PARTICIPANTS_3,
  { userId: 4, attendeeNickname: '브로콜리', color: 'broccoli' },
  { userId: 5, attendeeNickname: '레몬', color: 'lemon' },
];

export default function AvatarListStoryPage() {
  return (
    <div className="p-6">
      <h1 className="mb-1 heading-4 font-bold text-neutral-1600">AvatarList</h1>
      <p className="mb-8 body-3 text-neutral-700">
        참여자 목록. 아바타를 겹쳐서 표시 + 인원 수 배지.
      </p>

      <div className="flex flex-col gap-8">
        <div>
          <p className="mb-3 label-1 font-semibold text-neutral-700">3명</p>
          <AvatarList surveyParticipantList={MOCK_PARTICIPANTS_3} />
        </div>
        <div>
          <p className="mb-3 label-1 font-semibold text-neutral-700">5명</p>
          <AvatarList surveyParticipantList={MOCK_PARTICIPANTS_5} />
        </div>
      </div>
    </div>
  );
}
```

**Commit:**

```bash
git add 'apps/web/src/app/storybook/components/avatar-list/page.tsx'
git commit -m "[Feat] storybook: AvatarList 스토리 페이지 추가"
```

---

### Task 22: BottomSheet Story

**Files:**

- Create: `apps/web/src/app/storybook/components/bottom-sheet/page.tsx`

```typescript
// apps/web/src/app/storybook/components/bottom-sheet/page.tsx
'use client';

import { useState } from 'react';

import BottomSheet from '@/components/ui/BottomSheet';

export default function BottomSheetStoryPage() {
  const [open, setOpen] = useState(false);
  const [showClose, setShowClose] = useState(true);
  const [title, setTitle] = useState('바텀시트 제목');

  return (
    <div className="p-6">
      <h1 className="mb-1 heading-4 font-bold text-neutral-1600">BottomSheet</h1>
      <p className="mb-6 body-3 text-neutral-700">
        하단에서 올라오는 시트. 90dvh 기본. 오버레이 클릭 또는 X 버튼으로 닫힘.
      </p>

      <div className="mb-6 flex flex-col gap-3 rounded-xl border border-neutral-300 bg-neutral-100 p-4">
        <label className="flex items-center gap-3">
          <span className="label-2 text-neutral-700 w-32">title</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1 rounded-md border border-neutral-300 px-2 py-1 label-2"
          />
        </label>
        <label className="flex items-center gap-3">
          <span className="label-2 text-neutral-700 w-32">showCloseButton</span>
          <button
            type="button"
            role="switch"
            aria-checked={showClose}
            onClick={() => setShowClose((v) => !v)}
            className={`relative h-6 w-10 rounded-full transition-colors ${showClose ? 'bg-orange-500' : 'bg-neutral-400'}`}
          >
            <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${showClose ? 'left-[calc(100%-22px)]' : 'left-0.5'}`} />
          </button>
        </label>
      </div>

      <button
        onClick={() => setOpen(true)}
        className="rounded-xl bg-orange-500 px-6 py-3 body-3 font-semibold text-white"
      >
        BottomSheet 열기
      </button>

      {open && (
        <BottomSheet title={title} showCloseButton={showClose} onClose={() => setOpen(false)}>
          <div className="flex flex-col gap-3 py-2">
            <p className="body-3 text-neutral-1400">바텀시트 안에 들어오는 콘텐츠 영역입니다.</p>
            <p className="body-3 text-neutral-600">
              설문 내에서 추가 선택지나 안내 문구를 표시할 때 사용합니다.
            </p>
          </div>
        </BottomSheet>
      )}
    </div>
  );
}
```

**Commit:**

```bash
git add 'apps/web/src/app/storybook/components/bottom-sheet/page.tsx'
git commit -m "[Feat] storybook: BottomSheet 스토리 페이지 추가"
```

---

## Phase 4 — Modals (Tasks 23–26)

> 모달은 `isOpen` 상태로 트리거. Controls 없음 — 트리거 버튼 방식으로 모든 케이스 나열.

---

### Task 23: ConfirmModal Story

**Files:**

- Create: `apps/web/src/app/storybook/modals/confirm/page.tsx`

```typescript
// apps/web/src/app/storybook/modals/confirm/page.tsx
'use client';

import { useState } from 'react';

import { ConfirmModal } from '@/components/ui/Modal';

type CaseId = 'coming-soon' | 'confirm-only' | 'logout' | 'withdraw' | 'create-cancel' | null;

const CASES = [
  {
    id: 'coming-soon' as const,
    label: '준비중 서비스',
    props: {
      title: '해당 서비스는 준비중이에요!',
      description: '많은 기대 부탁드립니다!',
      illustration: '/images/modal/modal-coming-soon.svg',
      confirmText: '확인',
    },
  },
  {
    id: 'confirm-only' as const,
    label: '확인 버튼만 (onCancel 없음)',
    props: { title: '안내', description: '확인 버튼만 있는 케이스예요.', confirmText: '확인' },
  },
  {
    id: 'logout' as const,
    label: '로그아웃',
    props: {
      title: '로그아웃 하시겠어요?',
      description: '로그아웃해도 해당 계정의 데이터는\n계속 저장되어 있습니다.',
      confirmText: '로그아웃',
      cancelText: '취소',
    },
  },
  {
    id: 'withdraw' as const,
    label: '회원탈퇴',
    props: {
      title: '정말 탈퇴하시겠어요?',
      description: '탈퇴 버튼 선택 시\n계정은 삭제되며 복구되지 않습니다.',
      confirmText: '탈퇴',
      cancelText: '취소',
    },
  },
  {
    id: 'create-cancel' as const,
    label: '모임 만들기 취소',
    props: {
      title: '모임 만들기를 취소하시겠어요?',
      confirmText: '네',
      cancelText: '아니오',
    },
  },
] as const;

export default function ConfirmModalStoryPage() {
  const [open, setOpen] = useState<CaseId>(null);
  const close = () => setOpen(null);

  return (
    <div className="p-6">
      <h1 className="mb-1 heading-4 font-bold text-neutral-1600">ConfirmModal</h1>
      <p className="mb-6 body-3 text-neutral-700">
        확인/취소 또는 확인 단일 버튼. illustration 선택적.
      </p>

      <div className="flex flex-col gap-2">
        {CASES.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setOpen(id)}
            className="rounded-xl bg-white px-4 py-3 text-left body-3 font-medium text-neutral-1400 shadow-sm border border-neutral-300 hover:bg-neutral-100"
          >
            {label}
          </button>
        ))}
      </div>

      {CASES.map(({ id, props }) => (
        <ConfirmModal
          key={id}
          isOpen={open === id}
          onConfirm={close}
          onCancel={'cancelText' in props ? close : undefined}
          {...props}
        />
      ))}
    </div>
  );
}
```

**Commit:**

```bash
git add 'apps/web/src/app/storybook/modals/confirm/page.tsx'
git commit -m "[Feat] storybook: ConfirmModal 스토리 페이지 추가 (5개 케이스)"
```

---

### Task 24: ErrorModal Story

**Files:**

- Create: `apps/web/src/app/storybook/modals/error/page.tsx`

```typescript
// apps/web/src/app/storybook/modals/error/page.tsx
'use client';

import { useState } from 'react';

import { ErrorModal } from '@/components/ui/Modal';
import { ERROR_CONFIG } from '@/data/constants/errorConfig';

type ErrorCaseId = 'C4043' | 'C4097' | 'C4099' | 'T002' | 'T003' | 'DEFAULT' | 'withdraw' | null;

const ERROR_CASES = [
  { id: 'C4043' as const, label: 'C4043 — 존재하지 않은 모임', config: ERROR_CONFIG.C4043 },
  { id: 'C4097' as const, label: 'C4097 — 설문 시간 만료', config: ERROR_CONFIG.C4097 },
  { id: 'C4099' as const, label: 'C4099 — 참여 인원 초과', config: ERROR_CONFIG.C4099 },
  { id: 'T002' as const, label: 'T002 — 토큰 포맷 오류', config: ERROR_CONFIG.T002 },
  { id: 'T003' as const, label: 'T003 — 토큰 모임 ID 오류', config: ERROR_CONFIG.T003 },
  { id: 'DEFAULT' as const, label: 'DEFAULT — 알 수 없는 에러', config: ERROR_CONFIG.DEFAULT },
  {
    id: 'withdraw' as const,
    label: '회원탈퇴 실패',
    config: {
      title: '탈퇴 처리 중 오류가 발생했어요',
      message: '잠시 후 다시 시도해주세요.',
      illustration: '/images/modal/modal-error.svg',
    },
  },
] as const;

export default function ErrorModalStoryPage() {
  const [open, setOpen] = useState<ErrorCaseId>(null);
  const close = () => setOpen(null);

  return (
    <div className="p-6">
      <h1 className="mb-1 heading-4 font-bold text-neutral-1600">ErrorModal</h1>
      <p className="mb-6 body-3 text-neutral-700">
        에러 발생 시 노출. 확인 버튼 1개. illustration 선택적.
      </p>

      <div className="flex flex-col gap-2">
        {ERROR_CASES.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setOpen(id)}
            className="rounded-xl bg-white px-4 py-3 text-left body-3 font-medium text-neutral-1400 shadow-sm border border-neutral-300 hover:bg-neutral-100"
          >
            {label}
          </button>
        ))}
      </div>

      {ERROR_CASES.map(({ id, config }) => (
        <ErrorModal
          key={id}
          isOpen={open === id}
          title={config.title}
          message={config.message}
          illustration={'illustration' in config ? config.illustration : undefined}
          onClose={close}
        />
      ))}
    </div>
  );
}
```

**Commit:**

```bash
git add 'apps/web/src/app/storybook/modals/error/page.tsx'
git commit -m "[Feat] storybook: ErrorModal 스토리 페이지 추가 (7개 케이스)"
```

---

### Task 25: ReviewModal Story

**Files:**

- Create: `apps/web/src/app/storybook/modals/review/page.tsx`

```typescript
// apps/web/src/app/storybook/modals/review/page.tsx
'use client';

import { useState } from 'react';

import ReviewModal from '@/components/ui/Modal/ReviewModal';

type ReviewCase = 'light' | 'dark' | null;

export default function ReviewModalStoryPage() {
  const [open, setOpen] = useState<ReviewCase>(null);
  const close = () => setOpen(null);

  return (
    <div className="p-6">
      <h1 className="mb-1 heading-4 font-bold text-neutral-1600">ReviewModal</h1>
      <p className="mb-6 body-3 text-neutral-700">
        리뷰 텍스트 전문 표시. light / dark 두 테마.
      </p>

      <div className="flex flex-col gap-2">
        <button
          onClick={() => setOpen('light')}
          className="rounded-xl bg-white px-4 py-3 text-left body-3 font-medium text-neutral-1400 shadow-sm border border-neutral-300 hover:bg-neutral-100"
        >
          리뷰 모달 — light
        </button>
        <button
          onClick={() => setOpen('dark')}
          className="rounded-xl bg-white px-4 py-3 text-left body-3 font-medium text-neutral-1400 shadow-sm border border-neutral-300 hover:bg-neutral-100"
        >
          리뷰 모달 — dark
        </button>
      </div>

      <ReviewModal
        isOpen={open === 'light'}
        onClose={close}
        reviewText="이 앱은 정말 편리하고 사용하기 쉬워요. 모임을 만들고 취향을 공유하는 과정이 너무 자연스럽게 연결되어 있어서 친구들과 함께 쓰기 좋았습니다."
        rating={4.5}
        theme="light"
      />
      <ReviewModal
        isOpen={open === 'dark'}
        onClose={close}
        reviewText="UI가 깔끔하고 반응 속도도 빠릅니다. 다만 알림 설정 부분이 조금 더 세분화되면 좋겠어요. 전반적으로 완성도가 높은 서비스입니다."
        rating={4}
        theme="dark"
      />
    </div>
  );
}
```

**Commit:**

```bash
git add 'apps/web/src/app/storybook/modals/review/page.tsx'
git commit -m "[Feat] storybook: ReviewModal 스토리 페이지 추가 (light/dark)"
```

---

### Task 26: CreateMeetingSuccessModal Story

**Files:**

- Create: `apps/web/src/app/storybook/modals/create-success/page.tsx`

```typescript
// apps/web/src/app/storybook/modals/create-success/page.tsx
'use client';

import { useState } from 'react';

import CreateMeetingSuccessModal from '@/components/ui/Modal/CreateMeetingSuccessModal';

export default function CreateSuccessModalStoryPage() {
  const [open, setOpen] = useState(false);

  return (
    <div className="p-6">
      <h1 className="mb-1 heading-4 font-bold text-neutral-1600">CreateMeetingSuccessModal</h1>
      <p className="mb-6 body-3 text-neutral-700">
        모임 생성 완료 후 공유 유도. 카카오톡 / URL 복사 버튼 포함.
      </p>

      <button
        onClick={() => setOpen(true)}
        className="rounded-xl bg-orange-500 px-6 py-3 body-3 font-semibold text-white"
      >
        모임 생성 완료 모달 열기
      </button>

      <CreateMeetingSuccessModal isOpen={open} onClose={() => setOpen(false)} />
    </div>
  );
}
```

**Commit:**

```bash
git add 'apps/web/src/app/storybook/modals/create-success/page.tsx'
git commit -m "[Feat] storybook: CreateMeetingSuccessModal 스토리 페이지 추가"
```

---

## Phase 5 — Survey UI (Tasks 27–28)

---

### Task 27: Chip Story

**Files:**

- Create: `apps/web/src/app/storybook/survey/chip/page.tsx`

```typescript
// apps/web/src/app/storybook/survey/chip/page.tsx
'use client';

import StorybookPreview from '@/app/storybook/_components/StorybookPreview';
import { useStoryControls } from '@/app/storybook/_hooks/useStoryControls';
import type { StoryConfig } from '@/app/storybook/_types/story';
import Chip from '@/app/meetings/[token]/survey/_components/ui/Chip';

const config: StoryConfig = {
  title: 'Chip',
  description: '설문 선택지 칩. 선택/미선택/비활성 3가지 상태.',
  component: Chip,
  controls: {
    label: { type: 'text', label: 'label', default: '한식' },
    selected: { type: 'toggle', label: 'selected', default: false },
    disabled: { type: 'toggle', label: 'disabled', default: false },
    variant: {
      type: 'select',
      label: 'variant',
      options: ['cuisine', 'any'],
      default: 'cuisine',
    },
  },
  variants: [
    { label: 'Unselected', props: { label: '한식', selected: false } },
    { label: 'Selected', props: { label: '한식', selected: true } },
    { label: 'Disabled', props: { label: '한식', disabled: true } },
    { label: 'Any variant', props: { label: '다 괜찮아요', variant: 'any', selected: false } },
    {
      label: 'Any selected',
      props: { label: '다 괜찮아요', variant: 'any', selected: true },
    },
    {
      label: 'With badge',
      props: { label: '한식', selected: true, orderBadge: 1 },
    },
  ],
};

export default function ChipStoryPage() {
  useStoryControls(config);
  return <StorybookPreview config={config} />;
}
```

**Commit:**

```bash
git add 'apps/web/src/app/storybook/survey/chip/page.tsx'
git commit -m "[Feat] storybook: Chip 스토리 페이지 추가"
```

---

### Task 28: ChipGroup Story

**Files:**

- Create: `apps/web/src/app/storybook/survey/chip-group/page.tsx`

> ChipGroupMultiSelect는 내부 상태가 복잡하므로 wrapper로 감싼 정적 데모.

```typescript
// apps/web/src/app/storybook/survey/chip-group/page.tsx
'use client';

import { useState } from 'react';

import ChipGroupMultiSelect from '@/app/meetings/[token]/survey/_components/ui/ChipGroupMultiSelect';
import type { ChipOption } from '@/app/meetings/[token]/survey/_components/ui/ChipGroupMultiSelect';

const CUISINE_OPTIONS: ChipOption[] = [
  { id: 'korean', label: '한식' },
  { id: 'japanese', label: '일식' },
  { id: 'chinese', label: '중식' },
  { id: 'western', label: '양식' },
  { id: 'snack', label: '분식' },
  { id: 'southeast-asian', label: '동남아' },
  { id: 'any', label: '다 괜찮아요', variant: 'any' },
];

export default function ChipGroupStoryPage() {
  const [selected, setSelected] = useState<string[]>([]);

  return (
    <div className="p-6">
      <h1 className="mb-1 heading-4 font-bold text-neutral-1600">ChipGroupMultiSelect</h1>
      <p className="mb-6 body-3 text-neutral-700">
        다중 선택 칩 그룹. exclusiveIds로 단독 선택 옵션 지정. 최대 선택 수 제한.
      </p>

      <div className="mb-4 rounded-xl border border-neutral-300 bg-neutral-100 p-3">
        <p className="label-2 text-neutral-700">
          선택된 ID: <span className="font-semibold text-orange-600">{selected.join(', ') || '없음'}</span>
        </p>
      </div>

      <ChipGroupMultiSelect
        options={CUISINE_OPTIONS}
        selectedIds={selected}
        exclusiveIds={['any']}
        onChange={setSelected}
      />

      <button
        onClick={() => setSelected([])}
        className="mt-4 rounded-lg border border-neutral-300 px-4 py-2 label-2 text-neutral-700 hover:bg-neutral-100"
      >
        초기화
      </button>
    </div>
  );
}
```

**Commit:**

```bash
git add 'apps/web/src/app/storybook/survey/chip-group/page.tsx'
git commit -m "[Feat] storybook: ChipGroupMultiSelect 스토리 페이지 추가"
```

---

## Final Verification

```bash
# 루트에서
pnpm typecheck
pnpm lint

# 개발 서버에서 수동 확인
# 1. /storybook → /storybook/foundations/colors 리다이렉트 확인
# 2. 각 사이드바 링크 클릭해서 이동 확인
# 3. components/button → Controls 패널에서 props 변경 시 Playground 실시간 반영 확인
# 4. 색상 스와치 클릭 → hex 클립보드 복사 확인
# 5. 아이콘 클릭 → Image 코드 복사 확인
```

---

## 완료 기준 체크리스트

- [ ] `/storybook` → `/storybook/foundations/colors` 리다이렉트
- [ ] 사이드바 모든 링크 이동 가능
- [ ] Colors: 56개 스와치 + 클릭 복사
- [ ] Typography: 13 스케일 테이블
- [ ] Icons: 3탭 + 클릭 복사
- [ ] Avatars: 10개 갤러리
- [ ] Button/Toggle/Input/Badge: Controls 실시간 반영
- [ ] StepIndicator/StepperInput: range slider 동작
- [ ] 모달 5종: 트리거 버튼 → 모달 열림/닫힘
- [ ] Chip/ChipGroup: 클릭 상호작용
- [ ] `pnpm typecheck` 0 errors
- [ ] `pnpm lint` 0 errors
