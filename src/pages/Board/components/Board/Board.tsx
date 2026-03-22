import { useState } from 'react';
import { IBoard } from '../../../../common/interfaces/IBoard';
import { PencilWrapper } from '../PencilWrapper';
import { deleteBoard, putBoardUpdates } from '../../../../api/boardsService';

interface IBoardProps extends IBoard {
  removeDeletedBoard(id: number): void;
  updateBoardTitle(id: number, newTitle: string): void;
}

export function Board({ id, title, custom, removeDeletedBoard, updateBoardTitle }: IBoardProps): JSX.Element {
  const [isChangeTitle, setIsChangeTitle] = useState(false);
  const [newTitle, setNewTitle] = useState<string | undefined>(title);
  async function handleDeleteBoard(e: React.MouseEvent<HTMLButtonElement>): Promise<void> {
    e.stopPropagation();
    e.preventDefault();
    // eslint-disable-next-line no-console
    console.log(`Кнопка натиснута! id: ${id}`);
    if (id) {
      const response = await deleteBoard(id);
      if (response === 'Deleted') {
        removeDeletedBoard(id);
      }
    }
  }
  function handleChangeTitle(e: React.MouseEvent<HTMLSpanElement>): void {
    e.stopPropagation();
    e.preventDefault();
    // eslint-disable-next-line no-console
    console.log(`Редагування натиснуте! id: ${id}`);
    setIsChangeTitle(true);
  }
  async function handleSubmit(e: React.SyntheticEvent): Promise<void> {
    e.preventDefault();
    e.stopPropagation();
    if (newTitle?.trim()) {
      const newBoard: IBoard = { id, title: newTitle, custom };
      // eslint-disable-next-line no-console
      console.log(JSON.stringify(newBoard));
      putBoardUpdates(newBoard);
      setIsChangeTitle(false);
      if (id) {
        updateBoardTitle(id, newTitle);
      }
    } else {
      setNewTitle(title);
      setIsChangeTitle(false);
    }
  }

  return (
    <PencilWrapper className="home__board_item" color={custom?.background || 'black'}>
      <div className="home__header">
        {!isChangeTitle && (
          <span className="board__item_title" onClick={handleChangeTitle}>
            {title}
          </span>
        )}
        {isChangeTitle && (
          <form className="fomr__change_title" onSubmit={handleSubmit}>
            <input
              type="text"
              className="input_change_title"
              value={newTitle}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
              }}
              onChange={(e) => setNewTitle(e.target.value)}
              onBlur={handleSubmit}
            />
          </form>
        )}
        <button className="icon__delete_button" aria-label="Delete" onClick={handleDeleteBoard}>
          <i className="fa fa-trash" />
        </button>
      </div>
    </PencilWrapper>
  );
}
