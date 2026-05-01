import { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Portal } from '../../Portal';
import { useClickOutside } from '../../../hooks/useClickOutside';
import { closeTextureModal } from '../../../store/uiSlice';
import { AppDispatch, RootState } from '../../../store/store';
import { TextureList } from '../TextureList';
import { applyTexture } from '../../../store/uiThunks';
import './changeTextureModal.scss';

export function ChangeTextureModal(): JSX.Element | null {
  const dispatch = useDispatch<AppDispatch>();
  const { isOpen, target, coords } = useSelector((state: RootState) => state.ui.textureModal);
  const board = useSelector((state: RootState) => state.boards.activeBoard);
  const menuRef = useRef<HTMLDivElement>(null);
  useClickOutside(menuRef, () => {
    setTimeout(() => {
      dispatch(closeTextureModal());
    }, 100);
  });

  if (!isOpen || !target || !board || !coords) return null;

  let currentTextureName: string | undefined;

  switch (target.type) {
    case 'list':
      currentTextureName = board.custom?.listTextures?.[target.listId];
      break;

    case 'card': {
      const list = board.lists?.find((l) => l.id === target.listId);
      const card = list?.cards?.find((c) => c.id === target.cardId);
      currentTextureName = card?.custom?.background;
      break;
    }

    case 'board':
      currentTextureName = board.custom?.background;
      break;
    default:
      break;
  }
  const handleTexturePick = (texture: string): void => {
    dispatch(applyTexture(texture));
    dispatch(closeTextureModal());
  };
  return (
    <Portal>
      <div className="texture-modal__overlay">
        <div
          ref={menuRef}
          className="texture-modal__content"
          style={{
            top: `${coords?.top}px`,
            left: `${coords?.left}px`,
          }}
        >
          <TextureList onTexturePicked={handleTexturePick} currentTexture={currentTextureName ?? ''} />
        </div>
      </div>
    </Portal>
  );
}
