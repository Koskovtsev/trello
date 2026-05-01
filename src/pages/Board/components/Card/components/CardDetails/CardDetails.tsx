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
import './cardDetails.scss';

export function CardDetails(): JSX.Element | null {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [isVisibleChangeCardTitle, setVisibleChangeCardTitle] = useState(false);
  const [cursorPosition, setCursorPosition] = useState<number>(0);

  const { cardId, boardId } = useParams<{ cardId: string; boardId: string }>();

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
          <div>Завантаження даних картки {cardId}...</div>
        ) : (
          <>
            <div className="card-details__texture-sample" style={{ backgroundImage: `url(${currentTexture})` }}>
              <div className="button__wrapper">
                <button
                  className="button__textures change-textures"
                  aria-label="Change Texture"
                  title="Change Texture"
                  onClick={(e) =>
                    handleTextureModal(e, { type: 'card', boardId: Number(boardId), listId, cardId: Number(cardId) })
                  }
                >
                  <span className="icon-wrapper change-textures" />
                </button>
                <button className="button__close-modal" aria-label="Close" title="Close" onClick={handleClose}>
                  <i className="fa-solid fa-xmark" />
                </button>
              </div>
            </div>
            <div className="card-details__main">
              <div className="card__title_wrapper">
                <label className="card__label">
                  <input
                    type="checkbox"
                    className="card__checkbox"
                    checked={activeCard.custom?.isChecked}
                    onChange={handleCheckedCard}
                  />
                </label>
                {!isVisibleChangeCardTitle && (
                  <span
                    className="card__title"
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
                      // setVisibleChangeCardTitle(false);
                    }}
                    currentText={activeCard.title ?? ''}
                    onCancel={() => setVisibleChangeCardTitle(false)}
                  />
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
