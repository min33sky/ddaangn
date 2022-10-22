// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { userService } from '@/services/userService';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'GET') {
    const session = await getSession({ req });

    if (!session) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    try {
      const reviews = await userService.getReviews(session.user.id);
      res.status(200).json(reviews);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
