import Image from 'next/image';
import Link from 'next/link';

import Button from '@/components/ui/Button';

const SERVICE_EMAIL = 'ssolvofficial@gmail.com';

const NotFoundPage = () => {
  return (
    <main className="flex h-[100dvh] flex-col select-none">
      <div className="flex flex-1 flex-col items-center justify-center gap-5 px-5">
        <Image src="/images/error-page.svg" alt="" width={100} height={100} />
        <div className="flex w-full flex-col gap-1 text-center">
          <h3 className="body-1 font-semibold text-neutral-1600">
            원하시는 페이지를 찾을 수 없어요
          </h3>
          <p className="body-3 font-medium whitespace-pre-wrap text-neutral-800">
            {`찾으시는 페이지가 사용할 수 없는 상태에요.\n문제가 또 발생한다면, ${SERVICE_EMAIL}로 알려주세요.`}
          </p>
        </div>
      </div>
      <div className="px-5 pt-3 pb-6">
        <Link href="/">
          <Button className="w-full py-[14px]">홈으로 가기</Button>
        </Link>
      </div>
    </main>
  );
};

export default NotFoundPage;
