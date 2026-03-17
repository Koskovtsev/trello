import { Link, Outlet } from 'react-router-dom';

export function Layout(): JSX.Element {
  return (
    <>
      <header className="App-header">
        <p>this is a Header</p>
        <Link to="/board">Board</Link>
      </header>
      <main>
        <Outlet />
      </main>
      <footer>footer</footer>
    </>
  );
}
