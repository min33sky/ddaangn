import { createProduct } from '@/lib/api/products';
import { UseMutationOptionsOf } from '@/lib/reactQueryTypes';
import { useMutation } from '@tanstack/react-query';

export default function useCreateProduct(
  options: UseMutationOptionsOf<typeof createProduct> = {},
) {
  return useMutation(createProduct, options);
}
