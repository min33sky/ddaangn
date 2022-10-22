import { prisma } from '@/lib/prisma';
import { DealKind } from '@prisma/client';

export const userService = {
  async getReviews(revieweeId: string) {
    const reviews = await prisma.review.findMany({
      where: {
        revieweeId: revieweeId,
      },
      include: {
        reviewer: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    return reviews;
  },

  async getFavorites(userId: string) {
    const favorites = await prisma.favorite.findMany({
      where: {
        userId: userId,
      },
      include: {
        product: true,
      },
    });

    return favorites;
  },

  async getDeals({ userId, kind }: { userId: string; kind: DealKind }) {
    const deals = await prisma.deal.findMany({
      where: {
        userId,
        kind,
      },
      include: {
        product: true,
      },
    });

    return deals;
  },
};
