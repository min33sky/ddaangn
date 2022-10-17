import { AnimatePresence, motion } from 'framer-motion';

interface Props {
  visible: boolean;
  onClose?: () => void;
}

/**
 * Modal Overlay
 * @property {boolean} visible - show or hide modal
 * @property {function} onClose - close modal
 */
export default function Overlay({ visible, onClose }: Props) {
  return (
    <AnimatePresence initial={false}>
      {visible && (
        <motion.div
          aria-label="Overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black"
          onClick={onClose}
        />
      )}
    </AnimatePresence>
  );
}
