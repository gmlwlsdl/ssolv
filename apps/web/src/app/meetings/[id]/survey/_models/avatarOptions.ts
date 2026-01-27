export interface AvatarOption {
  key: string;
  src: string;
  bgColor: string;
}

export const AVATAR_OPTIONS: AvatarOption[] = [
  { key: 'default', src: '/images/avatar/default.svg', bgColor: '#FFD014' },
  { key: 'strawberry', src: '/images/avatar/strawberry.svg', bgColor: '#FFBDBF' },
  { key: 'matcha', src: '/images/avatar/matcha.svg', bgColor: '#6ADE81' },
  { key: 'orange', src: '/images/avatar/orange.svg', bgColor: '#FF9F5B' },
  { key: 'grape', src: '/images/avatar/grape.svg', bgColor: '#D3A2F1' },
  { key: 'chocolate', src: '/images/avatar/chocolate.svg', bgColor: '#C3AB9B' },
  { key: 'milk', src: '/images/avatar/milk.svg', bgColor: '#D7ECFF' },
  // { key: 'blackSesame', src: '/images/avatar/blackSesame.svg', bgColor: '#9C9F93' },
  { key: 'mint', src: '/images/avatar/mint.svg', bgColor: '#ABEBE2' },
  { key: 'sweetPotato', src: '/images/avatar/sweetPotato.svg', bgColor: '#C99DB2' },
  { key: 'pistachio', src: '/images/avatar/pistachio.svg', bgColor: '#A8D39E' },
];
