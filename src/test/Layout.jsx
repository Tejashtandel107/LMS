import { Link, Outlet } from "react-router-dom";

function Layout() {
  return (
    <div>
      <h1>Navbar</h1>

      <Link to="/layout/home">Home</Link>
      <br />
      <Link to="/layout/about">About</Link>

      <hr />

      <Outlet />
    </div>
  );
}

export default Layout;