import { FormEvent, useState } from 'react';
import { PencilWrapper } from '../PencilWrapper';
import './addForm.scss';

export function AddBoardForm({ numberOfElements }: { numberOfElements: number }): JSX.Element {
  const [title, setTitle] = useState<string>('');
  function handleSubmit(e: FormEvent): void {
    e.preventDefault();
    // eslint-disable-next-line no-console
    console.log(`додаємо нову дошку з назвою ${title} id: ${numberOfElements + 1}`);
  }
  return (
    <PencilWrapper className="home__board_item" color="black">
      <form className="form__add" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Введіть назву списку..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="form__add_input"
        />
        <button type="submit" className="add-board-button">
          Додати список
        </button>
      </form>
    </PencilWrapper>
  );
}
