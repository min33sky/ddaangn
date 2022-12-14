import TabLayout from '@/components/layout/TabLayout';
import { queryKeys } from '@/constants';
import useFavoriteProduct from '@/hooks/products/useFavoriteProduct';
import useGetProduct from '@/hooks/products/useGetProduct';
import {
  GetProduct,
  getProduct,
  getProductsIds,
  GetProductWithOwner,
} from '@/lib/api/products';
import { currencyFormat } from '@/lib/currencyFormat';
import getQueryClient from '@/lib/queryClient';
import { dehydrate, useQueryClient } from '@tanstack/react-query';
import { GetServerSidePropsContext } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React from 'react';
import { productsService } from '@/services/productsService';
import { getSession } from 'next-auth/react';

export default function ItemDetailPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const id = router.query.id as string;

  const { data } = useGetProduct(id, {
    onSuccess: () => {
      console.log('Product fetched successfully');
    },
    staleTime: 0,
    // cacheTime: 0,
  });

  const { mutate } = useFavoriteProduct({
    async onMutate(data) {
      await queryClient.cancelQueries([queryKeys.getProduct, id]);
      const previousProduct = queryClient.getQueryData([
        queryKeys.getProduct,
        id,
      ]);

      queryClient.setQueryData(
        [queryKeys.getProduct, id],
        (oldQueryData: GetProduct | undefined) => {
          if (!oldQueryData) return undefined;
          return {
            ...oldQueryData,
            isLiked: !oldQueryData.isLiked,
          };
        },
      );
      return previousProduct;
    },
    onError(error, variables, context) {
      queryClient.setQueryData([queryKeys.getProduct, id], context);
    },
    onSettled() {
      queryClient.invalidateQueries([queryKeys.getProduct, id]);
    },
  });

  if (!data) {
    return <div>Loading...</div>;
  }

  const { product, relatedProducts } = data;

  const toggleFavorite = () => {
    mutate(id);
  };

  return (
    <TabLayout>
      <div className="px-2 py-2">
        <section className="mb-8">
          {product?.image ? (
            <figure className="relative h-96">
              <Image
                src={product.image}
                layout="fill"
                objectFit="contain"
                alt="product image"
              />
            </figure>
          ) : (
            <div className="h-96 bg-slate-300" />
          )}
          <div className="flex cursor-pointer py-3 border-t border-b items-center space-x-3">
            {product?.owner.image ? (
              <figure className="w-12 h-12 relative rounded-full overflow-hidden">
                <Image src={product.owner.image} layout="fill" alt="avatar" />
              </figure>
            ) : (
              <div className="w-12 h-12 rounded-full bg-slate-300" />
            )}

            <div>
              <p className="text-sm font-medium text-gray-700">
                {product?.owner.name}
              </p>
              <p className="text-xs font-medium text-gray-500">
                View profile &rarr;
              </p>
            </div>
          </div>

          <div className="mt-5">
            <h1 className="text-2xl font-bold text-gray-900">
              {product?.name}
            </h1>
            <span className="text-3xl block mt-3 text-gray-900">
              {currencyFormat(product?.price || 0)}
            </span>
            <p className=" my-6 text-gray-700">{product?.description}</p>
            <div className="flex items-center justify-between space-x-2">
              <button className="flex-1 bg-orange-500 text-white py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 font-medium hover:bg-orange-600 focus:ring-orange-500 ">
                ??????????????? ????????????
              </button>

              {/* ????????? ?????? */}
              <button
                onClick={toggleFavorite}
                className={`
                flex items-center justify-center rounded-md p-3 hover:bg-gray-100
                ${
                  data.isLiked
                    ? 'text-red-400 hover:text-red-500'
                    : 'text-gray-400  hover:text-gray-500'
                }`}
              >
                <svg
                  className={`h-7 w-7 ${data.isLiked && 'fill-red-400'}`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </section>

        <div>
          <h2 className="text-2xl font-bold text-gray-900">?????? ?????????</h2>
          <div className=" mt-6 grid grid-cols-2 gap-4">
            {relatedProducts.map((product) => (
              <div key={product.id}>
                <div className="h-56 w-full mb-4 bg-slate-300" />
                <h3 className="text-gray-700 -mb-1">{product.name}</h3>
                <span className="text-sm font-medium text-gray-900">
                  {currencyFormat(product.price)}
                </span>
              </div>
            ))}
            {relatedProducts.length === 0 && (
              <div className="text-gray-700 font-semibold">
                ?????? ????????? ????????????...
              </div>
            )}
          </div>
        </div>
      </div>
    </TabLayout>
  );
}

// export async function getStaticPaths() {
//   const products = await productsService.getProductsIds();

//   const paths = products.map((product) => ({
//     params: { id: product.id },
//   }));

//   return {
//     paths,
//     fallback: false,
//   };
// }

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const queryClient = getQueryClient();
  const session = await getSession(context);

  const { params } = context;

  const id = Array.isArray(params?.id) ? params?.id[0] : params?.id;

  console.log('??????~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~: ', session);

  if (id) {
    await queryClient.prefetchQuery([queryKeys.getProduct, id], () =>
      productsService.getProduct({
        productId: id,
        userId: session?.user.id,
      }),
    );
  }

  return {
    props: {
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
    },
  };
}
