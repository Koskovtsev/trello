import { useState } from 'react';
import { IList } from '../../../../common/interfaces/IList';
import { Card } from '../Card/Card';
import './list.scss';
import '../../board.scss';
import { AddCardForm } from '../Card/AddCardForm';
import { ChangeTitleForm } from '../Board/ChangeTitleForm';
import { deleteList } from '../../../../api/boardsService';
import { TextureList } from './TextureList';

interface IAddCardChangesProps extends IList {
  onListChanged(): void;
  boardId: number;
}
export function List(props: IAddCardChangesProps): JSX.Element {
  const { id, title, cards, onListChanged, boardId, custom } = props;
  const [isVisibleChangeTitleForm, setVisibleChangeTitleForm] = useState(false);
  const [isVisibleAddCardForm, setVisibleAddCardForm] = useState(false);
  const color = custom?.color ?? require('../../../../assets/textur_black.jpg');
  const [currentTexture, setCurrentTexture] = useState(color);
  const [isVisibleChangeTexture, setVisibleChangeTexture] = useState(false);
  // eslint-disable-next-line no-console
  console.log(`колір: ${currentTexture}, кастом: ${JSON.stringify(props)}`);
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
    <div className="list" style={{ backgroundImage: `url(${currentTexture})` }}>
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
        <button
          className="list__button_custom-icon"
          aria-label="Change Texture"
          onClick={() => setVisibleChangeTexture((prev) => !prev)}
        >
          <span className="icon-wrapper" />
        </button>
      </div>
      {isVisibleChangeTexture && <TextureList key={boardId} onTexturePicked={setCurrentTexture} />}
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
      <div className="button__wrapper">
        <button className="button__add_card" onClick={() => setVisibleAddCardForm(true)}>
          ➕ додати картку
        </button>
        <button className="home__button_delete-item" aria-label="Delete" onClick={handleDeleteList}>
          <i className="fa fa-trash" />
        </button>
      </div>
    </div>
  );
}
