import Button from '@/components/ui/Button';
import BaseModal from '@/components/ui/Modal/BaseModal';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal = ({
  isOpen,
  title,
  description,
  confirmText = '네',
  cancelText = '아니오',
  onConfirm,
  onCancel,
}: ConfirmModalProps) => {
  return (
    <BaseModal isOpen={isOpen} onClose={onCancel}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1 text-center">
          <h3 className="body-2 font-semibold text-neutral-1600">{title}</h3>
          {description && (
            <p className="body-3 font-medium whitespace-pre-line text-neutral-800">{description}</p>
          )}
        </div>

        <div className="flex gap-[11px]">
          <Button theme="gray" className="flex-1" onClick={onCancel}>
            {cancelText}
          </Button>
          <Button className="flex-1" onClick={onConfirm}>
            {confirmText}
          </Button>
        </div>
      </div>
    </BaseModal>
  );
};

export default ConfirmModal;
