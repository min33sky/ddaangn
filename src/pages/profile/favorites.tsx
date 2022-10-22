import TabLayout from '@/components/layout/TabLayout';
import Card from '@/components/product/Card';
import { queryKeys } from '@/constants';
import useGetFavorites from '@/hooks/user/useGetFavorites';
import getQueryClient from '@/lib/queryClient';
import { userService } from '@/services/userService';
import { dehydrate } from '@tanstack/react-query';
import { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';
import Head from 'next/head';
import React from 'react';

export default function FavoritesPage() {
  const { data: favorites } = useGetFavorites();

  return (
    <TabLayout>
      <Head>
        <title>관심 목록 | Daangn</title>
      </Head>
      <div className="flex flex-col space-y-5 py-10">
        {favorites?.map((data) => (
          <Card key={data.id} {...data.product} />
        ))}
      </div>
    </TabLayout>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const queryClient = getQueryClient();
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/?callbackUrl=/profile/favorites',
        permanent: false,
      },
    };
  }

  await queryClient.prefetchQuery([queryKeys.getFavorites], () =>
    userService.getFavorites(session.user.id),
  );

  return {
    props: {
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
    },
  };
}
