import toast from 'react-hot-toast';
import { FormEvent, useState } from 'react';
import { postList } from '../../../../api/boardsService';
import { TextureList, textures } from './TextureList';
import './list.scss';

interface IAddListFormProps {
  onListAdded(texture: string): void;
  position: number;
  boardId: number;
}

export function AddListForm({ onListAdded, position, boardId }: IAddListFormProps): JSX.Element {
  const [title, setTitle] = useState('');
  const [currentTexture, setCurrentTexture] = useState(textures[8].url);
  async function handleSubmit(e: FormEvent): Promise<void> {
    e.preventDefault();
    const titleRegex = /^[a-zA-Zа-яА-ЯёЁіІїЇєЄґҐ0-9\s._-]+$/;
    if (title.trim() && titleRegex.test(title)) {
      const dataToSend = { title, position, custom: { listTextures: currentTexture } };
      try {
        const response = await postList(dataToSend, boardId);
        if (response === 'Created') {
          onListAdded(currentTexture);
          setTitle('');
        }
      } catch (error) {
        toast.error(`Error creating new list`);
      }
    }
  }
  return (
    <div className="list" style={{ backgroundImage: `url(${currentTexture})` }}>
      <form className="form__add_list" onSubmit={handleSubmit}>
        <input
          type="text"
          className="input_list_title"
          placeholder="Введіть назву списку..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextureList key={boardId} onTexturePicked={setCurrentTexture} />
        <button type="submit" className="button__add_list">
          Додати список
        </button>
      </form>
    </div>
  );
}
