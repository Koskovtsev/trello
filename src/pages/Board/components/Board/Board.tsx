import toast from 'react-hot-toast';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getBoard, putBoardUpdates, putListsUpdates } from '../../../../api/boardsService';
import { List } from '../List/List';
import { AddListForm } from '../List/AddListForm';
import { ChangeTitleForm } from './ChangeTitleForm';
import './board.scss';
import { IBoard } from '../../../../common/interfaces/IBoard';
import { IList } from '../../../../common/interfaces/IList';

export function Board(): JSX.Element {
  const [boardData, setBoradData] = useState<IBoard | null>(null);
  const [refreshList, setRefreshList] = useState(false);
  const [isChangeTitle, setIsChangeTitle] = useState(false);
  const [isVisibleAddListForm, setVisibleAddListForm] = useState(false);
  const { boardId } = useParams<{ boardId: string }>();
  const id = Number(boardId);
  useEffect(() => {
    async function fetchBoard(): Promise<void> {
      try {
        const data = await getBoard(id);
        setBoradData(data);
      } catch (error) {
        toast.error(`Error getting board data`);
      }
    }
    fetchBoard();
  }, [boardId, refreshList]);
  const updateListTexture = async (texturedList: Record<string, string>, freshData: IBoard): Promise<void> => {
    const updatedCustom = {
      ...freshData.custom,
      listTextures: {
        ...texturedList,
      },
    };
    try {
      const response = await putBoardUpdates({
        id,
        title: freshData.title,
        custom: updatedCustom,
      } as IBoard);
      if (response === 'Updated') {
        setRefreshList((prev) => !prev);
      }
    } catch (error) {
      toast.error(`Error updating list properties`);
    }
  };
  const handleNewList = async (texture: string): Promise<void> => {
    if (!boardData) return;
    try {
      const data: IBoard = await getBoard(id);
      const texturedLists = { ...(data?.custom?.listTextures || {}) };
      const newId = data.lists?.find(
        (list) => !texturedLists[String(list.id)] || texturedLists[String(list.id)] === null
      )?.id;
      if (!newId) return;
      const updatedTextureLists = {
        ...texturedLists,
        [String(newId)]: texture,
      };
      await updateListTexture(updatedTextureLists, data);
    } catch (error) {
      toast.error(`Error creating new list`);
    }
  };

  if (!boardData) {
    return <div className="loading">Завантаження...</div>;
  }
  const lists = boardData.lists ?? [];
  const title = boardData.title ?? '';
  const handleListAdded = (texture: string): void => {
    handleNewList(texture);
    setVisibleAddListForm(false);
  };
  const handleListChanged = async (position?: number, listId?: number): Promise<void> => {
    if (position && position < lists.length) {
      const newPositionList = lists.reduce((acc: { id: number; position: number }[], list) => {
        if (list.id === listId) return acc;
        acc.push({ id: list.id!, position: acc.length + 1 });
        return acc;
      }, []);
      try {
        await putListsUpdates(newPositionList as IList[], id);
      } catch (error) {
        toast.error(`Error updating list properties`);
      }
    }
    // eslint-disable-next-line no-console
    // console.log(`Pos: ${JSON.stringify(position)}`);
    if (listId) {
      const texturedLists = { ...(boardData?.custom?.listTextures || {}) };
      if (delete texturedLists[listId]) {
        updateListTexture(texturedLists, boardData);
      }
    }
    setRefreshList((prev) => !prev);
  };
  const handleTitleChanged = (isChanged: boolean): void => {
    if (isChanged) {
      handleListChanged();
    }
    setIsChangeTitle(false);
  };
  return (
    <div className="board">
      <div className="board__title_wrapper">
        {!isChangeTitle && (
          <div className="board__title" onClick={() => setIsChangeTitle(true)}>
            {title}
          </div>
        )}
        {isChangeTitle && (
          <ChangeTitleForm
            key={id}
            onTitleChanged={handleTitleChanged}
            boardId={id}
            currentTitle={title ?? ''}
            type="board"
          />
        )}
      </div>
      <div className="board__list">
        {lists.map((elem) => (
          <List
            key={elem.id}
            {...elem}
            onListChanged={handleListChanged}
            boardData={boardData}
            boardId={id}
            onTextureUpdate={updateListTexture}
          />
        ))}
        {!isVisibleAddListForm && (
          <button className="board__add_button" onClick={() => setVisibleAddListForm(true)}>
            ➕ Додайде ще один список
          </button>
        )}
        {isVisibleAddListForm && (
          <AddListForm key={id} onListAdded={handleListAdded} position={lists.length + 1} boardId={id} />
        )}
      </div>
    </div>
  );
}
