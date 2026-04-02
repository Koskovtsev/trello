import React from 'react';
import 'nprogress/nprogress.css';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
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

window.addEventListener('error', handleError);
window.addEventListener('unhandledrejection', handleError);

const rootElement = document.getElementById('root');

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <HashRouter>
        <App />
      </HashRouter>
      {/* <BrowserRouter>  прибрав для гітхабу.
        <App /> 
      </BrowserRouter> */}
    </React.StrictMode>
  );
}
