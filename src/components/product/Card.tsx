import { currencyFormat } from '@/lib/currencyFormat';
import { Product } from '@prisma/client';
import Image from 'next/image';
import React from 'react';

interface Props extends Product {
  _count: {
    favorites?: number;
    deals?: number;
  };
}

export default function Card({
  price,
  description,
  image,
  name,
  _count,
}: Props) {
  return (
    <article className="flex px-4 pt-5 cursor-pointer justify-between">
      <div className="flex space-x-4">
        <figure className="relative rounded-md w-20 h-20">
          <Image
            src={image}
            alt="product image"
            layout="fill"
            objectFit="contain"
          />
        </figure>
        {/* <div className="w-20 h-20 bg-gray-400 rounded-md" /> */}
        <div className="pt-2 flex flex-col">
          <h3 className="text-sm font-medium text-gray-900">{name}</h3>
          <span className="text-xs text-gray-500">{description}</span>
          <span className="font-medium mt-1 text-gray-900">
            {currencyFormat(price)}
          </span>
        </div>
      </div>

      <div className="flex space-x-2 items-end justify-end">
        <div className="flex space-x-0.5 items-center text-sm  text-gray-600">
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
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            ></path>
          </svg>
          <span>{_count.favorites || _count.deals}</span>
        </div>

        <div className="flex space-x-0.5 items-center text-sm  text-gray-600">
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
          <span>1</span>
        </div>
      </div>
    </article>
  );
}
