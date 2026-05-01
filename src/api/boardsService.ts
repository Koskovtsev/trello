import { IBoard } from '../common/interfaces/IBoard';
import { IBoardData } from '../common/interfaces/IBoardData';
import { ICard } from '../common/interfaces/ICard';
import { IList } from '../common/interfaces/IList';
import api from './request';

export async function postNewBoard(boardData: IBoard): Promise<string> {
  const response = await api.post<unknown, { result: string }>('board', boardData);
  return response.result;
}

export async function deleteBoard(id: number): Promise<string> {
  const response = await api.delete<unknown, { result: string }>(`board/${id}`);
  return response.result;
}

export async function getBoards(): Promise<IBoard[]> {
  const response = await api.get<unknown, { boards: IBoard[] }>('board');
  return response.boards;
}

export async function putBoardUpdates(boardId: number, boardData: IBoard): Promise<string> {
  const response = await api.put<unknown, { result: string }>(`board/${boardId}`, boardData);
  return response.result;
}

export async function getBoard(id: number): Promise<IBoardData> {
  return api.get<IBoardData, IBoardData>(`board/${id}`);
}

export async function postList(boardId: number, list: IList): Promise<string> {
  const response = await api.post<unknown, { result: string }>(`board/${boardId}/list`, list);
  return response.result;
}

export async function postCard(boardId: number, card: ICard): Promise<string> {
  const response = await api.post<unknown, { result: string }>(`board/${boardId}/card`, card);
  return response.result;
}

export async function deleteList(boardId: number, listId: number): Promise<string> {
  const response = await api.delete<unknown, { result: string }>(`board/${boardId}/list/${listId}`);
  return response.result;
}

export async function putListUpdates(boardId: number, listId: number, listData: IList): Promise<string> {
  const response = await api.put<unknown, { result: string }>(`board/${boardId}/list/${listId}`, listData);
  return response.result;
}

export async function putListsUpdates(boardId: number, listData: IList[]): Promise<string> {
  const response = await api.put<unknown, { result: string }>(`board/${boardId}/list/`, listData);
  return response.result;
}

export async function putCardUpdates(boardId: number, cardId: number, cardData: ICard): Promise<string> {
  const response = await api.put<unknown, { result: string }>(`board/${boardId}/card/${cardId}`, cardData);
  return response.result;
}

export async function putCardsUpdates(boardId: number, cardData: ICard[]): Promise<string> {
  const response = await api.put<unknown, { result: string }>(`board/${boardId}/card/`, cardData);
  return response.result;
}

export async function deleteCard(boardId: number, cardId: number): Promise<string> {
  const response = await api.delete<unknown, { result: string }>(`board/${boardId}/card/${cardId}`);
  return response.result;
}
