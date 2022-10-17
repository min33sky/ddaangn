import { useDialog } from '@/contexts/DialogContext';
import { useCallback } from 'react';

const descripionMap = {
  restricted: 'You are not allowed to access this page.',
  'not-ready': 'This page is not ready yet.',
};

export default function useOpenAlertDialog() {
  const { openDialog } = useDialog();

  const openAlertDialog = useCallback(
    (type: keyof typeof descripionMap) => {
      openDialog({
        title: '경고',
        description: descripionMap[type],
        confirmText: '확인',
        mode: 'confirm',
      });
    },
    [openDialog],
  );

  return openAlertDialog;
}
