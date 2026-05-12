import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { AddBoardModal } from './components/AddBoard/AddBoardModal';
import { createBoardThunk, deleteBoardThunk, fetchAllBoardsThunk } from '../../store/boards/thunks';
import { BoardItem } from './components/BoardItem/BoardItem';
import { AppDispatch, RootState } from '../../store/store';
import './home.scss';

export function Home(): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const boards = useSelector((state: RootState) => state.boards.boards);
  const [addBoardModalActive, setaddBoardModalActive] = useState(false);
  const [draftTitle, setDraftTitle] = useState('');

  useEffect(() => {
    dispatch(fetchAllBoardsThunk());
  }, []);

  const handleBoardAdded = async (title: string, texture: string): Promise<void> => {
    const payload = {
      title,
      custom: {
        background: texture,
      },
    };
    const response = await dispatch(createBoardThunk(payload));
    if (response) {
      setaddBoardModalActive(false);
      await dispatch(fetchAllBoardsThunk());
    }
  };

  return (
    <>
      <span className="home__page_title">Мої дошки</span>
      <div className="board__preview_list">
        {boards.map((elem) => {
          if (!elem.id) return null;
          return (
            <Link key={elem.id} to={`/board/${elem.id}`}>
              <BoardItem
                key={elem.id}
                id={elem.id}
                {...elem}
                onDelete={(id) => {
                  dispatch(deleteBoardThunk(id));
                }}
              />
            </Link>
          );
        })}
        <button className="board__add_button" onClick={() => setaddBoardModalActive((prop) => !prop)}>
          <span className="button__add_title">+ Додати дошку</span>
        </button>
        <AddBoardModal
          active={addBoardModalActive}
          setActive={setaddBoardModalActive}
          onBoardAdded={handleBoardAdded}
          title={draftTitle}
          setTitle={setDraftTitle}
        />
      </div>
    </>
  );
}
