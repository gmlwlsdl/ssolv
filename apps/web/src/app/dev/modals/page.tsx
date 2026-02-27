'use client';

import { useState } from 'react';

import SurveyBottomSheet from '@/app/meetings/[token]/survey/_components/ui/modal/BottomSheet';
import SurveyConfirmModal from '@/app/meetings/[token]/survey/_components/ui/modal/ConfirmModal';
import FoodConfirmModal from '@/app/meetings/[token]/survey/_components/ui/modal/FoodConfirmModal';
import { ConfirmModal, ErrorModal } from '@/components/ui/Modal';
import CreateMeetingSuccessModal from '@/components/ui/Modal/CreateMeetingSuccessModal';
import ReviewModal from '@/components/ui/Modal/ReviewModal';
import { ERROR_CONFIG } from '@/data/constants/errorConfig';

type ModalId =
  | 'error-C4043'
  | 'error-C4097'
  | 'error-C4099'
  | 'error-T002'
  | 'error-T003'
  | 'error-DEFAULT'
  | 'error-withdraw-fail'
  | 'confirm-coming-soon'
  | 'confirm-cancel-only'
  | 'confirm-logout'
  | 'confirm-withdraw'
  | 'confirm-create-cancel'
  | 'review-light'
  | 'review-dark'
  | 'create-success'
  | 'survey-confirm'
  | 'survey-food-confirm'
  | 'survey-bottom-sheet'
  | null;

const ERROR_CASES = [
  { id: 'error-C4043' as const, label: 'C4043 — 존재하지 않은 모임', config: ERROR_CONFIG.C4043 },
  { id: 'error-C4097' as const, label: 'C4097 — 설문 시간 만료', config: ERROR_CONFIG.C4097 },
  { id: 'error-C4099' as const, label: 'C4099 — 참여 인원 초과', config: ERROR_CONFIG.C4099 },
  { id: 'error-T002' as const, label: 'T002 — 토큰 포맷 오류', config: ERROR_CONFIG.T002 },
  { id: 'error-T003' as const, label: 'T003 — 토큰 모임 ID 오류', config: ERROR_CONFIG.T003 },
  {
    id: 'error-DEFAULT' as const,
    label: 'DEFAULT — 알 수 없는 에러',
    config: ERROR_CONFIG.DEFAULT,
  },
  {
    id: 'error-withdraw-fail' as const,
    label: '회원탈퇴 실패',
    config: {
      title: '탈퇴 처리 중 오류가 발생했어요',
      message: '잠시 후 다시 시도해주세요.',
      illustration: '/images/modal/modal-error.svg',
    },
  },
] as const;

const CONFIRM_CASES = [
  {
    id: 'confirm-coming-soon' as const,
    label: '준비중 서비스',
    props: {
      title: '해당 서비스는 준비중이에요!',
      description: '많은 기대 부탁드립니다!',
      illustration: '/images/modal/modal-coming-soon.svg',
      confirmText: '확인',
    },
  },
  {
    id: 'confirm-cancel-only' as const,
    label: '확인 버튼만 (onCancel 없음)',
    props: { title: '안내', description: '확인 버튼만 있는 케이스예요.', confirmText: '확인' },
  },
  {
    id: 'confirm-logout' as const,
    label: '로그아웃',
    props: {
      title: '로그아웃 하시겠어요?',
      description: '로그아웃해도 해당 계정의 데이터는\n계속 저장되어 있습니다.',
      confirmText: '로그아웃',
      cancelText: '취소',
    },
  },
  {
    id: 'confirm-withdraw' as const,
    label: '회원탈퇴',
    props: {
      title: '정말 탈퇴하시겠어요?',
      description: '탈퇴 버튼 선택 시\n계정은 삭제되며 복구되지 않습니다.',
      confirmText: '탈퇴',
      cancelText: '취소',
    },
  },
  {
    id: 'confirm-create-cancel' as const,
    label: '모임 만들기 취소',
    props: {
      title: '모임 만들기를 취소하시겠어요?',
      confirmText: '네',
      cancelText: '아니오',
    },
  },
] as const;

