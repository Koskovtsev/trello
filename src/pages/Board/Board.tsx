import toast from 'react-hot-toast';
import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useParams } from 'react-router-dom';
import { getBoard, putBoardUpdates } from '../../api/boardsService';
import { List } from './components/List/List';
import { getTexture, TextureList } from '../../components/Textures/TextureList';
import { IBoard } from '../../common/interfaces/IBoard';
// import { IList } from '../../common/interfaces/IList';
import { IDragEvent } from '../../common/interfaces/IDragEvent';
import { updatePosition } from './utils/updatePosition';
import { ChangeTitleForm } from './components/ChangeTitle/ChangeTitleForm';
import { AddListForm } from './components/AddList/AddListForm';
import { AppDispatch, RootState } from '../../store/store';
import { fetchBoardThunk, updateBoardThunk } from '../../store/boards/thunks';
import { useBoard } from './hooks/useBoard';
import { ChangeTextureModal } from '../../components/Textures/ChangeTextureModal/ChangeTextureModal';
import './board.scss';
import './components/List/list.scss';

export function Board(): JSX.Element {
  const activeBoard = useSelector((state: RootState) => state.boards.activeBoard);
  const [isVisibleChangeTexture, setVisibleChangeTexture] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const [isChangeTitle, setIsChangeTitle] = useState(false);
  const [isVisibleAddListForm, setVisibleAddListForm] = useState(false);
  const scrollToEnd = useRef<HTMLDivElement>(null);
  const isInitialRender = useRef(true);
  const prevListsLength = useRef(0);
  const { boardId } = useParams<{ boardId: string }>();
  const id = Number(boardId);
  const currentTexture = getTexture(activeBoard?.custom?.background ?? '');

  const { handleChangeTitle } = useBoard(id);
  const { handleTextureModal } = useBoard(id);

  async function fetchBoard(): Promise<IBoard | null> {
    try {
      const data = await getBoard(id);
      return data;
    } catch (error) {
      toast.error(`Error getting board data`);
      return null;
    }
  }
  useEffect(() => {
    if (boardId) {
      dispatch(fetchBoardThunk(Number(boardId)));
    }
  }, [boardId, dispatch]);
  const lists = activeBoard?.lists ?? [];
  const title = activeBoard?.title ?? '';
  useEffect(() => {
    if (!activeBoard) return;
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
  if (!activeBoard) return <>загрузка</>;
  const refreshBoard = (): void => {
    if (boardId) {
      dispatch(fetchBoardThunk(Number(boardId)));
    }
  };
  const updateListTexture = async (texturedList: Record<string, string>, freshData: IBoard): Promise<void> => {
    const updatedCustom = {
      boardId: id,
      boardData: {
        title,
        custom: {
          ...freshData.custom,
          listTextures: {
            ...texturedList,
          },
        },
      },
    };
    dispatch(updateBoardThunk(updatedCustom));
  };
  const handleNewList = async (texture: string): Promise<void> => {
    setVisibleAddListForm(false);
    if (!activeBoard) return; // TODO: переробить на більш логічний та читаємий блок обробки появи нового списку.
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

  if (!activeBoard) {
    return <div className="loading">Завантаження...</div>;
  }
  // TODO: винести логіку цього хендлера окремо в файл і розбити на різні методи.
  // const handleListChanged = async (position?: number, listId?: number): Promise<void> => {
  //   if (!position || position >= lists.length) {
  //     refreshBoard();
  //     return;
  //   }
  //   const newPositionList = lists.reduce((acc: { id: number; position: number }[], list) => {
  //     if (list.id === listId) return acc;
  //     acc.push({ id: list.id!, position: acc.length + 1 });
  //     return acc;
  //   }, []);
  //   try {
  //     await putListsUpdates(id, newPositionList as IList[]); // TODO: пуш-пут... винести в боардХук.
  //   } catch (error) {
  //     toast.error(`Error updating list properties`);
  //   }

  //   if (listId) {
  //     const texturedLists = { ...(activeBoard?.custom?.listTextures || {}) };
  //     if (delete texturedLists[listId]) {
  //       updateListTexture(texturedLists, activeBoard);
  //     }
  //   }
  //   refreshBoard();
  // };
  // TODO: переробить компонент ChangeTitleForm він має повертати новий тайтл, його обробкой має зайнятись окрема функція в окремому файлі.
  // const handleTitleChanged = async (newTitle: string): Promise<void> => {
  //   if (newTitle) {
  //     const newBoard: IBoard = { id, title: newTitle };
  //     await putBoardUpdates(id, newBoard);
  //     refreshBoard();
  //   }
  //   setIsChangeTitle(false);
  // };
  // TODO: винести в окремий файл який буде займатись виключно текстурами (компонент селект текстур)
  const handleNewTexture = async (texture: string): Promise<void> => {
    if (texture === currentTexture) return;
    // setCurrentTexture(texture);
    setVisibleChangeTexture(false);
    const updatedCustom = {
      ...activeBoard.custom,
      background: texture,
    };
    // TODO: зв'язок з сервером в окремому файлі?
    try {
      const response = await putBoardUpdates(id, {
        id,
        title: activeBoard.title,
        custom: updatedCustom,
      } as IBoard);
      if (response === 'Updated') refreshBoard();
    } catch (error) {
      toast.error('Error updating board properties.');
    }
  };
  // TODO: зв'язок з сервером в окремому файлі?
  const updateItemsPositions = async (props: IDragEvent): Promise<void> => {
    const isUpdated = await updatePosition(props, lists, id);
    if (isUpdated) refreshBoard();
  };
  return (
    <>
      <div className="board" ref={scrollToEnd} style={{ backgroundImage: `url(${currentTexture})` }}>
        <div className="board__title_wrapper">
          {!isChangeTitle && (
            <div className="board__title" title={title} onClick={() => setIsChangeTitle(true)}>
              {title}
            </div>
          )}
          {isChangeTitle && (
            <ChangeTitleForm
              key={id}
              onTitleChanged={(newTitle) => {
                handleChangeTitle(newTitle);
                setIsChangeTitle(false);
              }}
              currentTitle={title ?? ''}
              onCancel={() => setIsChangeTitle(false)}
            />
          )}
          <button
            className="list__button_custom-icon"
            aria-label="Change Texture"
            onClick={(e) => {
              handleTextureModal(e, { type: 'board', boardId: id });
            }}
          >
            <span className="icon-wrapper" />
          </button>
          {isVisibleChangeTexture && (
            <TextureList key={boardId} onTexturePicked={handleNewTexture} currentTexture={currentTexture} />
          )}
        </div>
        <div className="board__list">
          {lists.map((elem) => (
            <List
              key={elem.id}
              {...elem}
              // onListChanged={handleListChanged}
              boardData={activeBoard}
              boardId={id}
              onDataUpdate={refreshBoard}
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
      <ChangeTextureModal />
      <Outlet />
    </>
  );
}
