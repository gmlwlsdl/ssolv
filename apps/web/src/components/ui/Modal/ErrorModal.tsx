import Image from 'next/image';

import Button from '@/components/ui/Button';
import BaseModal from '@/components/ui/Modal/BaseModal';

interface ErrorModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  illustration?: string;
  onClose: () => void;
}

const ErrorModal = ({ isOpen, title, message, illustration, onClose }: ErrorModalProps) => {
  return (
    <BaseModal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col items-center gap-4">
        {illustration && <Image src={illustration} alt="" width={100} height={100} />}

        <div className="flex w-full flex-col gap-6">
          <div className="flex flex-col gap-1">
            <h3 className="text-center body-2 font-semibold text-neutral-1600">{title}</h3>
            <p className="text-center body-3 font-medium whitespace-pre-wrap text-neutral-800">
              {message}
            </p>
          </div>

          <Button className="w-full py-[14px]" onClick={onClose}>
            확인
          </Button>
        </div>
      </div>
    </BaseModal>
  );
};

export default ErrorModal;
