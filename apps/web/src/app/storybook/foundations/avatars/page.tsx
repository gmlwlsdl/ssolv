import Image from 'next/image';

const AVATARS = [
  'banana',
  'broccoli',
  'carrot',
  'default',
  'lemon',
  'mushroom',
  'paprika',
  'pear',
  'tomato',
  'turnip',
] as const;

const AvatarsPage = () => {
  return (
    <div className="p-6">
      <h1 className="mb-1 heading-4 font-bold text-neutral-1600">Avatars</h1>
      <p className="mb-8 body-3 text-neutral-700">
        사용자 프로필 아바타.{' '}
        <code className="rounded bg-neutral-200 px-1 py-0.5 text-[11px]">AvatarVariantKey</code>{' '}
        타입과 1:1 대응.
      </p>

      <div className="grid grid-cols-5 gap-6">
        {AVATARS.map((name) => (
          <div key={name} className="flex flex-col items-center gap-2">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-neutral-300 bg-neutral-100 p-2">
              <Image
                src={`/images/avatar/${name}.svg`}
                alt={name}
                width={48}
                height={48}
                className="object-contain"
              />
            </div>
            <p className="label-2 font-medium text-neutral-700">{name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AvatarsPage;
