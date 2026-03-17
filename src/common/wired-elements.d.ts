import { DetailedHTMLProps, HTMLAttributes } from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      // Додаємо опис для wired-button
      'wired-button': DetailedHTMLProps<
        HTMLAttributes<HTMLElement> & {
          elevation?: string | number;
          disabled?: boolean;
        },
        HTMLElement
      >;

      // Якщо будете використовувати інші елементи, додайте їх сюди:
      'wired-card': DetailedHTMLProps<
        HTMLAttributes<HTMLElement> & {
          elevation?: string | number;
        },
        HTMLElement
      >;

      'wired-input': DetailedHTMLProps<
        HTMLAttributes<HTMLElement> & {
          placeholder?: string;
          value?: string;
        },
        HTMLElement
      >;
    }
  }
}
