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

type Mode = 'move' | 'copy';

interface CardMoveProps {
  isOpen: boolean;
  onClose(): void;
  cardId: number;
  listId: number;
  boardId: number;
  mode: Mode;
}

export function CardTransferModal({
  isOpen,
  onClose,
  cardId,
  listId,
  boardId,
  mode,
}: CardMoveProps): JSX.Element | null {
  const [selectedBoardId, setSelectedBoardId] = useState(boardId);
  const [cardTitle, setCardTitle] = useState('');
  const [currentBoard, setCurrentBoard] = useState<IBoard | null>(null);
  const [selectedListId, setSelectedListId] = useState(listId);
  const dispatch = useDispatch<AppDispatch>();
  const boards = useSelector((state: RootState) => state.boards.boards);
  const activeCard = useSelector((state: RootState) => {
    const lists = state.boards.activeBoard?.lists || [];
    return lists.find((list) => list.cards?.some((c) => c.id === cardId))?.cards?.find((c) => c.id === cardId) || null;
  });
  const [selectedPosition, setSelectedPosition] = useState(activeCard?.position ?? 1);

  useEffect(() => {
    setCardTitle(activeCard?.title ?? '');
  }, [activeCard]);
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
      } catch {
        toast.error(`cant load boardData id:${selectedBoardId}`);
      }
    };
    if (selectedBoardId) {
      loadBoard();
    }
  }, [selectedBoardId]);

  if (!isOpen || !activeCard) return null;
  if (!boards.length) return <div>Loading...</div>;

  const handleTransfer = async (): Promise<void> => {
    const payload: ITransferCardData = {
      cardData: { ...activeCard, list_id: listId },
      mode,
      fromBoardId: boardId,
      toBoardId: selectedBoardId,
      toListId: selectedListId,
      position: selectedPosition,
    };
    transferCard(payload, dispatch);
    onClose();
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
    if (mode === 'copy') return cardsNumber + 1;
    if (selectedListId !== listId) return cardsNumber + 1;
    return cardsNumber;
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
        {current.showTitleInput && (
          <>
            <span>Назва</span>
            <ChangeTitleForm
              onTitleChanged={(newTitle) => setCardTitle(newTitle)}
              onCancel={() => {}}
              currentTitle={cardTitle}
            />
            <span>Скопіювати в...</span>
          </>
        )}
        <div className="card-move__board_selector">
          <label>Дошка</label>
          <select value={selectedBoardId} onChange={(e) => setSelectedBoardId(Number(e.target.value))}>
            {boards.map((board) => (
              <option key={board.id} value={board.id}>
                {board.title}
              </option>
            ))}
          </select>
        </div>
        <div className="card-move__list_selector">
          <label>Список</label>
          <select value={selectedListId} onChange={(e) => setSelectedListId(Number(e.target.value))}>
            {lists.map((list) => (
              <option key={list.id} value={list.id}>
                {list.title}
              </option>
            ))}
          </select>
        </div>
        <div className="card-move__card-position_selector">
          <label>Положення</label>
          <select value={selectedPosition} onChange={(e) => setSelectedPosition(Number(e.target.value))}>
            {positions.map((pos) => (
              <option key={pos} value={pos}>
                {pos}
              </option>
            ))}
          </select>
        </div>
        <button className="card-move__move" onClick={handleTransfer}>
          {current.buttonText}
        </button>
      </div>
    </div>
  );
}
