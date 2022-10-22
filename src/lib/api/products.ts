import { Product } from '@prisma/client';
import { client } from '../client';

/**
 * 상품 목록 조회
 */
export async function getProducts() {
  const { data } = await client.get<GetProducts>('/api/products');
  return data;
}

/**
 * 상품 ID 목록 조회
 */
export async function getProductsIds() {
  const { data } = await client.get<
    {
      id: string;
    }[]
  >('/api/products/ids');
  return data;
}

/**
 * 상품 조회
 * @param id 상품 ID
 */
export async function getProduct(id: string) {
  const { data } = await client.get<GetProduct>(`/api/products/${id}`);
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

/**
 * 상품 좋아요
 * @param id 상품 ID
 */
export async function favoriteProduct(id: string) {
  const { data } = await client.post<{ message: string }>(
    `/api/products/${id}/favorite`,
    {},
  );
  return data;
}

export type GetProducts = (Product & {
  _count: {
    favorites: number;
  };
})[];

export interface CreateProduct {
  name: string;
  description: string;
  price: number;
  image: string;
}

export interface GetProduct {
  product: GetProductWithOwner;
  relatedProducts: Product[];
  isLiked: boolean;
}

export interface GetProductWithOwner extends Product {
  owner: {
    id: string;
    name: string | null;
    image: string | null;
  };
}
