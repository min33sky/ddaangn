import { prisma } from '@/lib/prisma';
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
};
