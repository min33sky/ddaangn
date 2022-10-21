// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { prisma } from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    const session = await getSession({ req });

    if (!session) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { id } = req.query;

    if (!id) {
      res.status(400).json({ error: 'postID required...' });
      return;
    }

    try {
      // 게시물이 있는지 확인
      const isExists = await prisma.post.findUnique({
        where: {
          id: Array.isArray(id) ? id[0] : id,
        },
      });

      if (!isExists) {
        res.status(404).json({ error: '게시물이 없습니다.' });
        return;
      }

      const newAnswer = await prisma.answer.create({
        data: {
          answer: req.body.answer,
          post: {
            connect: {
              id: Array.isArray(id) ? id[0] : id,
            },
          },
          user: {
            connect: {
              id: session.user.id,
            },
          },
        },
      });

      res.status(200).json(newAnswer);
    } catch (error: any) {
      res.status(500).json(error.message);
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
