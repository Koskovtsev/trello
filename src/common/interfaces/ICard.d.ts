export interface ICard {
  id?: number;
  title?: string;
  position?: number;
  list_id?: number;
  color?: string;
  description?: string;
  custom?: {
    isChecked?: boolean;
    background?: string;
  };
  // users?: number[];
  // created_at?: number; це для авторизації
}
