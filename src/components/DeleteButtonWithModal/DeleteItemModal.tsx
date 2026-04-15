import { Portal } from '../Portal';

interface IDeleteItemProps {
  active: boolean;
  setActive(isActive: boolean): void;
  onItemDeleted(isDeleted: boolean): void;
}
export function DeleteItemModal({ active, setActive, onItemDeleted }: IDeleteItemProps): JSX.Element | null {
  if (!active) return null;
  const handleDeleteItem = (): void => {
    onItemDeleted(true);
    setActive(false);
  };
  return (
    <Portal>
      <span>Видалити?</span>
      <button className="button_delete" onClick={handleDeleteItem}>
        Так
      </button>
      <button
        className="button_cancel"
        onClick={() => {
          setActive(false);
        }}
      >
        Ні
      </button>
    </Portal>
  );
}
