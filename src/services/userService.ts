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
        product: {
          include: {
            _count: {
              select: {
                favorites: true,
              },
            },
          },
        },
      },
    });

    return favorites;
  },

  /**
   * 구매록록 또는 판매목록을 가져오기
   */
  async getDeals({ userId, kind }: { userId: string; kind: DealKind }) {
    /**
     ** _count절에 where절을 추가하려면 아래와 같이 해야한다.
      generator client {
      provider        = "prisma-client-js"
      previewFeatures = ["filteredRelationCount"]
      }
     */
    const deals = await prisma.deal.findMany({
      where: {
        userId,
        kind,
      },
      include: {
        product: {
          include: {
            _count: {
              select: {
                deals: {
                  where: {
                    kind,
                  },
                },
              },
            },
          },
        },
      },
    });

    return deals;
  },
};
