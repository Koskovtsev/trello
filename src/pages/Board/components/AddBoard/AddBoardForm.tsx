import toast from 'react-hot-toast';
import { FormEvent, useState } from 'react';
import { PencilWrapper } from '../PencilWrapper';
import { postNewBoard } from '../../../../api/boardsService';
import './addForm.scss';
import { IBoard } from '../../../../common/interfaces/IBoard';

interface IAddBoardFormProps {
  onBoardAdded(board: IBoard): void;
}
export function AddBoardForm({ onBoardAdded }: IAddBoardFormProps): JSX.Element {
  const [title, setTitle] = useState<string>('');
  const [color, setColor] = useState<string>('#000000');
  async function handleSubmit(e: FormEvent): Promise<void> {
    e.preventDefault();
    const titleRegex = /^[a-zA-Zа-яА-ЯёЁіІїЇєЄґҐ0-9\s._-]+$/;
    if (title.trim() && titleRegex.test(title)) {
      const dataToSend: IBoard = { title, custom: { background: color } };
      try {
        const id = await postNewBoard(dataToSend);
        if (id) {
          const newFullBoardObject: IBoard = { id, title, custom: { background: color } };
          onBoardAdded(newFullBoardObject);
          setTitle('');
          setColor('#000000');
        }
      } catch (error) {
        toast.error('Error creating new board');
      }
    }
  }
  return (
    <PencilWrapper className="home__board_item" color={color || 'black'}>
      <form className="form__add" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Введіть назву дошки..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="form__add_title"
        />
        <input type="color" value={color} className="form__add_color" onChange={(e) => setColor(e.target.value)} />
        <button type="submit" className="board__button_add-item">
          Додати дошку
        </button>
      </form>
    </PencilWrapper>
  );
}
