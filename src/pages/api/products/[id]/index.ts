// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { getSession } from 'next-auth/react';
import { productsService } from '@/services/productsService';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await getSession({ req });

  if (req.method === 'GET') {
    try {
      const { id } = req.query;

      const productId = Array.isArray(id) ? id[0] : id;

      if (!productId) {
        res.status(400).json({ message: '상품 ID가 필요합니다.' });
        return;
      }

      const { product, relatedProducts } = await productsService.getProduct(
        productId,
      );

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
