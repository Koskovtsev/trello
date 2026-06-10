import { Toaster } from 'react-hot-toast';
import { Route, Routes } from 'react-router-dom';
import { RequireAuth } from './components/RequireAuth';
import { Board } from './pages/Board/Board';
import { Home } from './pages/Home/Home';
import { Layout } from './components/Layout/Layout';
import { CardDetails } from './pages/Board/components/Card/components/CardDetails/CardDetails';
import { Register } from './pages/User/AuthPages/Register';
import { Login } from './pages/User/AuthPages/Login';
import { ChangePassword } from './pages/User/AuthPages/ChangePassword';
import { ForgotPasswordEmail } from './pages/User/AuthPages/ForgotPasswordEmail';
import { ForgotPasswordReset } from './pages/User/AuthPages/ForgotPasswordReset';
import './styles.scss';
import 'nprogress/nprogress.css';

function App(): JSX.Element {
  return (
    <div className="App">
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route
            index
            element={
              <RequireAuth>
                <Home />
              </RequireAuth>
            }
          />
          <Route path="/registration/" element={<Register />} />
          <Route path="/login/" element={<Login />} />
          <Route path="/password/" element={<ChangePassword />} />
          <Route path="/forgot-password-email/" element={<ForgotPasswordEmail />} />
          <Route path="/forgot-password-reset/" element={<ForgotPasswordReset />} />
          <Route
            path="/board/:boardId"
            element={
              <RequireAuth>
                <Board />
              </RequireAuth>
            }
          >
            <Route
              path="card/:cardId"
              element={
                <RequireAuth>
                  <CardDetails />
                </RequireAuth>
              }
            />
          </Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
