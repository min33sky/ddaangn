import PostItem from '@/components/community/PostItem';
import TabLayout from '@/components/layout/TabLayout';
import { queryKeys } from '@/constants';
import useGetPosts from '@/hooks/community/useGetPosts';
import { getPosts } from '@/lib/api/community';
import getQueryClient from '@/lib/queryClient';
import { dehydrate } from '@tanstack/react-query';
import Link from 'next/link';
import React from 'react';

export default function CommunityPage() {
  const { data: posts } = useGetPosts({
    onSuccess: () => {
      console.log('Posts fetched successfully');
    },
  });

  return (
    <TabLayout>
      <div className="py-10 space-y-8">
        {posts?.map((post) => (
          <Link key={post.id} href={`/community/${post.id}`}>
            <a>
              <PostItem {...post} />
            </a>
          </Link>
        ))}

        <button className="fixed hover:bg-orange-500 transition-colors cursor-pointer  bottom-24 right-5 shadow-xl bg-orange-400 rounded-full p-4 text-white">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            ></path>
          </svg>
        </button>
      </div>
    </TabLayout>
  );
}

export async function getStaticProps() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery([queryKeys.getPosts], () => getPosts());

  return {
    props: {
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
    },
  };
}
