import React from 'react';
import 'nprogress/nprogress.css';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import './index.css';
import App from './App';

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
