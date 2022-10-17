import { createPortal } from 'react-dom';

interface Props {
  selector?: string;
  children: React.ReactNode;
}

/**
 * Portal Component
 * @property {string} selector - selector to render portal
 * @property {React.ReactNode} children - component to render inside portal
 */
export default function Portal({ selector = '#portal', children }: Props) {
  const portalElement =
    typeof window !== 'undefined' && document.querySelector(selector);

  return portalElement ? createPortal(children, portalElement) : null;
}
