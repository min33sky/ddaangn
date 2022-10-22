// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { postsService } from '@/services/postsService';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'GET') {
    const { id } = req.query;

    const postId = Array.isArray(id) ? id[0] : id;

    if (!postId) {
      res.status(400).json({ message: 'Post ID is required.' });
      return;
    }

    // 게시물이 있는지 확인
    try {
      const post = await postsService.getPost(postId);
      if (!post) {
        res.status(404).json({ message: '게시물이 없습니다.' });
        return;
      }

      res.status(200).json(post);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
