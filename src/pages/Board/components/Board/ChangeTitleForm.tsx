import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { ICard } from '../../../../common/interfaces/ICard';
import { IList } from '../../../../common/interfaces/IList';
import { IBoard } from '../../../../common/interfaces/IBoard';
import { putBoardUpdates, putCardUpdates, putListUpdates } from '../../../../api/boardsService';

type IChangeTitleFormProps = IBoardChangeProps | IListChangeProps | ICardChangeProps;

interface IBoardChangeProps extends IBaseProps {
  type: 'board';
}

interface ICardChangeProps extends IBaseProps {
  type: 'card';
  listId: number;
  cardId: number;
}

interface IListChangeProps extends IBaseProps {
  type: 'list';
  listId: number;
}

interface IBaseProps {
  onTitleChanged(isChanged: boolean): void;
  boardId: number;
  currentTitle: string;
}

export function ChangeTitleForm(props: IChangeTitleFormProps): JSX.Element {
  const inputRef = useRef<HTMLInputElement>(null);
  const { onTitleChanged, currentTitle, boardId, type } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [newTitle, setNewTitle] = useState(currentTitle);
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, []);
  async function handleSubmitTitle(e: React.SyntheticEvent): Promise<void> {
    if (isLoading) return;
    e.preventDefault();
    e.stopPropagation();
    if (newTitle === currentTitle) {
      onTitleChanged(false);
      return;
    }
    const titleRegex = /^[a-zA-Zа-яА-ЯёЁіІїЇєЄґҐ0-9\s._-]+$/;
    if (newTitle?.trim() && titleRegex.test(newTitle)) {
      setIsLoading(true);
      try {
        if (type === 'list') {
          const { listId } = props;
          const newList: IList = { title: newTitle };
          await putListUpdates(newList, boardId, listId);
        }
        if (type === 'board') {
          const newBoard: IBoard = { id: boardId, title: newTitle };
          await putBoardUpdates(newBoard);
        }
        if (type === 'card') {
          const { listId, cardId } = props;
          const newCard: ICard = { title: newTitle, list_id: listId };
          await putCardUpdates(newCard, boardId, cardId);
        }
        onTitleChanged(true);
      } catch (error) {
        toast.error(`Error updating ${type} title.`);
      } finally {
        setIsLoading(false);
      }
    } else {
      setNewTitle(currentTitle);
      onTitleChanged(false);
    }
  }
  return (
    <form className="edit-title" onSubmit={handleSubmitTitle}>
      <input
        className="edit-title__input"
        ref={inputRef}
        type="text"
        value={newTitle}
        onChange={(e) => setNewTitle(e.target.value)}
        onBlur={handleSubmitTitle}
        onFocus={(e) => e.target.select()}
        disabled={isLoading}
        size={Math.max(newTitle.length - 3, 1)}
      />
    </form>
  );
}
