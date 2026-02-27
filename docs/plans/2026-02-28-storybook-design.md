# /storybook 디자인 시스템 뷰어 — Design Document

> **작성일**: 2026-02-28
> **접근법**: Approach A — Full Dynamic Controls (Variants Gallery + Playground Controls)
> **목적**: 디자이너·개발자가 브라우저에서 직접 컴포넌트를 탐색·조작할 수 있는 인하우스 Storybook

---

## 1. 목표 & 범위

### 왜 만드는가

- 현재 `dev/modals` 페이지는 모달 미리보기만 가능. 조작 불가.
- 디자이너가 "이 버튼 disabled 상태는?" 같은 질문을 개발자에게 묻지 않고 직접 확인할 수 있어야 함.
- 신규 개발자 온보딩 시 "어떤 컴포넌트가 있나?" 를 코드 없이 파악.

### 포함 범위

| 카테고리    | 항목                                                                                                                                  |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Foundations | Colors, Typography, Icons, Avatars                                                                                                    |
| Components  | Button, Toggle, Input, Badge, Loading, StepIndicator, StepperInput, ParticipantProgressIndicator, AvatarIcon, AvatarList, BottomSheet |
| Modals      | ConfirmModal, ErrorModal, ReviewModal, CreateMeetingSuccessModal                                                                      |
| Survey UI   | Chip, ChipGroupMultiSelect (설문 전용 — 읽기 전용 갤러리)                                                                             |

### 제외 범위

- 특정 도메인 페이지 컴포넌트 (PersonaEmptyCard 등)
- API 의존 컴포넌트 (실데이터 필요한 것들)

---

## 2. URL 구조

```
/storybook                              → redirect → /storybook/foundations/colors
/storybook/foundations/colors
/storybook/foundations/typography
/storybook/foundations/icons
/storybook/foundations/avatars
/storybook/components/button
/storybook/components/toggle
/storybook/components/input
/storybook/components/badge
/storybook/components/loading
/storybook/components/step-indicator
/storybook/components/stepper-input
/storybook/components/participant-progress
/storybook/components/avatar-icon
/storybook/components/avatar-list
/storybook/components/bottom-sheet
/storybook/modals/confirm
/storybook/modals/error
/storybook/modals/review
/storybook/modals/create-success
/storybook/survey/chip
/storybook/survey/chip-group
```

딥링크 공유 가능. URL로 직접 접근 시 해당 페이지 바로 렌더링.

---

## 3. 레이아웃 (3-Panel)

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Storybook  [검색]                                    [light/dark 토글]  │
├───────────┬─────────────────────────────────┬───────────────────────────┤
│           │                                 │                           │
│  SIDEBAR  │       CENTER PREVIEW            │  CONTROLS PANEL           │
│  (240px)  │       (flex-1)                  │  (280px)                  │
│           │                                 │                           │
│ ▾ Foundations  │  ── Variants Gallery ──    │  Props                    │
│   Colors       │  [variant-1] [variant-2]   │  ┌─────────────────────┐ │
│   Typography   │  [variant-3] [variant-4]   │  │ theme    [select ▾] │ │
│   Icons        │                            │  │ status   [select ▾] │ │
│   Avatars      │  ── Playground ──          │  │ disabled [toggle  ] │ │
│                │  ┌─────────────────────┐   │  │ children [text    ] │ │
│ ▾ Components   │  │                     │   │  └─────────────────────┘ │
│   Button       │  │   <실시간 프리뷰>     │   │                           │
│   Toggle       │  │                     │   │  [Copy Props]  [Reset]   │
│   Input        │  └─────────────────────┘   │                           │
│   Badge        │                            │  Code Snippet             │
│   ...          │  bg: [white] [gray] [dark] │  ┌─────────────────────┐ │
│                │                            │  │ <Button             │ │
│ ▾ Modals       │                            │  │   theme="primary"   │ │
│   Confirm      │                            │  │ >                   │ │
│   Error        │                            │  │   버튼               │ │
│   ...          │                            │  │ </Button>           │ │
│                │                            │  └─────────────────────┘ │
│ ▾ Survey UI    │                            │                           │
│   Chip         │                            │                           │
│   ChipGroup    │                            │                           │
└───────────┴─────────────────────────────────┴───────────────────────────┘
```

- **모바일**: 사이드바 숨김 → 상단 드롭다운 네비. Controls는 하단 슬라이드업 패널.
- **light/dark 토글**: 중앙 프리뷰 배경만 전환 (시스템 테마 영향 없음).

---

## 4. StoryConfig 타입 시스템 (핵심)

```typescript
// apps/web/src/app/storybook/_types/story.ts

