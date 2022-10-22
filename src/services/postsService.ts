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
};
