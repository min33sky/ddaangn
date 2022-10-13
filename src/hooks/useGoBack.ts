import { useRouter } from 'next/router';
import { useCallback } from 'react';

export default function useGoBack() {
  const router = useRouter();
  const goBack = useCallback(() => {
    router.back();
  }, [router]);
  return goBack;
}
