export interface AvatarOption {
  key: string;
  src: string;
  bgColor?: string;
}

export const AVATAR_OPTIONS: AvatarOption[] = [
  { key: 'default', src: '/images/avatar/default.svg' },
  { key: 'banana', src: '/images/avatar/banana.svg' },
  { key: 'broccoli', src: '/images/avatar/broccoli.svg' },
  { key: 'carrot', src: '/images/avatar/carrot.svg' },
  { key: 'lemon', src: '/images/avatar/lemon.svg' },
  { key: 'mushroom', src: '/images/avatar/mushroom.svg' },
  { key: 'paprika', src: '/images/avatar/paprika.svg' },
  { key: 'pear', src: '/images/avatar/pear.svg' },
  { key: 'tomato', src: '/images/avatar/tomato.svg' },
  { key: 'turnip', src: '/images/avatar/turnip.svg' },
];
