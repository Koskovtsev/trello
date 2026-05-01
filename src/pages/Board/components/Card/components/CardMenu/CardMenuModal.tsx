import { useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useClickOutside } from '../../../../../../hooks/useClickOutside';
import { Portal } from '../../../../../../components/Portal';
import { ConfirmModal } from '../../../../../../components/DeleteButtonWithModal/ConfirmModal';
import { ICard } from '../../../../../../common/interfaces/ICard';
import { useBoard } from '../../../../hooks/useBoard';
import './cardMenuModal.scss';

interface ICardMenuProps {
  isOpen: boolean;
  onClose: () => void;
  coords: { top: number; left: number } | null;
  onDeleteCard(): void;
  onChangeTitle(): void;
  card: ICard;
  listId: number;
}
export function CardMenuModal({
  isOpen,
  onClose,
  coords,
  onDeleteCard,
  onChangeTitle,
  card,
  listId,
}: ICardMenuProps): JSX.Element | null {
  const menuRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setModalActive] = useState(false);
  const navigate = useNavigate();
  const { boardId } = useParams();
  useClickOutside(menuRef, () => {
    if (!isModalOpen) {
      onClose();
    }
  });
  const { handleTextureModal } = useBoard(Number(boardId));
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
                navigate(`/board/${boardId}/card/${card.id}`);
              }}
            >
              Відкрити картку
            </button>
            <button
              className="menu__options_button open-textures"
              aria-label="Change Texture"
              onClick={(e) => {
                onClose();
                handleTextureModal(e, {
                  type: 'card',
                  boardId: Number(boardId),
                  listId,
                  cardId: card.id!,
                });
                // eslint-disable-next-line no-console
                // console.log(`trying to call modal: boardId:${Number(boardId)}, listId: ${listId} cardId: ${card.id!}.`);
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
