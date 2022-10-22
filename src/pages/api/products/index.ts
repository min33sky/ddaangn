// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { getSession } from 'next-auth/react';
import { productsService } from '@/services/productsService';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { getProducts } = productsService;

  if (req.method === 'GET') {
    try {
      const products = await getProducts();
      res.status(200).json(products);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === 'POST') {
    const session = await getSession({ req });

    if (!session) {
      res.status(401).json({ message: '로그인이 필요합니다.' });
      return;
    }

    const { name, price, description, image } = req.body;

    try {
      const product = await prisma.product.create({
        data: {
          name,
          price,
          description,
          image,
          owner: {
            connect: {
              id: session.user.id,
            },
          },
        },
      });

      res.status(200).json({
        ...product,
      });
    } catch (error) {
      res.status(500).json({ message: '상품 등록에 실패했습니다.' });
    }
  } else {
    res.setHeader('Allow', ['POST', 'GET']);
    res.status(405).json({
      message: `HTTP Method ${req.method} is not supported.`,
    });
  }
}
