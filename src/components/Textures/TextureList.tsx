import { useState } from 'react';
import './textureList.scss';

interface TextureProps {
  onTexturePicked(texture: string): void;
  currentTexture: string;
}

export const textures = [
  { id: 1, name: 'yellow', url: '/trello/assets/textur_yellow.jpg' },
  { id: 2, name: 'pink', url: '/trello/assets/textur_pink.jpg' },
  { id: 3, name: 'orange', url: '/trello/assets/textur_orange.jpg' },
  { id: 4, name: 'green', url: '/trello/assets/textur_green.jpg' },
  { id: 5, name: 'blue', url: '/trello/assets/textur_blue.jpg' },
  { id: 6, name: 'purple', url: '/trello/assets/textur_purple.jpg' },
  { id: 7, name: 'gray', url: '/trello/assets/textur_gray.jpg' },
  { id: 8, name: 'lakes', url: '/trello/assets/textur_lakes.jpg' },
  { id: 9, name: 'car', url: '/trello/assets/textur_car.jpg' },
  { id: 10, name: 'mountains', url: '/trello/assets/textur_mountains.jpg' },
  { id: 11, name: 'nature', url: '/trello/assets/textur_nature.jpg' },
  { id: 12, name: 'none', url: '' },
];
export function getTexture(textureName: string): string {
  return textures.find((texture) => texture.name === textureName)?.url ?? '';
}
export function TextureList({ onTexturePicked, currentTexture }: TextureProps): JSX.Element {
  const [selectedTexture, setTexture] = useState(currentTexture);
  const handleTexturePick = (textureName: string): void => {
    onTexturePicked(textureName);
    setTexture(textureName);
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
            onClick={() => handleTexturePick(texture.name)}
          >
            {selectedTexture === texture.name && (
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
