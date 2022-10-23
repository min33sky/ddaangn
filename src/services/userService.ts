import { prisma } from '@/lib/prisma';
import { DealKind } from '@prisma/client';

export const userService = {
  /**
   * 내 정보 조회
   * @param userId
   */
  async getMyStatus(userId: string) {
    const me = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    return me;
  },

  async setMyStatus({
    userId,
    email,
    image,
    name,
    phone,
  }: {
    userId: string;
    image?: string;
    name?: string;
    email?: string;
    phone?: number;
  }) {
    //TODO: validate email, phone, etc.
    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        image,
        name,
        email,
        phone,
      },
    });

    return updatedUser;
  },

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
