// логіка переміщення списка

import { IList } from '../../../../common/interfaces/IList';

interface IListReorderPayload {
  listId: number;
  targetPosition: number; // Нова позиція (від 1 до N)
}

export const handleListReorder = (payload: IListReorderPayload, lists: IList[]): IList[] => {
  const { listId, targetPosition } = payload;

  // 1. Копіюємо масив, щоб не мутувати оригінал (хоча в Thunk ми отримуємо його зі стейту)
  const updatedLists = [...lists];

  // 2. Знаходимо індекс списку, який тягнемо
  const currentIndex = updatedLists.findIndex((l) => l.id === listId);
  if (currentIndex === -1) return [];

  // 3. Вирізаємо його
  const [movedList] = updatedLists.splice(currentIndex, 1);

  // 4. Вставляємо в нову позицію (індекс = позиція - 1)
  updatedLists.splice(targetPosition - 1, 0, movedList);

  // 5. Повертаємо масив об'єктів з оновленими позиціями для сервера
  return updatedLists.map((list, index) => ({
    ...list,
    position: index + 1,
  }));
};
