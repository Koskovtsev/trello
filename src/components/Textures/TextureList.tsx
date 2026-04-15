import { useState } from 'react';
import './textureList.scss';

export const textures = [
  { id: 1, name: 'yellow', url: '/trello/assets/textur_yellow.jpg' },
  { id: 2, name: 'orange', url: '/trello/assets/textur_pink.jpg' },
  { id: 3, name: 'pink_', url: '/trello/assets/textur_red.jpg' },
  { id: 4, name: 'black', url: '/trello/assets/textur_orange.jpg' },
  { id: 5, name: 'azure', url: '/trello/assets/textur_green.jpg' },
  { id: 6, name: 'green', url: '/trello/assets/textur_blue.jpg' },
  { id: 7, name: 'blue', url: '/trello/assets/textur_car.jpg' },
  { id: 8, name: 'purple', url: '/trello/assets/textur_purple.jpg' },
  { id: 9, name: 'gray', url: '/trello/assets/textur_gray.jpg' },
  { id: 10, name: 'black', url: '/trello/assets/textur_black.jpg' },
  { id: 11, name: 'black', url: '/trello/assets/textur_mountains.jpg' },
  { id: 12, name: 'black', url: '/trello/assets/textur_nature.jpg' },
];
export function TextureList({ onTexturePicked }: { onTexturePicked: (texture: string) => void }): JSX.Element {
  const [selectedId, setSelectedId] = useState(0);
  const handleTexturePick = (textureID: number, textureUrl: string): void => {
    onTexturePicked(textureUrl);
    setSelectedId(textureID);
  };
  return (
    <ul className="color-picker">
      {textures.map((texture) => (
        <li key={texture.id}>
          <div
            className="color_box"
            style={{
              backgroundImage: `url(${texture.url})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
            onClick={() => handleTexturePick(texture.id, texture.url)}
          >
            {selectedId === texture.id && (
              <div className="texture_selected_wrapper">
                <div className="texture_selected">
                  <i className="fa-solid fa-check" />
                </div>
              </div>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
