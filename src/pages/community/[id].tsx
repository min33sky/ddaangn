import AnswerItem from '@/components/community/AnswerItem';
import TabLayout from '@/components/layout/TabLayout';
import Button from '@/components/system/Button';
import LabelTextarea from '@/components/system/LabelTextarea';
import { queryKeys } from '@/constants';
import useCreateAnswer from '@/hooks/community/useCreateAnswer';
import useGetPost from '@/hooks/community/useGetPost';
import useToggleCuriosity from '@/hooks/community/useToggleCuriosity';
import { useDateDistance } from '@/hooks/useDateDistance';
import { GetPost, getPost, getPostsIds } from '@/lib/api/community';
import getQueryClient from '@/lib/queryClient';
import { postsService } from '@/services/postsService';
import { zodResolver } from '@hookform/resolvers/zod';
import { dehydrate, useQueryClient } from '@tanstack/react-query';
import { GetStaticPropsContext } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

const AnswerSchema = z.object({
  answer: z.string().min(1).max(200).trim(),
});

type AnserInput = z.infer<typeof AnswerSchema>;

export default function CommunityPostDetail() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const id = router.query.id as string;

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<AnserInput>({
    resolver: zodResolver(AnswerSchema),
  });

  const { data } = useGetPost(id, {
    onSuccess(data) {
      console.log('Post fetched successfully');
    },
  });

  const { mutate: mutateCuriosity, isLoading: isCuriosityLoading } =
    useToggleCuriosity({
      async onMutate(data) {
        queryClient.cancelQueries([queryKeys.getPost, id]);

        const previousPost = queryClient.getQueryData([queryKeys.getPost, id]);

        queryClient.setQueryData(
          [queryKeys.getPost, id],
          (oldQueryData: GetPost | undefined) => {
            if (!oldQueryData) return undefined;

            return {
              ...oldQueryData,
              user: {
                ...oldQueryData.user,
                curiosities: {
                  ...(oldQueryData.user.curiosities.length > 0
                    ? []
                    : [
                        {
                          postId: id,
                        },
                      ]),
                },
              },
              _count: {
                ...oldQueryData._count,
                curious:
                  oldQueryData.user.curiosities.length !== 0
                    ? oldQueryData._count.curiosities - 1
                    : oldQueryData._count.curiosities + 1,
              },
            };
          },
        );

        return previousPost;
      },

      onError(error, variables, context) {
        queryClient.setQueryData([queryKeys.getPost, id], context);
      },

      onSettled() {
        queryClient.invalidateQueries([queryKeys.getPost, id]);
      },
    });

  const { mutate: mutateAnser, isLoading: isAnswerLoading } = useCreateAnswer({
    onSuccess(data) {
      queryClient.invalidateQueries([queryKeys.getPost, id]);
      reset({ answer: '' });
    },
  });

  if (!data) return <div>Loading...</div>;

  const toggleCuriosity = () => {
    if (isCuriosityLoading) return;
    mutateCuriosity(id);
  };

  const onValid: SubmitHandler<AnserInput> = ({ answer }) => {
    if (isAnswerLoading) return;
    mutateAnser({ id, answer });
  };

  const { user, question, answers, _count } = data;

  return (
    <TabLayout>
      <div className="flex flex-col flex-1">
        <span className="cursor-pointer inline-flex w-fit my-3 ml-4 items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-800">
          ????????????
        </span>

        {/* ?????? ?????? ????????? ?????? */}
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

        {/* ???????????? */}
        <div>
          <div className="mt-2 px-4 text-gray-700">
            <span className="text-orange-500 font-medium">Q.</span> {question}
          </div>
          <div className="flex px-4 space-x-5 mt-3 text-gray-700 py-2.5 border-t border-b-[2px]  w-full">
            {/* ???????????? */}
            <button
              onClick={toggleCuriosity}
              className={`
                flex items-center space-x-2 text-sm
                ${user.curiosities.length > 0 ? 'text-purple-600' : ''}
              `}
            >
              <svg
                className="h-4 w-4"
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
              <span>???????????? {_count.curiosities || 0}</span>
            </button>

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
              <span>?????? {_count.answers}</span>
            </span>
          </div>
        </div>

        <section className="flex flex-col flex-1">
          <div className="my-2 space-y-5 flex-1 ">
            {answers.map((answer) => (
              <AnswerItem key={answer.id} {...answer} />
            ))}
            {
              // ????????? ?????? ??????
              answers.length === 0 && (
                <div className="h-full grid place-items-center bg-gray-100">
                  <p className="text-gray-500 text-sm">
                    ?????? ??? ????????? ?????? ????????? ????????????. ????
                  </p>
                </div>
              )
            }
          </div>

          <form
            onSubmit={handleSubmit(onValid)}
            className="space-y-2 sticky bottom-0 bg-white"
          >
            <LabelTextarea
              {...register('answer')}
              labelName="?????? ??????"
              rows={2}
              placeholder="????????? ???????????????."
            />
            <Button disabled={isAnswerLoading} layoutMode="fullWidth">
              ??????
            </Button>
          </form>
        </section>
      </div>
    </TabLayout>
  );
}

export async function getStaticPaths() {
  // const posts = await getPostsIds();
  const posts = await postsService.getPostsIds();

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
    await queryClient.prefetchQuery([queryKeys.getPost, id], () =>
      postsService.getPost(id),
    );
  }

  return {
    props: {
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
    },
  };
}
