/* eslint-disable react/no-danger */
import DOMPurify from 'dompurify';
import { useState } from 'react';
import { marked } from 'marked';
import './descriptionMarkdown.scss';

interface Props {
  initialValue: string;
  onSave: (value: string) => void;
}

export function DescriptionMarkdown({ initialValue = '', onSave }: Props): JSX.Element {
  const [text, setText] = useState(initialValue);
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = (): void => {
    onSave(text);
    setIsEditing(false);
  };

  const html = DOMPurify.sanitize(marked.parse(text) as string);

  return (
    <div className="markdown-editor">
      {!isEditing && (
        <div className="markdown-editor__preview" onClick={() => setIsEditing(true)}>
          {text ? (
            <div className="markdown-editor__content" dangerouslySetInnerHTML={{ __html: html }} />
          ) : (
            <span className="markdown-editor__placeholder" style={{ color: '#888' }}>
              Додати опис...
            </span>
          )}
        </div>
      )}

      {isEditing && (
        <div className="markdown-editor__edit-group">
          <textarea
            className="markdown-editor__textarea"
            value={text}
            onChange={(e) => setText(e.target.value)}
            style={{ width: '100%', minHeight: '100px' }}
          />
          <div className="markdown-editor__actions" style={{ marginTop: '8px' }}>
            <button className="markdown-editor__button markdown-editor__button--save" onClick={handleSave}>
              Зберегти
            </button>
            <button
              className="markdown-editor__button markdown-editor__button--cancel"
              onClick={() => setIsEditing(false)}
            >
              Скасувати
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
