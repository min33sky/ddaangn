import { createAnswer, createPost } from '@/lib/api/community';
import { UseMutationOptionsOf } from '@/lib/reactQueryTypes';
import { useMutation } from '@tanstack/react-query';

export default function useCreateAnswer(
  options: UseMutationOptionsOf<typeof createAnswer> = {},
) {
  return useMutation(createAnswer, options);
}
