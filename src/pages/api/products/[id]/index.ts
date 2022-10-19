// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'GET') {
    try {
      const { id } = req.query;

      const product = await prisma.product.findUnique({
        where: {
          id: Array.isArray(id) ? id[0] : id,
        },
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      });

      if (!product) {
        res.status(404).json({ error: 'Product not found' });
      }

      const terms = product?.name.split(' ').map((term) => ({
        name: {
          contains: term,
        },
      }));

      const relatedProducts = await prisma.product.findMany({
        where: {
          OR: terms,
          AND: {
            id: {
              not: product?.id, // 현재 상품 제외
            },
          },
        },
        take: 4,
      });

      res.status(200).json({
        product,
        relatedProducts,
      });
    } catch (error) {
      res.status(500).json({ error });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
