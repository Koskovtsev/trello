import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getBoard, putBoardUpdates } from '../../../../api/boardsService';
import { List } from '../List/List';
import { AddListForm } from '../List/AddListForm';
import { ChangeTitleForm } from './ChangeTitleForm';
import './board.scss';
import { IBoard } from '../../../../common/interfaces/IBoard';

export function Board(): JSX.Element {
  const [boardData, setBoradData] = useState<IBoard | null>(null);
  const [refreshList, setRefreshList] = useState(false);
  const [isChangeTitle, setIsChangeTitle] = useState(false);
  const [isVisibleAddListForm, setVisibleAddListForm] = useState(false);
  const { boardId } = useParams<{ boardId: string }>();
  const id = Number(boardId);
  useEffect(() => {
    async function fetchBoard(): Promise<void> {
      try {
        const data = await getBoard(id);
        setBoradData(data);
      } catch (error) {
        // eslint-disable-next-line no-console, @typescript-eslint/no-var-requires
        // console.log(require('../../../../assets/textur_yellow.jpg'));
      }
    }
    fetchBoard();
  }, [boardId, refreshList]);
  const updateListTexture = async (listId: number, listTexture: string, freshData: IBoard): Promise<void> => {
    const texturedLists = freshData?.custom?.listTextures || {};
    const updatedCustom = {
      ...freshData.custom,
      listTextures: {
        ...texturedLists,
        [String(listId)]: listTexture,
      },
    };
    const response = await putBoardUpdates({
      id,
      title: freshData.title,
      custom: updatedCustom,
    } as IBoard);
    if (response === 'Updated') {
      setRefreshList((prev) => !prev);
    }
  };
  const handleNewList = async (texture: string): Promise<void> => {
    if (!boardData) return;
    const data: IBoard = await getBoard(id);
    const texturedLists = data?.custom?.listTextures || {};
    const newId = data.lists?.find(
      (list) => !texturedLists[String(list.id)] || texturedLists[String(list.id)] === null
    )?.id;
    // eslint-disable-next-line no-console, @typescript-eslint/no-var-requires
    console.log(`newID: ${newId}}`);
    if (!newId) return;
    // eslint-disable-next-line no-console, @typescript-eslint/no-var-requires
    console.log(
      `Айді нового списка: ${newId}, список вже готових об'єктів айд-текстура: ${JSON.stringify(texturedLists)}, listTextures: ${JSON.stringify(boardData.custom?.listTextures)}`
    );
    await updateListTexture(newId, texture, data);
  };

  if (!boardData) {
    return <div className="loading">Завантаження...</div>;
  }
  const lists = boardData.lists ?? [];
  const title = boardData.title ?? '';
  const handleListAdded = (texture: string): void => {
    handleNewList(texture);
    setVisibleAddListForm(false);
  };
  const handleListChanged = (listId?: number): void => {
    if (listId && listId > lists.length) {
      // eslint-disable-next-line no-console
      console.log(`колір: ${listId}`);
    }
    setRefreshList((prev) => !prev);
  };
  const handleTitleChanged = (isChanged: boolean): void => {
    if (isChanged) {
      handleListChanged();
    }
    setIsChangeTitle(false);
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
          <List
            key={elem.id}
            {...elem}
            onListChanged={handleListChanged}
            boardData={boardData}
            boardId={id}
            onTextureUpdate={updateListTexture}
          />
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
