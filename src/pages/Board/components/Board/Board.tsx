import toast from 'react-hot-toast';
import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { getBoard, putBoardUpdates, putListsUpdates } from '../../../../api/boardsService';
import { List } from '../List/List';
import { AddListForm } from '../List/AddListForm';
import { TextureList } from '../List/TextureList';
import { ChangeTitleForm } from './ChangeTitleForm';
import { IBoard } from '../../../../common/interfaces/IBoard';
import { IList } from '../../../../common/interfaces/IList';
import { IDragEvent } from '../../../../common/interfaces/IDragEvent';
import { updatePosition } from './updatePosition';
import './board.scss';
import '../List/list.scss';

export function Board(): JSX.Element {
  const [boardData, setBoradData] = useState<IBoard | null>(null);
  const [refreshList, setRefreshList] = useState(false);
  const [isVisibleChangeTexture, setVisibleChangeTexture] = useState(false);
  const [isChangeTitle, setIsChangeTitle] = useState(false);
  const [isVisibleAddListForm, setVisibleAddListForm] = useState(false);
  const [currentTexture, setCurrentTexture] = useState<string | undefined>(boardData?.custom?.background ?? undefined);
  const scrollToEnd = useRef<HTMLDivElement>(null);
  const isInitialRender = useRef(true);
  const prevListsLength = useRef(0);
  const { boardId } = useParams<{ boardId: string }>();
  const id = Number(boardId);
  useEffect(() => {
    if (boardData?.custom?.background) {
      setCurrentTexture(boardData.custom.background);
    }
  }, [boardData]);
  async function fetchBoard(): Promise<IBoard | null> {
    try {
      const data = await getBoard(id);
      setBoradData(data);
      return data;
    } catch (error) {
      toast.error(`Error getting board data`);
      return null;
    }
  }
  useEffect(() => {
    fetchBoard();
  }, [boardId, refreshList]);
  const lists = boardData?.lists ?? [];
  const title = boardData?.title ?? '';
  useEffect(() => {
    if (!boardData) return;
    if (isInitialRender.current) {
      isInitialRender.current = false;
      prevListsLength.current = lists.length;
      return;
    }
    const isNewListAdded = lists.length > prevListsLength.current;
    if (isVisibleAddListForm || isNewListAdded) {
      if (scrollToEnd.current) {
        scrollToEnd.current.scrollLeft = scrollToEnd.current.scrollWidth;
      }
      prevListsLength.current = lists.length;
    }
    prevListsLength.current = lists.length;
  }, [isVisibleAddListForm, lists.length]);
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
      const data = await fetchBoard();
      if (!data) return;
      const texturedLists = { ...(data.custom?.listTextures || {}) };
      const newId = data?.lists?.find(
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

  const handleListAdded = (texture: string): void => {
    handleNewList(texture);
    setVisibleAddListForm(false);
  };
  if (!boardData) {
    return <div className="loading">Завантаження...</div>;
  }
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
  const handleNewTexture = async (texture: string): Promise<void> => {
    if (texture === currentTexture) return;
    setCurrentTexture(texture);
    setVisibleChangeTexture(false);
    const updatedCustom = {
      ...boardData.custom,
      background: texture,
    };
    try {
      const response = await putBoardUpdates({
        id,
        title: boardData.title,
        custom: updatedCustom,
      } as IBoard);
      if (response === 'Updated') {
        setRefreshList((prev) => !prev);
      }
    } catch (error) {
      toast.error('Error updating board properties.');
    }
  };

  const updateItemsPositions = async (props: IDragEvent): Promise<void> => {
    const isUpdated = await updatePosition(props, lists, id);
    if (isUpdated) {
      setRefreshList((prev) => !prev);
    }
  };
  return (
    <div
      className="board"
      ref={scrollToEnd}
      style={{
        backgroundImage: currentTexture?.includes('/') ? `url(${currentTexture})` : currentTexture,
        backgroundColor: '#acacac',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
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
        <button
          className="list__button_custom-icon"
          aria-label="Change Texture"
          onClick={() => setVisibleChangeTexture((prev) => !prev)}
        >
          <span className="icon-wrapper" />
        </button>
        {isVisibleChangeTexture && <TextureList key={boardId} onTexturePicked={handleNewTexture} />}
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
            onItemDragged={updateItemsPositions}
          />
        ))}
        {!isVisibleAddListForm && (
          <button className="board__add_button" onClick={() => setVisibleAddListForm(true)}>
            ➕ Додайде ще один список
          </button>
        )}
        {isVisibleAddListForm && (
          <AddListForm key={`form-${id}`} onListAdded={handleListAdded} position={lists.length + 1} boardId={id} />
        )}
      </div>
    </div>
  );
}
