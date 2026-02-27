import Image from 'next/image';

import Button from '@/components/ui/Button';
import BaseModal from '@/components/ui/Modal/BaseModal';
import { cn } from '@/lib/cn';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  description?: string;
  illustration?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

const ConfirmModal = ({
  isOpen,
  title,
  description,
  illustration,
  confirmText = '네',
  cancelText = '아니오',
  onConfirm,
  onCancel,
}: ConfirmModalProps) => {
  const textAndButtons = (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1 text-center">
        <h3 className="body-2 font-semibold text-neutral-1600">{title}</h3>
        {description && (
          <p className="body-3 font-medium whitespace-pre-line text-neutral-800">{description}</p>
        )}
      </div>

      <div className={cn('flex', onCancel && 'gap-[11px]')}>
        {onCancel && (
          <Button theme="gray" className="flex-1 py-[14px]" onClick={onCancel}>
            {cancelText}
          </Button>
        )}
        <Button className={cn('py-[14px]', onCancel ? 'flex-1' : 'w-full')} onClick={onConfirm}>
          {confirmText}
        </Button>
      </div>
    </div>
  );

  return (
    <BaseModal isOpen={isOpen} onClose={onCancel ?? onConfirm}>
      {illustration ? (
        <div className="flex flex-col gap-4">
          <Image src={illustration} alt="" width={100} height={100} className="mx-auto" />
          {textAndButtons}
        </div>
      ) : (
        textAndButtons
      )}
    </BaseModal>
  );
};

export default ConfirmModal;
