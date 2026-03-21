import { Link, Outlet } from 'react-router-dom';

export function Layout(): JSX.Element {
  return (
    <>
      <header className="App-header">
        <Link to="/">Home</Link>
      </header>
      <main>
        <Outlet />
      </main>
      {/* <footer>footer</footer> */}
    </>
  );
}
