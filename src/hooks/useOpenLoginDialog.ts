import { useDialog } from '@/contexts/DialogContext';
import { useRouter } from 'next/router';
import { useCallback } from 'react';

const descriptionMap = {
  like: '이 글이 마음에 드시나요? 이 글을 다른 사람들에게도 추천하기 위해서 로그인을 해주세요.',
  comment: '댓글을 남기기 위해서는 로그인이 필요합니다.',
  commentLike: '이 댓글이 마음에 드세요? 로그인하고 좋아요를 눌러주세요.',
  bookmark: '나중에 또 보고 싶으신가요? 로그인하고 북마크를 해주세요.',
  profile: '내 정보를 확인하고 관리하려면 로그인이 필요합니다.',
};

export default function useOpenLoginDialog() {
  // const navigate = useNavigate();
  // const location = useLocation();
  const router = useRouter();
  const { openDialog } = useDialog();

  const openLoginDialog = useCallback(
    (type: keyof typeof descriptionMap) => {
      const description = descriptionMap[type];
      openDialog({
        title: '로그인이 필요합니다',
        description,
        confirmText: '로그인',
        onConfirm: () =>
          router.push(`/auth/signin?callbackUrl=${router.pathname}`), //? 로그인 후 현재 위치로 돌아오기 위한 설정
        mode: 'confirmCancel',
      });
    },
    [openDialog, router],
  );

  return openLoginDialog;
}
