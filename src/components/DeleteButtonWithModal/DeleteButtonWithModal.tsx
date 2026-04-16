import { useState } from 'react';
import { DeleteItemModal } from './DeleteItemModal';

interface IDeleteButtonProps {
  onDeletedItem(isDelete: boolean): void;
}
export function DeleteButtonWithModal({ onDeletedItem }: IDeleteButtonProps): JSX.Element {
  const [deleteItemModalActive, setDeleteItemModalActive] = useState(false);
  return (
    <>
      <button
        className="home__button_delete-item"
        aria-label="Delete"
        onClick={(e) => {
          setDeleteItemModalActive(true);
          e.stopPropagation();
          e.preventDefault();
        }}
      >
        <i className="fa fa-trash" />
      </button>
      <DeleteItemModal
        active={deleteItemModalActive}
        setActive={setDeleteItemModalActive}
        onItemDeleted={onDeletedItem}
      />
    </>
  );
}
