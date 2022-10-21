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
      const isExists = await prisma.curiosity.findUnique({
        where: {
          userId_postId: {
            postId: Array.isArray(id) ? id[0] : id,
            userId: session.user.id,
          },
        },
      });

      if (isExists) {
        // 궁금해요 취소
        await prisma.curiosity.delete({
          where: {
            id: isExists.id,
          },
        });

        res.status(200).json({ curiosity: false });
      } else {
        // 궁금해요
        await prisma.curiosity.create({
          data: {
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

        res.status(200).json({ curiosity: true });
      }
    } catch (error: any) {
      res.status(500).json(error.message);
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
