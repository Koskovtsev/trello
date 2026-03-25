import { FormEvent, useState } from 'react';
import { postList } from '../../../../api/boardsService';
import './list.scss';

interface IAddListFormProps {
  onListAdded(): void;
  position: number;
  boardId: number;
}

export function AddListForm({ onListAdded, position, boardId }: IAddListFormProps): JSX.Element {
  const [title, setTitle] = useState('');
  async function handleSubmit(e: FormEvent): Promise<void> {
    e.preventDefault();
    if (title.trim()) {
      const dataToSend = { title, position };
      const response = await postList(dataToSend, boardId);
      if (response === 'Created') {
        onListAdded();
        setTitle('');
      }
    }
  }
  return (
    <div className="list">
      <form className="form__add_list" onSubmit={handleSubmit}>
        <input
          type="text"
          className="input_list_title"
          placeholder="Введіть назву списку..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleSubmit}
        />
        <button type="submit" className="button__add_list">
          Додати список
        </button>
      </form>
    </div>
  );
}
