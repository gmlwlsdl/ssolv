import { dirname } from 'path';
import { fileURLToPath } from 'url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';
import react from 'eslint-plugin-react';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import importPlugin from 'eslint-plugin-import';
import prettier from 'eslint-plugin-prettier';
import reactHooks from 'eslint-plugin-react-hooks';
import { createRequire } from 'module';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

const require = createRequire(import.meta.url);
const filenames = require('eslint-plugin-filenames'); // CJS 플러그인 안전 로드

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

// 1) 공유 설정(Next/TS/Import/Prettier 등) 레거시 extends를 Flat으로 흡수
const legacyExtends = compat.extends(
  'eslint:recommended',
  'plugin:@typescript-eslint/recommended',
  'plugin:react/recommended',
  'plugin:jsx-a11y/recommended',
  'plugin:import/recommended',
  'plugin:import/typescript',
  'next/core-web-vitals',
  'prettier'
);

// 2) 프로젝트 규칙/플러그인/파서/세팅 + ignore + 예외(Next 라우팅 파일명)
const eslintConfig = [
  // 레거시 확장 먼저
  ...legacyExtends,

  // 메인 룰셋
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: tsParser,
      parserOptions: {
        // tsconfig를 인식하도록 (v9+ 권장)
        // 모노레포 환경에 맞게 조정
        project: ['tsconfig.json', 'apps/*/tsconfig.json'],
        tsconfigRootDir: __dirname,
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      react,
      'jsx-a11y': jsxA11y,
      import: importPlugin,
      prettier,
      'react-hooks': reactHooks,
      filenames,
    },
    settings: {
      next: {
        rootDir: ['apps/web/'],
      },
      react: {
        version: 'detect',
      },
      'import/resolver': {
        typescript: {
          project: ['tsconfig.json', 'apps/*/tsconfig.json'],
        },
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
          paths: ['src', '.'],
        },
      },
    },
    rules: {
      // Prettier
      'prettier/prettier': ['error', { endOfLine: 'auto' }],

      /**
       * @description
       * Flat Config(ESLint 9 이상) 환경에서 eslint-plugin-filenames 의 match-regex 룰 지원 하지 않음
       *
       * 버전을 낮춘다면,
       * 기존 룰 (filenames/match-regex) 그대로 사용 가능
       * 최신 ESLint 기능 및 성능, 버그 픽스 미적용
       *
       * 버전 유지 + 룰 제거/변경
       * 최신 ESLint, Next.js 최신 기능 유지
       * 파일명 체크 룰을 포기하거나 직접 구현 필요
       * */
      // 파일명 규칙 (Next 라우팅 파일은 아래 override로 예외 처리)
      // 'filenames/match-regex': {
      //   pattern: '^[a-z-]+\\.[a-z]+$',
      //   message: '파일명은 소문자와 하이픈(-)만 사용하세요',
      // },

      // 컴포넌트 네이밍
      'react/jsx-pascal-case': 'error',

      // 함수/식별자 네이밍
      camelcase: ['error', { properties: 'never' }],

      // props 구조분해
      'react/destructuring-assignment': ['error', 'always'],

      // import 순서
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
            'object',
            'type',
          ],
          pathGroups: [{ pattern: 'react', group: 'external', position: 'before' }],
          pathGroupsExcludedImportTypes: ['react'],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],

      // TS 관련
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-empty-interface': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',

      // 컴포넌트 정의 방식
      'react/function-component-definition': [
        2,
        { namedComponents: 'arrow-function', unnamedComponents: 'arrow-function' },
      ],

      // JSX 관련
      'react/jsx-key': ['error', { checkFragmentShorthand: true }],
      'react/jsx-no-duplicate-props': ['error', { ignoreCase: true }],

      // 기타
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      'import/no-default-export': 'off',
      'import/prefer-default-export': 'off',
      'import/no-unresolved': 'off',
      'prefer-const': 'error',
      'no-var': 'error',
      eqeqeq: 'error',
      'prefer-destructuring': ['error', { array: false, object: true }],
      'no-useless-rename': 'error',
      'object-shorthand': 'error',

      // Hooks
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },

  // 무시 목록 (예전 .eslintignore 대체)
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'build/**',
      'dist/**',
      'next-env.d.ts',
      '.eslintrc.cjs',
    ],
  },

  // Next 라우팅/세그먼트 파일은 파일명 규칙 예외
  {
    files: ['apps/web/src/app/**', 'apps/web/src/pages/**', 'apps/web/src/app/api/**'],
    rules: {
      'filenames/match-regex': 'off',
    },
  },

  // react-native 과의 호환성으로 인해 규칙 예외
  {
    files: ['apps/mobile/**/*.{js,jsx,ts,tsx}'],
    rules: {
      'import/namespace': 'off',
    },
  },
];

export default eslintConfig;
