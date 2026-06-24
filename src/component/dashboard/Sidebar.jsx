import React from "react";
import { NavLink } from "react-router-dom";

function Sidebar({ menus, role }) {
  return (
    <div
      className="bg-white border-end vh-100"
      style={{ width: "260px" }}
    >
      <div className="p-4 border-bottom">
        <h4 className="fw-bold mb-0">🎓 Learnix</h4>
      </div>

      <div className="px-4 py-3">
        <small className="text-uppercase text-muted fw-bold">
          {role}
        </small>
      </div>

      <ul className="nav flex-column px-2">
        {menus.map((menu, index) => (
          <li key={index} className="nav-item mb-2">
            <NavLink
              to={menu.path}
              className={({ isActive }) =>
                `nav-link rounded-3 py-3 ${
                  isActive
                    ? "bg-primary text-white"
                    : "text-dark"
                }`
              }
            >
              <i className={`${menu.icon} me-2`}></i>
              {menu.name}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;