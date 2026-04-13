// TODO: перенести зображення в паблік і прибрать require.
export const textures = [
  { id: 1, name: 'yellow', url: require('../../../../assets/textur_mountains.jpg') },
  { id: 2, name: 'orange', url: require('../../../../assets/textur_orange.jpg') },
  { id: 3, name: 'pink', url: require('../../../../assets/textur_pink.jpg') },
  { id: 4, name: 'black', url: require('../../../../assets/textur_red.jpg') },
  { id: 5, name: 'azure', url: require('../../../../assets/textur_azure.jpg') },
  { id: 6, name: 'green', url: require('../../../../assets/textur_green.jpg') },
  { id: 7, name: 'blue', url: require('../../../../assets/textur_blue.jpg') },
  { id: 8, name: 'purple', url: require('../../../../assets/textur_purple.jpg') },
  { id: 9, name: 'gray', url: require('../../../../assets/textur_gray.jpg') },
  { id: 10, name: 'black', url: require('../../../../assets/textur_black.jpg') },
];
export function TextureList({ onTexturePicked }: { onTexturePicked: (texture: string) => void }): JSX.Element {
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
            onClick={() => onTexturePicked(texture.url)}
          />
        </li>
      ))}
    </ul>
  );
}
