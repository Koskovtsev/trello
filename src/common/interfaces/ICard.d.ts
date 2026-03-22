export interface ICard {
  id?: number;
  title: string;
  position: number;
  color?: string;
  desription?: string;
  custom?: Record<string, unknown>;
  // users?: number[];
  // created_at?: number;
}
