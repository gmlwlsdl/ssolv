import AvatarList from '@/components/ui/AvatarList';

import type { Participant } from '@/data/models/meeting';

const MOCK_PARTICIPANTS_3: Participant[] = [
  { userId: 1, attendeeNickname: '딸기', color: 'tomato' },
  { userId: 2, attendeeNickname: '당근', color: 'carrot' },
  { userId: 3, attendeeNickname: '바나나', color: 'banana' },
];

const MOCK_PARTICIPANTS_5: Participant[] = [
  ...MOCK_PARTICIPANTS_3,
  { userId: 4, attendeeNickname: '브로콜리', color: 'broccoli' },
  { userId: 5, attendeeNickname: '레몬', color: 'lemon' },
];

const AvatarListStoryPage = () => {
  return (
    <div className="p-6">
      <h1 className="mb-1 heading-4 font-bold text-neutral-1600">AvatarList</h1>
      <p className="mb-8 body-3 text-neutral-700">
        참여자 목록. 아바타를 겹쳐서 표시 + 인원 수 배지.
      </p>

      <div className="flex flex-col gap-8">
        <div>
          <p className="mb-3 label-1 font-semibold text-neutral-700">3명</p>
          <AvatarList surveyParticipantList={MOCK_PARTICIPANTS_3} />
        </div>
        <div>
          <p className="mb-3 label-1 font-semibold text-neutral-700">5명</p>
          <AvatarList surveyParticipantList={MOCK_PARTICIPANTS_5} />
        </div>
      </div>
    </div>
  );
};

export default AvatarListStoryPage;
