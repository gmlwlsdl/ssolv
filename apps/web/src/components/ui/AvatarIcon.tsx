import Image from 'next/image';

import { AvatarVariantKey } from '@/data/models/avator';
import { cn } from '@/lib/cn';

const IMAGE_PATH = '/images/avatar';

type AvatarVariantMeta = { iconSrc: string };

const AVATAR_VARIANTS: Record<AvatarVariantKey, AvatarVariantMeta> = {
  none: {
    iconSrc: `${IMAGE_PATH}/default.svg`,
  },
  default: {
    iconSrc: `${IMAGE_PATH}/default.svg`,
  },
  banana: {
    iconSrc: `${IMAGE_PATH}/banana.svg`,
  },
  broccoli: {
    iconSrc: `${IMAGE_PATH}/broccoli.svg`,
  },
  carrot: {
    iconSrc: `${IMAGE_PATH}/carrot.svg`,
  },
  lemon: {
    iconSrc: `${IMAGE_PATH}/lemon.svg`,
  },
  mushroom: {
    iconSrc: `${IMAGE_PATH}/mushroom.svg`,
  },
  paprika: {
    iconSrc: `${IMAGE_PATH}/paprika.svg`,
  },
  pear: {
    iconSrc: `${IMAGE_PATH}/pear.svg`,
  },
  tomato: {
    iconSrc: `${IMAGE_PATH}/tomato.svg`,
  },
  turnip: {
    iconSrc: `${IMAGE_PATH}/turnip.svg`,
  },
} as const;

interface AvatarIconProps {
  variant?: AvatarVariantKey | string | null;
  className?: string;
}

const DEFAULT_VARIANT: AvatarVariantKey = 'default';

const toCamelCase = (str: string) => str.replace(/_([a-z])/g, (_, c) => c.toUpperCase());

const resolveVariant = (variant?: AvatarIconProps['variant']): AvatarVariantKey => {
  if (!variant) return DEFAULT_VARIANT;

  const camel = toCamelCase(variant.toString());
  const normalized = camel as AvatarVariantKey;

  return AVATAR_VARIANTS[normalized] ? normalized : DEFAULT_VARIANT;
};

/**
 *
 * @param variant - 아바타 변경
 * @param className - 추가 클래스 이름
 * @description - 기본 크기는 48px * 48px 입니다.
 * @description - 컴포넌트 크기는 80px을 넘어갈 경우 아이콘 해상도가 낮아집니다.
 */
const AvatarIcon = ({ variant, className }: AvatarIconProps) => {
  const resolvedVariant = resolveVariant(variant);
  const iconSrc = AVATAR_VARIANTS[resolvedVariant];
  return (
    <div className={cn('flex h-12 w-12 items-center justify-center rounded-xl', className)}>
      <div className="relative h-full w-full">
        <Image
          src={iconSrc.iconSrc}
          alt={resolvedVariant}
          fill
          className="rounded-xl object-contain"
        />
      </div>
    </div>
  );
};

export default AvatarIcon;
