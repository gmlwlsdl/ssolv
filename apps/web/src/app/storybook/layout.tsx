import StorybookControls from '@/app/storybook/_components/StorybookControls';
import StorybookSidebar from '@/app/storybook/_components/StorybookSidebar';

const StorybookLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen overflow-hidden bg-neutral-100">
      <div className="w-[220px] shrink-0">
        <StorybookSidebar />
      </div>

      <main className="no-scrollbar flex-1 overflow-y-auto bg-white">{children}</main>

      <div className="w-[280px] shrink-0 border-l border-neutral-300 bg-neutral-50">
        <StorybookControls />
      </div>
    </div>
  );
};

export default StorybookLayout;
