import type { SurveyResult } from '@/app/meetings/[id]/survey/_models/types';

const saveSurveyResult = (_input: SurveyResult) => {
  // TODO: DB/외부 API 저장
  // await fetch(...);
  return { ok: true };
};

export default saveSurveyResult;
