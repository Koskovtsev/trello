import { Link, Outlet } from 'react-router-dom';

export function Layout(): JSX.Element {
  return (
    <div className="app-container">
      <header className="App-header">
        <Link to="/">Home</Link>
      </header>
      <main>
        <Outlet />
      </main>
      <footer />
    </div>
  );
}
