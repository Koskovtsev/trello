import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { AppDispatch, RootState } from '../../../../../../store/store';
import { ICard } from '../../../../../../common/interfaces/ICard';
import { fetchBoardThunk, updateCardThunk } from '../../../../../../store/boards/thunks';
import { closeCardModal } from '../../../../../../store/uiSlice';
import { useBoard } from '../../../../hooks/useBoard';
import { getTexture } from '../../../../../../components/Textures/TextureList';
import { useCard } from '../../hooks/useCard';
import { TextAreaForm } from './TextAreaForm/TextAreaForm';
import { DescriptionMarkdown } from './DescriptionMarkdown/DescriptionMarkdown';
import './cardDetails.scss';

export function CardDetails(): JSX.Element | null {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [isVisibleChangeCardTitle, setVisibleChangeCardTitle] = useState(false);
  const [cursorPosition, setCursorPosition] = useState<number>(0);
  const { cardId, boardId } = useParams<{ cardId: string; boardId: string }>();
  const [copied, setCopied] = useState(false);
  const activeCard = useSelector((state: RootState) => {
    const lists = state.boards.activeBoard?.lists || [];
    return (
      lists
        .find((list) => list.cards?.some((c) => c.id === Number(cardId)))
        ?.cards?.find((c) => c.id === Number(cardId)) || null
    );
  });
  const listId = useSelector((state: RootState) => {
    const parentList = state.boards.activeBoard?.lists?.find((list) =>
      list.cards?.some((c) => c.id === Number(cardId))
    );
    return parentList?.id;
  });
  const currentListName = useSelector((state: RootState) => {
    const lists = state.boards.activeBoard?.lists || [];
    return lists.find((list) => list.id === listId)?.title;
  });
  useEffect(() => {
    if (!activeCard && boardId) {
      dispatch(fetchBoardThunk(Number(boardId)));
    }
  }, [boardId, activeCard, dispatch]);

  if (!listId || !Number(boardId) || !Number(cardId) || !activeCard) return null;
  const currentTexture = getTexture(activeCard.custom?.background ?? 'none');

  const handleChangeTitle = (newTitle: string): void => {
    const newCard: ICard = {
      ...activeCard,
      title: newTitle,
      list_id: listId,
    };
    if (boardId && cardId) {
      const payload = {
        boardId: Number(boardId),
        cardData: newCard,
      };
      dispatch(updateCardThunk(payload));
    }
  };

  const handleSaveDescription = (text: string): void => {
    const newCard = {
      ...activeCard,
      description: text,
      list_id: listId,
    };

    dispatch(
      updateCardThunk({
        boardId: Number(boardId),
        cardData: newCard,
      })
    );
  };

  const handleClose = (): void => {
    dispatch(closeCardModal());
    navigate(`/board/${boardId}`);
  };

  const { handleTextureModal } = useBoard(Number(boardId));

  const { handleCheckedCard } = useCard({
    boardId: Number(boardId),
    listId,
    cardId: Number(cardId),
    cardData: activeCard,
  });
  return (
    <div className="card-details__overlay" onClick={handleClose}>
      <div className="card-details__window" onClick={(e) => e.stopPropagation()}>
        {!activeCard ? (
          <div className="card-details__loading">Завантаження даних картки {cardId}...</div>
        ) : (
          <>
            <div className="card-details__header" style={{ backgroundImage: `url(${currentTexture})` }}>
              {/* <div className="card-details__texture-sample" style={{ backgroundImage: `url(${currentTexture})` }}> */}
              <div className="card-details__actions">
                <button
                  className="card-details__btn-textures-change"
                  aria-label="Change Texture"
                  title="Change Texture"
                  onClick={(e) =>
                    handleTextureModal(e, { type: 'card', boardId: Number(boardId), listId, cardId: Number(cardId) })
                  }
                >
                  <span className="card-details__icon" />
                </button>
                <button className="card-details__btn-close" aria-label="Close" title="Close" onClick={handleClose}>
                  <i className="fa-solid fa-xmark" />
                </button>
              </div>
            </div>
            <div className="card-details__main">
              <div className="card-details__title-group">
                <label className="card-details__checkbox-label">
                  <input
                    type="checkbox"
                    className="card-details__checkbox"
                    checked={activeCard.custom?.isChecked}
                    onChange={handleCheckedCard}
                  />
                </label>
                {!isVisibleChangeCardTitle && (
                  <span
                    className="card-details__title"
                    onMouseUp={() => {
                      const selection = window.getSelection();
                      if (selection) {
                        setCursorPosition(selection.focusOffset);
                      }
                    }}
                    onClick={() => setVisibleChangeCardTitle(true)}
                  >
                    {activeCard.title}
                  </span>
                )}
                {isVisibleChangeCardTitle && (
                  <TextAreaForm
                    cursorPosition={cursorPosition}
                    onTextChanged={(newTitle) => {
                      handleChangeTitle(newTitle);
                    }}
                    currentText={activeCard.title ?? ''}
                    onCancel={() => setVisibleChangeCardTitle(false)}
                  />
                )}
              </div>
              <div className="card-details__description-group">
                <span className="card-details__description-label">Опис</span>
                <DescriptionMarkdown
                  initialValue={activeCard.description || ''}
                  onSave={(value) => {
                    handleSaveDescription(value);
                  }}
                />
                <span className="card-details__list">
                  В колонці:
                  <span className="card-details__list_name">{currentListName}</span>
                </span>
                <span className="card-details__link_label">Посилання:</span>
                <div className="card-details__link_box">
                  {`https://koskovtsev.github.io/trello/#/board/${boardId}/card/${cardId}`}
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `https://koskovtsev.github.io/trello/#/board/${boardId}/card/${cardId}`
                      );
                      setCopied(true);

                      setTimeout(() => {
                        setCopied(false);
                      }, 2000);
                    }}
                  >
                    Copy
                  </button>
                </div>
                {copied && <span className="card-details__copied">Посилання скопійовано.</span>}
              </div>
            </div>
            <div className="card-details__footer">
              <button className="card-details__action-btn card-details__action-btn_copy">Копіювати</button>
              <button className="card-details__action-btn card-details__action-btn_move">Перемістити</button>
              <button className="card-details__action-btn card-details__action-btn_delete">Видалити</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
