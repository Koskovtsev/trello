import { useState } from 'react';
import { IList } from '../../../../common/interfaces/IList';
import { Card } from '../Card/Card';
import { TextureList } from '../../../../components/Textures/TextureList';
import { IDragEvent } from '../../../../common/interfaces/IDragEvent';
import { IBoard } from '../../../../common/interfaces/IBoard';
import { ChangeTitleForm } from '../ChangeTitle/ChangeTitleForm';
import { AddCardForm } from '../AddCard/AddCardForm';
import { useList } from './hooks/useList';
import { DeleteAction } from '../../../../components/DeleteButtonWithModal/DeleteAction';
import './list.scss';

interface IAddCardChangesProps extends IList {
  onListChanged(position?: number, listId?: number): void;
  boardData: IBoard;
  boardId: number;
  onTextureUpdate(texturedList: Record<string, string>, freshData: IBoard): void;
  onItemDragged(draggedElement: IDragEvent): void;
  onDataUpdate(): void;
}
export function List(props: IAddCardChangesProps): JSX.Element {
  const { id, title, cards, onListChanged, boardData, boardId, onTextureUpdate, onItemDragged, onDataUpdate } = props;
  const [isVisibleChangeTitleForm, setVisibleChangeTitleForm] = useState(false); // TODO: тут теж багато стейтів, треба скоротить.
  const [isVisibleAddCardForm, setVisibleAddCardForm] = useState(false);
  const [currentTexture, setCurrentTexture] = useState<string | null>(
    boardData.custom?.listTextures?.[id ?? 0] ?? null
  );
  const [isVisibleChangeTexture, setVisibleChangeTexture] = useState(false);
  // TODO: прибрать хендлер текстур окремо до файлу що управляє текстурами.
  // TODO: зробить кнопку текстур в окремий компонент селект. шо це?
  const handleNewTexture = (texture: string): void => {
    if (texture === currentTexture) return;
    setCurrentTexture(texture);
    setVisibleChangeTexture(false);
    const texturedLists = { ...(boardData?.custom?.listTextures || {}) };
    const updatedTextureLists = {
      ...texturedLists,
      [String(id)]: texture,
    };
    onTextureUpdate(updatedTextureLists, boardData);
  };
  const { deleteListById } = useList({ boardId, listId: id!, onRefreshList: onDataUpdate });
  const { changeTitle } = useList({ boardId, listId: id!, onRefreshList: onDataUpdate });
  const handleCardAdded = (): void => {
    onDataUpdate(); // TODO: є кращі рішення ніж виклик пустого колбеку.
    setVisibleAddCardForm(false);
  };
  // const handleTitleChanged = (newTitle: string): void => {
  //   if (newTitle) {
  //     onDataUpdate(); // TODO: переписать заглушку на зміну назви.
  //   }
  //   setVisibleChangeTitleForm(false);
  // };

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
            onClick={() => setVisibleChangeTexture((prev) => !prev)}
            onBlur={() => setVisibleChangeTexture((prev) => !prev)}
          >
            <span className="icon-wrapper" />
          </button>
        </div>
        {isVisibleChangeTexture && <TextureList key={boardId} onTexturePicked={handleNewTexture} />}
        <ul className="list__cards">
          {cards?.map((elem) => (
            <Card
              key={elem.id}
              cardData={elem}
              boardId={boardId}
              listId={id!}
              onListChanged={onListChanged}
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
