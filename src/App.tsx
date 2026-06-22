import { Toaster } from 'react-hot-toast';
import { useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const [isInitializing, setIsInitializing] = useState(true);
  useEffect(() => {
    const getParamFromUrl = (param: string): string | null => {
      // 1. Шукаємо в стандартному search (?token=...)
      const searchParams = new URLSearchParams(window.location.search);
      if (searchParams.has(param)) return searchParams.get(param);

      // 2. Шукаємо в хеші (на випадок, якщо URL виглядав як #/login/?token=...)
      const { hash } = window.location;
      const hashParams = new URLSearchParams(hash.split('?')[1] || '');
      if (hashParams.has(param)) return hashParams.get(param);

      return null;
    };
    // const params = new URLSearchParams(window.location.search);
    const token = getParamFromUrl('token');
    const refreshToken = getParamFromUrl('refreshToken');
    // eslint-disable-next-line no-console
    console.log(`Auth Check: token: ${!!token}, refreshToken: ${!!refreshToken} }, `);
    if (token && refreshToken) {
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
      window.history.replaceState({}, document.title, window.location.pathname + window.location.hash);
      const redirectPath = localStorage.getItem('redirectAfterLogin');
      // eslint-disable-next-line no-console
      console.log(`redirectPath: ${redirectPath}`);
      if (redirectPath) localStorage.removeItem('redirectAfterLogin');
      navigate(redirectPath ?? '/');
    }
    setIsInitializing(false);
  }, [navigate]);

  if (isInitializing) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        Завантаження...
      </div>
    );
  }

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
