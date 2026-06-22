import { Navigate, useLocation } from 'react-router-dom';

export function RequireAuth({ children }: { children: JSX.Element }): JSX.Element {
  const token = localStorage.getItem('token');

  const location = useLocation();

  if (!token) {
    if (location.pathname !== '/' && location.pathname !== '/login/') {
      const fullPath = location.pathname + location.search;
      localStorage.setItem('redirectAfterLogin', fullPath);
    }
    return <Navigate to="/login/" replace />;
  }

  return children;
}
