import { queryKeys } from '@/constants';
import { getMyStatus } from '@/lib/api/user';
import { UseQueryOptionsOf } from '@/lib/reactQueryTypes';
import { useQuery } from '@tanstack/react-query';

/**
 * Get the current user's status
 */
export default function useGetMyStatus(
  options: UseQueryOptionsOf<typeof getMyStatus> = {},
) {
  return useQuery([queryKeys.getMyStatus], getMyStatus, options);
}
