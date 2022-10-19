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
      res.status(401).json({ message: '로그인이 필요합니다.' });
      return;
    }

    try {
      const { id } = req.query;

      const isFavoritedProduct = await prisma.favorite.findUnique({
        where: {
          userId_productId: {
            userId: session.user.id,
            productId: Array.isArray(id) ? id[0] : id!,
          },
        },
      });

      if (isFavoritedProduct) {
        // 좋아요 취소
        await prisma.favorite.delete({
          where: {
            id: isFavoritedProduct.id,
          },
        });

        res.status(200).json({ message: '좋아요 취소' });
      } else {
        // 좋아요 추가
        await prisma.favorite.create({
          data: {
            user: {
              connect: {
                id: session.user.id,
              },
            },
            product: {
              connect: {
                id: Array.isArray(id) ? id[0] : id!,
              },
            },
          },
        });

        res.status(200).json({ message: '좋아요 추가' });
      }
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
