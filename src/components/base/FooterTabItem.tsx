import useOpenLoginDialog from '@/hooks/useOpenLoginDialog';
import {
  ChatBubbleOvalLeftEllipsisIcon,
  GlobeAsiaAustraliaIcon,
  HomeIcon,
  UserIcon,
  VideoCameraIcon,
} from '@heroicons/react/24/outline';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { createElement } from 'react';

const iconMap = {
  home: HomeIcon,
  community: GlobeAsiaAustraliaIcon,
  chat: ChatBubbleOvalLeftEllipsisIcon,
  live: VideoCameraIcon,
  me: UserIcon,
};

interface Props {
  icon: keyof typeof iconMap;
  title: string;
  to: string;
}

/**
 * FooterTabItem
 * @summary 하단에 위치하는 탭 네비게이션의 아이템
 * @property icon - 아이콘 이름
 * @property title - 탭 이름
 * @property to - 이동할 경로
 */
export default function FooterTabItem({ icon, title, to }: Props) {
  const router = useRouter();
  const iconElement = createElement(iconMap[icon]);
  const isActive = router.pathname === to;
  const { data: session } = useSession();
  const openLoginDIalog = useOpenLoginDialog();

  const handleClick = (e: React.MouseEvent) => {
    if (!session) {
      e.preventDefault();
      openLoginDIalog('profile');
    }
  };

  return (
    <Link href={to}>
      <a
        className={`flex flex-1 items-center justify-center flex-col ${
          isActive && 'text-orange-500'
        }`}
        onClick={handleClick}
      >
        <figure className="h-5 w-5">{iconElement}</figure>
        <p>{title}</p>
      </a>
    </Link>
  );
}
