import { createPortal } from 'react-dom';

export function Portal({ children }: { children: React.ReactNode }): React.ReactPortal | null {
  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) return null;
  return createPortal(children, modalRoot);
}
