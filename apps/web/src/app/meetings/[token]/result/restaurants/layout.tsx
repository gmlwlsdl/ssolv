import RestaurantsNavigation from '@/app/meetings/[token]/result/restaurants/_components/RestaurantsNavigation';

type PageProps = {
  children: React.ReactNode;
  params: Promise<{ token: string }>;
};

const RestaurantsLayout = async ({ children, params }: PageProps) => {
  const { token } = await params;

  return (
    <div className="flex flex-1 flex-col bg-neutral-1600">
      <RestaurantsNavigation token={token} />
      {children}
    </div>
  );
};

export default RestaurantsLayout;
