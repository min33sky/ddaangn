import { User, Product } from '@prisma/client';
import { client } from '../client';

export interface CreateProduct {
  name: string;
  description: string;
  price: number;
  image: string;
}

/**
 * 상품 등록 API
 * @param productData
 */
export async function createProduct(productData: CreateProduct) {
  const { data } = await client.post<Product>('/api/products', productData);
  return data;
}
