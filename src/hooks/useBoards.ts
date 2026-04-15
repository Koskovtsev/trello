import toast from 'react-hot-toast';
import { useState } from 'react';
import { deleteBoard, getBoards, postNewBoard } from '../api/boardsService';
import { IBoard } from '../common/interfaces/IBoard';

interface IUseBoardData {
  boards: IBoard[];
  createBoard(newTitle: string, texture: string): Promise<boolean>;
  fetchBoards(): Promise<void>;
  deleteBoardById(boardId: number): Promise<void>;
}

export function useBoards(): IUseBoardData {
  const [boards, setBoards] = useState<IBoard[]>([]);

  async function fetchBoards(): Promise<void> {
    try {
      const data = await getBoards();
      setBoards(data);
    } catch (error) {
      toast.error(`Error to get boards data`);
    }
  }
  const createBoard = async (newTitle: string, texture: string): Promise<boolean> => {
    const dataToSend: IBoard = { title: newTitle, custom: { background: texture } };
    try {
      const response = await postNewBoard(dataToSend);
      if (response === 'Created') {
        fetchBoards();
        return true;
      }
    } catch (error) {
      toast.error('Error creating new board');
    }
    return false;
  };

  const deleteBoardById = async (boardId: number): Promise<void> => {
    try {
      const response = await deleteBoard(boardId);
      if (response === 'Deleted') {
        fetchBoards();
      }
    } catch (error) {
      toast.error(`Error deleting board`);
    }
  };
  return { boards, createBoard, fetchBoards, deleteBoardById };
}
