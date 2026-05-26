import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useParams } from 'react-router-dom';
import { List } from './components/List/List';
import { getTexture } from '../../components/Textures/TextureList';
import { ChangeTitleForm } from './components/ChangeTitle/ChangeTitleForm';
import { AppDispatch, RootState } from '../../store/store';
import { fetchBoardThunk, processCardMoveThunk } from '../../store/boards/thunks';
import { useBoard } from './hooks/useBoard';
import { ChangeTextureModal } from '../../components/Textures/ChangeTextureModal/ChangeTextureModal';
import { IList } from '../../common/interfaces/IList';
import { ICard } from '../../common/interfaces/ICard';
import { IDragCardPayload } from '../../common/interfaces/IDragCardPayload';
import { AddItemModal } from '../Home/components/AddBoard/AddItemModal';
import './board.scss';
import './components/List/list.scss';

type DragType = 'list' | 'card' | null;

export function Board(): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();

  const [isVisibleAddListForm, setVisibleAddListForm] = useState(false);
  const [isChangeTitle, setIsChangeTitle] = useState(false);
  const [draftTitle, setDraftTitle] = useState('');
  const [dragType, setDragType] = useState<DragType>(null);
  const [draggedListId, setDraggedListId] = useState<number | null>(null);
  const [draggedCardId, setDraggedCardId] = useState<number | null>(null);
  const [sourceData, setSourceData] = useState<{ listId: number; pos: number } | null>(null);
  const [previewLists, setPreviewLists] = useState<IList[]>([]);

  const activeBoard = useSelector((state: RootState) => state.boards.activeBoard);
  const currentTexture = getTexture(activeBoard?.custom?.background ?? '');
  const { boardId } = useParams<{ boardId: string }>();
  const id = Number(boardId);
  const { handleChangeTitle, handleTextureModal, handleListAdded } = useBoard(id);
  const lists = activeBoard?.lists ?? [];
  const title = activeBoard?.title ?? '';

  const scrollToEnd = useRef<HTMLDivElement>(null);
  const isInitialRender = useRef(true);
  const prevListsLength = useRef(0);

  useEffect(() => {
    if (boardId) {
      dispatch(fetchBoardThunk(Number(boardId))).unwrap();
    }
  }, [boardId, dispatch]);
  useEffect(() => {
    if (draggedListId !== null) return;
    setPreviewLists(lists);
  }, [lists, draggedListId]);
  useEffect(() => {
    if (!activeBoard) return; // TODO: цей юзеффект для автоскролу, винести в окремий файл + він не працює.
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

  if (!activeBoard) return <>загрузка</>;
  // const refreshBoard = async (bId: number): Promise<void> => {
  //   if (bId) {
  //     await dispatch(fetchBoardThunk(Number(bId))).unwrap();
  //   }
  // };
  if (!activeBoard) {
    return <div className="loading">Завантаження...</div>;
  }

  function reorder(list: IList[], fromIndex: number, toindex: number): IList[] {
    const cloned = structuredClone(list);
    const [removed] = cloned.splice(fromIndex, 1);
    cloned.splice(toindex, 0, removed);
    const reorderedList = cloned.map((li: IList, index: number) => ({
      ...li,
      position: index + 1,
    }));
    return reorderedList;
  }

  function handleCardHover(hoveredCardId: number | null, targetListId: number): void {
    if (dragType !== 'card' || draggedCardId === hoveredCardId) return;
    setPreviewLists((prevList: IList[]) => {
      const clone = structuredClone(prevList);
      const sourceList = clone.find((list: IList) => list.cards?.some((card) => card.id === draggedCardId));
      const targetList = clone.find((list: IList) => list.id === targetListId);

      if (!sourceList || !targetList) return prevList;

      const sourceCards = sourceList.cards || [];
      const targetCards = targetList.cards || [];

      const draggedCardIndex = sourceCards.findIndex((card: ICard) => card.id === draggedCardId);
      const hoveredCardIndex = targetCards.findIndex((card: ICard) => card.id === hoveredCardId);
      if (sourceList.id === targetListId && draggedCardIndex === hoveredCardIndex) return prevList;
      if (draggedCardIndex === -1) return prevList;

      const [movedCard] = sourceCards.splice(draggedCardIndex, 1);
      movedCard.list_id = targetListId;
      const insertIndex = hoveredCardIndex !== -1 ? hoveredCardIndex : targetCards.length;
      targetCards.splice(insertIndex, 0, movedCard);
      return clone;
    });
  }

  function handleListHover(hoveredId: number): void {
    if (dragType !== 'list' || draggedListId === hoveredId) return;
    const draggedIndex = previewLists.findIndex((list) => list.id === draggedListId);
    const targetIndex = previewLists.findIndex((list) => list.id === hoveredId);
    if (draggedIndex === -1 || targetIndex === -1) return;
    setPreviewLists(reorder(previewLists, targetIndex, draggedIndex!));
  }

  const handleCardDrag = (cardId: number, cardData: ICard, listId: number): void => {
    setDragType('card');
    setDraggedCardId(cardId);
    setSourceData({ listId, pos: cardData.position! });
  };

  const handleDragEnd = async (): Promise<void> => {
    if (sourceData && draggedCardId) {
      let targetListId = 0;
      let targetPosition = 0;
      previewLists.forEach((list) => {
        const idx = list.cards?.findIndex((c) => c.id === draggedCardId);
        if (idx !== undefined && idx !== -1) {
          targetListId = list.id!;
          targetPosition = idx + 1;
        }
      });
      const cardMovePayload: IDragCardPayload = {
        cardId: draggedCardId,
        sourceListId: sourceData.listId,
        targetListId,
        sourcePosition: sourceData.pos,
        targetPosition,
        boardId: id,
      };
      dispatch(processCardMoveThunk(cardMovePayload));
    }
    setDraggedListId(null);
    setDraggedCardId(null);
    setDragType(null);
    setPreviewLists(lists);
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
            onClick={(e) => handleTextureModal(e, { type: 'board', boardId: id })}
          >
            <span className="icon-wrapper" />
          </button>
        </div>
        <div className="board__list">
          {previewLists.map((elem, index) => (
            <List
              key={elem.id}
              {...elem}
              boardData={activeBoard}
              boardId={id}
              // onDataUpdate={refreshBoard}
              onHover={(listIndex) => handleListHover(listIndex)}
              onDragStarted={(listId, type) => {
                setDragType(type);
                setDraggedListId(listId);
              }}
              currentPosition={index + 1}
              currentDraggedListId={draggedListId!}
              onCardDragStarted={(cardId, cardData, listId) => {
                handleCardDrag(cardId!, cardData, listId);
              }}
              onCardHover={(cardId, listId) => handleCardHover(cardId!, listId)}
              onDragEnded={handleDragEnd}
              draggedCardId={draggedCardId!}
              dragType={dragType}
            />
          ))}
          {!isVisibleAddListForm && (
            <button className="board__add_button" onClick={() => setVisibleAddListForm(true)}>
              ➕ Додайде ще один список
            </button>
          )}
          {isVisibleAddListForm && (
            <AddItemModal
              active={isVisibleAddListForm}
              setActive={setVisibleAddListForm}
              onBoardAdded={(listTitle, listTexture) => handleListAdded(listTitle, listTexture, lists.length + 1)}
              title={draftTitle}
              setTitle={setDraftTitle}
              modalType="list"
            />
          )}
        </div>
      </div>
      <ChangeTextureModal />
      <Outlet />
    </>
  );
}
