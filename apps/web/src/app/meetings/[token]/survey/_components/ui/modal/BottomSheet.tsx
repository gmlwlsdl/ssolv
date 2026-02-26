import { X } from 'lucide-react';

interface BottomSheetProps {
  title?: string;
  showCloseButton?: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const BottomSheet = ({ title, showCloseButton = false, onClose, children }: BottomSheetProps) => {
  return (
    <>
      {/* 배경 오버레이 */}
      <div role="presentation" className="fixed inset-0 z-40 bg-black/60" onClick={onClose} />

      {/* 바텀시트 */}
      <div className="no-scrollbar fixed bottom-0 left-1/2 z-50 flex w-full max-w-[475px] -translate-x-1/2 flex-col space-y-4 overflow-auto rounded-t-2xl bg-white p-5 pb-8">
        {/* 헤더 */}
        <div className="relative text-center">
          <p className="body-3 font-semibold text-orange-700">{title}</p>
          {showCloseButton && (
            <X
              onClick={onClose}
              size={24}
              strokeWidth={2.25}
              className="absolute top-5 right-4 cursor-pointer text-orange-800"
            />
          )}
        </div>

        {/* 실제 콘텐츠 */}
        <div className="flex flex-1 flex-col overflow-y-auto">{children}</div>
      </div>
    </>
  );
};

export default BottomSheet;
