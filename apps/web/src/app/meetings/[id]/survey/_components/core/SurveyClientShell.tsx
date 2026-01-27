'use client';

import SurveyClient from '@/app/meetings/[id]/survey/_components/core/SurveyClient';

import type { RoleLabel, SurveyResult } from '../../_models/types';

interface SurveyClientShellProps {
  role: RoleLabel;
  meetingId: number;
  initial?: Partial<SurveyResult>;
}

/**
 * SurveyClientShell
 * - CSR 전용 루트 컴포넌트
 * - Server Component에서 Client Component를 안전하게 감싸는 Wrapper
 * - 이 내부부터는 브라우저 전용 로직(CSR)만 수행
 */
const SurveyClientShell = (props: SurveyClientShellProps) => {
  return <SurveyClient {...props} />;
};

export default SurveyClientShell;
