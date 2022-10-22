import { queryKeys } from '@/constants';
import { getDeals } from '@/lib/api/user';
import { UseQueryOptionsOf } from '@/lib/reactQueryTypes';
import { useQuery } from '@tanstack/react-query';

export default function useGetBought(
  options: UseQueryOptionsOf<typeof getDeals> = {},
) {
  return useQuery(
    [queryKeys.getDeals, 'Purchase'],
    () => getDeals('Purchase'),
    options,
  );
}
