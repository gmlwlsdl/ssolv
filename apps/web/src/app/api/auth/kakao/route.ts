import { NextRequest, NextResponse } from 'next/server';

export const GET = (request: NextRequest) => {
  const CLIENT_ID = process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID;
  const REDIRECT_URL = process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URL;
  const state = request.nextUrl.searchParams.get('state');

  if (!CLIENT_ID || !REDIRECT_URL) {
    return NextResponse.json(
      {
        error: '환경변수을 찾지 못했습니다.',
        missing: {
          CLIENT_ID: !CLIENT_ID,
          REDIRECT_URL: !REDIRECT_URL,
        },
      },
      { status: 500 }
    );
  }

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URL,
  });

  if (state) {
    params.append('state', state);
  }

  const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?${params.toString()}`;

  return NextResponse.json({ url: kakaoAuthUrl });
};
