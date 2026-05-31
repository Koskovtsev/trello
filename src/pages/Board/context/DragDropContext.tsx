import { createContext, useContext } from 'react';

type DragType = 'list' | 'card' | null;

export interface IDragDropContext {
  draggedListId: number | null;
  draggedCardId: number | null;
  dragType: DragType;
}

export const DragDropContext = createContext<IDragDropContext | null>(null);

export const useDragDrop = (): IDragDropContext => {
  const context = useContext(DragDropContext);

  if (!context) {
    throw new Error('useDragDrop must be used inside DragDropContext.Provider');
  }

  return context;
};
