import TopNavigation from '@/app/_components/layout/TopNavigation';

interface OverviewLayoutProps {
  children: React.ReactNode;
}
const OverviewLayout = ({ children }: OverviewLayoutProps) => {
  return (
    <div className="flex flex-1 flex-col bg-neutral-100">
      <TopNavigation showBackButton leftHref="/" />
      {children}
    </div>
  );
};

export default OverviewLayout;
