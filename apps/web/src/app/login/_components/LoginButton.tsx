'use client';

import { useState } from 'react';

import Image from 'next/image';

import Badge from '@/components/ui/Badge';
import { ErrorModal } from '@/components/ui/Modal';
import { LOGIN_ERROR_TYPES } from '@/data/constants/errorCodes';
import { getErrorConfig } from '@/data/constants/errorConfig';
import { useDisclosure } from '@/hooks/useDisclosure';
import { cn } from '@/lib/cn';

const PROVIDER_CONFIG = {
  kakao: {
    text: '카카오톡으로 시작하기',
    icon: '/images/brand/kakao.svg',
    iconAlt: '카카오 로고',
    className: 'bg-yellow-400 text-neutral-1600',
    apiPath: '/api/auth/kakao',
  },
  apple: {
    text: 'Apple로 계속하기',
    icon: '/images/brand/apple.svg',
    iconAlt: 'Apple 로고',
    className: 'bg-black text-white',
    apiPath: '/api/auth/apple',
  },
} as const;

export type Provider = keyof typeof PROVIDER_CONFIG;

interface LoginButtonProps {
  provider?: Provider;
  redirectTo?: string | null;
  isLastUsed?: boolean;
}

const LoginButton = ({ provider = 'kakao', redirectTo, isLastUsed = false }: LoginButtonProps) => {
  const config = PROVIDER_CONFIG[provider];
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen: showError, handler: errorHandler } = useDisclosure();
  const errorConfig = getErrorConfig(LOGIN_ERROR_TYPES.SERVER_ERROR);

  const handleLogin = async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const params = new URLSearchParams();
      if (redirectTo) {
        params.append('state', redirectTo);
      }
      const queryString = params.toString();
      const apiUrl = `${config.apiPath}${queryString ? `?${queryString}` : ''}`;

      const response = await fetch(apiUrl);
      if (!response.ok) {
        const error = await response.json();
        console.error(`[${provider}] OAuth URL 취득 실패:`, error);
        errorHandler.open();
        setIsLoading(false);
        return;
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error(`[${provider}] 로그인 에러:`, error);
      errorHandler.open();
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="relative">
        {isLastUsed && (
          <div className="absolute -top-2.5 left-3 z-10">
            <Badge variant="highlight">최근 로그인</Badge>
          </div>
        )}
        <button
          type="button"
          aria-label={config.text}
          onClick={handleLogin}
          disabled={isLoading}
          className={cn(
            'flex h-[62px] w-full cursor-pointer items-center justify-center gap-2 rounded-[14px] p-[10px] body-3 font-semibold transition-all duration-200',
            config.className,
            isLoading && 'cursor-not-allowed opacity-60'
          )}
        >
          <Image src={config.icon} alt={config.iconAlt} width={24} height={24} />
          {isLoading ? '로그인 중...' : config.text}
        </button>
      </div>

      <ErrorModal
        isOpen={showError}
        title={errorConfig.title}
        message={errorConfig.message}
        illustration={errorConfig.illustration}
        onClose={errorHandler.close}
      />
    </>
  );
};

export default LoginButton;
