import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { AppDispatch, RootState } from '../../../../../../store/store';
import { closeModal, updateCardThunk } from '../../../../../../store/cardsSlice';
import { ChangeTitleForm } from '../../../ChangeTitle/ChangeTitleForm';
import { ICard } from '../../../../../../common/interfaces/ICard';
import { fetchBoardThunk } from '../../../../../../store/boardsSlice';
import './cardDetails.scss';

interface UpdateCardPayload {
  cardData: ICard;
  boardId: number;
  cardId: number;
}

export function CardDetails(): JSX.Element | null {
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
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    if (!activeCard && boardId) {
      dispatch(fetchBoardThunk(Number(boardId)));
    }
  }, [boardId, activeCard, dispatch]);
  const navigate = useNavigate();
  const [isVisibleChangeCardTitle, setVisibleChangeCardTitle] = useState(false);
  const handleChangeTitle = (newTitle: string): void => {
    const newCard: ICard = {
      ...activeCard,
      title: newTitle,
      list_id: listId,
    };
    if (boardId && cardId) {
      dispatch(
        updateCardThunk({ cardData: newCard, boardId: Number(boardId), cardId: Number(cardId) } as UpdateCardPayload)
      );
    }
  };
  const handleClose = (): void => {
    dispatch(closeModal());
    navigate(`/board/${boardId}`);
  };
  return (
    <div className="card-details__overlay" onClick={handleClose}>
      <div className="card-details__window" onClick={(e) => e.stopPropagation()}>
        {!activeCard ? (
          <div>Завантаження даних картки {cardId}...</div>
        ) : (
          <>
            <div
              className="card-details__texture-sample"
              style={{ backgroundImage: `url(${activeCard.custom?.listTexture})` }}
            >
              <div className="button__wrapper">
                <button className="button__textures change-textures" aria-label="Change Texture" title="Change Texture">
                  <span className="icon-wrapper change-textures" />
                </button>
                <button className="button__textures delete-textures" aria-label="Delete Texture" title="Delete Texture">
                  <span className="icon-wrapper delete-textures" />
                </button>
                <button className="button__close-modal" aria-label="Close" title="Close" onClick={handleClose}>
                  <i className="fa-solid fa-xmark" />
                </button>
              </div>
            </div>
            <div className="card-details__main">
              {/* <label className="card__label">
      <input type="checkbox" className="card__checkbox" checked={activeCard.custom?.isChecked} onChange={() => {
        dispatch()
      }} />
    </label> */}
              {!isVisibleChangeCardTitle && (
                <span className="card__checkbox_title" onClick={() => setVisibleChangeCardTitle(true)}>
                  {activeCard.title}
                </span>
              )}
              {isVisibleChangeCardTitle && (
                <ChangeTitleForm
                  onTitleChanged={(newTitle) => {
                    handleChangeTitle(newTitle);
                    setVisibleChangeCardTitle(false);
                  }}
                  currentTitle={activeCard.title ?? ''}
                  onCancel={() => setVisibleChangeCardTitle(false)}
                />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
