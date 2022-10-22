import { queryKeys } from '@/constants';
import { getReviews } from '@/lib/api/user';
import { UseQueryOptionsOf } from '@/lib/reactQueryTypes';
import { useQuery } from '@tanstack/react-query';

export default function useGetReviews(
  options: UseQueryOptionsOf<typeof getReviews> = {},
) {
  return useQuery([queryKeys.getReviews], () => getReviews(), options);
}
