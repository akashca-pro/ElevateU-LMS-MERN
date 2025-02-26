import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  Bookmark,
  MessageSquare,
  PlusCircle,
  Star,
  Settings,
  LogOut,
  ChevronLeft,
  Menu,
} from "lucide-react";

const Sidebar = ({ onToggle }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState("Profile");
  const navigate = useNavigate(); 

  const menuItems = [
    { id: 1, title: "Profile", icon: LayoutDashboard, path: "/user/profile" },
    { id: 2, title: "My Courses", icon: BookOpen, path: "/user/profile/my-courses" },
    { id: 3, title: "Bookmarks", icon: Bookmark, path: "/bookmarks" },
    { id: 4, title: "Messages", icon: MessageSquare, path: "/messages" },
    { id: 5, title: "Create Course", icon: PlusCircle, path: "/create-course" },
    { id: 6, title: "Reviews", icon: Star, path: "/reviews" },
    { id: 7, title: "Settings", icon: Settings, path: "/settings" },
    { id: 8, title: "Logout", icon: LogOut, path: "/user/profile/logout" },
  ];

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
    if (onToggle) {
      onToggle(!isCollapsed);
    }
  };

  return (
    <div
      className={`${
        isCollapsed ? "w-20" : "w-64"
      } min-h-screen bg-white transition-all duration-300 ease-in-out fixed left-0 top-0 z-50 border-r border-gray-200`}
    >
      {/* Mobile Toggle Button */}
      <button className="md:hidden fixed top-4 left-4 z-50 p-2" onClick={toggleSidebar}>
        <Menu size={24} />
      </button>

      {/* Desktop Toggle Button */}
      <button
        className="hidden md:flex absolute -right-3 top-9 bg-white border border-gray-200 rounded-full p-1.5 hover:bg-gray-50"
        onClick={toggleSidebar}
      >
        <ChevronLeft
          className={`h-4 w-4 text-gray-600 transition-transform duration-300 ${isCollapsed ? "rotate-180" : ""}`}
        />
      </button>

      {/* Logo */}
      

      {/* Navigation Items */}
      <nav className="px-3 py-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveItem(item.title);
                navigate(item.path); // Navigate to the path
              }}
              className={`flex items-center w-full rounded-lg p-3 mb-1 transition-colors
                ${activeItem === item.title ? "bg-[#1A064F] text-white" : "text-gray-600 hover:bg-gray-100"}
                ${isCollapsed ? "justify-center" : "justify-start"}
              `}
            >
              <Icon size={20} />
              {!isCollapsed && <span className="ml-3 text-sm font-medium">{item.title}</span>}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;