const EmptyPickCard = () => {
  return (
    <div className="flex flex-col items-center gap-1 px-5 py-6">
      <span className="label-1 font-medium text-white">
        <span className="font-bold">우리 모임 Pick!</span>이 아직 선정되지 않았어요.
      </span>
      <span className="label-2 font-medium text-neutral-500">
        가고 싶어요 버튼을 누르면 순위를 확인할 수 있어요.
      </span>
    </div>
  );
};

export default EmptyPickCard;
