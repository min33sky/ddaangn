import { queryKeys } from '@/constants';
import { getPosts } from '@/lib/api/community';
import { UseQueryOptionsOf } from '@/lib/reactQueryTypes';
import { useQuery } from '@tanstack/react-query';

export default function useGetPosts(
  coords: { latitude?: number; longitude?: number },
  options: UseQueryOptionsOf<typeof getPosts> = {},
) {
  return useQuery(
    [queryKeys.getPosts],
    () =>
      getPosts({
        latitude: coords.latitude,
        longitude: coords.longitude,
      }),
    options,
  );
}
