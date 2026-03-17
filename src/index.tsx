import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';

/**
 * Глобальний перехоплювач для блокування "червоного вікна" помилки ResizeObserver.
 * Працює шляхом зупинки поширення події до того, як її підхопить React Error Overlay.
 */
const handleError = (e: ErrorEvent | PromiseRejectionEvent): void => {
  const message = e instanceof ErrorEvent ? e.message : e.reason?.message;

  if (
    typeof message === 'string' &&
    (message.includes('ResizeObserver loop completed with undelivered notifications') ||
      message.includes('ResizeObserver loop limit exceeded'))
  ) {
    // Зупиняємо подію повністю
    e.stopImmediatePropagation();
    e.stopPropagation();
  }
};

// Додаємо слухачі на старті
window.addEventListener('error', handleError);
window.addEventListener('unhandledrejection', handleError);

const rootElement = document.getElementById('root');

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  );
}
// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import { BrowserRouter } from 'react-router-dom';
// import './index.css';
// import App from './App';

// const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
// window.addEventListener('error', (e) => {
//   if (e.message === 'ResizeObserver loop completed with undelivered notifications') {
//     if (e.stopImmediatePropagation) {
//       e.stopImmediatePropagation();
//     }
//   }
// });
// root.render(
//   <React.StrictMode>
//     <BrowserRouter>
//       <App />
//     </BrowserRouter>
//   </React.StrictMode>
// );
