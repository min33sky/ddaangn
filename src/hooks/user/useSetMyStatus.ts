import { setMyStatus } from '@/lib/api/user';
import { UseMutationOptionsOf } from '@/lib/reactQueryTypes';
import { useMutation } from '@tanstack/react-query';

export default function useSetMyStatus(
  options: UseMutationOptionsOf<typeof setMyStatus> = {},
) {
  return useMutation(setMyStatus, options);
}
