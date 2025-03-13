import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelect } from "@/hooks/useSelect";
import { ChevronLeft } from "lucide-react";

const Sidebar = ({ onToggle, menuItems }) => {
  const { user, tutor } = useSelect();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [activeItem, setActiveItem] = useState("Profile");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === `/${user.isAuthenticated ? "user" : "tutor"}/profile/messages`) {
      setActiveItem("Messages");
    } else if (location.pathname === `/${user.isAuthenticated ? "user" : tutor.isAuthenticated ? "tutor" : "admin"}/profile`) {
      setActiveItem("Profile");
    }
  }, [location.pathname, user, tutor]);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
    if (onToggle) {
      onToggle(!isCollapsed);
    }
  };

  return (
    <div
      className={`fixed left-0 top-0 z-50 min-h-screen bg-white transition-all duration-300 border-r border-gray-200 flex flex-col 
        ${isCollapsed ? "w-8" : "w-64"}`}
    >
      {/* Sidebar Navigation */}
      <nav className={`px-3 py-4 flex-1 overflow-hidden transition-opacity duration-300 ${isCollapsed ? "opacity-0" : "opacity-100"}`}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveItem(item.title);
                navigate(item.path);
              }}
              className={`flex items-center w-full rounded-lg p-3 mb-1 transition-colors 
                ${activeItem === item.title ? "bg-[#1A064F] text-white" : "text-gray-600 hover:bg-gray-100"}
                ${isCollapsed ? "justify-center" : "justify-start"}`}
            >
              <Icon size={20} />
              {!isCollapsed && <span className="ml-3 text-sm font-medium">{item.title}</span>}
            </button>
          );
        })}
      </nav>

      {/* Toggle Button (Moves Along with Sidebar) */}
      <button
        className={`absolute top-14 right-[-12px] p-2 bg-white border rounded-full shadow-md transition-transform duration-300 
          ${isCollapsed ? "translate-x-0" : "translate-x-0"}`}
        onClick={toggleSidebar}
      >
        <ChevronLeft className={`h-5 w-5 text-gray-600 transition-transform duration-300 ${isCollapsed ? "rotate-180" : ""}`} />
      </button>
    </div>
  );
};

export default Sidebar;