const EMPTY_MESSAGE = `아직 진행 중인 식당 추천이 없어요
모임을 생성하고 식당을 추천받아보세요`;

const EmptyActiveMeetingCard = () => {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-2 rounded-3xl bg-white px-4 py-5">
      <p className="text-center body-3 leading-6 font-medium whitespace-pre text-neutral-800">
        {EMPTY_MESSAGE}
      </p>
    </div>
  );
};

export default EmptyActiveMeetingCard;
