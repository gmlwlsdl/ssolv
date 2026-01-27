import TopNavigation from '@/components/layout/TopNavigation';

const AnalysisLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  return (
    <div className="flex flex-1 flex-col bg-neutral-1600">
      <TopNavigation
        showBackButton
        leftHref={`/meetings/${id}/result/overview`}
        className="text-white"
      />
      {children}
    </div>
  );
};

export default AnalysisLayout;
