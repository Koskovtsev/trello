const textures = [
  { id: 1, name: 'yellow', url: require('../../../../assets/textur_yellow.jpg') },
  { id: 2, name: 'blue', url: require('../../../../assets/textur_blue.jpg') },
  { id: 3, name: 'gray', url: require('../../../../assets/textur_gray.jpg') },
  { id: 4, name: 'green', url: require('../../../../assets/textur_green.jpg') },
  { id: 5, name: 'pink', url: require('../../../../assets/textur_pink.jpg') },
  { id: 6, name: 'purple', url: require('../../../../assets/textur_purple.jpg') },
];

export function TextureList({ onTexturePicked }: { onTexturePicked: (texture: string) => void }): JSX.Element {
  return (
    <ul className="color-picker">
      {textures.map((texture) => (
        <li key={texture.id}>
          <div
            className="color_box"
            style={{ backgroundImage: `url(${texture.url})` }}
            onClick={() => onTexturePicked(texture.url)}
          />
        </li>
      ))}
    </ul>
  );
}
