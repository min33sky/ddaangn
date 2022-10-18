import { queryKeys } from '@/constants';
import { getProduct } from '@/lib/api/products';
import { UseQueryOptionsOf } from '@/lib/reactQueryTypes';
import { useQuery } from '@tanstack/react-query';

export default function useGetProduct(
  id: string,
  options: UseQueryOptionsOf<typeof getProduct> = {},
) {
  return useQuery([queryKeys.getProduct, id], () => getProduct(id), options);
}
