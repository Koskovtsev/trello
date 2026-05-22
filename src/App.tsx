import { Toaster } from 'react-hot-toast';
import { Route, Routes } from 'react-router-dom';
import { Board } from './pages/Board/Board';
import { Home } from './pages/Home/Home';
import { Layout } from './components/Layout/Layout';
import { CardDetails } from './pages/Board/components/Card/components/CardDetails/CardDetails';
import { Registration } from './pages/User/Registration/Registration';
import { Login } from './pages/User/Login/Login';
import './styles.scss';
import 'nprogress/nprogress.css';

function App(): JSX.Element {
  return (
    <div className="App">
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/registration/" element={<Registration />} />
          <Route path="/login/" element={<Login />} />
          <Route path="/board/:boardId" element={<Board />}>
            <Route path="card/:cardId" element={<CardDetails />} />
          </Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
