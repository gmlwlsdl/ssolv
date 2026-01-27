import Image from 'next/image';
import Link from 'next/link';

import Button from '@/components/ui/Button';

const NotFoundPage = () => {
  return (
    <main className="flex h-[100dvh] flex-col select-none">
      <div className="flex flex-1 flex-col items-center justify-center gap-5 px-5">
        <div className="flex w-full flex-col gap-1 text-center">
          <h3 className="body-1 font-semibold text-neutral-1600">
            원하시는 페이지를 찾을 수 없어요.
          </h3>
          <p className="body-3 font-medium whitespace-pre text-neutral-800">
            {`찾으시는 페이지의 주소 혹은 이름이 변경되었거나,\n일시적으로 사용할 수 없는 상태에요.`}
          </p>
          <p className="body-3 font-medium whitespace-pre text-neutral-800">
            {`문제가 또 발생한다면,\nssolvofficial@gmail.com로 알려주세요.`}
          </p>
        </div>
      </div>
      <Link href="/" className="px-5 pt-3 pb-6">
        <Button theme="orange">홈으로 가기</Button>
      </Link>
    </main>
  );
};

export default NotFoundPage;
