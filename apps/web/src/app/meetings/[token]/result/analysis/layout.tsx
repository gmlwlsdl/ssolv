import TopNavigation from '@/components/layout/TopNavigation';

const AnalysisLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ token: string }>;
}) => {
  const { token } = await params;

  return (
    <div className="flex flex-1 flex-col bg-neutral-1600">
      <TopNavigation
        showBackButton
        leftHref={`/meetings/${token}/result/overview`}
        className="text-white"
      />
      {children}
    </div>
  );
};

export default AnalysisLayout;
