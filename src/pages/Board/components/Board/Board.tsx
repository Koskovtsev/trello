import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
// import { IBoardData } from '../../../../common/interfaces/IBoardData';
import { getBoard } from '../../../../api/boardsService';
import { List } from '../List/List';
import { AddListForm } from '../List/AddListForm';
import { ChangeTitleForm } from './ChangeTitleForm';
import './board.scss';
import { IBoard } from '../../../../common/interfaces/IBoard';

export function Board(): JSX.Element {
  const [boardData, setBoradData] = useState<IBoard | null>(null);
  // const [title, setTitle] = useState('');
  const [refreshList, setRefreshList] = useState(false);
  const [isChangeTitle, setIsChangeTitle] = useState(false);
  const [isVisibleAddListForm, setVisibleAddListForm] = useState(false);
  // const [lists, setLists] = useState<IList[]>([]);
  const { boardId } = useParams<{ boardId: string }>();
  const id = Number(boardId);

  // async function getNewTitle(): Promise<IBoardData> {
  //   const data = await getBoard(id);
  //   setTitle(data.title);
  //   return data;
  // }
  useEffect(() => {
    async function fetchBoard(): Promise<void> {
      try {
        const data = await getBoard(id);
        setBoradData(data);
      } catch (error) {
        // eslint-disable-next-line no-console, @typescript-eslint/no-var-requires
        console.log(require('../../../../assets/textur_yellow.jpg'));
      }
    }
    fetchBoard();
  }, [boardId, refreshList]);
  const lists = boardData?.lists ?? [];
  const title = boardData?.title ?? '';
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
