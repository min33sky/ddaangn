import { useDateDistance } from '@/hooks/useDateDistance';
import { Author } from '@/lib/api/community';
import Image from 'next/image';
import React from 'react';

interface Props {
  id: string;
  answer: string;
  user: Author;
  createdAt: string;
  updatedAt: string;
}

export default function AnswerItem({
  answer,
  user,
  createdAt,
  updatedAt,
}: Props) {
  const formattedDate = useDateDistance(createdAt);

  return (
    <div className="flex items-start space-x-3">
      {user.image ? (
        <figure className="relative w-8 h-8 rounded-full overflow-hidden">
          <Image
            src={user.image}
            alt="avatar"
            layout="fill"
            objectFit="contain"
          />
        </figure>
      ) : (
        <div className="w-8 h-8 bg-slate-200 rounded-full" />
      )}
      <div className="flex flex-col">
        <div className="flex items-center space-x-2">
          <span className="text-sm block font-medium text-gray-700">
            {user.name}
          </span>
          <span className="text-xs text-gray-500 block ">{formattedDate}</span>
        </div>
        <p className="text-gray-700 mt-2">{answer}</p>
      </div>
    </div>
  );
}
