import { useState } from 'react';
import { ICard } from '../../../../common/interfaces/ICard';
import { ChangeTitleForm } from '../ChangeTitle/ChangeTitleForm';
import { useCard } from './hooks/useCard';
import { CardMenuModal } from './components/CardMenu/CardMenuModal';
import { getTexture } from '../../../../components/Textures/TextureList';
import { useDragDrop } from '../../context/DragDropContext';
import { useCardDragDrop } from './hooks/useCardDragDrop';
import './card.scss';

interface ICardChangeProps {
  cardData: ICard;
  listId: number;
  onHover(id: number, listId: number): void;
  onDragStarted(id: number | null): void;
  onDragEnded(): void;
}

export function Card(props: ICardChangeProps): JSX.Element {
  const dragDrop = useDragDrop();
  const { draggedCardId } = dragDrop;
  const { listId, cardData, onHover, onDragStarted, onDragEnded } = props;
  const [isVisibleChangeCardTitle, setVisibleChangeCardTitle] = useState(false);
  const [menuCoords, setMenuCoords] = useState<{ top: number; left: number } | null>(null);
  const [isVisibleMenuOptions, setVisibleMenuOptions] = useState(false);

  const { handleDeleteCard, handleCheckedCard, handleChangeTitle } = useCard({
    listId,
    cardId: cardData.id!,
    cardData,
  });

  const handleOpenMenu = (e: React.MouseEvent<HTMLButtonElement>): void => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMenuCoords({
      top: rect.top + window.scrollY,
      left: rect.left + window.scrollX,
    });
    setVisibleMenuOptions(true);
  };

  const currentTexture = getTexture(cardData?.custom?.background ?? '');

  const { handleDragStart, handleDragEnd, handleDragEnter, handleDragLeave, handleDragOver, handleDrop } =
    useCardDragDrop({
      cardId: cardData.id!,
      listId,
      onHover,
      onDragStarted,
      onDragEnded,
    });

  return (
    <div
      className="empty-Card_list"
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className={`card__item_wrapper ${draggedCardId === cardData.id ? 'card__item_wrapper-dragging' : ''}`}>
        <div
          className="card__item"
          style={{ backgroundImage: `url(${currentTexture})`, zIndex: isVisibleMenuOptions ? 300 : 5 }}
          draggable={!isVisibleChangeCardTitle}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <li>
            <label className="card__label">
              <input
                type="checkbox"
                className="card__checkbox"
                checked={!!cardData.custom?.isChecked}
                onChange={handleCheckedCard}
              />
              {!isVisibleChangeCardTitle && (
                <span
                  className="card__checkbox_title"
                  onClick={() => {
                    handleCheckedCard();
                  }}
                >
                  {cardData.title}
                </span>
              )}
              {isVisibleChangeCardTitle && (
                <ChangeTitleForm
                  onTitleChanged={(newTitle) => handleChangeTitle(newTitle, setVisibleChangeCardTitle)}
                  currentTitle={cardData.title ?? ''}
                  onCancel={() => setVisibleChangeCardTitle(false)}
                />
              )}
            </label>
          </li>
          <div className="button__card-change_wrapper">
            <button className="button__menu_options" aria-label="Change card title" onClick={handleOpenMenu}>
              <i className="fa fa-pencil-alt" />
            </button>
            <CardMenuModal
              isOpen={isVisibleMenuOptions}
              onClose={() => setVisibleMenuOptions(false)}
              coords={menuCoords}
              onDeleteCard={handleDeleteCard}
              onChangeTitle={() => {
                setVisibleChangeCardTitle(true);
                setVisibleMenuOptions(false);
              }}
              card={cardData}
              listId={listId}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
