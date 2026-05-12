import { useState } from 'react';
import { ICard } from '../../../../common/interfaces/ICard';
import { ChangeTitleForm } from '../ChangeTitle/ChangeTitleForm';
import { useCard } from './hooks/useCard';
import { CardMenuModal } from './components/CardMenu/CardMenuModal';
import { getTexture } from '../../../../components/Textures/TextureList';
import './card.scss';

interface ICardChangeProps {
  cardData: ICard;
  boardId: number;
  listId: number;
  onHover(id: number, listId: number): void;
  onDragStarted(id: number | null): void;
  onDragEnded(): void;
  draggedCardId: number;
}

export function Card(props: ICardChangeProps): JSX.Element {
  const { boardId, listId, cardData, onHover, onDragStarted, onDragEnded, draggedCardId } = props;
  const [isVisibleChangeCardTitle, setVisibleChangeCardTitle] = useState(false);
  const [menuCoords, setMenuCoords] = useState<{ top: number; left: number } | null>(null);
  const [isVisibleMenuOptions, setVisibleMenuOptions] = useState(false);

  const { handleDeleteCard, handleCheckedCard, handleChangeTitle } = useCard({
    boardId,
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

  const onDragStart = (e: React.DragEvent<HTMLDivElement>): void => {
    e.stopPropagation();
    setTimeout(() => {
      if (cardData.id) {
        onDragStarted(cardData.id);
      }
    }, 0);
  };
  const onDragEnd = (e: React.DragEvent<HTMLDivElement>): void => {
    onDragStarted(null);
    e.stopPropagation();
  };
  const onDragEnter = (e: React.DragEvent<HTMLDivElement>): void => {
    e.stopPropagation();
  };
  const onDragLeave = (e: React.DragEvent<HTMLDivElement>): void => {
    e.stopPropagation();
  };
  const onDragOver = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    onHover(cardData.id!, listId);
  };
  const onDrop = (e: React.DragEvent<HTMLDivElement>): void => {
    e.stopPropagation();
    e.preventDefault();
    onDragEnded();
  };
  return (
    <div
      className="empty-Card_list"
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <div className={`card__item_wrapper ${draggedCardId === cardData.id ? 'card__item_wrapper-dragging' : ''}`}>
        <div
          className="card__item"
          style={{ backgroundImage: `url(${currentTexture})`, zIndex: isVisibleMenuOptions ? 300 : 5 }}
          draggable={!isVisibleChangeCardTitle}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
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
