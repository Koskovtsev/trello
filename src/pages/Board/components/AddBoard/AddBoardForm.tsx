import toast from 'react-hot-toast';
import { FormEvent, useState } from 'react';
import { TextureList, textures } from '../List/TextureList';
import { postNewBoard } from '../../../../api/boardsService';
import './addForm.scss';
import { IBoard } from '../../../../common/interfaces/IBoard';

interface IAddBoardFormProps {
  onBoardAdded(board: IBoard): void;
}
export function AddBoardForm({ onBoardAdded }: IAddBoardFormProps): JSX.Element {
  const [title, setTitle] = useState<string>('');
  const [currentTexture, setCurrentTexture] = useState<string | null>(textures[8].url);
  // const [color, setColor] = useState<string>(textures[8].url);
  async function handleSubmit(e: FormEvent): Promise<void> {
    e.preventDefault();
    const titleRegex = /^[a-zA-Zа-яА-ЯёЁіІїЇєЄґҐ0-9\s._-]+$/;
    if (title.trim() && titleRegex.test(title)) {
      const dataToSend: IBoard = { title, custom: { background: currentTexture ?? textures[8].url } };
      try {
        const id = await postNewBoard(dataToSend);
        if (id) {
          const newFullBoardObject: IBoard = { id, title, custom: { background: currentTexture ?? textures[8].url } };
          onBoardAdded(newFullBoardObject);
          setTitle('');
        }
      } catch (error) {
        toast.error('Error creating new board');
      }
    }
  }
  return (
    <div className="home__board_item" style={{ backgroundImage: `url(${currentTexture})` }}>
      <form className="form__add" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Введіть назву дошки..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="form__add_title"
        />
        <TextureList key={0} onTexturePicked={setCurrentTexture} />
        <button type="submit" className="board__button_add-item">
          Додати дошку
        </button>
      </form>
    </div>
  );
}
