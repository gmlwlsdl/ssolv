import RestaurantsNavigation from '@/app/meetings/[id]/result/restaurants/_components/RestaurantsNavigation';

type PageProps = {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
};

const RestaurantsLayout = async ({ children, params }: PageProps) => {
  const { id } = await params;

  return (
    <div className="flex flex-1 flex-col bg-neutral-1600">
      <RestaurantsNavigation id={id} />
      {children}
    </div>
  );
};

export default RestaurantsLayout;
