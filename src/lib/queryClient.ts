import { QueryClient } from '@tanstack/react-query';

/**
 * Create a new queryClient
 */
const getQueryClient = (() => {
  let queryClient: QueryClient | null = null;
  return () => {
    if (!queryClient) {
      queryClient = new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60, // 1분동안 최신 상태 유지
            cacheTime: 1000 * 60 * 60, // 1시간동안 캐시 유지
            refetchOnReconnect: false,
            refetchOnWindowFocus: false,
          },
        },
      });
    }
    return queryClient;
  };
})();

export default getQueryClient;
