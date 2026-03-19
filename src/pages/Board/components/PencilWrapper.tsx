import React from 'react';
import { RenderBorders } from './RenderBorders';
import { RenderBackground } from './RenderBackground';

interface PencilWrapperProps {
  children: React.ReactNode;
  color: string;
  className: string;
}
// THIS FUNCTION WAS GENERETED BY GEMINI
export function PencilWrapper(props: PencilWrapperProps): JSX.Element {
  const { children, color = '#555', className = '' } = props;

  return (
    <div
      className={`pencil-wrapper-container ${className}`}
      style={{
        position: 'relative',
        padding: '20px',
        overflow: 'hidden',
        background: '#fdfdfc', // Базовий колір "паперу"
        borderRadius: '4px',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '80px',
      }}
    >
      {/* 1. ШАР РАМКИ: 
        Ми передаємо той самий color. 
        RenderBorders всередині себе має фільтр brightness(0.7), 
        тому він автоматично стане темнішим за фон.
      */}
      <RenderBorders color={color} strokeWidth={1.2} />

      {/* 2. ШАР ШТРИХОВКИ (ФОН):
        Використовує оригінальний колір.
      */}
      <RenderBackground color={color} />

      {/* 3. ШАР КОНТЕНТУ:
        zIndex: 1 гарантує, що текст і кнопки будуть ПЕРЕД штриховкою.
      */}
      <div
        className="pencil-content"
        style={{
          position: 'relative',
          zIndex: 1,
        }}
      >
        {children}
      </div>
    </div>
  );
}
