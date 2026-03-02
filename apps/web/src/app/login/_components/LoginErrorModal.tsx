'use client';

import { useEffect } from 'react';

import { ErrorModal } from '@/components/ui/Modal';
import { getErrorConfig } from '@/data/constants/errorConfig';
import { useDisclosure } from '@/hooks/useDisclosure';

interface LoginErrorModalProps {
  errorType: string;
}

const LoginErrorModal = ({ errorType }: LoginErrorModalProps) => {
  const { isOpen, handler } = useDisclosure();
  const errorConfig = getErrorConfig(errorType);

  useEffect(() => {
    handler.open();
  }, [handler]);

  return (
    <ErrorModal
      isOpen={isOpen}
      title={errorConfig.title}
      message={errorConfig.message}
      illustration={errorConfig.illustration}
      onClose={handler.close}
    />
  );
};

export default LoginErrorModal;
