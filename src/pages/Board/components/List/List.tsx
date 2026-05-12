import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { IList } from '../../../../common/interfaces/IList';
import { Card } from '../Card/Card';
import { IBoard } from '../../../../common/interfaces/IBoard';
import { ChangeTitleForm } from '../ChangeTitle/ChangeTitleForm';
import { AddCardForm } from '../AddCard/AddCardForm';
import { useList } from './hooks/useList';
import { DeleteAction } from '../../../../components/DeleteButtonWithModal/DeleteAction';
import { useBoard } from '../../hooks/useBoard';
import { getTexture } from '../../../../components/Textures/TextureList';
import { AppDispatch } from '../../../../store/store';
import './list.scss';
import { processListMoveThunk } from '../../../../store/boards/thunks';
import { ICard } from '../../../../common/interfaces/ICard';

interface IDragListPayload {
  listId: number;
  targetPosition: number;
  boardId: number;
}

type DragType = 'list' | 'card' | null;

interface IAddCardChangesProps extends IList {
  boardData: IBoard;
  boardId: number;
  onDataUpdate(): void;
  onHover(id: number): void;
  onDragStarted(id: number | null, type: DragType): void;
  onDragEnded(): void;
  currentPosition: number;
  currentDraggedListId: number;
  onCardDragStarted(cardId: number | null, cardData: ICard, listId: number): void;
  onCardHover(cardId: number | null, listId: number): void;
  draggedCardId: number;
  dragType: DragType;
}
export function List(props: IAddCardChangesProps): JSX.Element {
  const {
    id,
    title,
    cards,
    boardData,
    boardId,
    onDataUpdate,
    onHover,
    onDragStarted,
    onDragEnded,
    currentPosition,
    currentDraggedListId,
    onCardDragStarted,
    onCardHover,
    draggedCardId,
    dragType,
  } = props;
  const [isVisibleChangeTitleForm, setVisibleChangeTitleForm] = useState(false);
  const [isVisibleAddCardForm, setVisibleAddCardForm] = useState(false);
  const currentTexture = getTexture(boardData.custom?.listTextures?.[id ?? 0] ?? 'gray');
  const dispatch = useDispatch<AppDispatch>();
  const { deleteListById, changeTitle } = useList({ boardId, listId: id!, onRefreshList: onDataUpdate });
  const { handleTextureModal } = useBoard(boardId);
  if (!cards) return <>загрузка</>;
  // TODO: подумать чи можна зменшити чи перенести в інше місце драг-Н-дроп функції.
  const onDragStart = (e: React.DragEvent<HTMLDivElement>): void => {
    e.stopPropagation();
    e.dataTransfer.setData('text/plain', String(id));
    setTimeout(() => {
      if (id) {
        onDragStarted(id, 'list');
      }
    }, 0);
  };
  const onDragEnd = (e: React.DragEvent<HTMLDivElement>): void => {
    onDragStarted(null, null);
    onDragEnded();
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
    if (currentDraggedListId && currentDraggedListId !== id && dragType === 'list') {
      onHover(id!);
    }
    if (dragType === 'card' && draggedCardId) {
      onCardHover(null, id!);
    }
  };
  const onDrop = async (e: React.DragEvent<HTMLDivElement>): Promise<void> => {
    e.preventDefault();
    e.stopPropagation();
    if (dragType === 'card') {
      onDragEnded();
    } else {
      const sourceList = boardData.lists?.find((l) => l.id === currentDraggedListId);
      const sourcePosition = sourceList?.position;
      if (sourcePosition === currentPosition) return;
      const draggedItem: IDragListPayload = {
        listId: currentDraggedListId,
        targetPosition: currentPosition,
        boardId,
      };
      await dispatch(processListMoveThunk(draggedItem)).unwrap();
    }
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
        className={`
        list__wrapper
        ${currentDraggedListId === id ? 'list__wrapper_dragging' : ''}
  `}
      >
        <div
          className="list"
          style={{ backgroundImage: `url(${currentTexture})` }}
          draggable={!isVisibleChangeTitleForm}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
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
          <ul className="list__cards">
            {cards?.map((elem) => (
              <Card
                key={elem.id}
                cardData={elem}
                boardId={boardId}
                listId={id!}
                onHover={(hoveredCardId, listId) => onCardHover(hoveredCardId, listId)}
                onDragStarted={(dragCardId) => {
                  onCardDragStarted(dragCardId, elem, id!);
                }}
                onDragEnded={onDragEnded}
                draggedCardId={draggedCardId!}
              />
            ))}
          </ul>
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
