import { cn } from '@/lib/cn';

type BadgeVariant = 'default' | 'highlight';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
}

const VARIANT_STYLES: Record<BadgeVariant, string> = {
  default: 'bg-neutral-200 text-neutral-600',
  highlight: 'bg-orange-500 text-white shadow-sm',
};

const Badge = ({ children, variant = 'default' }: BadgeProps) => {
  return (
    <span
      className={cn(
        'w-fit rounded-md px-2 py-1 label-2 text-xs font-semibold select-none',
        VARIANT_STYLES[variant]
      )}
    >
      {children}
    </span>
  );
};

export default Badge;
