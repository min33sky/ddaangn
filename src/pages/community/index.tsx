import PostItem from '@/components/community/PostItem';
import TabLayout from '@/components/layout/TabLayout';
import FloatCreateButton from '@/components/product/FloatCreateButton';
import { queryKeys } from '@/constants';
import useGetPosts from '@/hooks/community/useGetPosts';
import { getPosts } from '@/lib/api/community';
import getQueryClient from '@/lib/queryClient';
import { dehydrate } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import React from 'react';

export default function CommunityPage() {
  const { data: session } = useSession();

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

        {session && <FloatCreateButton type="community" />}
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
