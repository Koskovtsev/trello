import { Toaster } from 'react-hot-toast';
import { Route, Routes } from 'react-router-dom';
import { Board } from './pages/Board/Board';
import { Home } from './pages/Home/Home';
import './styles.scss';
import 'nprogress/nprogress.css';
import { Layout } from './components/Layout/Layout';

function App(): JSX.Element {
  return (
    <div className="App">
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/board/:boardId" element={<Board />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
