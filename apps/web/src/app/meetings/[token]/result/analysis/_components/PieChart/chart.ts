interface AnalysisTheme {
  background: string;
  label: string;
  labelColor: string;
  labelBackground: string;
  tab: {
    backgroundClass: string;
    colorClass: string;
    backgroundStyle: string;
    colorStyle: string;
  };
}

export const CHART_THEME: AnalysisTheme = {
  background:
    'linear-gradient(243deg, rgba(255, 173, 0, 0.12) 3.06%, rgba(255, 255, 255, 0.12) 76.7%)',
  label: '가장 선호',
  labelColor: '#EBBB00',
  labelBackground: '#FFE47A2E',
  tab: {
    backgroundClass: 'bg-[rgba(255,228,122,0.18)]',
    colorClass: 'text-[#FFE47A]',
    backgroundStyle: 'rgba(255, 205, 0, 0.08)',
    colorStyle: '#FFE47A',
  },
};

export const PIE_GRADIENTS = [
  {
    id: 'color0',
    stops: [
      { offset: '0%', color: '#FFCD00' },
      { offset: '100%', color: '#FFF5CC' },
    ],
  },
  {
    id: 'color1',
    stops: [
      { offset: '0%', color: '#FF4F14' },
      { offset: '100%', color: '#FFF0EB' },
    ],
  },
  {
    id: 'color2',
    stops: [
      { offset: '100%', color: '#6D89F0' },
      { offset: '0%', color: '#EDF0FD' },
    ],
  },
  {
    id: 'color3',
    stops: [
      { offset: '0%', color: '#F59E0B' }, // 앰버 (따뜻한 오렌지)
      { offset: '100%', color: '#FEF3C7' },
    ],
  },
  {
    id: 'color4',
    stops: [
      { offset: '0%', color: '#EF4444' }, // 코랄 레드 (따뜻한 빨강)
      { offset: '100%', color: '#FEE2E2' },
    ],
  },
  {
    id: 'color5',
    stops: [
      { offset: '0%', color: '#14B8A6' }, // 틸 (청록색)
      { offset: '100%', color: '#CCFBF1' },
    ],
  },
];
