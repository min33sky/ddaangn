import { DialogConfig } from '@/contexts/DialogContext';
import Button from './Button';
import Modal from './Modal';

interface Props extends DialogConfig {
  visible: boolean;
}

/**
 * Dialog Component.
 *
 * @property {boolean} visible - show or hide dialog
 * @property {string} title - dialog title
 * @property {string} description - dialog description
 * @property {string} confirmText - confirm button text
 * @property {string} cancelText - cancel button text
 * @property {function} onClose - close dialog
 * @property {function} onConfirm - confirm dialog
 * @property {string} mode - dialog mode
 */
export default function Dialog({
  visible,
  title,
  description,
  confirmText,
  cancelText,
  onClose,
  onConfirm,
  mode,
}: Props) {
  return (
    <Modal visible={visible} onClose={onClose}>
      <h3 className="mb-2 text-lg font-semibold leading-normal text-gray-800">
        {title}
      </h3>

      <p className="mb-6 whitespace-pre-wrap text-base text-gray-600">
        {description}
      </p>

      <footer className="flex justify-end gap-2">
        {mode === 'confirmCancel' && (
          <Button variant="secondary" onClick={onClose}>
            {cancelText ?? '닫기'}
          </Button>
        )}
        <Button onClick={onConfirm}>{confirmText ?? '확인'}</Button>
      </footer>
    </Modal>
  );
}
