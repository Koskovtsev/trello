import { useState } from 'react';
import { ConfirmModal } from './ConfirmModal';

interface IDeleteProps {
  onConfirm(isDelete: boolean): void;
}
export function DeleteAction({ onConfirm }: IDeleteProps): JSX.Element {
  const [isModalOpen, setModalActive] = useState(false);
  return (
    <>
      <button
        className="home__button_delete-item"
        aria-label="Delete"
        onClick={(e) => {
          setModalActive(true);
          e.stopPropagation();
          e.preventDefault();
        }}
      >
        <i className="fa fa-trash" />
      </button>
      <ConfirmModal isOpen={isModalOpen} onClose={setModalActive} onConfirm={onConfirm} />
    </>
  );
}
