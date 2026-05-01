import toast from 'react-hot-toast';
import { FormEvent, useState } from 'react';
import { TextureList } from '../../../../components/Textures/TextureList';
import { postList } from '../../../../api/boardsService';
import '../List/list.scss';

interface IAddListFormProps {
  onListAdded(texture: string): void;
  position: number;
  boardId: number;
}

export function AddListForm({ onListAdded, position, boardId }: IAddListFormProps): JSX.Element {
  const [title, setTitle] = useState('');
  const [currentTexture, setCurrentTexture] = useState('gray');
  async function handleSubmit(e: FormEvent): Promise<void> {
    e.preventDefault();
    const titleRegex = /^[a-zA-Zа-яА-ЯёЁіІїЇєЄґҐ0-9\s._-]+$/; // TODO: винести окремо перевірку інпуту.
    if (title.trim() && titleRegex.test(title)) {
      const dataToSend = { title, position, custom: { listTextures: currentTexture } };
      try {
        const response = await postList(boardId, dataToSend);
        if (response === 'Created') {
          onListAdded(currentTexture);
          setTitle('');
        }
      } catch (error) {
        toast.error(`Error creating new list`);
      }
    }
  }
  // TODO: стандартний інпут сильно виділяється, стилізувати під оригінальний трелло.
  // TODO: useClickOutside - щоб прибрать коли неактивний, використати його до всих відкривающихся модалок/компонентів.
  return (
    <div className="list" style={{ backgroundImage: `url(${currentTexture})`, backgroundColor: '#acacac' }}>
      <form className="form__add_list" onSubmit={handleSubmit}>
        <input
          type="text"
          className="input_list_title"
          placeholder="Введіть назву списку..."
          value={title ?? ''}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextureList key={boardId} onTexturePicked={setCurrentTexture} currentTexture={currentTexture} />
        <button type="submit" className="button__add_list">
          Додати список
        </button>
      </form>
    </div>
  );
}
