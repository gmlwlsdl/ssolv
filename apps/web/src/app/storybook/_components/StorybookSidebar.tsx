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
