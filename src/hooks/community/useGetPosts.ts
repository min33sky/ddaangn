import { queryKeys } from '@/constants';
import { getPosts } from '@/lib/api/community';
import { UseQueryOptionsOf } from '@/lib/reactQueryTypes';
import { useQuery } from '@tanstack/react-query';

export default function useGetPosts(
  options: UseQueryOptionsOf<typeof getPosts> = {},
) {
  return useQuery([queryKeys.getPosts], () => getPosts(), options);
}
