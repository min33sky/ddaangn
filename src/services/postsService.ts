import { prisma } from '@/lib/prisma';

export const postsService = {
  async getPostsIds() {
    const ids = await prisma.post.findMany({
      select: {
        id: true,
      },
    });

    return ids;
  },

  async getPost(id: string) {
    const post = await prisma.post.findUnique({
      where: {
        id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            curiosities: {
              select: {
                postId: true,
              },
            },
          },
        },
        answers: {
          select: {
            id: true,
            answer: true,
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
            createdAt: true,
            updatedAt: true,
          },
        },
        _count: {
          select: {
            answers: true,
            curiosities: true,
          },
        },
      },
    });

    return post;
  },

  async getPosts({
    latitude,
    longitude,
  }: {
    latitude?: number;
    longitude?: number;
  }) {
    const posts = await prisma.post.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        _count: {
          select: {
            answers: true,
            curiosities: true,
          },
        },
      },
      where: {
        latitude: latitude
          ? {
              gte: latitude - 0.01,
              lte: latitude + 0.01,
            }
          : undefined,
        longitude: longitude
          ? {
              gte: longitude - 0.01,
              lte: longitude + 0.01,
            }
          : undefined,
      },
    });

    return posts;
  },
};
