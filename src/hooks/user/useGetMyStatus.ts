import { queryKeys } from '@/constants';
import { getMyStatus } from '@/lib/api/user';
import { UseQueryOptionsOf } from '@/lib/reactQueryTypes';
import { useQuery } from '@tanstack/react-query';

export default function useGetMyStatus(
  options: UseQueryOptionsOf<typeof getMyStatus> = {},
) {
  return useQuery([queryKeys.getMyStatus], getMyStatus, options);
}
