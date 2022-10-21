// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { prisma } from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'GET') {
    // 게시물 목록 가져와야함

    try {
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
      });

      res.status(200).json(posts);
    } catch (error: any) {
      res.status(500).json(error.message);
    }
  } else if (req.method === 'POST') {
    const session = await getSession({ req });

    if (!session) {
      res.status(401).json({ message: '로그인이 필요합니다.' });
      return;
    }

    const { question } = req.body;

    try {
      const newPost = await prisma.post.create({
        data: {
          question,
          user: {
            connect: {
              id: session.user.id,
            },
          },
        },
      });

      res.status(200).json(newPost);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
