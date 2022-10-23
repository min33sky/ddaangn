import {
  Favorite,
  Product,
  Review,
  DealKind,
  Deal,
  User,
} from '@prisma/client';
import { client } from './../client';

/**
 * 내 정보 조회
 */
export async function getMyStatus() {
  const { data } = await client.get<User>(`/api/users/me`);
  return data;
}

export async function setMyStatus({
  image,
  name,
  email,
  phone,
}: {
  image?: string;
  name?: string;
  email?: string;
  phone?: number;
}) {
  const { data } = await client.put<User>(`/api/users/me`, {
    image,
    name,
    email,
    phone,
  });
  return data;
}

export async function getReviews() {
  const { data } = await client.get<GetReviews>(`/api/reviews`);
  return data;
}

export async function getFavorites() {
  const { data } = await client.get<GetFavorites>(`/api/users/me/favorites`);
  return data;
}

export async function getDeals(kind: DealKind) {
  const { data } = await client.get<GetDeals>(
    `/api/users/me/deals?kind=${kind}`,
  );
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

type GetDeals = (Deal & {
  product: Product & {
    _count: {
      deals: number;
    };
  };
})[];
