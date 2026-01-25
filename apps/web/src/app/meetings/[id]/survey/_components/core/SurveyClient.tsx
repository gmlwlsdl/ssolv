'use client';
import { useRouter } from 'next/navigation';

import SurveyFunnel from './SurveyFunnel';

import type { RoleLabel, SurveyResult } from '../../_models/types';

interface SurveyClientProps {
  role: RoleLabel;
  meetingId: number;
  initial?: Partial<SurveyResult>;
}

/** SurveyClient
 * - 설문 퍼널 실행의 진입점 (Client 환경 전용)
 * - 완료 시 onComplete 콜백으로 후속 페이지 이동 처리
 * - 실제 설문 단계 제어는 SurveyFunnel에 위임
 */
const SurveyClient = ({ role, meetingId, initial }: SurveyClientProps) => {
  const router = useRouter();

  const handleComplete = async (_data: SurveyResult) => {
    // TODO: 서버 저장 로직
    router.push('/recommendations/sAmCHo');
  };

  return (
    <SurveyFunnel role={role} meetingId={meetingId} initial={initial} onComplete={handleComplete} />
  );
};

export default SurveyClient;