const SAMPLE_FOOD_ITEMS = [
  { categoryLabel: '한식', detailLabel: '삼겹살', iconSrc: '/icons/people.svg' },
  { categoryLabel: '한식', detailLabel: '갈비', iconSrc: '/icons/people.svg' },
  { categoryLabel: '중식', detailLabel: '짜장면', iconSrc: '/icons/people.svg' },
  { categoryLabel: '일식', detailLabel: '초밥', iconSrc: '/icons/people.svg' },
];

const SectionTitle = ({ children }: { children: string }) => (
  <h2 className="mb-1 text-sm font-semibold tracking-wide text-neutral-600 uppercase">
    {children}
  </h2>
);

const SectionDesc = ({ children }: { children: string }) => (
  <p className="mb-3 text-xs text-neutral-400">{children}</p>
);

const PreviewButton = ({ label, onClick }: { label: string; onClick: () => void }) => (
  <button
    onClick={onClick}
    className="rounded-xl bg-white px-4 py-3 text-left text-sm font-medium text-neutral-1400 shadow-sm hover:bg-neutral-200"
  >
    {label}
  </button>
);

const DevModalsPage = () => {
  const [openModal, setOpenModal] = useState<ModalId>(null);

  const close = () => setOpenModal(null);

  return (
    <div className="min-h-screen bg-neutral-100 px-5 py-10">
      <h1 className="mb-1 text-xl font-bold text-neutral-1600">Modal 케이스 프리뷰</h1>
      <p className="mb-8 text-sm text-neutral-600">개발 전용 페이지 — 프로덕션 배포 전 제거</p>

      {/* ─── ErrorModal ─── */}
      <section className="mb-8">
        <SectionTitle>ErrorModal</SectionTitle>
        <SectionDesc>에러 발생 시 노출. 확인 버튼 1개. illustration 선택.</SectionDesc>
        <div className="flex flex-col gap-2">
          {ERROR_CASES.map(({ id, label }) => (
            <PreviewButton key={id} label={label} onClick={() => setOpenModal(id)} />
          ))}
        </div>
      </section>

      {/* ─── ConfirmModal ─── */}
      <section className="mb-8">
        <SectionTitle>ConfirmModal</SectionTitle>
        <SectionDesc>확인/취소 2버튼 또는 확인 1버튼. illustration 선택.</SectionDesc>
        <div className="flex flex-col gap-2">
          {CONFIRM_CASES.map(({ id, label }) => (
            <PreviewButton key={id} label={label} onClick={() => setOpenModal(id)} />
          ))}
        </div>
      </section>

      {/* ─── ReviewModal ─── */}
      <section className="mb-8">
        <SectionTitle>ReviewModal</SectionTitle>
        <SectionDesc>리뷰 텍스트 전문 표시. light / dark 테마.</SectionDesc>
        <div className="flex flex-col gap-2">
          <PreviewButton label="리뷰 모달 — light" onClick={() => setOpenModal('review-light')} />
          <PreviewButton label="리뷰 모달 — dark" onClick={() => setOpenModal('review-dark')} />
        </div>
      </section>

      {/* ─── CreateMeetingSuccessModal ─── */}
      <section className="mb-8">
        <SectionTitle>CreateMeetingSuccessModal</SectionTitle>
        <SectionDesc>모임 생성 완료 후 공유 유도. 카카오톡 / URL 복사.</SectionDesc>
        <div className="flex flex-col gap-2">
          <PreviewButton label="모임 생성 완료" onClick={() => setOpenModal('create-success')} />
        </div>
      </section>

      {/* ─── Survey / ConfirmModal (로컬) ─── */}
      <section className="mb-8">
        <SectionTitle>Survey / ConfirmModal (로컬)</SectionTitle>
        <SectionDesc>
          설문 내부 전용. 공통 ConfirmModal과 별도 구현 (z-index / 위치 차이).
        </SectionDesc>
        <div className="flex flex-col gap-2">
          <PreviewButton
            label="설문 건너뛰기 확인"
            onClick={() => setOpenModal('survey-confirm')}
          />
        </div>
      </section>

      {/* ─── Survey / FoodConfirmModal ─── */}
      <section className="mb-8">
        <SectionTitle>Survey / FoodConfirmModal</SectionTitle>
        <SectionDesc>음식 선택 제출 전 최종 확인. 선택 항목 카테고리 그룹 표시.</SectionDesc>
        <div className="flex flex-col gap-2">
          <PreviewButton
            label="음식 선택 제출 확인 (샘플 4개)"
            onClick={() => setOpenModal('survey-food-confirm')}
          />
        </div>
      </section>

      {/* ─── Survey / BottomSheet ─── */}
      <section className="mb-8">
        <SectionTitle>Survey / BottomSheet</SectionTitle>
        <SectionDesc>설문 내부 하단 시트. 타이틀 + 자유 콘텐츠 슬롯.</SectionDesc>
        <div className="flex flex-col gap-2">
          <PreviewButton label="바텀시트" onClick={() => setOpenModal('survey-bottom-sheet')} />
        </div>
      </section>

      {/* ════ 렌더링 영역 ════ */}

      {/* ErrorModal 렌더링 */}
      {ERROR_CASES.map(({ id, config }) => (
        <ErrorModal
          key={id}
          isOpen={openModal === id}
          title={config.title}
          message={config.message}
          illustration={'illustration' in config ? config.illustration : undefined}
          onClose={close}
        />
      ))}

      {/* ConfirmModal 렌더링 */}
      {CONFIRM_CASES.map(({ id, props }) => (
        <ConfirmModal
          key={id}
          isOpen={openModal === id}
          onConfirm={close}
          onCancel={'cancelText' in props ? close : undefined}
          {...props}
        />
      ))}

      {/* ReviewModal 렌더링 */}
      <ReviewModal
        isOpen={openModal === 'review-light'}
        onClose={close}
        reviewText={`이 앱은 정말 편리하고 사용하기 쉬워요. 모임을 만들고 취향을 공유하는 과정이 너무 자연스럽게 연결되어 있어서 친구들과 함께 쓰기 좋았습니다. 앞으로도 많이 사용할 것 같아요!`}
        rating={4.5}
        theme="light"
      />
      <ReviewModal
        isOpen={openModal === 'review-dark'}
        onClose={close}
        reviewText={`UI가 깔끔하고 반응 속도도 빠릅니다. 다만 알림 설정 부분이 조금 더 세분화되면 좋겠어요. 전반적으로 완성도가 높은 서비스입니다.`}
        rating={4}
        theme="dark"
      />

      {/* CreateMeetingSuccessModal 렌더링 */}
      <CreateMeetingSuccessModal isOpen={openModal === 'create-success'} onClose={close} />

      {/* Survey / ConfirmModal 렌더링 */}
      <SurveyConfirmModal
        open={openModal === 'survey-confirm'}
        title="이 단계를 건너뛸까요?"
        description="건너뛰면 해당 항목은 선택하지 않은 것으로 처리돼요."
        cancelText="취소"
        confirmText="건너뛰기"
        onCancel={close}
        onConfirm={close}
      />

      {/* Survey / FoodConfirmModal 렌더링 */}
      <FoodConfirmModal
        open={openModal === 'survey-food-confirm'}
        title="이렇게 제출할게요!"
        subtitle="선택한 음식 취향을 확인해 주세요."
        selectedFoods={SAMPLE_FOOD_ITEMS}
        onCancel={close}
        onConfirm={close}
      />

      {/* Survey / BottomSheet 렌더링 */}
      {openModal === 'survey-bottom-sheet' && (
        <SurveyBottomSheet title="바텀시트 예시" showCloseButton onClose={close}>
          <div className="flex flex-col gap-3 py-2">
            <p className="body-3 text-neutral-1400">바텀시트 안에 들어오는 콘텐츠 영역입니다.</p>
            <p className="body-3 text-neutral-600">
              설문 내에서 추가 선택지나 안내 문구를 표시할 때 사용합니다.
            </p>
          </div>
        </SurveyBottomSheet>
      )}
    </div>
  );
};

export default DevModalsPage;
