import { queryKeys } from '@/constants';
import { getFavorites } from '@/lib/api/user';
import { UseQueryOptionsOf } from '@/lib/reactQueryTypes';
import { useQuery } from '@tanstack/react-query';

export default function useGetFavorites(
  options: UseQueryOptionsOf<typeof getFavorites> = {},
) {
  return useQuery([queryKeys.getFavorites], () => getFavorites(), options);
}
