import { useRef, useState } from 'react';
import { useClickOutside } from '../../../../../../hooks/useClickOutside';
import { Portal } from '../../../../../../components/Portal';
import './cardMenuModal.scss';
import { ConfirmModal } from '../../../../../../components/DeleteButtonWithModal/ConfirmModal';

interface ICardMenuProps {
  isOpen: boolean;
  onClose: () => void;
  coords: { top: number; left: number } | null;
  onDeleteCard(): void;
  onChangeTitle(): void;
  onCardDetailOpen(): void;
}
export function CardMenuModal({
  isOpen,
  onClose,
  coords,
  onDeleteCard,
  onChangeTitle,
  onCardDetailOpen,
}: ICardMenuProps): JSX.Element | null {
  const menuRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setModalActive] = useState(false);
  useClickOutside(menuRef, () => {
    if (!isModalOpen) {
      onClose();
    }
  });
  if (!isOpen || !coords) return null;
  return (
    <Portal>
      <div className="card-menu__overlay">
        <div
          ref={menuRef}
          className="card-menu__content"
          style={{
            position: 'absolute',
            top: `${coords.top - 15}px`,
            left: `${coords.left + 20}px`,
            zIndex: 1000,
          }}
        >
          <div className="menu__options_header">
            <button
              className="menu__options_button change-title"
              onClick={() => {
                onChangeTitle();
              }}
            >
              Редагувати назву
            </button>
            <button
              className="menu__options_button open-card"
              onClick={() => {
                onClose();
                onCardDetailOpen();
              }}
            >
              Відкрити картку
            </button>
            <button
              className="menu__options_button open-textures"
              aria-label="Change Texture"
              onClick={() => {
                // eslint-disable-next-line no-console
                console.log(`TODO: change texture here.`);
              }}
            >
              <span className="open-textures_title">Змінення обкладинки</span>
              <div className="open-textures_logo" />
            </button>
            <button className="menu__options_button open-card" onClick={() => setModalActive(true)}>
              Видалити картку
            </button>
            <ConfirmModal isOpen={isModalOpen} onClose={setModalActive} onConfirm={onDeleteCard} />
          </div>
        </div>
      </div>
    </Portal>
  );
}
