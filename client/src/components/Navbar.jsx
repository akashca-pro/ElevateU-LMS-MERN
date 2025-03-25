import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserCircle, ShoppingCart, MessageSquare, LogOut, Menu, X, Search } from "lucide-react"; 
import { useSelect } from "@/hooks/useSelect";
import { useUserAuthActions, useTutorAuthActions, useAdminAuthActions } from "@/hooks/useDispatch";
import { useTutorLogoutMutation } from '@/services/TutorApi/tutorAuthApi';
import { useAdminLogoutMutation } from '@/services/adminApi/adminAuthApi';
import { useUserLogoutMutation } from '@/services/userApi/userAuthApi';
import { useUserLoadCartQuery } from '@/services/userApi/userCourseApi.js'
import Notification from "./Notification";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { GlobalSearch } from "./Search";
import { formatUrl } from "@/utils/formatUrls";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(null);
  const { user, tutor, admin } = useSelect();
  
  const role = user.isAuthenticated ? "user" : tutor.isAuthenticated ? "tutor" : admin.isAuthenticated ? 'admin' : 'none';
  const roleData = user.isAuthenticated ? user.userData : tutor.isAuthenticated ? tutor.tutorData : admin.isAuthenticated ? admin.adminData : 'none';
  
  const { data : cartDetails } = useUserLoadCartQuery(undefined,
    { refetchOnMountOrArgChange : true ,
      skip : tutor.isAuthenticated || admin.isAuthenticated })

    const courseName = formatUrl(cartDetails?.data?.course?.title || 'courseName')

  const { logout: userLogout } = useUserAuthActions();
  const { logout: tutorLogout } = useTutorAuthActions();
  const { logout: adminLogout } = useAdminAuthActions();

  const [logout] = role === 'user' 
    ? useUserLogoutMutation() 
    : role === 'tutor'
    ? useTutorLogoutMutation()
    : useAdminLogoutMutation();

  const stateLogout = role === 'user' 
    ? userLogout 
    : role === 'tutor'
    ? tutorLogout
    : adminLogout;

  useEffect(() => {
    setSearchTerm(""); // Reset search on page change
    setMenuOpen(false); // Close menu on navigation
  }, [location.pathname]);

  const handleLogout = async () => {
    const toastId = toast.loading('Please wait . . .');
    try {
      await logout().unwrap();
      stateLogout();
      toast.success('Logout successful', { id: toastId });
      setMenuOpen(false);
    } catch (error) {
      toast.error(error?.data?.message || 'Error logout', { id: toastId });
    }
  };

  const handleSearch = (course) => {
    navigate(`/explore/courses/${course.title}`, { state: course._id });
    setSearchTerm(""); 
    setMenuOpen(false); 
  };

  return (
    <nav className="border-b bg-white relative">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        
        {/* Left Side */}
        <div className="flex items-center gap-8">      
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.svg" alt="ElevateU Logo" className="h-8 w-8" />
            <span className="text-xl font-bold">ElevateU</span>
          </Link>
          <Link to="/explore" className="hidden text-gray-600 hover:text-purple-600 md:block">
            Explore
          </Link>
        </div>

        {/* Search Bar (Desktop) */}
        <div className="hidden w-full max-w-xl md:flex justify-center px-8">
          <div className="relative w-full">
            <GlobalSearch onSearch={handleSearch}  />
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {user.isAuthenticated || tutor.isAuthenticated || admin.isAuthenticated ? (
            <>
              { user.isAuthenticated && <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Link to={`/explore/courses/${courseName}/checkout`} className="hidden text-gray-600 hover:text-purple-600 md:block">
                  <ShoppingCart className="h-6 w-6" />
                </Link>
              </motion.div>}

              {!admin.isAuthenticated && (
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                  <Link to={user.isAuthenticated ? `/user/profile/messages` : `/tutor/profile/messages`} className="hidden text-gray-600 hover:text-purple-600 md:block">
                    <MessageSquare className="h-6 w-6" />
                  </Link>
                </motion.div>
              )}

              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Link to={`/${role}/profile`} className="hidden text-gray-600 hover:text-purple-600 md:block">
                  <UserCircle className="h-6 w-6" />
                </Link>
              </motion.div>

              <Notification role={role} userId={roleData} />

              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <button onClick={handleLogout} className="hidden text-gray-600 hover:text-red-600 md:block">
                  <LogOut className="h-6 w-6" />
                </button>
              </motion.div>
            </>
          ) : (
            <div className="hidden gap-4 md:flex">
              <Link to="/user/login" className="rounded-full px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">
                Log in
              </Link>
              <Link to="/user/sign-up" className="rounded-full bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700">
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <button className="block md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </motion.div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-white shadow-md md:hidden z-50"
          >
            <div className="flex flex-col gap-4 p-4">

              {/* Mobile Search Bar */}
              <div className="relative w-full">
                <GlobalSearch onSearch={handleSearch} />
              </div>

              <Link to="/explore" className="text-gray-600 hover:text-purple-600 text-center" onClick={() => setMenuOpen(false)}>
                Explore
              </Link>
              
              {user.isAuthenticated || tutor.isAuthenticated || admin.isAuthenticated ? (
                <>
                  <Link to={`/${role}/profile`} className="text-gray-600 hover:text-purple-600 text-center" onClick={() => setMenuOpen(false)}>
                    Profile
                  </Link>
                  <button onClick={handleLogout} className="text-red-600 hover:text-red-800">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/user/login" className="text-gray-600 hover:text-purple-600" onClick={() => setMenuOpen(false)}>
                    Log in
                  </Link>
                  <Link to="/user/sign-up" className="text-white bg-purple-600 px-4 py-2 rounded-lg hover:bg-purple-700" onClick={() => setMenuOpen(false)}>
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;