import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Topbar({ onMenuClick }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    setUser(userData);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const imageUrl = user?.avatar?.url
    ? `${BASE_URL}${user.avatar.url}`
    : "https://via.placeholder.com/50";

  return (
    <div className="bg-white border-bottom px-3 px-md-4 py-3">
      <div className="d-flex justify-content-between align-items-center gap-3">

        {/* Mobile Menu Button */}
        <button
          className="btn btn-outline-primary d-lg-none"
          onClick={onMenuClick}
        >
          <i className="bi bi-list"></i>
        </button>

        {/* Search */}
        <div className="flex-grow-1"></div>

        {/* User */}
        <div className="d-flex align-items-center gap-2">
          <img
            src={imageUrl}
            alt="Profile"
            className="rounded-circle"
            height={45}
            width={45}
            style={{ objectFit: "cover" }}
          />

          <div className="d-none d-md-block">
            <div className="fw-semibold">{user?.username}</div>
            <small className="text-muted">{user?.email}</small>
          </div>

          <button
            className="btn btn-danger btn-sm d-none d-sm-block"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Topbar;