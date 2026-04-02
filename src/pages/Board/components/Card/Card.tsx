import { useState } from 'react';
import toast from 'react-hot-toast';
import { ICard } from '../../../../common/interfaces/ICard';
import './card.scss';
import { ChangeTitleForm } from '../Board/ChangeTitleForm';
import { putCardUpdates } from '../../../../api/boardsService';
import { TextureList } from '../List/TextureList';

interface ICardChangeProps extends ICard {
  boardId: number;
  listId: number;
  onListChanged(): void;
}

export function Card(props: ICardChangeProps): JSX.Element {
  const { boardId, listId, onListChanged, title, id, custom } = props;
  const [isVisibleChangeCardTitle, setVisibleChangeCardTitle] = useState(false);
  const [isVisibleMenuOptions, setVisibleMenuOptions] = useState(false);
  const [isChecked, setIsChecked] = useState(custom?.isChecked ?? false);
  const [isVisibleChangeTexture, setVisibleChangeTexture] = useState(false);
  const [currentTexture, setCurrentTexture] = useState<string | null>(custom?.listTexture ?? null);
  const handleCheckedCard = async (): Promise<void> => {
    const newCard: ICard = {
      ...props,
      custom: {
        ...custom,
        isChecked: !isChecked,
      },
      list_id: listId,
    };
    try {
      await putCardUpdates(newCard, boardId, id!);
      setIsChecked((prev) => !prev);
      onListChanged();
    } catch (error) {
      toast.error('Error updating card properties.');
    }
  };
  const handleTitleChanged = (isChanged: boolean | undefined): void => {
    if (isChanged) {
      onListChanged();
    }
    setVisibleChangeCardTitle(false);
  };
  const handleNewTexture = async (texture: string): Promise<void> => {
    if (texture === currentTexture) return;
    setCurrentTexture(texture);
    setVisibleChangeTexture(false);
    const cardUpdate: ICard = {
      list_id: listId,
      custom: {
        ...custom,
        listTexture: texture,
      },
    };
    try {
      await putCardUpdates(cardUpdate, boardId, id!);
      setVisibleChangeTexture((prev) => !prev);
      setVisibleMenuOptions((prev) => !prev);
      onListChanged();
    } catch (error) {
      toast.error('Error updating card properties.');
    }
  };
  return (
    <div className="card__item" style={{ backgroundImage: `url(${currentTexture})` }}>
      <li>
        <label className="card__label">
          <input type="checkbox" className="card__checkbox" checked={isChecked} onChange={handleCheckedCard} />
          {!isVisibleChangeCardTitle && <span>{title}</span>}
          {isVisibleChangeCardTitle && (
            <ChangeTitleForm
              key={id}
              onTitleChanged={handleTitleChanged}
              listId={listId}
              boardId={boardId}
              cardId={id!}
              currentTitle={title ?? ''}
              type="card"
            />
          )}
        </label>
      </li>
      <div className="button__card-change_wrapper">
        <button
          className="button__card-change_title"
          aria-label="Change card title"
          onClick={() => setVisibleChangeCardTitle(true)}
        >
          <i className="fa fa-pencil-alt" />
        </button>
        <button
          className="button__menu_options"
          aria-label="Show menu"
          onClick={() => setVisibleMenuOptions((prev) => !prev)}
        >
          <i className="fas fa-ellipsis-h" />
        </button>
        {isVisibleMenuOptions && (
          <div className="menu__options">
            <div className="menu__options_header">
              <span className="menu__options_title">Редагування картки</span>
              <button
                className="list__button_custom-icon"
                aria-label="Change Texture"
                onClick={() => setVisibleChangeTexture((prev) => !prev)}
              >
                <span className="icon-wrapper" />
              </button>
            </div>
            {isVisibleChangeTexture && <TextureList key={boardId} onTexturePicked={handleNewTexture} />}
          </div>
        )}
      </div>
    </div>
  );
}
