import { useEffect, useRef, useState } from 'react';
import { validateTitle } from '../../../../common/validador';
import './changeTitleForm.scss';

interface IChangeTitleFormProps {
  currentTitle: string;
  onTitleChanged(newTitle: string): void;
  onCancel(): void;
}
export function ChangeTitleForm(props: IChangeTitleFormProps): JSX.Element {
  const inputRef = useRef<HTMLInputElement>(null);
  const { onTitleChanged, currentTitle, onCancel } = props;
  const [newTitle, setNewTitle] = useState(currentTitle);
  const [isError, setError] = useState(false);
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, []);
  async function handleSubmitTitle(e: React.SyntheticEvent): Promise<void> {
    e.preventDefault();
    e.stopPropagation();
    if (newTitle.trim() === currentTitle) {
      onCancel();
      return;
    }
    if (!isError) {
      onTitleChanged(newTitle);
    } else {
      onCancel();
    }
  }
  return (
    <div className="form_wrapper">
      <form className="edit-title" onSubmit={handleSubmitTitle}>
        <input
          className={`edit-title__input ${isError ? 'edit-title--error' : ''}`}
          ref={inputRef}
          type="text"
          value={newTitle}
          onMouseDown={(e) => e.stopPropagation}
          onChange={(e) => {
            if (!validateTitle(e.target.value)) {
              setError(true);
            } else {
              setError(false);
            }
            setNewTitle(e.target.value);
          }}
          onBlur={handleSubmitTitle}
          onFocus={(e) => e.target.select()}
          size={Math.max(newTitle.length - 3, 1)}
        />
      </form>
      {isError && <span className="error_message">Назва занадто коротка, або введені недопустимі символи</span>}
    </div>
  );
}
