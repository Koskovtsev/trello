import { RefObject, useEffect } from 'react';

export function useClickOutside(modalRef: RefObject<HTMLElement>, callback: () => void): void {
  useEffect(() => {
    const listener = (event: MouseEvent): void => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        callback();
      }
    };
    document.addEventListener('mousedown', listener);
    return (): void => {
      document.removeEventListener('mousedown', listener);
    };
  }, [modalRef, callback]);
}
