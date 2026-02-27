/** 로그인 응답에서 받는 사용자 프로필 정보 */
export interface UserProfile {
  /** 이메일 */
  email: string;
  /** 닉네임 */
  nickname: string;
  /** 프로필 이미지 URL */
  profileImage: string;
}
