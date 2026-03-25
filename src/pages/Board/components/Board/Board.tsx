import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { IBoardData } from '../../../../common/interfaces/IBoardData';
import { getBoard } from '../../../../api/boardsService';
import { IList } from '../../../../common/interfaces/IList';
import { List } from '../List/List';
import { AddListForm } from '../List/AddListForm';
import { ChangeTitleForm } from './ChangeTitleForm';
import './board.scss';

export function Board(): JSX.Element {
  const [title, setTitle] = useState('');
  const [refreshList, setRefreshList] = useState(false);
  const [isChangeTitle, setIsChangeTitle] = useState(false);
  const [isVisibleAddListForm, setVisibleAddListForm] = useState(false);
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
      setLists(boardData.lists);
    }
    getList();
  }, [boardId, refreshList]);
  const handleListAdded = (): void => {
    setRefreshList((prev) => !prev);
    setVisibleAddListForm(false);
  };
  const handleListChanged = (): void => {
    setRefreshList((prev) => !prev);
  };
  const handleTitleChanged = (isChanged: boolean): void => {
    if (isChanged) {
      setIsChangeTitle(false);
      handleListChanged();
    } else {
      setIsChangeTitle(false);
    }
  };
  return (
    <div className="board">
      <div className="board__title_wrapper">
        {!isChangeTitle && (
          <div className="board__title" onClick={() => setIsChangeTitle(true)}>
            {title}
          </div>
        )}
        {isChangeTitle && (
          <ChangeTitleForm
            key={id}
            onTitleChanged={handleTitleChanged}
            boardId={id}
            currentTitle={title ?? ''}
            type="board"
          />
        )}
      </div>
      <div className="board__list">
        {lists.map((elem) => (
          <List key={elem.id} {...elem} onListChanged={handleListChanged} boardId={id} />
        ))}
        {!isVisibleAddListForm && (
          <button className="board__add_button" onClick={() => setVisibleAddListForm(true)}>
            ➕ Додайде ще один список
          </button>
        )}
        {isVisibleAddListForm && (
          <AddListForm key={id} onListAdded={handleListAdded} position={lists.length + 1} boardId={id} />
        )}
      </div>
    </div>
  );
}
