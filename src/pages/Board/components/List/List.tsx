import { useState } from 'react';
import { IList } from '../../../../common/interfaces/IList';
import { ICard } from '../../../../common/interfaces/ICard';
import { Card } from '../Card/Card';
import { useDragDrop } from '../../context/DragDropContext';
import { ChangeTitleForm } from '../ChangeTitle/ChangeTitleForm';
import { useList } from './hooks/useList';
import { DeleteAction } from '../../../../components/DeleteButtonWithModal/DeleteAction';
import { useBoard } from '../../hooks/useBoard';
import { getTexture } from '../../../../components/Textures/TextureList';
import { AddCardForm } from '../AddCard/AddCardForm';
import { useBoardInfo } from '../../context/BoardInfoContext';
import { useListDragDrop } from './hooks/useListDragDrop';
import './list.scss';

type DragType = 'list' | 'card' | null;

interface IAddCardChangesProps extends IList {
  onHover(id: number): void;
  onDragStarted(id: number | null, type: DragType): void;
  onDragEnded(): void;
  currentPosition: number;
  onCardDragStarted(cardId: number | null, cardData: ICard, listId: number): void;
  onCardHover(cardId: number | null, listId: number): void;
}
export function List(props: IAddCardChangesProps): JSX.Element {
  const { id, title, cards, onHover, onDragStarted, onDragEnded, currentPosition, onCardDragStarted, onCardHover } =
    props;

  const { boardId, activeBoard } = useBoardInfo();
  const dragDrop = useDragDrop();
  const { draggedListId } = dragDrop;
  const [isVisibleChangeTitleForm, setVisibleChangeTitleForm] = useState(false);
  const [isVisibleAddCardForm, setVisibleAddCardForm] = useState(false);
  const currentTexture = getTexture(activeBoard.custom?.listTextures?.[id ?? 0] ?? 'gray');
  const { deleteListById, changeTitle } = useList({ boardId, listId: id! });
  const { handleTextureModal } = useBoard(boardId);
  const { handleDragStart, handleDragEnd, handleDragEnter, handleDragLeave, handleDragOver, handleDrop } =
    useListDragDrop({
      listId: id!,
      currentPosition,
      onHover,
      onCardHover,
      onDragStarted,
      onDragEnded,
    });
  if (!cards) return <>загрузка</>;
  return (
    <div
      className="empty-list"
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div
        className={`
        list__wrapper
        ${draggedListId === id ? 'list__wrapper_dragging' : ''}
  `}
      >
        <div
          className="list"
          style={{ backgroundImage: `url(${currentTexture})` }}
          draggable={!isVisibleChangeTitleForm}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="list__header">
            {!isVisibleChangeTitleForm && (
              <span className="list__title" onClick={() => setVisibleChangeTitleForm(true)}>
                {title}
              </span>
            )}
            {isVisibleChangeTitleForm && (
              <ChangeTitleForm
                onTitleChanged={(newTitle) => {
                  changeTitle(newTitle);
                  setVisibleChangeTitleForm(false);
                }}
                onCancel={() => setVisibleChangeTitleForm(false)}
                currentTitle={title ?? ''}
              />
            )}
            <button
              className="list__button_custom-icon"
              aria-label="Change Texture"
              onClick={(e) => handleTextureModal(e, { type: 'list', boardId, listId: id! })}
            >
              <span className="icon-wrapper" />
            </button>
          </div>
          <div className="list__cards">
            {cards?.map((elem) => (
              <Card
                key={elem.id}
                cardData={elem}
                listId={id!}
                onHover={(hoveredCardId, listId) => onCardHover(hoveredCardId, listId)}
                onDragStarted={(dragCardId) => {
                  onCardDragStarted(dragCardId, elem, id!);
                }}
                onDragEnded={onDragEnded}
              />
            ))}
          </div>
          {isVisibleAddCardForm && (
            <AddCardForm
              title={title ?? ''}
              onClose={() => setVisibleAddCardForm(false)}
              position={(cards?.length ?? 0) + 1}
              boardId={boardId}
              list_id={id ?? 0}
            />
          )}
          <div className="list__footer">
            <button className="button__add_card" onClick={() => setVisibleAddCardForm(true)}>
              ➕ додати картку
            </button>
            <DeleteAction onConfirm={deleteListById} />
          </div>
        </div>
      </div>
    </div>
  );
}
