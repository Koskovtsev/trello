import { FormEvent, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { ICard } from '../../../../common/interfaces/ICard';
import { useClickOutside } from '../../../../hooks/useClickOutside';
import { validateTitle } from '../../../../common/validador';
import { AppDispatch } from '../../../../store/store';
import { createCardThunk, fetchBoardThunk } from '../../../../store/boards/thunks';
import './addCardForm.scss';

interface IAddCardFormProps extends ICard {
  onCardAdded(): void;
  boardId: number;
  list_id: number;
}
export function AddCardForm({ onCardAdded, position, boardId, list_id }: IAddCardFormProps): JSX.Element {
  const [title, setTitle] = useState('');
  const [isTitleEntered, setIsTitleEntered] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const modalRef = useRef<HTMLDivElement>(null);
  const isValid = validateTitle(title);
  function saveTitle(): void {
    const payload = {
      boardId,
      cardData: {
        title,
        list_id,
        position,
      },
    };
    dispatch(createCardThunk(payload));
    dispatch(fetchBoardThunk(boardId));
    onCardAdded();
  }
  useClickOutside(modalRef, () => {
    if (isValid) {
      saveTitle();
      setTitle('');
    }
  });
  function handleSubmit(e: FormEvent): void {
    e.preventDefault();
    if (isValid) {
      saveTitle();
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
