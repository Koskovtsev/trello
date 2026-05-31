import { useCallback } from 'react';

interface IUseCardDragDropData {
  handleDragStart(e: React.DragEvent<HTMLDivElement>): void;
  handleDragEnd(e: React.DragEvent<HTMLDivElement>): void;
  handleDragEnter(e: React.DragEvent<HTMLDivElement>): void;
  handleDragLeave(e: React.DragEvent<HTMLDivElement>): void;
  handleDragOver(e: React.DragEvent<HTMLDivElement>): void;
  handleDrop(e: React.DragEvent<HTMLDivElement>): void;
}

interface IUseCardDragDropProps {
  cardId: number;
  listId: number;
  onHover(id: number, listId: number): void;
  onDragStarted(id: number | null): void;
  onDragEnded(): void;
}

export function useCardDragDrop({
  cardId,
  listId,
  onHover,
  onDragStarted,
  onDragEnded,
}: IUseCardDragDropProps): IUseCardDragDropData {
  const handleDragStart = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.stopPropagation();

      setTimeout(() => {
        onDragStarted(cardId);
      }, 0);
    },
    [cardId, onDragStarted]
  );

  const handleDragEnd = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.stopPropagation();
      onDragStarted(null);
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
      onHover(cardId, listId);
    },
    [cardId, listId, onHover]
  );
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      onDragEnded();
    },
    [onDragEnded]
  );

  return { handleDragStart, handleDragEnd, handleDragEnter, handleDragLeave, handleDragOver, handleDrop };
}
