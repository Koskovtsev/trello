import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { IBoard } from '../../common/interfaces/IBoard';
import { IBoardData } from '../../common/interfaces/IBoardData';
import { getBoard, putBoardUpdates } from '../../api/boardsService';
import { IList } from '../../common/interfaces/IList';
import { List } from './components/List/List';
// import { AddListForm } from './components/List/AddListForm';
import { AddBoardForm } from './components/AddBoard/AddBoardForm';
import './components/Board/board.scss';

export function Board(): JSX.Element {
  const [title, setTitle] = useState('');
  const [isChangeTitle, setIsChangeTitle] = useState(false);
  const [isVisibleAddListForm, setVisibleAddListForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [lists, setLists] = useState<IList[]>([]);
  const { boardId } = useParams<{ boardId: string }>();
  const id = Number(boardId);

  async function getNewTitle(): Promise<IBoardData> {
    const boardData = await getBoard(id);
    setTitle(boardData.title);
    return boardData;
  }
  useEffect(() => {
    async function getList(): Promise<void> {
      const boardData = await getNewTitle();
      const [boardLists] = boardData.lists;
      setLists([...lists, boardLists]);
      setNewTitle(boardData.title);
    }
    getList();
  }, [boardId]);
  async function handleSubmitTitle(e: React.SyntheticEvent): Promise<void> {
    e.preventDefault();
    e.stopPropagation();
    if (newTitle?.trim()) {
      const newBoard: IBoard = { id, title: newTitle };
      await putBoardUpdates(newBoard);
      await getNewTitle();
      setIsChangeTitle(false);
    } else {
      setNewTitle(title);
      setIsChangeTitle(false);
    }
  }
  const handleListAdded = (newList: IList): void => {
    setLists([...lists, newList]);
    setVisibleAddListForm(false);
  };
  return (
    <div className="board">
      {!isChangeTitle && (
        <span className="board__title" onClick={() => setIsChangeTitle(true)}>
          {title}
        </span>
      )}
      {isChangeTitle && (
        <form className="fomr__change_title" onSubmit={handleSubmitTitle}>
          <input
            type="text"
            className="input_change_title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onBlur={handleSubmitTitle}
          />
        </form>
      )}
      <div className="board__list">
        {lists.map((elem) => (
          <List key={elem.id} title={elem.title} cards={elem.cards} />
        ))}
        {!isVisibleAddListForm && (
          <button className="board__add-button" onClick={() => setVisibleAddListForm(true)}>
            + Додайде ще один список
          </button>
        )}
        {isVisibleAddListForm && <AddBoardForm onBoardAdded={handleListAdded} />}
      </div>
    </div>
  );
}
