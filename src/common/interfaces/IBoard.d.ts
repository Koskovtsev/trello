import { IList } from './IList';

export interface IBoard {
  id?: number;
  title: string;
  custom?: {
    background?: string;
    description?: string;
    listTextures?: Record<string, string>;
  };
  lists?: IList[];
}
