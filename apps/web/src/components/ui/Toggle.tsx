'use client';

import { cn } from '@/lib/cn';

interface ToggleProps {
  /** 토글 활성화 상태 */
  checked: boolean;
  /** 토글 상태 변경 핸들러 */
  onChange: (checked: boolean) => void;
  /** 접근성 라벨 */
  ariaLabel?: string;
}

/**
 * 토글 스위치 컴포넌트
 *
 * @description 알림 설정 등에 사용되는 토글 스위치입니다.
 * Figma 디자인 기반: 50x30 크기, 24px 원형 노브, orange-500 활성색
 */
const Toggle = ({ checked, onChange, ariaLabel }: ToggleProps) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative h-[30px] w-[50px] shrink-0 cursor-pointer rounded-full transition-colors duration-200',
        checked ? 'bg-orange-500' : 'bg-neutral-400'
      )}
    >
      <span
        className={cn(
          'absolute top-[3px] size-[24px] rounded-full bg-white shadow-sm transition-transform duration-200',
          checked ? 'left-[23px]' : 'left-[3px]'
        )}
      />
    </button>
  );
};

export default Toggle;
