import { useRef } from 'react';
import { Portal } from '../Portal';
import { useClickOutside } from '../../hooks/useClickOutside';
import './deleteButtonModal.scss';

interface IDeleteItemProps {
  isOpen: boolean;
  onClose(isActive: boolean): void;
  onConfirm(isDeleted: boolean): void;
}
export function ConfirmModal({ isOpen, onClose, onConfirm }: IDeleteItemProps): JSX.Element | null {
  if (!isOpen) return null;
  const modalRef = useRef<HTMLDivElement>(null);
  useClickOutside(modalRef, () => {
    onClose(false);
  });
  return (
    <Portal>
      <div className="modal__confirm" ref={modalRef} onClick={(e) => e.stopPropagation()}>
        <span>Ви впевнені?</span>
        <div className="button_wrapper">
          <button
            className="button_confirm"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              onConfirm(true);
              onClose(false);
            }}
          >
            Так
          </button>
          <button
            className="button_cancel"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              onClose(false);
            }}
          >
            Ні
          </button>
        </div>
      </div>
    </Portal>
  );
}
