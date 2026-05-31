import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useDragDrop } from '../../../context/DragDropContext';
import { useBoardInfo } from '../../../context/BoardInfoContext';
import { processListMoveThunk } from '../../../../../store/boards/thunks';
import { AppDispatch } from '../../../../../store/store';

interface IDragListPayload {
  listId: number;
  targetPosition: number;
  boardId: number;
}
interface IUseListDragDropData {
  handleDragStart(e: React.DragEvent<HTMLDivElement>): void;
  handleDragEnd(e: React.DragEvent<HTMLDivElement>): void;
  handleDragEnter(e: React.DragEvent<HTMLDivElement>): void;
  handleDragLeave(e: React.DragEvent<HTMLDivElement>): void;
  handleDragOver(e: React.DragEvent<HTMLDivElement>): void;
  handleDrop(e: React.DragEvent<HTMLDivElement>): void;
}

type DragType = 'list' | 'card' | null;

interface IUseListDragDropProps {
  listId: number;
  currentPosition: number;
  onHover(id: number): void;
  onCardHover(cardId: number | null, listId: number): void;
  onDragStarted(id: number | null, type: DragType): void;
  onDragEnded(): void;
}

export function useListDragDrop({
  listId,
  currentPosition,
  onHover,
  onCardHover,
  onDragStarted,
  onDragEnded,
}: IUseListDragDropProps): IUseListDragDropData {
  const { boardId, activeBoard } = useBoardInfo();
  const dragDrop = useDragDrop();
  const { draggedListId, draggedCardId, dragType } = dragDrop;
  const dispatch = useDispatch<AppDispatch>();
  const handleDragStart = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.stopPropagation();
      setTimeout(() => {
        onDragStarted(listId, 'list');
      }, 0);
    },
    [listId, onDragStarted]
  );

  const handleDragEnd = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      onDragStarted(null, null);
      onDragEnded();
      e.stopPropagation();
    },
    [onDragStarted]
  );
  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.stopPropagation();
  }, []);
  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.stopPropagation();
  }, []);
  const handleDragOver = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (draggedListId && draggedListId !== listId && dragType === 'list') {
        onHover(listId);
      }
      if (dragType === 'card' && draggedCardId) {
        onCardHover(null, listId);
      }
    },
    [listId, onHover, onCardHover]
  );
  const handleDrop = useCallback(
    async (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (dragType === 'card') {
        onDragEnded();
      } else {
        const sourceList = activeBoard.lists?.find((l) => l.id === draggedListId);
        const sourcePosition = sourceList?.position;
        if (sourcePosition === currentPosition) return;
        const draggedItem: IDragListPayload = {
          listId: draggedListId!,
          targetPosition: currentPosition,
          boardId,
        };
        await dispatch(processListMoveThunk(draggedItem)).unwrap();
      }
    },
    [onDragEnded]
  );

  return { handleDragStart, handleDragEnd, handleDragEnter, handleDragLeave, handleDragOver, handleDrop };
}
