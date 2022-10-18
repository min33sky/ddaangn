import { Product } from '@prisma/client';
import { client } from '../client';

/**
 * 상품 목록 조회
 */
export async function getProducts() {
  const { data } = await client.get<Product[]>('/api/products');
  return data;
}

/**
 * 상품 등록
 * @param productData
 */
export async function createProduct(productData: CreateProduct) {
  const { data } = await client.post<Product>('/api/products', productData);
  return data;
}

export interface CreateProduct {
  name: string;
  description: string;
  price: number;
  image: string;
}
