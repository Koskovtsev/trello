import toast from 'react-hot-toast';
import { FormEvent, useState } from 'react';
import { postCard } from '../../../../api/boardsService';
import { ICard } from '../../../../common/interfaces/ICard';

interface IAddCardFormProps extends ICard {
  onCardAdded(card: ICard): void;
  boardId: number;
  list_id: number;
}

export function AddCardForm({ onCardAdded, position, boardId, list_id }: IAddCardFormProps): JSX.Element {
  const [title, setTitle] = useState('');
  async function handleSubmit(e: FormEvent): Promise<void> {
    e.preventDefault();
    const titleRegex = /^[a-zA-Zа-яА-ЯёЁіІїЇєЄґҐ0-9\s._-]+$/;
    if (title.trim() && titleRegex.test(title)) {
      const dataToSend = { title, list_id, position };
      try {
        const response = await postCard(dataToSend, boardId);
        if (response === 'Created') {
          onCardAdded(dataToSend);
          setTitle('');
        }
      } catch (error) {
        toast.error('There is an Error to add new Card');
      }
    }
  }
  return (
    <form className="form__add_card" onSubmit={handleSubmit}>
      <input
        type="text"
        className="input_card_title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onBlur={handleSubmit}
      />
    </form>
  );
}
