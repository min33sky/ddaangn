import PostItem from '@/components/community/PostItem';
import TabLayout from '@/components/layout/TabLayout';
import FloatCreateButton from '@/components/product/FloatCreateButton';
import { queryKeys } from '@/constants';
import useGetPosts from '@/hooks/community/useGetPosts';
import useCoords from '@/hooks/useCoords';
import getQueryClient from '@/lib/queryClient';
import { postsService } from '@/services/postsService';
import { dehydrate } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

export default function CommunityPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { latitude, longitude } = useCoords();
  const [mode, setMode] = useState<'All' | 'Nearby'>('All');

  const { data: posts, refetch } = useGetPosts(
    {
      latitude: mode === 'Nearby' ? latitude : undefined,
      longitude: mode === 'Nearby' ? longitude : undefined,
    },
    {
      onSuccess: () => {
        console.log('Posts fetched successfully');
      },
    },
  );

  useEffect(() => {
    if (router.query['lagitude'] || router.query['longitude']) {
      setMode('Nearby');
    } else {
      setMode('All');
    }
  }, [refetch, router.query]);

  useEffect(() => {
    refetch();
  }, [mode, refetch]);

  if (!posts) {
    return <div>Loading...</div>;
  }

  console.log('*** posts ***: ', posts);

  return (
    <TabLayout>
      <nav className="flex space-x-4 justify-center">
        <Link href="/community">
          <a className="bg-orange-400 text-sm text-white py-1 px-3 rounded-full hover:bg-orange-500 transition">
            전체
          </a>
        </Link>
        <Link href={`/community?latitude=${latitude}&longitude=${longitude}`}>
          <a className="bg-orange-400 text-sm text-white py-1 px-3 rounded-full hover:bg-orange-500 transition">
            내 근처
          </a>
        </Link>
      </nav>

      <div className="mt-2 flex flex-col space-y-8">
        {posts.map((post) => (
          <Link key={post.id} href={`/community/${post.id}`}>
            <a>
              <PostItem {...post} />
            </a>
          </Link>
        ))}
      </div>

      {session && <FloatCreateButton type="community" />}
    </TabLayout>
  );
}

export async function getStaticProps() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery([queryKeys.getPosts], () =>
    postsService.getPosts({}),
  );

  return {
    props: {
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
    },
  };
}
