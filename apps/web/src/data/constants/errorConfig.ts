export const ERROR_CONFIG = {
  C4043: {
    code: 'C4043',
    title: '존재하지 않은 모임이에요',
    message: `찾으시는 모임이 변경 혹은 삭제되어\n찾을 수 없어요.`,
    illustration: '/images/modal/modal-not-found.svg',
  },
  C4097: {
    code: 'C4097',
    title: '앗, 설문 시간이 지났어요!',
    message: `설문 참여 시간이 마감되었어요.\n다음 기회에 참여해 주세요.`,
    illustration: '/images/modal/modal-overtime.svg',
  },
  C4099: {
    code: 'C4099',
    title: '앗, 참여 인원이 가득 찼어요!',
    message: `이미 모든 인원이 설문에 참여했어요.\n다음 설문에 함께해 주세요.`,
    illustration: '/images/modal/modal-unaccess.svg',
  },
  T002: {
    code: 'T002',
    title: '존재하지 않은 모임이에요',
    message: `찾으시는 모임이 변경 혹은 삭제되어\n찾을 수 없어요.`,
    illustration: '/images/modal/modal-not-found.svg',
  },
  T003: {
    code: 'T003',
    title: '존재하지 않은 모임이에요',
    message: `찾으시는 모임이 변경 혹은 삭제되어\n찾을 수 없어요.`,
    illustration: '/images/modal/modal-not-found.svg',
  },
  // 로그인 에러 (클라이언트 에러 타입 기준 그룹핑)
  email_conflict: {
    code: 'email_conflict',
    title: '이미 가입된 이메일이에요',
    message: `다른 소셜 계정으로 가입된 이메일이에요.\n기존 계정으로 로그인해 주세요.`,
    illustration: '/images/modal/modal-error.svg',
  },
  auth_failed: {
    code: 'auth_failed',
    title: '인증에 실패했어요',
    message: `소셜 로그인 인증에 실패했어요.\n다시 시도해 주세요.`,
    illustration: '/images/modal/modal-error.svg',
  },
  rate_limited: {
    code: 'rate_limited',
    title: '요청이 너무 많아요',
    message: `잠시 후 다시 시도해 주세요.`,
    illustration: '/images/modal/modal-error.svg',
  },
  oauth_failed: {
    code: 'oauth_failed',
    title: '로그인이 취소되었어요',
    message: `소셜 로그인이 취소되었어요.\n다시 시도해 주세요.`,
    illustration: '/images/modal/modal-error.svg',
  },
  DEFAULT: {
    code: 'DEFAULT',
    title: '문제가 발생했어요!',
    message: `예상치 못한 오류가 발생했어요.\n잠시 후 다시 시도해주세요.`,
    illustration: '/images/modal/modal-error.svg',
  },
} as const;

export const getErrorConfig = (
  errorCode: string
): (typeof ERROR_CONFIG)[keyof typeof ERROR_CONFIG] => {
  return ERROR_CONFIG[errorCode as keyof typeof ERROR_CONFIG] ?? ERROR_CONFIG.DEFAULT;
};
