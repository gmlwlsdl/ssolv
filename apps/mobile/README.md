# Mobile App

Expo 기반 iOS 앱. Next.js 웹앱을 WebView로 래핑하는 구조입니다.

## 사전 준비

### 1. GoogleService-Info.plist

Firebase 설정 파일로, **보안상 Git에 포함되지 않습니다.**

- `apps/mobile/` 루트에 직접 파일을 위치시켜야 합니다.
- 파일이 없다면 팀원에게 공유를 요청하세요.

```
apps/mobile/
└── GoogleService-Info.plist  ← 여기에 위치
```

### 2. 환경 변수

`apps/mobile/.env` 파일을 생성합니다.

```env
EXPO_PUBLIC_WEB_URL=<웹앱 URL>
EXPO_PUBLIC_KAKAO_APP_KEY=<카카오 앱 키>
```

---

## 빌드 (EAS Build)

> **빌드는 반드시 `apps/mobile/` 디렉토리에서 실행해야 합니다.**
> iOS 빌드는 Apple Developer 계정 소유자인 **희진**만 수행할 수 있습니다.

```bash
cd apps/mobile
```

| 프로필        | 용도                          | 명령어                                           |
| ------------- | ----------------------------- | ------------------------------------------------ |
| `development` | 개발 테스트 (dev client 포함) | `eas build --platform ios --profile development` |
| `preview`     | 내부 배포 테스트              | `eas build --platform ios --profile preview`     |
| `production`  | App Store 배포                | `eas build --platform ios --profile production`  |

> EAS CLI가 없다면 먼저 설치하세요: `npm install -g eas-cli`

---

## 실행

> **개발 서버는 프로젝트 루트에서 실행합니다.**

```bash
# 프로젝트 루트에서
pnpm mobile dev
```

빌드된 앱을 기기에 설치한 뒤, 위 명령으로 Metro 번들러를 실행하면 앱과 연결됩니다.

---

## 기술 스택

- **Expo** ~54.0.18 / **React Native** 0.81.5
- **react-native-webview** — Next.js 웹앱 로드
- **@react-native-firebase/messaging** — FCM 푸시 알림 (iOS)
- **expo-apple-authentication** — Apple 로그인
