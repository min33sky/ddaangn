// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { userService } from '@/services/userService';
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

  if (req.method === 'GET') {
    try {
      const user = await userService.getMyStatus(session.user.id);

      if (!user) {
        res.status(404).json({ message: 'Not Found' });
        return;
      }

      res.status(200).json(user);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  } else if (req.method === 'PUT') {
    const { name, email, phone, image } = req.body;

    try {
      const updatedUser = await userService.setMyStatus({
        userId: session.user.id,
        name,
        email,
        phone,
        image,
      });

      res.status(200).json(updatedUser);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
