import toast from 'react-hot-toast';
import { FormEvent, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { TextureList } from '../../../../components/Textures/TextureList';
import { validateTitle } from '../../../../common/validador';
import { IList } from '../../../../common/interfaces/IList';
import { AppDispatch } from '../../../../store/store';
import { createListThunk, fetchBoardThunk, updateBoardThunk } from '../../../../store/boards/thunks';
import { IBoard } from '../../../../common/interfaces/IBoard';
import '../List/list.scss';
import { useClickOutside } from '../../../../hooks/useClickOutside';

interface IAddListFormProps {
  onClose(): void;
  position: number;
  boardId: number;
  title: string;
  setTitle(newTitle: string): void;
}

export function AddListForm({ onClose, position, boardId, title, setTitle }: IAddListFormProps): JSX.Element {
  const formRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch<AppDispatch>();
  const [currentTexture, setCurrentTexture] = useState('gray');

  useClickOutside(formRef, onClose);

  const createList = async (): Promise<void> => {
    const listData: IList = {
      title: title.trim(),
      position,
    };
    await dispatch(createListThunk({ boardId, listData })).unwrap();
    const newBoard = await dispatch(fetchBoardThunk(boardId)).unwrap();
    const newListId = newBoard.lists?.find((list) => list.position === position)?.id;
    if (!newListId) return;
    const boardData: IBoard = {
      ...newBoard,
      custom: {
        ...newBoard.custom,
        listTextures: {
          ...newBoard.custom?.listTextures,
          [newListId]: currentTexture,
        },
      },
    };
    await dispatch(updateBoardThunk({ boardId, boardData }));
  };

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    if (!title.trim() && !validateTitle(title)) return;
    try {
      await createList();
      setTitle('');
      onClose();
    } catch (error) {
      toast.error(`Catn create list`);
    }
  }; // TODO: стандартний інпут сильно виділяється, стилізувати під оригінальний трелло.

  return (
    <div
      className="list"
      style={{ backgroundImage: `url(${currentTexture})`, backgroundColor: '#acacac' }}
      ref={formRef}
    >
      <form className="form__add_list" onSubmit={(e) => handleSubmit(e)}>
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
