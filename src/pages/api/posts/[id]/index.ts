// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'GET') {
    const { id } = req.query;

    // 게시물이 있는지 확인
    try {
      const post = await prisma.post.findUnique({
        where: {
          id: Array.isArray(id) ? id[0] : id,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
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

      if (!post) {
        res.status(404).json({ message: '게시물이 없습니다.' });
        return;
      }

      res.status(200).json(post);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
