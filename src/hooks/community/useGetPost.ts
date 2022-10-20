import { queryKeys } from '@/constants';
import { getPost } from '@/lib/api/community';
import { UseQueryOptionsOf } from '@/lib/reactQueryTypes';
import { useQuery } from '@tanstack/react-query';

export default function useGetPost(
  id: string,
  options: UseQueryOptionsOf<typeof getPost> = {},
) {
  return useQuery([queryKeys.getPost, id], () => getPost(id), options);
}
