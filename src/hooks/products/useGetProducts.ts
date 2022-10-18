import { queryKeys } from '@/constants';
import { getProducts } from '@/lib/api/products';
import { UseQueryOptionsOf } from '@/lib/reactQueryTypes';
import { useQuery } from '@tanstack/react-query';

export default function useGetProducts(
  options: UseQueryOptionsOf<typeof getProducts> = {},
) {
  return useQuery([queryKeys.getProducts], getProducts, options);
}
