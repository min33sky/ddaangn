// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { prisma } from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'GET') {
    // 게시물 목록 가져와야함 위도 경도도 가져온다.

    const {
      query: { latitude, longitude },
    } = req;

    const parsedLatitude = latitude
      ? parseFloat(latitude.toString())
      : undefined;

    const parsedLongitude = longitude
      ? parseFloat(longitude.toString())
      : undefined;

    console.log(
      '위도, 경도: ',
      latitude,
      parsedLatitude,
      longitude,
      parsedLongitude,
    );

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
        where: {
          latitude: parsedLatitude
            ? {
                gte: parsedLatitude - 0.01,
                lte: parsedLatitude + 0.01,
              }
            : undefined,
          longitude: parsedLongitude
            ? {
                gte: parsedLongitude - 0.01,
                lte: parsedLongitude + 0.01,
              }
            : undefined,
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

    const { question, latitude, longitude } = req.body;

    try {
      const newPost = await prisma.post.create({
        data: {
          question,
          latitude,
          longitude,
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
