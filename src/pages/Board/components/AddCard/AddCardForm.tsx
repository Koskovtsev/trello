import { FormEvent, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { ICard } from '../../../../common/interfaces/ICard';
import { useClickOutside } from '../../../../hooks/useClickOutside';
import { validateTitle } from '../../../../common/validador';
import { AppDispatch } from '../../../../store/store';
import { createCardThunk, fetchBoardThunk } from '../../../../store/boards/thunks';
import './addCardForm.scss';

interface IAddCardFormProps extends ICard {
  onClose(): void;
  boardId: number;
  list_id: number;
}
export function AddCardForm({ onClose, position, boardId, list_id }: IAddCardFormProps): JSX.Element {
  const [title, setTitle] = useState('');
  const [isTitleEntered, setIsTitleEntered] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const modalRef = useRef<HTMLDivElement>(null);
  const isValid = validateTitle(title);
  async function saveTitle(): Promise<void> {
    const payload = {
      boardId,
      cardData: {
        title,
        list_id,
        position,
      },
    };
    await dispatch(createCardThunk(payload)).unwrap();
    await dispatch(fetchBoardThunk(boardId)).unwrap();
    onClose();
  }
  useClickOutside(modalRef, () => {
    if (isValid) {
      saveTitle();
      setTitle('');
    }
  });
  async function handleSubmit(e: FormEvent): Promise<void> {
    e.preventDefault();
    if (isValid) {
      await saveTitle();
      setTitle('');
    }
  }
  const showInputError = isTitleEntered && !isValid;
  return (
    <div className="input-form__wrapper" ref={modalRef}>
      <form className="form__add_card" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Введіть назву картки..."
          className={`input_card_title ${showInputError ? `error` : ``}`}
          value={title ?? ''}
          onChange={(e) => {
            setTitle(e.target.value);
            setIsTitleEntered(true);
          }}
        />
        {showInputError && <span className="modal__error-text">Назва не відповідає вимогам</span>}
      </form>
    </div>
  );
}
