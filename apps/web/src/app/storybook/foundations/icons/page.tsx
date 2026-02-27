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

const IconCard = ({ name, path }: { name: string; path: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const snippet = `<Image src="${path}" alt="${name}" width={40} height={40} />`;
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
        <Image src={path} alt={name} width={40} height={40} className="object-contain" />
      </div>
      <p className="text-center text-[10px] font-medium text-neutral-700">
        {copied ? '✓ Copied!' : name}
      </p>
    </button>
  );
};

const IconsPage = () => {
  const [tab, setTab] = useState<Tab>('utility');

  const tabItems: { key: Tab; label: string; count: number }[] = [
    { key: 'utility', label: 'Utility', count: UTILITY_ICONS.length },
    { key: 'food', label: 'Food', count: FOOD_ICONS.length },
    { key: 'brand', label: 'Brand', count: BRAND_ICONS.length },
  ];

  const icons = tab === 'utility' ? UTILITY_ICONS : tab === 'food' ? FOOD_ICONS : BRAND_ICONS;

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
};

export default IconsPage;
