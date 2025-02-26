import React from "react"
import Sidebar from "./Sidebar.jsx"

const Layout = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar onToggle={(collapsed) => setSidebarCollapsed(collapsed)} />
      <main className={`transition-all duration-300 ${sidebarCollapsed ? "ml-20" : "ml-64"} p-6`}>{children}</main>
    </div>
  )
}

export default Layout
