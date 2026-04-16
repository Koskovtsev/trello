import { Portal } from '../Portal';
import './deleteButtonModal.scss';

interface IDeleteItemProps {
  active: boolean;
  setActive(isActive: boolean): void;
  onItemDeleted(isDeleted: boolean): void;
}
export function DeleteItemModal({ active, setActive, onItemDeleted }: IDeleteItemProps): JSX.Element | null {
  if (!active) return null;
  return (
    <Portal>
      <div className="modal__confirm">
        <span>Видалити?</span>
        <div className="button_wrapper">
          <button
            className="button_delete"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              onItemDeleted(true);
              setActive(false);
            }}
          >
            Так
          </button>
          <button
            className="button_cancel"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setActive(false);
            }}
          >
            Ні
          </button>
        </div>
      </div>
    </Portal>
  );
}
