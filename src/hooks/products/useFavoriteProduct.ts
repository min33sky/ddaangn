import { favoriteProduct } from '@/lib/api/products';
import { UseMutationOptionsOf } from '@/lib/reactQueryTypes';
import { useMutation } from '@tanstack/react-query';

export default function useFavoriteProduct(
  options: UseMutationOptionsOf<typeof favoriteProduct> = {},
) {
  return useMutation(favoriteProduct, options);
}
