import { useEffect, useRef, useState } from 'react';
import { IList } from '../../../../common/interfaces/IList';
import { putBoardUpdates, putListUpdates } from '../../../../api/boardsService';
import { IBoard } from '../../../../common/interfaces/IBoard';

type IChangeTitleFormProps = IBoardChangeProps | IListChangeProps;

interface IBoardChangeProps extends IBaseProps {
  type: 'board';
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
    // TODO: зробить неактивну форму поки йдуть запити на сервер.
    if (newTitle?.trim()) {
      if (type === 'list') {
        const { listId } = props;
        const newBoard: IList = { title: newTitle };
        setIsLoading(true);
        await putListUpdates(newBoard, boardId, listId);
        onTitleChanged(true);
        setIsLoading(false);
      }
      if (type === 'board') {
        const newBoard: IBoard = { id: boardId, title: newTitle };
        setIsLoading(true);
        await putBoardUpdates(newBoard);
        onTitleChanged(true);
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
