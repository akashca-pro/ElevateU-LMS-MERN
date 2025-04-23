// Layout.jsx
import React from "react";
import Sidebar from "./Sidebar.jsx";
import { Menu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Layout = ({ children, menuItems ,sidebarCollapsed, setSidebarCollapsed }) => {

  return (
    <div className="relative min-h-screen bg-gray-50">
      <AnimatePresence>
        {!sidebarCollapsed && (
          <>
            {/* Blur Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
              onClick={() => setSidebarCollapsed(true)}
            />
            
            {/* Sidebar */}
            <Sidebar
              isOpen={!sidebarCollapsed}
              onToggle={() => setSidebarCollapsed(true)}
              menuItems={menuItems}
            />
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="p-6 transition-all duration-300">
        {children}
      </main>
    </div>
  );
};

export default Layout;