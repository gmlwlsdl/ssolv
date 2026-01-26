import { cn } from '@/app/_lib/cn';
import { getProgressPercent } from '@/app/_utils/ui';

interface StepIndicatorProps {
  value: number;
  total: number;
  progressColor?: string;
  progressBgColor?: string;
}

const StepIndicator = ({
  value,
  total,
  progressColor = 'bg-orange-400',
  progressBgColor = 'bg-neutral-300',
}: StepIndicatorProps) => {
  const percent = getProgressPercent(value, total);

  return (
    <div className={cn('h-1 w-full overflow-hidden rounded-full', progressBgColor)}>
      <div
        className={cn('h-full rounded-full transition-all', progressColor)}
        style={{ width: `${percent}%` }}
      ></div>
    </div>
  );
};

export default StepIndicator;
