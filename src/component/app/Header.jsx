import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { redirectPathByRole } from "../../utils/authRedirect";
import { fetchCart, clearCartState } from "../../features/cartSlice";

function Header({ scrollToCategories, scrollToCourses, scrollToWhy }) {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { items = [] } = useSelector((state) => state.cart);
  const { items: wishlistItems = [] } = useSelector((state) => state.wishlist);

  useEffect(() => {
    const res = localStorage.getItem("user");

    if (res) {
      const loggedUser = JSON.parse(res);
      setUser(loggedUser);
      dispatch(fetchCart());
    }
  }, [dispatch]);

  const dashboard = redirectPathByRole(user);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    dispatch(clearCartState());
    navigate("/login");
  };

  const closeMenu = () => {
    const navbar = document.getElementById("navbarContent");
    if (navbar?.classList.contains("show")) {
      navbar.classList.remove("show");
    }
  };

  return (
    <nav className="navbar navbar-expand-lg bg-white shadow-sm sticky-top py-2">
      <div className="container">
        <Link
          className="navbar-brand d-flex align-items-center fw-bold fs-4"
          to="/"
          onClick={closeMenu}
        >
          <span
            className="rounded-circle d-flex justify-content-center align-items-center me-2"
            style={{
              width: "42px",
              height: "42px",
              background: "linear-gradient(135deg,#4F46E5,#8B5CF6)",
              color: "#fff",
              fontSize: "20px",
            }}
          >
            🎓
          </span>
          Learnix
        </Link>

        <button
          className="navbar-toggler border-0 shadow-none"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse mt-3 mt-lg-0" id="navbarContent">
          {location.pathname === "/" ? (
            <ul className="navbar-nav mx-lg-auto gap-lg-3 mb-3 mb-lg-0">
              <li className="nav-item">
                <button
                  className="nav-link fw-semibold border-0 bg-transparent px-0 px-lg-2"
                  onClick={() => {
                    scrollToCourses?.();
                    closeMenu();
                  }}
                >
                  Courses
                </button>
              </li>

              <li className="nav-item">
                <button
                  className="nav-link fw-semibold border-0 bg-transparent px-0 px-lg-2"
                  onClick={() => {
                    scrollToCategories?.();
                    closeMenu();
                  }}
                >
                  Categories
                </button>
              </li>

              <li className="nav-item">
                <button
                  className="nav-link fw-semibold border-0 bg-transparent px-0 px-lg-2"
                  onClick={() => {
                    scrollToWhy?.();
                    closeMenu();
                  }}
                >
                  Why Learnix
                </button>
              </li>
            </ul>
          ) : (
            <div className="flex-grow-1"></div>
          )}

          {user ? (
            <div className="d-flex flex-column flex-lg-row align-items-stretch align-items-lg-center gap-3">
              <div className="d-flex align-items-center gap-3">
                <Link
                  to="/student/wishlist"
                  onClick={closeMenu}
                  className="position-relative text-dark text-decoration-none icon-btn"
                >
                  <i className="bi bi-heart fs-4"></i>

                  {wishlistItems.length > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                      {wishlistItems.length}
                    </span>
                  )}
                </Link>

                <Link
                  to="/student/cart"
                  onClick={closeMenu}
                  className="position-relative text-dark text-decoration-none icon-btn"
                >
                  <i className="bi bi-cart3 fs-4"></i>

                  {items.length > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                      {items.length}
                    </span>
                  )}
                </Link>
              </div>

              <div
                className="d-flex flex-column flex-md-row align-items-stretch align-items-md-center gap-3 p-3 p-lg-2 rounded-4 rounded-lg-pill"
                style={{
                  background: "#f8fafc",
                  border: "1px solid #e5e7eb",
                }}
              >
                <div className="d-flex align-items-center gap-2">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
                    style={{
                      width: "42px",
                      height: "42px",
                      minWidth: "42px",
                      background: "linear-gradient(135deg,#4F46E5,#8B5CF6)",
                    }}
                  >
                    {user?.username?.charAt(0).toUpperCase() || "U"}
                  </div>

                  <div>
                    <div className="fw-semibold" style={{ fontSize: "14px" }}>
                      {user?.username}
                    </div>
                    <small className="text-muted">
                      {user?.userRole || user?.role?.name || "User"}
                    </small>
                  </div>
                </div>

                <Link
                  to={dashboard}
                  onClick={closeMenu}
                  className="btn btn-sm text-white rounded-pill px-3 py-2 fw-semibold"
                  style={{
                    background: "linear-gradient(135deg,#4F46E5,#8B5CF6)",
                    border: "none",
                  }}
                >
                  <i className="bi bi-grid me-1"></i>
                  Dashboard
                </Link>

                <button
                  onClick={handleLogout}
                  className="btn btn-sm btn-outline-danger rounded-pill px-3 py-2 fw-semibold"
                >
                  <i className="bi bi-box-arrow-right me-1"></i>
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="d-flex flex-column flex-lg-row gap-3">
              <Link
                to="/login"
                onClick={closeMenu}
                className="btn btn-outline-dark rounded-pill px-4 fw-semibold"
              >
                Sign In
              </Link>

              <Link
                to="/register"
                onClick={closeMenu}
                className="btn text-white px-4 rounded-pill fw-semibold"
                style={{
                  background: "linear-gradient(135deg,#4F46E5,#8B5CF6)",
                  border: "none",
                }}
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Header;