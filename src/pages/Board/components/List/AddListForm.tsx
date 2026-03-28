import { FormEvent, useState } from 'react';
import { postList } from '../../../../api/boardsService';
import { TextureList } from './TextureList';
import './list.scss';

interface IAddListFormProps {
  onListAdded(texture: string): void;
  position: number;
  boardId: number;
}

export function AddListForm({ onListAdded, position, boardId }: IAddListFormProps): JSX.Element {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const defaultColor = require('../../../../assets/textur_black.jpg');
  const [title, setTitle] = useState('');
  const [currentTexture, setCurrentTexture] = useState(defaultColor);
  async function handleSubmit(e: FormEvent): Promise<void> {
    e.preventDefault();
    if (title.trim()) {
      const dataToSend = { title, position, custom: { listTextures: currentTexture } };
      // eslint-disable-next-line no-console
      // console.log(dataToSend);
      const response = await postList(dataToSend, boardId);
      if (response === 'Created') {
        onListAdded(currentTexture);
        setTitle('');
      }
    }
  }

  // eslint-disable-next-line no-console, @typescript-eslint/no-var-requires
  // console.log(require('../../../../assets/textur_yellow.jpg'));
  return (
    <div className="list" style={{ backgroundImage: `url(${currentTexture})` }}>
      <form className="form__add_list" onSubmit={handleSubmit}>
        <input
          type="text"
          className="input_list_title"
          placeholder="Введіть назву списку..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          // onBlur={handleSubmit}
        />
        <TextureList key={boardId} onTexturePicked={setCurrentTexture} />
        <button type="submit" className="button__add_list">
          Додати список
        </button>
      </form>
    </div>
  );
}
