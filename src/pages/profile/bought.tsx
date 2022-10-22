import TabLayout from '@/components/layout/TabLayout';
import Card from '@/components/product/Card';
import { queryKeys } from '@/constants';
import useGetBought from '@/hooks/user/useGetBought';
import getQueryClient from '@/lib/queryClient';
import { userService } from '@/services/userService';
import { dehydrate } from '@tanstack/react-query';
import { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';
import React from 'react';

export default function BoughtPage() {
  const { data: boughtData } = useGetBought();

  return (
    <TabLayout>
      <div className="flex flex-col space-y-5 py-10">
        {boughtData?.map((data) => (
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
        destination: '/?callbackUrl=/profile/bought',
        permanent: false,
      },
    };
  }

  await queryClient.prefetchQuery([queryKeys.getDeals, 'Purchase'], () =>
    userService.getDeals({ userId: session.user.id, kind: 'Purchase' }),
  );

  return {
    props: {
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
    },
  };
}
