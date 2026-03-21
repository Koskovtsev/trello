// import { FormEvent, useState } from 'react';
// import { IList } from '../../../../common/interfaces/IList';

// interface IAddListFormProps {
//     onListAdded(list: IList): void;
// }

// export function AddListForm({ onListAdded }: IAddListFormProps): JSX.Element {
//     const [title, setTitle] = useState('');
//     const [color, setColor] = useState<string>('#000000');
//     async function handleSubmit(e: FormEvent): Promise<void> { }
//     return (
//         <form className="form__add_list" onSubmit={handleSubmit}>
//             <input
//                 type="text"
//                 className="input_list_title"
//                 value={title}
//                 onChange={(e) => setTitle(e.target.value)}
//                 onBlur={handleSubmit}
//             />
//             <input type="color" value={color} className="form__add_color" onChange={(e) => setColor(e.target.value)} />
//         </form>
//     );
// }
