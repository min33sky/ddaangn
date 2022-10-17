import Dialog from '@/components/system/Dialog';
import dynamic from 'next/dynamic';
import { createContext, useCallback, useContext, useState } from 'react';

const Portal = dynamic(() => import('@/components/system/Portal'), {
  ssr: false,
});

export interface DialogConfig {
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onClose?: () => void; //? 종료할 때 실행할 함수
  onConfirm?: () => void; //? 확인 버튼을 눌렀을 때 실행할 함수
  mode?: 'confirmCancel' | 'confirm';
}

interface DialogContextValue {
  openDialog: (config: DialogConfig) => void;
}

const DialogContext = createContext<DialogContextValue | null>(null);

interface Props {
  children: React.ReactNode;
}

export default function DialogProvider({ children }: Props) {
  //? 다이얼로그는 앱에서 하나만 보여지므로 visible은 useState로 관리하는 것이 편하다.
  const [visible, setVisible] = useState(false);
  const [config, setConfig] = useState<DialogConfig | null>(null);

  const openDialog = useCallback((config: DialogConfig) => {
    setConfig(config);
    setVisible(true);
  }, []);

  const closeDialog = useCallback(() => {
    config?.onClose?.();
    setVisible(false);
  }, [config]);

  const handleConfirm = useCallback(() => {
    config?.onConfirm?.();
    setVisible(false);
  }, [config]);

  return (
    <DialogContext.Provider value={{ openDialog }}>
      {children}
      <Portal>
        <Dialog
          visible={visible}
          title={config?.title ?? 'title'}
          description={config?.description ?? 'description'}
          confirmText={config?.confirmText}
          cancelText={config?.cancelText}
          onClose={closeDialog}
          onConfirm={handleConfirm}
          mode={config?.mode ?? 'confirm'}
        />
      </Portal>
    </DialogContext.Provider>
  );
}

export function useDialog() {
  const context = useContext(DialogContext);
  if (!context)
    throw new Error('useDialog must be used within a DialogProvider');
  return context;
}
