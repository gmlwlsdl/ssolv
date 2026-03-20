import InviteTopButton from '@/app/meetings/[token]/result/overview/_components/InviteTopButton';
import TopNavigation from '@/components/layout/TopNavigation';

interface OverviewLayoutProps {
  children: React.ReactNode;
}
const OverviewLayout = ({ children }: OverviewLayoutProps) => {
  return (
    <div
      className="flex flex-1 flex-col bg-neutral-100"
      style={{
        marginTop: 'calc(-1 * env(safe-area-inset-top))',
        paddingTop: 'env(safe-area-inset-top)',
      }}
    >
      <TopNavigation
        showBackButton
        leftHref="/"
        showNextButton
        rightComponent={<InviteTopButton />}
      />
      {children}
    </div>
  );
};

export default OverviewLayout;
