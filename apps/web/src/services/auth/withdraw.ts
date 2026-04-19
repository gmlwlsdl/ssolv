export interface WithdrawResult {
  provider: 'kakao' | 'apple' | 'unknown';
  redirectUrl: string;
}

/**
 * 회원탈퇴 처리
 *
 * @returns provider - 마지막 로그인 provider, redirectUrl - 탈퇴 후 이동할 URL
 * @throws 탈퇴 API 실패 시 에러
 */
export const withdraw = async (): Promise<WithdrawResult> => {
  const response = await fetch('/api/auth/withdraw', {
    method: 'DELETE',
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.errorMessage ?? '회원탈퇴 처리 중 오류가 발생했습니다');
  }

  const { provider, redirectUrl } = await response.json();
  return { provider, redirectUrl };
};
