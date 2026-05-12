import { useEffect, useRef, useState } from 'react';
import { validateTitle } from '../../../../../../../common/validador';
import './textAreaForm.scss';

interface TextAreaFormProps {
  cursorPosition: number;
  onTextChanged: (newTitle: string) => void;
  currentText: string;
  onCancel: () => void;
}

export function TextAreaForm({ onTextChanged, currentText, onCancel, cursorPosition }: TextAreaFormProps): JSX.Element {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [error, setError] = useState(false);

  const autoResize = (): void => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = 'auto';
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }
  };
  useEffect(() => {
    if (textAreaRef.current && cursorPosition != null) {
      textAreaRef.current.focus();
      textAreaRef.current.setSelectionRange(cursorPosition, cursorPosition);
      autoResize();
    }
  }, [cursorPosition]);

  const handleKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const value = textAreaRef.current?.value || '';
      if (value.trim() !== currentText.trim()) {
        onTextChanged(value.trim());
      }
      onCancel();
    }
    if (e.key === 'Escape') {
      onCancel();
    }
  };

  const handleSave = (): void => {
    const value = textAreaRef.current?.value || '';
    const trimmed = value.trim();
    const current = currentText.trim();
    if (trimmed === current) {
      onCancel();
      return;
    }
    if (!validateTitle(trimmed)) {
      setError(true);
      return;
    }
    onTextChanged(trimmed);
    onCancel();
  };

  return (
    <div className="edit-title__container">
      <textarea
        ref={textAreaRef}
        className={`edit-title__textarea ${error ? 'edit-title__textarea--error' : ''}`}
        defaultValue={currentText}
        onInput={(e) => {
          autoResize();
          const { value } = e.target as HTMLTextAreaElement;
          if (!validateTitle(value)) setError(true);
          else setError(false);
        }}
        onKeyDown={handleKeyDown}
        onBlur={handleSave}
      />
      {error && (
        <span className="edit-title__error-message">Назва занадто коротка, або введені недопустимі символи</span>
      )}
    </div>
  );
}
