import React from "react";
import Sidebar from "./Sidebar.jsx";

const Layout = ({ children, menuItems }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(true); // Set default to true

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar menuItems={menuItems} onToggle={(collapsed) => setSidebarCollapsed(collapsed)} />
      <main className={`transition-all duration-300 flex-1 ${sidebarCollapsed ? "ml-20" : "ml-64"} p-6`}>
        {children}
      </main>
    </div>
  );
};

export default Layout;