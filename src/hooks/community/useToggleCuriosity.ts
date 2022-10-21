import { toggleCuriosity } from '@/lib/api/community';
import { UseMutationOptionsOf } from '@/lib/reactQueryTypes';
import { useMutation } from '@tanstack/react-query';

export default function useToggleCuriosity(
  options: UseMutationOptionsOf<typeof toggleCuriosity> = {},
) {
  return useMutation(toggleCuriosity, options);
}
