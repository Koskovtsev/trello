import { useState } from 'react';
import { IList } from '../../../../common/interfaces/IList';
import { Card } from '../Card/Card';
import { IDragEvent } from '../../../../common/interfaces/IDragEvent';
import { IBoard } from '../../../../common/interfaces/IBoard';
import { ChangeTitleForm } from '../ChangeTitle/ChangeTitleForm';
import { AddCardForm } from '../AddCard/AddCardForm';
import { useList } from './hooks/useList';
import { DeleteAction } from '../../../../components/DeleteButtonWithModal/DeleteAction';
import { useBoard } from '../../hooks/useBoard';
import { getTexture } from '../../../../components/Textures/TextureList';
import './list.scss';

interface IAddCardChangesProps extends IList {
  // onListChanged(position?: number, listId?: number): void;
  boardData: IBoard;
  boardId: number;
  onItemDragged(draggedElement: IDragEvent): void;
  onDataUpdate(): void;
}
export function List(props: IAddCardChangesProps): JSX.Element {
  const { id, title, cards, boardData, boardId, onItemDragged, onDataUpdate } = props;
  const [isVisibleChangeTitleForm, setVisibleChangeTitleForm] = useState(false);
  const [isVisibleAddCardForm, setVisibleAddCardForm] = useState(false);
  const currentTexture = getTexture(boardData.custom?.listTextures?.[id ?? 0] ?? 'gray');
  const { deleteListById } = useList({ boardId, listId: id!, onRefreshList: onDataUpdate });
  const { changeTitle } = useList({ boardId, listId: id!, onRefreshList: onDataUpdate });
  const { handleTextureModal } = useBoard(boardId);
  const handleCardAdded = (): void => {
    onDataUpdate(); // TODO: переробить на редакс зміни.
    setVisibleAddCardForm(false);
  };
  // TODO: подумать чи можна зменшити чи перенести в інше місце драг-Н-дроп функції.
  const onDragStart = (e: React.DragEvent<HTMLDivElement>): void => {
    e.dataTransfer.setData('listId', `${id}`);
  };
  const onDragEnd = (e: React.DragEvent<HTMLDivElement>): void => {
    e.stopPropagation();
  };
  const onDragEnter = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
  };
  const onDragLeave = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
  };
  const onDragOver = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
  };
  const onDrop = (e: React.DragEvent<HTMLDivElement>): void => {
    const startedId = e.dataTransfer.getData('listId');
    const draggedItemPositions: IDragEvent = { draggedId: Number(startedId), targetId: id! };
    onItemDragged(draggedItemPositions);
  };
  // TODO: зробить полосу прокрутки в середині кожного списку якщо вони великі.
  return (
    <div
      className="empty-list"
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
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
              key={id}
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
              // onListChanged={onListChanged}
              onItemDragged={onItemDragged}
            />
          ))}
        </ul>
        {isVisibleAddCardForm && (
          <AddCardForm
            key={id}
            title={title ?? ''}
            onCardAdded={handleCardAdded}
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
  );
}
