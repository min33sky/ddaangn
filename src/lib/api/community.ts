import { Post, User } from '@prisma/client';
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

/**
 * 커뮤니티 게시물 조회
 * @param id 게시물 ID
 * @returns
 */
export async function getPost(id: string) {
  const { data } = await client.get<GetPost>(`/api/posts/${id}`);
  return data;
}

/**
 * 커뮤니티 게시물 목록 ID 조회
 * @description SSG를 위한 데이터 조회
 */
export async function getPostsIds() {
  const { data } = await client.get<{ id: string }[]>('/api/posts/ids');
  return data;
}

/**
 * 게시물 궁금해요 등록 및 취소
 * @param id 게시물 ID
 */
export async function toggleCuriosity(id: string) {
  const { data } = await client.post<{ curiosity: boolean }>(
    `/api/posts/${id}/curiosity`,
  );
  return data;
}

type Author = Pick<User, 'id' | 'name' | 'image'>;

type AuthorWithCuriosity = Author & {
  curiosities: {
    postId: string;
  }[];
};

export interface GetPost extends Post {
  user: AuthorWithCuriosity;
  answers: {
    id: string;
    answer: string;
    user: Author;
  }[];
  _count: {
    answers: number;
    curiosities: number;
  };
}
