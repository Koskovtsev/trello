import { useState } from 'react';
import { ICard } from '../../../../common/interfaces/ICard';
import { IDragEvent } from '../../../../common/interfaces/IDragEvent';
import { ChangeTitleForm } from '../ChangeTitle/ChangeTitleForm';
import { useCard } from './hooks/useCard';
import { CardMenuModal } from './components/CardMenu/CardMenuModal';
import { getTexture } from '../../../../components/Textures/TextureList';
import './card.scss';

interface ICardChangeProps {
  cardData: ICard;
  boardId: number;
  listId: number;
  // onListChanged(): void;
  onItemDragged(draggedElement: IDragEvent): void;
}

export function Card(props: ICardChangeProps): JSX.Element {
  const { boardId, listId, onItemDragged, cardData } = props;
  const [isVisibleChangeCardTitle, setVisibleChangeCardTitle] = useState(false);
  const [menuCoords, setMenuCoords] = useState<{ top: number; left: number } | null>(null);
  const [isVisibleMenuOptions, setVisibleMenuOptions] = useState(false); // TODO: багато стейтів, які можна було б винести в компоненти які їх використовують.

  const { handleCheckedCard } = useCard({ boardId, listId, cardId: cardData.id!, cardData });
  const { handleDeleteCard } = useCard({ boardId, cardId: cardData.id! });
  const { handleChangeTitle } = useCard({ boardId, listId, cardId: cardData.id!, cardData });

  const triggerEditTitle = (): void => {
    setVisibleChangeCardTitle(true);
    setVisibleMenuOptions(false);
  };

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
    e.dataTransfer.setData('cardId', `${cardData.id}`);
    e.dataTransfer.setData('listId', `${listId}`);
    e.stopPropagation();
  };
  const onDragEnd = (e: React.DragEvent<HTMLDivElement>): void => {
    e.stopPropagation();
  };
  const onDragEnter = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
  };
  const onDragLeave = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
  };
  const onDragOver = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
  };
  const onDrop = (e: React.DragEvent<HTMLDivElement>): void => {
    const draggedCardId = +e.dataTransfer.getData('cardId');
    const sourceListId = +e.dataTransfer.getData('listId');
    const draggedItemPositions: IDragEvent = {
      draggedId: draggedCardId,
      targetId: cardData.id!,
      sourceContainerId: sourceListId,
      targetContainerId: listId,
    };
    if (draggedCardId) onItemDragged(draggedItemPositions);
    e.stopPropagation();
  };

  return (
    <div
      className="empty-list"
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
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
            {!isVisibleChangeCardTitle && <span className="card__checkbox_title">{cardData.title}</span>}
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
            onChangeTitle={triggerEditTitle}
            card={cardData}
            listId={listId}
          />
        </div>
      </div>
    </div>
  );
}