type ControlDef =
  | { type: 'select'; label: string; options: string[]; default: string }
  | { type: 'toggle'; label: string; default: boolean }
  | { type: 'text'; label: string; default: string }
  | { type: 'range'; label: string; min: number; max: number; step?: number; default: number };

export interface VariantDef {
  label: string;
  props: Record<string, unknown>;
  background?: 'white' | 'gray' | 'dark';
}

export interface StoryConfig<P extends Record<string, unknown> = Record<string, unknown>> {
  title: string;
  description?: string;
  component: React.ComponentType<P>;
  controls: Partial<Record<keyof P, ControlDef>>;
  variants?: VariantDef[];
}
```

`StorybookControls` 는 `StoryConfig.controls`를 순회해 control type에 따라 `<select>`, `<input type="checkbox">`, `<input type="text">`, `<input type="range">` 를 자동 렌더링. `useState`로 현재 props 값을 관리하고 Playground 컴포넌트에 spread.

**Button 예시:**

```typescript
export const config: StoryConfig<ButtonProps> = {
  title: 'Button',
  description: '주요 CTA 버튼. theme × status 조합으로 상태 표현.',
  component: Button,
  controls: {
    theme: {
      type: 'select',
      label: 'theme',
      options: ['cta-gradient', 'orange', 'orange-light', 'gray'],
      default: 'cta-gradient',
    },
    status: { type: 'select', label: 'status', options: ['normal', 'disabled'], default: 'normal' },
    children: { type: 'text', label: 'label', default: '버튼' },
  },
  variants: [
    { label: 'CTA Gradient', props: { theme: 'cta-gradient', children: '다음으로' } },
    { label: 'Orange', props: { theme: 'orange', children: '확인' } },
    { label: 'Orange Light', props: { theme: 'orange-light', children: '선택' } },
    { label: 'Gray', props: { theme: 'gray', children: '취소' } },
    { label: 'Disabled', props: { status: 'disabled', children: '비활성' } },
  ],
};
```

---

## 5. Foundations 페이지 설계

### Colors

- 6개 팔레트 (neutral, orange, red, yellow, green, blue) + alpha overlays
- 각 스와치: 색상 칩 + 토큰명 + hex 값
- **클릭 시 hex 클립보드 복사** → "Copied!" 토스트
- gradient 유틸리티도 별도 섹션으로 표시

### Typography

- 13개 텍스트 스케일 (display-1 ~ label-2)
- 각 행: 클래스명 / font-size / line-height / 실제 렌더링 텍스트
- 샘플 텍스트: "모임을 만들어 보세요" (한글 가독성 확인용)

### Icons

- 탭 구분: Utility (6개) / Food (11개) / Brand (4개)
- 각 아이콘: SVG 렌더링 + 파일명
- **클릭 시 `<Image src="..." />` 코드 스니펫 클립보드 복사**
- Food 아이콘은 실제 카테고리명으로 표시 (한글)

### Avatars

- 10개 아바타 그리드 (banana, broccoli, carrot, default, lemon, mushroom, paprika, pear, tomato, turnip)
- 각 아바타: 이미지 + 이름

---

## 6. 컴포넌트별 Controls 정의 요약

| 컴포넌트                     | Controls                                                                                                                            |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Button                       | theme (select), status (select), children (text)                                                                                    |
| Toggle                       | checked (toggle), disabled (toggle)                                                                                                 |
| Input                        | type (select: text/search), hasError (toggle), showClearButton (toggle), helperText (text), errorMessage (text), placeholder (text) |
| Badge                        | children (text)                                                                                                                     |
| Loading                      | — (variants 없음, 전체화면 오버레이 미리보기)                                                                                       |
| StepIndicator                | totalSteps (range 1-5), currentStep (range 1-5)                                                                                     |
| StepperInput                 | value (range 0-20), min (range 0), max (range 20)                                                                                   |
| ParticipantProgressIndicator | total (range 1-10), current (range 0-10)                                                                                            |
| AvatarIcon                   | type (select: 10종), size (select: sm/md/lg)                                                                                        |
| BottomSheet                  | title (text), showCloseButton (toggle)                                                                                              |

---

## 7. 파일 구조

```
apps/web/src/app/storybook/
├── layout.tsx                              # 3-panel shell (sidebar + slot + controls)
├── page.tsx                                # redirect → foundations/colors
├── _types/
│   └── story.ts                            # StoryConfig, ControlDef, VariantDef 타입
├── _components/
│   ├── StorybookSidebar.tsx                # 좌측 카테고리 트리 (nav)
│   ├── StorybookPreview.tsx                # 중앙 프리뷰 (variants gallery + playground)
│   └── StorybookControls.tsx              # 우측 Controls 패널 (StoryConfig → auto-render)
├── _hooks/
│   └── useStoryControls.ts                 # controls state 관리 훅
├── foundations/
│   ├── colors/page.tsx
│   ├── typography/page.tsx
│   ├── icons/page.tsx
│   └── avatars/page.tsx
├── components/
│   ├── button/page.tsx
│   ├── toggle/page.tsx
│   ├── input/page.tsx
│   ├── badge/page.tsx
│   ├── loading/page.tsx
│   ├── step-indicator/page.tsx
│   ├── stepper-input/page.tsx
│   ├── participant-progress/page.tsx
│   ├── avatar-icon/page.tsx
│   ├── avatar-list/page.tsx
│   └── bottom-sheet/page.tsx
├── modals/
│   ├── confirm/page.tsx
│   ├── error/page.tsx
│   ├── review/page.tsx
│   └── create-success/page.tsx
└── survey/
    ├── chip/page.tsx
    └── chip-group/page.tsx
