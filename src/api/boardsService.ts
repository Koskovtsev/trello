import { IBoard } from '../common/interfaces/IBoard';
import api from './request';

interface ICreateBoardResponse {
  result: string;
  id: number;
}

export async function postNewBoard(boardData: IBoard): Promise<number> {
  const response = await api.post<unknown, ICreateBoardResponse>('board', boardData);
  return response.id;
}

export async function deleteBoard(id: number): Promise<string> {
  const response = await api.delete<unknown, { result: string }>(`board/${id}`);
  return response.result;
}

export async function getBoards(): Promise<IBoard[]> {
  const response = await api.get<unknown, { boards: IBoard[] }>('board');
  return response.boards;
}

export async function putBoardUpdates(boardData: IBoard): Promise<string> {
  const response = await api.put<unknown, { result: string }>(`board/${boardData.id}`, boardData);
  return response.result;
}
// export async function getBoard(id:number) {
//     const response = await api.get(`board/${id}`);
//     return (response as unknown as ICreateBoardResponse).;
// }
