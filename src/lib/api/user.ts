import { Favorite, Product, Review, DealKind } from '@prisma/client';
import { client } from './../client';

export async function getReviews() {
  const { data } = await client.get<GetReviews>(`/api/reviews`);
  return data;
}

export async function getFavorites() {
  const { data } = await client.get<GetFavorites>(`/api/users/me/favorites`);
  return data;
}

export async function getDeals(kind: DealKind) {
  const { data } = await client.get(`/api/users/me/deals?kind=${kind}`);
  return data;
}

type GetReviews = (Review & {
  reviewer: {
    id: string;
    name: string | null;
    image: string | null;
  };
})[];

type GetFavorites = (Favorite & {
  product: Product & {
    _count: {
      favorites: number;
    };
  };
})[];
