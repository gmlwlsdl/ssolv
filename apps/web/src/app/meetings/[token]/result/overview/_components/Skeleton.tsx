const OverviewSkeleton = () => {
  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-6 px-5 py-4">
        <div
          className="h-10 w-full animate-pulse rounded-lg"
          style={{
            background:
              'linear-gradient(224deg, var(--Saturated-Orange-Orange50, #FFF7F5) 3.05%, var(--Saturated-Orange-Orange100, #FFF0EB) 96.12%)',
          }}
        />
        <div
          className="h-24 w-full animate-pulse rounded-lg"
          style={{
            background:
              'linear-gradient(224deg, var(--Saturated-Orange-Orange50, #FFF7F5) 3.05%, var(--Saturated-Orange-Orange100, #FFF0EB) 96.12%)',
          }}
        />
      </div>
      <div className="flex w-full justify-center py-4">
        <div
          className="h-[399px] w-[84%] animate-pulse rounded-3xl"
          style={{
            background:
              'linear-gradient(224deg, var(--Saturated-Orange-Orange50, #FFF7F5) 3.05%, var(--Saturated-Orange-Orange100, #FFF0EB) 96.12%)',
          }}
        />
      </div>
    </div>
  );
};

export default OverviewSkeleton;
