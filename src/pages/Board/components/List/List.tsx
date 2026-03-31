import toast from 'react-hot-toast';
import { useState } from 'react';
import { IList } from '../../../../common/interfaces/IList';
import { Card } from '../Card/Card';
import './list.scss';
import '../../board.scss';
import { AddCardForm } from '../Card/AddCardForm';
import { ChangeTitleForm } from '../Board/ChangeTitleForm';
import { deleteList } from '../../../../api/boardsService';
import { TextureList } from './TextureList';
import { IBoard } from '../../../../common/interfaces/IBoard';

interface IAddCardChangesProps extends IList {
  onListChanged(position?: number, listId?: number): void;
  boardData: IBoard;
  boardId: number;
  onTextureUpdate(texturedList: Record<string, string>, freshData: IBoard): void;
}
export function List(props: IAddCardChangesProps): JSX.Element {
  const { id, title, cards, onListChanged, boardData, boardId, onTextureUpdate, position } = props;
  const [isVisibleChangeTitleForm, setVisibleChangeTitleForm] = useState(false);
  const [isVisibleAddCardForm, setVisibleAddCardForm] = useState(false);
  const [currentTexture, setCurrentTexture] = useState<string | null>(
    boardData.custom?.listTextures?.[id ?? 0] ?? null
  );
  const [isVisibleChangeTexture, setVisibleChangeTexture] = useState(false);
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
  const handleCardAdded = (): void => {
    onListChanged();
    setVisibleAddCardForm(false);
  };
  const handleTitleChanged = (isChanged: boolean): void => {
    if (isChanged) {
      onListChanged();
    }
    setVisibleChangeTitleForm(false);
  };
  async function handleDeleteList(): Promise<void> {
    try {
      const response = await deleteList(boardId, id!);
      if (response === 'Deleted') {
        onListChanged(position, id);
      } else {
        toast.error(`Error deleting list`);
      }
    } catch (error) {
      toast.error(`Error deleting list`);
    }
  }
  return (
    <div className="list" style={{ backgroundImage: `url(${currentTexture})` }}>
      <div className="list__header">
        {!isVisibleChangeTitleForm && (
          <h2 className="list__title" onClick={() => setVisibleChangeTitleForm(true)}>
            {title}
          </h2>
        )}
        {isVisibleChangeTitleForm && (
          <ChangeTitleForm
            key={id}
            onTitleChanged={handleTitleChanged}
            listId={id ?? 0}
            boardId={boardId}
            currentTitle={title ?? ''}
            type="list"
          />
        )}
        <button
          className="list__button_custom-icon"
          aria-label="Change Texture"
          onClick={() => setVisibleChangeTexture((prev) => !prev)}
        >
          <span className="icon-wrapper" />
        </button>
      </div>
      {isVisibleChangeTexture && <TextureList key={boardId} onTexturePicked={handleNewTexture} />}
      <ul className="list__cards">
        {cards?.map((elem) => (
          <Card key={elem.id} {...elem} boardId={boardId} listId={id!} onListChanged={onListChanged} />
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
      <div className="button__wrapper">
        <button className="button__add_card" onClick={() => setVisibleAddCardForm(true)}>
          ➕ додати картку
        </button>
        <button className="home__button_delete-item" aria-label="Delete" onClick={handleDeleteList}>
          <i className="fa fa-trash" />
        </button>
      </div>
    </div>
  );
}
