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

const ColorsPage = () => {
  return (
    <div className="p-6">
      <h1 className="mb-1 heading-4 font-bold text-neutral-1600">Colors</h1>
      <p className="mb-8 body-3 text-neutral-700">
        스와치를 클릭하면 hex 값이 클립보드에 복사됩니다.
      </p>

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
};

export default ColorsPage;
