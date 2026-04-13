import { useEffect, useRef, useState } from 'react';
// import toast from 'react-hot-toast';
// import { putBoardUpdates, putCardUpdates, putListUpdates } from '../../../../api/boardsService';
// import { IList } from '../../../../common/interfaces/IList';
// import { IBoard } from '../../../../common/interfaces/IBoard';
// import { ICard } from '../../../../common/interfaces/ICard';
import { validateTitle } from '../../../../common/validador';

// type IChangeTitleFormProps = IBoardChangeProps | IListChangeProps | ICardChangeProps;

// interface IBoardChangeProps extends IBaseProps {
//   type: 'board';
// }

// interface ICardChangeProps extends IBaseProps {
//   type: 'card';
//   listId: number;
//   cardId: number;
// }

// interface IListChangeProps extends IBaseProps {
//   type: 'list';
//   listId: number;
// }

interface IChangeTitleFormProps {
  currentTitle: string;
  onTitleChanged(newTitle: string | boolean): void;
  // boardId: number;
}
export function ChangeTitleForm(props: IChangeTitleFormProps): JSX.Element {
  const inputRef = useRef<HTMLInputElement>(null);
  const { onTitleChanged, currentTitle } = props;
  const [newTitle, setNewTitle] = useState(currentTitle);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, []);
  async function handleSubmitTitle(e: React.SyntheticEvent): Promise<void> {
    e.preventDefault();
    e.stopPropagation();
    if (newTitle === currentTitle) {
      onTitleChanged(false);
      return;
    }
    if (!validateTitle(newTitle)) {
      setError('Назва не відповідає вимогам');
    } else {
      onTitleChanged(newTitle);
    }
    // setIsLoading(true);
    // // TODO: компонент не має відправляти/обробляти запити на сервер, тільки повертати назву на верх.
    // try {
    //   if (type === 'list') {
    //     const { listId } = props;
    //     const newList: IList = { title: newTitle };
    //     await putListUpdates(newList, boardId, listId);
    //   }
    //   if (type === 'board') {
    //     const newBoard: IBoard = { id: boardId, title: newTitle };
    //     await putBoardUpdates(newBoard);
    //   }
    //   if (type === 'card') {
    //     const { listId, cardId } = props;
    //     const newCard: ICard = { title: newTitle, list_id: listId };
    //     await putCardUpdates(newCard, boardId, cardId);
    //   }
    //   onTitleChanged(true);
    // } catch (error) {
    //   toast.error(`Error updating ${type} title.`);
    // } finally {
    //   setIsLoading(false);
    // }
  }
  return (
    <form className={`edit-title ${error ? 'edit-title--error' : ''}`} onSubmit={handleSubmitTitle}>
      <input
        className="edit-title__input"
        ref={inputRef}
        type="text"
        value={newTitle}
        onChange={(e) => {
          setNewTitle(e.target.value);
          if (error) setError(null);
        }}
        onBlur={handleSubmitTitle}
        onFocus={(e) => e.target.select()}
        // disabled={isLoading}
        size={Math.max(newTitle.length - 3, 1)}
      />
    </form>
  );
}
