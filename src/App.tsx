// import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Board } from './pages/Board/Board';
import './styles.scss';
import { Layout } from './pages/Board/components/Layout';

function App(): JSX.Element {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<div>Home Page</div>} />
          <Route path="board" element={<Board />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
