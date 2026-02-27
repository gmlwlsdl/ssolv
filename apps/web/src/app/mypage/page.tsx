import { cookies } from 'next/headers';

import { UserProfile } from '@/data/models/member';

import { MyPageClient } from './_components';

const DEFAULT_PROFILE: UserProfile = {
  email: '',
  nickname: '',
  profileImage: '',
};

/** 쿠키에서 사용자 프로필 정보를 읽어옵니다. */
const getUserProfile = async (): Promise<UserProfile> => {
  const cookieStore = await cookies();
  const raw = cookieStore.get('userProfile')?.value;

  if (!raw) return DEFAULT_PROFILE;

  try {
    return JSON.parse(raw) as UserProfile;
  } catch {
    return DEFAULT_PROFILE;
  }
};

const MyPage = async () => {
  const profile = await getUserProfile();

  return <MyPageClient profile={profile} />;
};

export default MyPage;
