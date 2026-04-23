import { FormEvent, useRef, useState } from 'react';
import { TextureList, textures } from '../../../../components/Textures/TextureList';
import { validateTitle } from '../../../../common/validador';
import { Portal } from '../../../../components/Portal';
import { useClickOutside } from '../../../../hooks/useClickOutside';
import './addBoardModal.scss';

interface IAddBoardFormProps {
  active: boolean;
  setActive(isActive: boolean): void;
  onBoardAdded(title: string, texture: string): void;
}
export function AddBoardModal({ active, setActive, onBoardAdded }: IAddBoardFormProps): JSX.Element | null {
  if (!active) return null;
  const modalRef = useRef<HTMLDivElement>(null);
  const [isTitleEntered, setIsTitleEntered] = useState(false);
  const [title, setTitle] = useState<string>('');
  const [currentTexture, setCurrentTexture] = useState<string>(textures[8].url);
  const isValid = validateTitle(title);
  function handleSubmit(e: FormEvent): void {
    e.preventDefault();
    if (isValid) {
      setTitle('');
      setActive(false);
      onBoardAdded(title, currentTexture);
    }
  }
  useClickOutside(modalRef, () => {
    setActive(false);
  });
  const showInputError = isTitleEntered && !isValid;
  return (
    <Portal>
      <div className="modal" ref={modalRef}>
        <div className="modal__header">
          <span className="modal__header_title">Створити дошку</span>
          <button type="button" className="modal__close-btn" aria-label="Close" onClick={() => setActive(false)}>
            <i className="fa-solid fa-xmark" />
          </button>
        </div>
        <form className="form__add" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Введіть назву дошки..."
            value={title ?? ''}
            onChange={(e) => {
              setTitle(e.target.value);
              setIsTitleEntered(true);
            }}
            className={`form__add_title ${showInputError ? `error` : ``}`}
          />
          {showInputError && (
            <span className="modal__error-text">назва занадто коротка, або введені недопустимі символи</span>
          )}
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
