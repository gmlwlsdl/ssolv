import RestaurantsNavigation from '@/app/events/[eventId]/restaurants/_components/RestaurantsNavigation';

type PageProps = {
  children: React.ReactNode;
  params: Promise<{ eventId: string }>;
};

const RestaurantsLayout = async ({ children, params }: PageProps) => {
  const { eventId } = await params;

  return (
    <div className="flex flex-1 flex-col bg-neutral-1600">
      <RestaurantsNavigation eventId={eventId} />
      {children}
    </div>
  );
};

export default RestaurantsLayout;
