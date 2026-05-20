import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { AppDispatch, RootState } from '../../../../../../store/store';
import { fetchAllBoardsThunk } from '../../../../../../store/boards/thunks';
import { getBoard } from '../../../../../../api/boardsService';
import { IBoard } from '../../../../../../common/interfaces/IBoard';
import { ChangeTitleForm } from '../../../ChangeTitle/ChangeTitleForm';
import { transferCard } from './transferCard';
import { ITransferCardData } from '../../../../../../common/interfaces/ITransferCardData';
import './cardTransferModal.scss';
import { ICard } from '../../../../../../common/interfaces/ICard';

type Mode = 'move' | 'copy';

interface CardMoveProps {
  isOpen: boolean;
  onClose(): void;
  listId: number;
  boardId: number;
  mode: Mode;
  cardData: ICard;
}

export function CardTransferModal({
  isOpen,
  onClose,
  listId,
  boardId,
  mode,
  cardData,
}: CardMoveProps): JSX.Element | null {
  const [selectedBoardId, setSelectedBoardId] = useState(boardId);
  const [currentBoard, setCurrentBoard] = useState<IBoard | null>(null);
  const [selectedListId, setSelectedListId] = useState(listId);
  const dispatch = useDispatch<AppDispatch>();
  const boards = useSelector((state: RootState) => state.boards.boards);
  const [selectedPosition, setSelectedPosition] = useState(cardData?.position ?? 1);
  const [cardTitle, setCardTitle] = useState(cardData.title!);
  useEffect(() => {
    if (!boards.length) {
      dispatch(fetchAllBoardsThunk());
    }
  }, [boards.length, dispatch]);
  useEffect(() => {
    const loadBoard = async (): Promise<void> => {
      try {
        const data = await getBoard(selectedBoardId);
        setCurrentBoard(data);
        const currendListId = data.lists?.find((list) => list.position === 1)?.id;
        setSelectedListId(currendListId!);
      } catch {
        toast.error(`cant load boardData id:${selectedBoardId}`);
      }
    };
    if (selectedBoardId) {
      loadBoard();
    }
  }, [selectedBoardId]);

  if (!isOpen) return null;
  if (!boards.length) return <div>Loading...</div>;

  const handleTransfer = async (): Promise<void> => {
    const payload: ITransferCardData = {
      cardData: { ...cardData, list_id: listId },
      mode,
      fromBoardId: boardId,
      toBoardId: selectedBoardId,
      toListId: selectedListId,
      position: selectedPosition,
    };
    onClose();
    requestAnimationFrame(async () => {
      await transferCard(payload, dispatch);
    });
  };
  const config = {
    move: {
      headerText: 'Перемістити картку',
      buttonText: 'Перемістити',
      showTitleInput: false,
    },
    copy: {
      headerText: 'Копіювати картку',
      buttonText: 'Створити картку',
      showTitleInput: true,
    },
  };
  const current = config[mode];
  const lists = currentBoard?.lists ?? [];
  const cardsNumber = lists.find((list) => list.id === selectedListId)?.cards?.length ?? 0;
  const getPositionsLength = (): number => {
    if (mode === 'move' && selectedListId === listId) {
      return cardsNumber;
    }
    return cardsNumber + 1;
  };
  const positions = Array.from({ length: getPositionsLength() }, (_, index) => index + 1);
  return (
    <div
      className="card-move__overlay"
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
    >
      <div className="card-move__window" onClick={(e) => e.stopPropagation()}>
        <div className="card-move__header">
          <span className="card-move__header_title">{current.headerText}</span>
          <button className="card-move__close" onClick={() => onClose()} aria-label="Close">
            <i className="fa-solid fa-xmark" />
          </button>
        </div>
        {current.showTitleInput ? (
          <>
            <span>Назва</span>
            <ChangeTitleForm
              onTitleChanged={(newTitle) => setCardTitle(newTitle)}
              onCancel={() => {}}
              currentTitle={cardTitle}
            />
            <span className="card-move__action_title">Скопіювати в...</span>
          </>
        ) : (
          <span className="card-move__action_title">Виберіть місце призначення</span>
        )}
        <div className="card-move__board_selector">
          <label className="card-move__selector_name">Дошка</label>
          <select
            className="card-move__selector"
            value={selectedBoardId}
            onChange={(e) => setSelectedBoardId(Number(e.target.value))}
          >
            {boards.map((board) => (
              <option key={board.id} value={board.id}>
                {boardId === board.id ? `${board.title} (поточне)` : board.title}
              </option>
            ))}
          </select>
        </div>
        <div className="card-move__destination_wrapper">
          <div className="card-move__list_selector">
            <label className="card-move__selector_name">Список</label>
            <select
              className="card-move__selector"
              value={selectedListId}
              onChange={(e) => setSelectedListId(Number(e.target.value))}
            >
              {lists.map((list) => (
                <option key={list.id} value={list.id}>
                  {listId === list.id ? `${list.title} (поточне)` : list.title}
                </option>
              ))}
            </select>
          </div>
          <div className="card-move__card-position_selector">
            <label className="card-move__selector_name">Положення</label>
            <select
              className="card-move__selector"
              value={selectedPosition}
              onChange={(e) => setSelectedPosition(Number(e.target.value))}
            >
              {positions.map((pos) => (
                <option key={pos} value={pos}>
                  {cardData.position === pos ? `${pos} (поточне)` : pos}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button className="card-move__move-button" onClick={handleTransfer}>
          {current.buttonText}
        </button>
      </div>
    </div>
  );
}
