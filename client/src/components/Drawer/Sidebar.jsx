// Sidebar.jsx (updated close button positioning)
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { X } from "lucide-react";
import { motion } from "framer-motion";

const Sidebar = ({ isOpen, onToggle, menuItems }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      exit={{ x: -300 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed top-0 left-0 w-64 h-full bg-white z-50 shadow-xl border-r border-gray-200"
    >
  

      <nav className="mt-6 space-y-2 px-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => {
                navigate(item.path);
                onToggle();
              }}
              className={`flex items-center w-full p-3 rounded-lg text-sm transition-all
                ${isActive ? "bg-[#1A064F] text-white" : "hover:bg-gray-100 text-gray-800"}`}
            >
              <Icon className="h-5 w-5" />
              <span className="ml-3">{item.title}</span>
            </motion.button>
          );
        })}
      </nav>
    </motion.div>
  );
};

export default Sidebar;