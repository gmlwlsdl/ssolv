'use client';

import useNativeMessage from '@/hooks/useNativeMessage';
import usePendingFcmToken from '@/hooks/usePendingFcmToken';

/**
 * 모바일 WebView nativeMessage 이벤트 리스너를 앱 전역에 등록하는 프로바이더
 */
const NativeMessageProvider = ({ children }: { children: React.ReactNode }) => {
  useNativeMessage();
  usePendingFcmToken();
  return <>{children}</>;
};

export default NativeMessageProvider;
