import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { AppDispatch, RootState } from '../../../../../../store/store';
import { fetchBoardThunk } from '../../../../../../store/boards/thunks';
import { useBoard } from '../../../../hooks/useBoard';
import { getTexture } from '../../../../../../components/Textures/TextureList';
import { useCard } from '../../hooks/useCard';
import { TextAreaForm } from './TextAreaForm/TextAreaForm';
import { DescriptionMarkdown } from './DescriptionMarkdown/DescriptionMarkdown';
import { ConfirmModal } from '../../../../../../components/DeleteButtonWithModal/ConfirmModal';
import { CardTransferModal } from '../CardTransfer/CardTransferModal';
import './cardDetails.scss';

type Mode = 'move' | 'copy';

export function CardDetails(): JSX.Element | null {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [isVisibleChangeCardTitle, setVisibleChangeCardTitle] = useState(false);
  const [actionType, setActionType] = useState<Mode>('copy');
  const [cursorPosition, setCursorPosition] = useState<number>(0);
  const [copied, setCopied] = useState(false);
  const [isConfirmModalOpen, setConfirmModalActive] = useState(false);
  const [isMoveModalOpen, setMoveModalActive] = useState(false);
  const { cardId, boardId } = useParams<{ cardId: string; boardId: string }>();
  const boardIdNum = Number(boardId);
  const cardIdNum = Number(cardId);
  const activeCard = useSelector((state: RootState) => {
    const lists = state.boards.activeBoard?.lists || [];
    return (
      lists.find((list) => list.cards?.some((c) => c.id === cardIdNum))?.cards?.find((c) => c.id === cardIdNum) || null
    );
  });
  const listId = useSelector((state: RootState) => {
    const parentList = state.boards.activeBoard?.lists?.find((list) => list.cards?.some((c) => c.id === cardIdNum));
    return parentList?.id;
  });
  const currentListName = useSelector((state: RootState) => {
    const lists = state.boards.activeBoard?.lists || [];
    return lists.find((list) => list.id === listId)?.title;
  });
  useEffect(() => {
    if (!activeCard && boardIdNum) {
      dispatch(fetchBoardThunk(boardIdNum)).unwrap();
    }
  }, [boardIdNum, activeCard, dispatch]);

  if (!listId || !boardIdNum || !cardIdNum || !activeCard) return null;

  const currentTexture = getTexture(activeCard.custom?.background ?? 'none');
  const cardUrl = `https://koskovtsev.github.io/trello/#/board/${boardIdNum}/card/${cardIdNum}`;

  const handleClose = (): void => navigate(`/board/${boardIdNum}`);
  const { handleTextureModal } = useBoard(boardIdNum);
  const { handleDeleteCard, handleCheckedCard, handleChangeTitle, handleSaveDescription } = useCard({
    boardId: boardIdNum,
    listId,
    cardId: cardIdNum,
    cardData: activeCard,
  });

  return (
    <div className="card-details__overlay" onClick={handleClose}>
      <div className="card-details__window" onClick={(e) => e.stopPropagation()}>
        {!activeCard ? (
          <div className="card-details__loading">Завантаження даних картки {cardIdNum}...</div>
        ) : (
          <>
            <div className="card-details__header" style={{ backgroundImage: `url(${currentTexture})` }}>
              <div className="card-details__actions">
                <button
                  className="card-details__btn-textures-change"
                  aria-label="Change Texture"
                  title="Change Texture"
                  onClick={(e) =>
                    handleTextureModal(e, { type: 'card', boardId: boardIdNum, listId, cardId: cardIdNum })
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
                      handleChangeTitle(newTitle, setVisibleChangeCardTitle);
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
                  {cardUrl}
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(cardUrl);
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
              <button
                className="card-details__action-btn card-details__action-btn_copy"
                onClick={() => {
                  setMoveModalActive(true);
                  setActionType('copy');
                }}
              >
                Копіювати
              </button>
              <button
                className="card-details__action-btn card-details__action-btn_move"
                onClick={() => {
                  setMoveModalActive(true);
                  setActionType('move');
                }}
              >
                Перемістити
              </button>
              <button
                className="card-details__action-btn card-details__action-btn_delete"
                onClick={() => setConfirmModalActive(true)}
              >
                Видалити
              </button>
            </div>
          </>
        )}
      </div>
      <CardTransferModal
        isOpen={isMoveModalOpen}
        onClose={() => setMoveModalActive(false)}
        cardId={activeCard.id!}
        listId={listId}
        boardId={boardIdNum}
        mode={actionType}
      />
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={setConfirmModalActive}
        onConfirm={() => {
          handleDeleteCard();
          handleClose();
        }}
      />
    </div>
  );
}
