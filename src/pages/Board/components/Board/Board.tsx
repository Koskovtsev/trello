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

// TODO: це має бути файл в пейджес разом з Хоум, це не компонент.
export function Board(): JSX.Element {
  const [boardData, setBoradData] = useState<IBoard | null>(null);
  const [isVisibleChangeTexture, setVisibleChangeTexture] = useState(false);
  const [isChangeTitle, setIsChangeTitle] = useState(false); // TODO: дуже багато стейтів, виносити їх в окремі компоненти, до яких вони належать.
  const [isVisibleAddListForm, setVisibleAddListForm] = useState(false);
  const currentTexture = boardData?.custom?.background ?? 'default_color';
  const scrollToEnd = useRef<HTMLDivElement>(null);
  const isInitialRender = useRef(true);
  const prevListsLength = useRef(0);
  const { boardId } = useParams<{ boardId: string }>();
  const id = Number(boardId);
  async function fetchBoard(): Promise<IBoard | null> {
    try {
      const data = await getBoard(id);
      // eslint-disable-next-line prettier/prettier, no-console
      console.log("Дані отримано:", data);
      setBoradData(data);
      return data;
    } catch (error) {
      toast.error(`Error getting board data`);
      return null;
    }
  }
  useEffect(() => {
    fetchBoard();
  }, [boardId]);
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
  }, [isVisibleAddListForm, lists.length]); // TODO: цей юзеффект для автоскролу, винести в окремий файл.
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
      if (response === 'Updated') await fetchBoard();
    } catch (error) {
      toast.error(`Error updating list properties`);
    }
  };
  const handleNewList = async (texture: string): Promise<void> => {
    setVisibleAddListForm(false);
    if (!boardData) return; // TODO: переробить на більш логічний та читаємий блок обробки появи нового списку.
    try {
      const data = await fetchBoard();
      if (!data) return;
      const texturedLists = { ...(data.custom?.listTextures || {}) };
      const newId = data?.lists?.find(
        (list) => !texturedLists[String(list.id)] || texturedLists[String(list.id)] === null // TODO: розібратись чому тут string.
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
  // TODO: винести логіку цього хендлера окремо в файл і розбити на різні методи.
  const handleListChanged = async (position?: number, listId?: number): Promise<void> => {
    if (!position || position >= lists.length) return;
    const newPositionList = lists.reduce((acc: { id: number; position: number }[], list) => {
      if (list.id === listId) return acc;
      acc.push({ id: list.id!, position: acc.length + 1 });
      return acc;
    }, []);
    try {
      await putListsUpdates(newPositionList as IList[], id); // TODO: пуш-пут... виность в окремі файли.
    } catch (error) {
      toast.error(`Error updating list properties`);
    }

    if (listId) {
      const texturedLists = { ...(boardData?.custom?.listTextures || {}) };
      if (delete texturedLists[listId]) {
        updateListTexture(texturedLists, boardData);
      }
    }
    await fetchBoard();
  };
  // TODO: переробить компонент ChangeTitleForm він має повертати новий тайтл, його обробкой має зайнятись окрема функція в окремому файлі.
  const handleTitleChanged = (isChanged: boolean): void => {
    if (isChanged) {
      handleListChanged();
    }
    setIsChangeTitle(false);
  };
  // TODO: винести в окремий файл який буде займатись виключно текстурами (компонент селект текстур)
  const handleNewTexture = async (texture: string): Promise<void> => {
    if (texture === currentTexture) return;
    // setCurrentTexture(texture);
    setVisibleChangeTexture(false);
    const updatedCustom = {
      ...boardData.custom,
      background: texture,
    };
    // TODO: зв'язок з сервером в окремому файлі?
    try {
      const response = await putBoardUpdates({
        id,
        title: boardData.title,
        custom: updatedCustom,
      } as IBoard);
      if (response === 'Updated') await fetchBoard();
    } catch (error) {
      toast.error('Error updating board properties.');
    }
  };
  // TODO: зв'язок з сервером в окремому файлі?
  const updateItemsPositions = async (props: IDragEvent): Promise<void> => {
    const isUpdated = await updatePosition(props, lists, id);
    if (isUpdated) await fetchBoard();
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
          <AddListForm key={`form-${id}`} onListAdded={handleNewList} position={lists.length + 1} boardId={id} />
        )}
      </div>
    </div>
  );
}
