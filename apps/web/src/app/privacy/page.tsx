import TopNavigation from '@/components/layout/TopNavigation';

const PrivacyPage = () => {
  return (
    <div className="no-scrollbar flex h-[100dvh] flex-col overflow-auto bg-white">
      <TopNavigation
        title="개인정보 처리방침"
        showBackButton
        leftHref="/mypage"
        leftAriaLabel="마이페이지로 돌아가기"
        className="bg-white text-neutral-800"
      />

      <main className="flex flex-col gap-8 px-5 pt-8 pb-20 text-neutral-1200">
        <section className="flex flex-col gap-4">
          <h1 className="title-1 font-bold text-neutral-1500">SOLV 개인정보 처리방침</h1>
          <p className="body-3 leading-relaxed">
            SOLV(이하 ‘회사’라고 함)은 개인정보 보호법 제30조에 따라 정보주체의 개인정보를 보호하고
            이와 관련한 고충을 신속하고 원활하게 처리하기 위하여 다음과 같이 개인정보 처리방침을
            수립·공개합니다.
          </p>
          <p className="body-3 font-medium">
            본 개인정보 처리방침은 SOLV{' '}
            <span className="text-primary-600 font-bold">모바일 애플리케이션 및 관련 서비스</span>에
            적용됩니다.
          </p>
        </section>

        <hr className="border-neutral-200" />

        <section className="flex flex-col gap-4">
          <h2 className="title-2 decoration-primary-200 font-bold text-neutral-1500 underline decoration-2 underline-offset-8">
            1. 개인정보의 처리 목적
          </h2>
          <p className="body-3 leading-relaxed">
            회사는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적
            이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 별도의 동의를 받는 등
            필요한 조치를 이행할 것입니다.
          </p>
          <div className="flex flex-col gap-6 border-l-2 border-neutral-200 pl-4">
            <div>
              <p className="body-3 font-bold text-neutral-1400">회원 가입 및 관리</p>
              <ul className="mt-1 list-inside list-disc space-y-1 label-1 text-neutral-1100">
                <li>본인 식별 및 인증</li>
                <li>회원 자격 유지 및 관리</li>
                <li>서비스 부정 이용 방지</li>
              </ul>
            </div>
            <div>
              <p className="body-3 font-bold text-neutral-1400">서비스 제공</p>
              <ul className="mt-1 list-inside list-disc space-y-1 label-1 text-neutral-1100">
                <li>콘텐츠 제공</li>
                <li>맞춤형 서비스 제공</li>
                <li>서비스 이용 통계 분석 및 서비스 개선</li>
              </ul>
            </div>
            <div>
              <p className="body-3 font-bold text-neutral-1400">알림 서비스 제공</p>
              <ul className="mt-1 list-inside list-disc space-y-1 label-1 text-neutral-1100">
                <li>서비스 공지 및 업데이트 안내</li>
                <li>사용자 맞춤 알림 제공</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="title-2 decoration-primary-200 font-bold text-neutral-1500 underline decoration-2 underline-offset-8">
            2. 처리하는 개인정보의 항목
          </h2>
          <p className="body-3 leading-relaxed">
            회사는 다음과 같은 개인정보를 처리할 수 있습니다.
          </p>
          <div className="flex flex-col gap-4">
            <div>
              <p className="mb-1 body-3 font-bold text-neutral-1400">소셜 로그인 및 회원가입 시</p>
              <p className="label-1 text-neutral-1100">
                이름, 이메일, 소셜 계정 식별자 (Apple, Kakao 등)
              </p>
            </div>
            <div>
              <p className="mb-1 body-3 font-bold text-neutral-1400">서비스 이용 과정 자동 수집</p>
              <p className="label-1 text-neutral-1100">
                이용 기록, 앱 로그, 기기 정보 (OS, 모델, 식별자 등)
              </p>
            </div>
            <div>
              <p className="mb-1 body-3 font-bold text-neutral-1400">푸시 알림 서비스</p>
              <p className="label-1 text-neutral-1100">기기 토큰(Device Token)</p>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="title-2 decoration-primary-200 font-bold text-neutral-1500 underline decoration-2 underline-offset-8">
            3. 개인정보의 처리 및 보유 기간
          </h2>
          <p className="body-3 leading-relaxed text-neutral-1100">
            회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에
            동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.
          </p>
          <div>
            <p className="body-3 font-bold text-neutral-1400">회원가입 및 관리: 회원 탈퇴 시까지</p>
            <p className="mt-2 label-2 text-neutral-600">
              ※ 단, 관계 법령 위반에 따른 수사·조사가 진행 중인 경우 해당 수사·조사 종료 시까지
              보관할 수 있습니다.
            </p>
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="title-2 decoration-primary-200 font-bold text-neutral-1500 underline decoration-2 underline-offset-8">
            4. 개인정보의 파기 절차 및 방법
          </h2>
          <div className="space-y-4">
            <p className="label-1 text-neutral-1100">
              <span className="font-bold text-neutral-1400">[파기 절차]</span> 목적 달성 후 별도
              DB로 옮겨져 일정 기간 저장 후 파기됩니다.
            </p>
            <p className="label-1 text-neutral-1100">
              <span className="font-bold text-neutral-1400">[파기 방법]</span> 전자적 파일은 복구
              불가능한 기술적 삭제, 종이 문서는 분쇄/소각합니다.
            </p>
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="title-2 decoration-primary-200 font-bold text-neutral-1500 underline decoration-2 underline-offset-8">
            5. 개인정보 처리 위탁
          </h2>
          <div className="flex flex-col gap-6">
            <div className="space-y-2">
              <p className="body-3 font-bold text-neutral-1400">Amplitude</p>
              <p className="label-1 leading-relaxed text-neutral-1100">
                앱 사용 분석을 통한 서비스 개선 및 사용성 분석 목적으로 활용됩니다.
              </p>
              <a
                href="https://amplitude.com/privacy"
                target="_blank"
                className="text-primary-600 label-2 font-bold"
              >
                Amplitude 개인정보 처리방침 →
              </a>
            </div>
            <div className="space-y-2">
              <p className="body-3 font-bold text-neutral-1400">푸시 알림 서비스</p>
              <p className="label-1 leading-relaxed text-neutral-1100">
                APNs(Apple) 또는 FCM(Google)을 통해 기기 토큰이 사용될 수 있습니다.
              </p>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="title-2 decoration-primary-200 font-bold text-neutral-1500 underline decoration-2 underline-offset-8">
            6. 정보주체의 권리 및 행사 방법
          </h2>
          <p className="label-1 leading-relaxed text-neutral-1100">
            이용자는 언제든지 개인정보 정정, 삭제, 처리 정지를 요구할 수 있으며,{' '}
            <span className="text-primary-600 font-bold underline">회원 탈퇴</span>를 통해 개인정보
            처리를 중단할 수 있습니다.
          </p>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="title-2 decoration-primary-200 font-bold text-neutral-1500 underline decoration-2 underline-offset-8">
            7. 개인정보 보호책임자
          </h2>
          <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6">
            <p className="mb-1 body-3 font-bold text-neutral-1500">
              성명: 조현재 (개인정보 보호책임자)
            </p>
            <p className="label-1 text-neutral-700">이메일: ssolvofficial@gmail.com</p>
          </div>
        </section>

        <section className="pt-10">
          <p className="label-3 text-neutral-400">시행일자: 2026년 3월 4일</p>
        </section>
      </main>
    </div>
  );
};

export default PrivacyPage;