```

총 예상 파일 수: ~30개 (타입, 훅, 레이아웃 포함)

---

## 8. 기술 결정 사항

| 항목                           | 결정                              | 이유                                  |
| ------------------------------ | --------------------------------- | ------------------------------------- |
| 라우팅                         | App Router nested layout          | 3-panel이 모든 하위 페이지에 공유됨   |
| Controls 상태                  | `useStoryControls` 커스텀 훅      | 컴포넌트 페이지마다 동일 패턴 재사용  |
| Controls → Preview 데이터 흐름 | URL searchParams 없이 메모리 상태 | 공유 필요 없음, 단순화 우선           |
| Code Snippet 생성              | controls 상태에서 동적 생성       | 빌드 타임 생성 불필요                 |
| 접근 제한                      | 없음 (URL 알면 접근 가능)         | 내부 전용, 프로덕션 배포 후 제거 예정 |
| `dev/modals` 페이지            | 유지 (별도 삭제 PR)               | storybook 안정화 후 제거              |

---

## 9. 구현 우선순위

```
Phase 1 (shell + foundations):
  1. layout.tsx — 3-panel 레이아웃
  2. StorybookSidebar — 카테고리 네비
  3. foundations/colors
  4. foundations/typography
  5. foundations/icons
  6. foundations/avatars

Phase 2 (StoryConfig 인프라 + 핵심 컴포넌트):
  7. _types/story.ts
  8. _hooks/useStoryControls
  9. StorybookControls (범용 패널)
  10. StorybookPreview (variants gallery + playground)
  11. components/button ~ components/bottom-sheet (11개)

Phase 3 (modals + survey):
  12. modals/* (4개) — dev/modals 내용 흡수
  13. survey/* (2개)
```

---

## 10. 성공 기준

- [ ] 디자이너가 개발자 없이 모든 컴포넌트 상태 확인 가능
- [ ] Controls 패널에서 props 변경 시 프리뷰 즉시 반영 (<16ms)
- [ ] 색상 hex 클릭 복사 동작
- [ ] 아이콘 클릭 시 Image 코드 복사 동작
- [ ] URL 딥링크 공유 동작
- [ ] `pnpm typecheck` 통과
- [ ] `pnpm lint` 통과
