import TabLayout from '@/components/layout/TabLayout';
import Button from '@/components/system/Button';
import LabelInput from '@/components/system/LabelInput';
import LabelTextarea from '@/components/system/LabelTextarea';
import { queryKeys } from '@/constants';
import useGetPost from '@/hooks/community/useGetPost';
import { getPost, getPostsIds } from '@/lib/api/community';
import getQueryClient from '@/lib/queryClient';
import { dehydrate } from '@tanstack/react-query';
import { GetStaticPropsContext } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React from 'react';

export default function CommunityPostDetail() {
  const router = useRouter();
  const id = router.query.id as string;

  const { data } = useGetPost(id, {
    onSuccess(data) {
      console.log('Post fetched successfully');
    },
  });

  if (!data) return <div>Loading...</div>;

  const { user, question, answers, _count } = data;

  return (
    <TabLayout>
      <div className="flex flex-col flex-1">
        <span className="inline-flex w-fit my-3 ml-4 items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-800">
          동네질문
        </span>

        {/* 유저 미니 프로필 카드 */}
        <div className="flex mb-3 px-4 cursor-pointer pb-3  border-b items-center space-x-3">
          {user.image ? (
            <figure className="w-12 h-12 relative rounded-full overflow-hidden">
              <Image
                src={user.image}
                layout="fill"
                objectFit="contain"
                alt="avatar"
              />
            </figure>
          ) : (
            <div className="w-10 h-10 rounded-full bg-slate-300" />
          )}
          <div>
            <p className="text-sm font-medium text-gray-700">{user.name}</p>
            <p className="text-xs font-medium text-gray-500">
              View profile &rarr;
            </p>
          </div>
        </div>

        {/* 질문내용 */}
        <div>
          <div className="mt-2 px-4 text-gray-700">
            <span className="text-orange-500 font-medium">Q.</span> {question}
          </div>
          <div className="flex px-4 space-x-5 mt-3 text-gray-700 py-2.5 border-t border-b-[2px]  w-full">
            <span className="flex space-x-2 items-center text-sm">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <span>궁금해요 {_count.curiosities}</span>
            </span>
            <span className="flex space-x-2 items-center text-sm">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                ></path>
              </svg>
              <span>답변 {_count.answers}</span>
            </span>
          </div>
        </div>

        <section className="flex flex-col flex-1">
          <div className="my-2 space-y-5 flex-1">
            {answers.map((answer) => (
              <div key={answer.id} className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-slate-200 rounded-full" />
                <div>
                  <span className="text-sm block font-medium text-gray-700">
                    Steve Jebs
                  </span>
                  <span className="text-xs text-gray-500 block ">2시간 전</span>
                  <p className="text-gray-700 mt-2">
                    The best mandu restaurant is the one next to my house.
                  </p>
                </div>
              </div>
            ))}
            {
              // 답변이 없을 경우
              answers.length === 0 && (
                <div className="h-full grid place-items-center bg-gray-100">
                  <p className="text-gray-500 text-sm">아직 답변이 없습니다</p>
                </div>
              )
            }
          </div>

          <div className="space-y-2">
            <LabelTextarea
              labelName="답변 달기"
              rows={3}
              placeholder="답변을 달아보세요."
            />
            <Button layoutMode="fullWidth">등록</Button>
          </div>
        </section>
      </div>
    </TabLayout>
  );
}

export async function getStaticPaths() {
  const posts = await getPostsIds();

  const paths = posts.map((post) => ({
    params: {
      id: post.id,
    },
  }));

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }: GetStaticPropsContext) {
  const queryClient = getQueryClient();

  const id = Array.isArray(params?.id) ? params?.id[0] : params?.id;

  if (id) {
    await queryClient.prefetchQuery([queryKeys.getPost, id], () => getPost(id));
  }

  return {
    props: {
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
    },
  };
}
