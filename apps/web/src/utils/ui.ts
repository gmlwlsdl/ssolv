export const getProgressPercent = (value: number, total: number) => {
  if (value > total) return 100;
  if (value < 1) return 3; // 디자인 수정 사항 반영 - 0%일 때도 progress bar가 보이도록
  return (value / total) * 100;
};
