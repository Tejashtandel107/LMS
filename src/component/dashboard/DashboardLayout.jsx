import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { sidebarMenus } from "../data/sidebarMenus";

function DashboardLayout({ role, children }) {
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <div className="d-flex">
      {/* Desktop Sidebar */}
      <div className="d-none d-lg-block">
        <Sidebar role={role} menus={sidebarMenus[role]} />
      </div>

      {/* Mobile Sidebar */}
      {showSidebar && (
        <div
          className="position-fixed top-0 start-0 bg-white vh-100 shadow"
          style={{ width: "260px", zIndex: 1050 }}
        >
          <button
            className="btn btn-sm btn-danger m-3"
            onClick={() => setShowSidebar(false)}
          >
            ✕
          </button>

          <Sidebar role={role} menus={sidebarMenus[role]} />
        </div>
      )}

      <div className="flex-grow-1 w-100">
        <Topbar onMenuClick={() => setShowSidebar(true)} />

        <div className="p-3 p-md-4">
          {children}
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;