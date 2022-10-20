import { createPost } from '@/lib/api/community';
import { UseMutationOptionsOf } from '@/lib/reactQueryTypes';
import { useMutation } from '@tanstack/react-query';

export default function useCreatePost(
  options: UseMutationOptionsOf<typeof createPost> = {},
) {
  return useMutation(createPost, options);
}
