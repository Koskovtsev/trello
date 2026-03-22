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
  //   const [description] = useState('dd');
  async function handleSubmit(e: FormEvent): Promise<void> {
    e.preventDefault();
    if (title.trim()) {
      const dataToSend = { title, list_id, position };
      // eslint-disable-next-line no-console
      //   console.log(
      //     `додаємо новий список з назвою ${title} and a position is ${position} data: ${JSON.stringify(dataToSend)} boardId: ${boardId} listID: ${list_id}`
      //   );
      const response = await postCard(dataToSend, boardId);
      if (response === 'Created') {
        onCardAdded(dataToSend);
        setTitle('');
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
