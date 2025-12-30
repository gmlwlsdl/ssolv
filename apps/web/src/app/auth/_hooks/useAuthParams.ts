import { useSearchParams } from 'next/navigation';

export const useAuthParams = () => {
  const searchParams = useSearchParams();

  return {
    code: searchParams.get('code'),
    error: searchParams.get('error'),
    state: searchParams.get('state'),
  };
};
