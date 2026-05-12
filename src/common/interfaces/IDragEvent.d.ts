export interface IDragEvent {
  draggedId: number;
  targetId: number;
  sourceListId?: number;
  targetListId?: number;
  sourceBoardId?: number;
  targetBoardId?: number;
}
