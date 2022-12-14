import { Answer, Post, User } from '@prisma/client';
import { client } from '../client';

/**
 * 게시물 목록 조회
 */
export async function getPosts({
  latitude,
  longitude,
}: {
  latitude?: number;
  longitude?: number;
}) {
  const { data } = await client.get<GetPosts>(
    `/api/posts?latitude=${latitude}&longitude=${longitude}`,
  );
  return data;
}

export async function createPost({
  question,
  latitude,
  longitude,
}: {
  question: string;
  latitude?: number;
  longitude?: number;
}) {
  const { data } = await client.post<Post>('/api/posts', {
    question,
    latitude,
    longitude,
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

/**
 * 게시물 답변 등록
 * @param id 게시물 ID
 * @param answer 답변 내용
 */
export async function createAnswer({
  id,
  answer,
}: {
  id: string;
  answer: string;
}) {
  const { data } = await client.post<Answer>(`/api/posts/${id}/answers`, {
    answer,
  });
  return data;
}

export type Author = Pick<User, 'id' | 'name' | 'image'>;

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
    createdAt: string;
    updatedAt: string;
  }[];
  _count: {
    answers: number;
    curiosities: number;
  };
}

export type GetPosts = (Post & {
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
  _count: {
    answers: number;
    curiosities: number;
  };
})[];
