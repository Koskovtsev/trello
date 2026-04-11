import { useState } from 'react';
import toast from 'react-hot-toast';
import { ICard } from '../../../../common/interfaces/ICard';
import './card.scss';
import { ChangeTitleForm } from '../Board/ChangeTitleForm';
import { putCardUpdates } from '../../../../api/boardsService';
import { TextureList } from '../List/TextureList';
import { IDragEvent } from '../../../../common/interfaces/IDragEvent';

interface ICardChangeProps extends ICard {
  boardId: number;
  listId: number;
  onListChanged(): void;
  onItemDragged(draggedElement: IDragEvent): void;
}

export function Card(props: ICardChangeProps): JSX.Element {
  const { boardId, listId, onListChanged, onItemDragged, title, id, custom } = props;
  const [isVisibleChangeCardTitle, setVisibleChangeCardTitle] = useState(false);
  const [isVisibleMenuOptions, setVisibleMenuOptions] = useState(false); // TODO: багато стейтів, які можна було б винести в компоненти які їх використовують.
  const [isChecked, setIsChecked] = useState(custom?.isChecked ?? false);
  const [isVisibleChangeTexture, setVisibleChangeTexture] = useState(false);
  const [currentTexture, setCurrentTexture] = useState<string | null>(custom?.listTexture ?? null);
  const handleCheckedCard = async (): Promise<void> => {
    const newCard: ICard = {
      ...props,
      custom: {
        ...custom,
        isChecked: !isChecked,
      },
      list_id: listId,
    };
    try {
      await putCardUpdates(newCard, boardId, id!);
      setIsChecked((prev) => !prev);
      onListChanged();
    } catch (error) {
      toast.error('Error updating card properties.');
    }
  };
  const handleTitleChanged = (isChanged: boolean | undefined): void => {
    if (isChanged) {
      onListChanged();
    }
    setVisibleChangeCardTitle(false);
  };
  // TODO: текстури мають бути в файлі з текстурами і їх обробка теж.
  const handleNewTexture = async (texture: string): Promise<void> => {
    if (texture === currentTexture) return;
    setCurrentTexture(texture);
    setVisibleChangeTexture(false);
    const cardUpdate: ICard = {
      list_id: listId,
      custom: {
        ...custom,
        listTexture: texture,
      },
    };
    try {
      await putCardUpdates(cardUpdate, boardId, id!);
      setVisibleChangeTexture((prev) => !prev);
      setVisibleMenuOptions((prev) => !prev);
      onListChanged();
    } catch (error) {
      toast.error('Error updating card properties.');
    }
  };
  const onDragStart = (e: React.DragEvent<HTMLDivElement>): void => {
    e.dataTransfer.setData('cardId', `${id}`);
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
      targetId: id!,
      sourceContainerId: sourceListId,
      targetContainerId: listId,
    };
    onItemDragged(draggedItemPositions);
    e.stopPropagation();
  };
  // TODO: прибрать карандаш в меню редагування.
  // TODO: саме меню редагування має бути модальним вікном (через глобал стейт?).
  // TODO: по стилям, будь-які едіти не мають скакати, всі розміри мають бути статичними.
  // TODO: коли вибрано якусь текстуру, додать бордер, щоб було зрозуміло яка зараз текстура вибрана. або залишити збільшеним(як при ховері) чи і те і те.
  // TODO: зробить не такими насиченими компоненти(збільшити розміри картки, або збільшити розміри списку) бо візуально - перегромадження.
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
        style={{ backgroundImage: `url(${currentTexture})`, zIndex: isVisibleMenuOptions ? 1000 : 5 }}
        draggable="true"
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      >
        <li>
          <label className="card__label">
            <input type="checkbox" className="card__checkbox" checked={isChecked} onChange={handleCheckedCard} />
            {!isVisibleChangeCardTitle && <span>{title}</span>}
            {isVisibleChangeCardTitle && (
              <ChangeTitleForm
                key={id}
                onTitleChanged={handleTitleChanged}
                listId={listId}
                boardId={boardId}
                cardId={id!}
                currentTitle={title ?? ''}
                type="card"
              />
            )}
          </label>
        </li>
        <div className="button__card-change_wrapper">
          <button
            className="button__card-change_title"
            aria-label="Change card title"
            onClick={() => setVisibleChangeCardTitle(true)}
          >
            <i className="fa fa-pencil-alt" />
          </button>
          <button
            className="button__menu_options"
            aria-label="Show menu"
            onClick={() => setVisibleMenuOptions((prev) => !prev)}
          >
            <i className="fas fa-ellipsis-h" />
          </button>
          {isVisibleMenuOptions && (
            <div className="menu__options">
              <div className="menu__options_header">
                <span className="menu__options_title">Редагування картки</span>
                <button
                  className="list__button_custom-icon"
                  aria-label="Change Texture"
                  onClick={() => setVisibleChangeTexture((prev) => !prev)}
                >
                  <span className="icon-wrapper" />
                </button>
              </div>
              {isVisibleChangeTexture && <TextureList key={boardId} onTexturePicked={handleNewTexture} />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
