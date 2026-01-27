import Image from 'next/image';

import Button from '@/components/ui/Button';
import BaseModal from '@/components/ui/Modal/BaseModal';

interface ErrorModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onClose: () => void;
}

const ErrorModal = ({ isOpen, title, message, onClose }: ErrorModalProps) => {
  return (
    <BaseModal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col items-center gap-4">
        <div className="mb-2 flex flex-col gap-1">
          <h3 className="text-center body-2 font-semibold">{title}</h3>
          <p className="text-center body-3 whitespace-pre-wrap text-neutral-800">{message}</p>
        </div>

        <Button className="h-13 w-full" onClick={onClose} theme="orange">
          확인
        </Button>
      </div>
    </BaseModal>
  );
};

export default ErrorModal;
