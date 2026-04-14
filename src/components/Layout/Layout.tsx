import { Link, Outlet, useLocation } from 'react-router-dom';
import './layout.scss';

export function Layout(): JSX.Element {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  return (
    <div className="app-container">
      <header className="App-header">
        <Link to="/" className={`header__logo-link ${isHomePage ? 'header__logo-link--home' : ''}`}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="header__logo-svg"
          >
            <path
              className="header__logo-bg"
              d="M0 5C0 2.23858 2.23858 0 5 0H19C21.7614 0 24 2.23858 24 5V19C24 21.7614 21.7614 24 19 24H5C2.23858 24 0 21.7614 0 19V5Z"
              fill="currentColor"
            />
            <rect
              className="header__logo-rect"
              x="4.431"
              y="4.431"
              width="5.907"
              height="13.803"
              rx="0.948"
              fill="currentColor"
            />
            <rect
              className="header__logo-rect"
              x="13.662"
              y="4.431"
              width="5.907"
              height="8.337"
              rx="0.948"
              fill="currentColor"
            />
          </svg>
          <span className="header__logo-text">Trello</span>
        </Link>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
