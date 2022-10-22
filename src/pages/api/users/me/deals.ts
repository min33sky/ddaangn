import { userService } from '@/services/userService';
import { DealKind } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await getSession({ req });

  if (!session) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  const {
    query: { kind },
  } = req;

  if (!kind) {
    res.status(400).json({ message: 'Bad Request' });
    return;
  }

  const dealKind = Array.isArray(kind) ? kind[0] : kind;

  if (dealKind !== DealKind.Purchase && dealKind !== DealKind.Sale) {
    res.status(400).json({ message: 'Bad Request' });
    return;
  }

  if (req.method === 'GET') {
    try {
      const deals = await userService.getDeals({
        userId: session.user.id,
        kind: dealKind,
      });

      res.status(200).json(deals);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
