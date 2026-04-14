import toast from 'react-hot-toast';
import { FormEvent, useRef, useState } from 'react';
import { postNewBoard } from '../../../../api/boardsService';
import { IBoard } from '../../../../common/interfaces/IBoard';
import { TextureList, textures } from '../../../Board/components/Textures/TextureList';
import { validateTitle } from '../../../../common/validador';
import { Portal } from '../../../../components/Portal';
import { useClickOutside } from '../../../../hooks/useClickOutside';
import './addForm.scss';

interface IAddBoardFormProps {
  active: boolean;
  onBoardAdded(board: IBoard | false): void;
}
export function AddBoardModal({ active, onBoardAdded }: IAddBoardFormProps): JSX.Element | null {
  if (!active) return null;
  const modalRef = useRef<HTMLDivElement>(null);
  const [title, setTitle] = useState<string>('');
  const [currentTexture, setCurrentTexture] = useState<string | null>(textures[8].url);
  const isValid = validateTitle(title);
  async function handleSubmit(e: FormEvent): Promise<void> {
    e.preventDefault();
    if (isValid) {
      const dataToSend: IBoard = { title, custom: { background: currentTexture ?? textures[8].url } };
      try {
        const id = await postNewBoard(dataToSend); // TODO: компонент має повертати назву а не відправляти на сервер.
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
  useClickOutside(modalRef, () => {
    onBoardAdded(false);
  });
  return (
    <Portal>
      <div className="modal" ref={modalRef}>
        <div className="modal__header">
          <span className="modal__header_title">Створити дошку</span>
          <button type="button" className="modal__close-btn" aria-label="Close" onClick={() => onBoardAdded(false)}>
            <i className="fa-solid fa-xmark" />
          </button>
        </div>
        <form className="form__add" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Введіть назву дошки..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form__add_title"
          />
          <span className="modal__texture_title">Фон</span>
          <div className="modal_texture">
            <TextureList key={0} onTexturePicked={setCurrentTexture} />
          </div>
          <button type="submit" className="board__button_add-item" disabled={!isValid}>
            Додати дошку
          </button>
        </form>
      </div>
    </Portal>
  );
}
