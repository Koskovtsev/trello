import { ICard } from './ICard';

export interface IList {
  id?: number;
  position?: number;
  custom?: Record<string, string>;
  title?: string;
  cards?: ICard[];
}
