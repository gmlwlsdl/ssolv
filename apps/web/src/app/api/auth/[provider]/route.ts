import { NextRequest, NextResponse } from 'next/server';

type Provider = 'kakao' | 'apple';

interface ProviderConfig {
  clientIdEnvKey: string;
  authUrl: string;
  extraParams?: Record<string, string>;
}

const PROVIDER_CONFIG: Record<Provider, ProviderConfig> = {
  kakao: {
    clientIdEnvKey: 'KAKAO_CLIENT_ID',
    authUrl: 'https://kauth.kakao.com/oauth/authorize',
  },
  apple: {
    clientIdEnvKey: 'APPLE_CLIENT_ID',
    authUrl: 'https://appleid.apple.com/auth/authorize',
    extraParams: {
      scope: 'name email',
      response_mode: 'form_post',
    },
  },
};

const isValidProvider = (provider: string): provider is Provider => {
  return provider in PROVIDER_CONFIG;
};

export const GET = (
  request: NextRequest,
  { params }: { params: Promise<{ provider: string }> }
) => {
  return params.then(({ provider }) => {
    if (!isValidProvider(provider)) {
      return NextResponse.json({ error: '지원하지 않는 provider입니다.' }, { status: 400 });
    }

    const config = PROVIDER_CONFIG[provider];
    const CLIENT_ID = process.env[config.clientIdEnvKey];
    const REDIRECT_URL = process.env.AUTH_REDIRECT_URL;
    const state = request.nextUrl.searchParams.get('state');

    if (!CLIENT_ID || !REDIRECT_URL) {
      return NextResponse.json(
        {
          error: '환경변수를 찾지 못했습니다.',
          missing: {
            CLIENT_ID: !CLIENT_ID,
            REDIRECT_URL: !REDIRECT_URL,
          },
        },
        { status: 500 }
      );
    }

    const searchParams = new URLSearchParams({
      response_type: 'code',
      client_id: CLIENT_ID,
      redirect_uri: REDIRECT_URL,
      ...config.extraParams,
    });

    if (state) {
      searchParams.append('state', state);
    }

    const authUrl = `${config.authUrl}?${searchParams.toString()}`;

    // 디버깅용 로그
    console.warn(`[${provider}] OAuth URL 생성:`);
    console.warn(`  CLIENT_ID: ${CLIENT_ID}`);
    console.warn(`  REDIRECT_URL: ${REDIRECT_URL}`);
    console.warn(`  authUrl: ${authUrl}`);

    return NextResponse.json({ url: authUrl });
  });
};
