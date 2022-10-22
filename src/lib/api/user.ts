import { Review } from '@prisma/client';
import { client } from './../client';

export async function getReviews(revieweeId: string) {
  const { data } = await client.get<GetReviews>(`/api/reviews`);
  return data;
}

type GetReviews = (Review & {
  reviewer: {
    id: string;
    name: string | null;
    image: string | null;
  };
})[];
