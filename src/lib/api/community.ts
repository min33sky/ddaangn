import { Post } from '@prisma/client';
import { client } from '../client';

/**
 * 커뮤니티 게시물 등록
 * @param question 질문 내용
 */
export async function createPost(question: string) {
  const { data } = await client.post<Post>('/api/posts', {
    question,
  });
  return data;
}
