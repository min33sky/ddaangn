import TabLayout from '@/components/layout/TabLayout';
import Card from '@/components/product/Card';
import FloatCreateButton from '@/components/product/FloatCreateButton';
import { queryKeys } from '@/constants';
import useGetProducts from '@/hooks/products/useGetProducts';
import { getProducts } from '@/lib/api/products';
import getQueryClient from '@/lib/queryClient';
import { productsService } from '@/services/productsService';
import { dehydrate } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function Home() {
  const { data: session } = useSession();
  const { data: products } = useGetProducts({
    onSuccess: () => {
      console.log('Products fetched successfully');
    },
  });

  return (
    <TabLayout>
      <div className="flex flex-col space-y-5 py-10 divide-y">
        {products?.map((product) => (
          <Link href={`/products/${product.id}`} key={product.id}>
            <a>
              <Card {...product} />
            </a>
          </Link>
        ))}

        {/* 글쓰기 플롯 버튼 */}
        {session && <FloatCreateButton type="products" />}
      </div>
    </TabLayout>
  );
}

export async function getStaticProps() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery(
    [queryKeys.getProducts],
    productsService.getProducts,
  );

  return {
    props: {
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
    },
  };
}
