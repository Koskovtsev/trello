import { useState } from 'react';
import { IList } from '../../../../common/interfaces/IList';
import { Card } from '../Card/Card';
import './list.scss';
import { AddCardForm } from '../Card/AddCardForm';
import { ChangeTitleForm } from '../Board/ChangeTitleForm';
import { deleteList } from '../../../../api/boardsService';

interface IAddCardChangesProps extends IList {
  onListChanged(): void;
  boardId: number;
}
export function List({ id, title, cards, onListChanged, boardId }: IAddCardChangesProps): JSX.Element {
  const [isVisibleChangeTitleForm, setVisibleChangeTitleForm] = useState(false);
  const [isVisibleAddCardForm, setVisibleAddCardForm] = useState(false);
  // eslint-disable-next-line no-console
  // console.log(`айді той шо приходть в ліст: ${id}`);
  const handleCardAdded = (): void => {
    onListChanged();
    setVisibleAddCardForm(false);
  };
  const handleTitleChanged = (isChanged: boolean): void => {
    if (isChanged) {
      onListChanged();
    }
    setVisibleChangeTitleForm(false);
  };
  async function handleDeleteList(): Promise<void> {
    const response = await deleteList(boardId, id ?? 0);
    if (response === 'Deleted') {
      onListChanged();
    }
  }
  return (
    <div className="list">
      <div className="list__header">
        {!isVisibleChangeTitleForm && (
          <h2 className="list__title" onClick={() => setVisibleChangeTitleForm(true)}>
            {title}
          </h2>
        )}
        {isVisibleChangeTitleForm && (
          <ChangeTitleForm
            key={id}
            onTitleChanged={handleTitleChanged}
            listId={id ?? 0}
            boardId={boardId}
            currentTitle={title ?? ''}
            type="list"
          />
        )}
        <button className="icon__delete_button" aria-label="Delete" onClick={handleDeleteList}>
          <i className="fa fa-trash" />
        </button>
      </div>
      <ul className="list__cards">{cards?.map((elem) => <Card key={elem.id} {...elem} />)}</ul>
      {isVisibleAddCardForm && (
        <AddCardForm
          key={id}
          title={title ?? ''}
          onCardAdded={handleCardAdded}
          position={(cards?.length ?? 0) + 1}
          boardId={boardId}
          list_id={id ?? 0}
        />
      )}
      <button className="button__add_card" onClick={() => setVisibleAddCardForm(true)}>
        ➕ додати картку
      </button>
    </div>
  );
}
