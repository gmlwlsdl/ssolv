import StorybookControlsPanel from '@/app/storybook/_components/StorybookControlsPanel';
import StorybookSidebar from '@/app/storybook/_components/StorybookSidebar';

const StorybookLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="fixed inset-0 z-50 flex overflow-hidden bg-neutral-100">
      <div className="w-[220px] shrink-0">
        <StorybookSidebar />
      </div>

      <main className="no-scrollbar flex-1 overflow-y-auto bg-white">{children}</main>

      <StorybookControlsPanel />
    </div>
  );
};

export default StorybookLayout;
