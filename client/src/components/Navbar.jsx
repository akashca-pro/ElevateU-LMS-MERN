import { useState } from "react";
import { Link } from "react-router-dom";
import { UserCircle, ShoppingCart, MessageSquare, LogOut, Menu, X } from "lucide-react"; 
import { useSelect } from "@/hooks/useSelect";
import { useUserAuthActions, useTutorAuthActions, useAdminAuthActions } from "@/hooks/useDispatch";
import {useTutorLogoutMutation} from '@/services/TutorApi/tutorAuthApi'
import {useAdminLogoutMutation} from '@/services/adminApi/adminAuthApi'
import {useUserLogoutMutation} from '@/services/userApi/userAuthApi'
import { toast } from "sonner";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, tutor, admin } = useSelect();
  const role = user.isAuthenticated ? "user" : tutor.isAuthenticated ? "tutor" : "admin";

  const { logout: userLogout } = useUserAuthActions();
  const { logout: tutorLogout } = useTutorAuthActions();
  const { logout: adminLogout } = useAdminAuthActions();

  const [logout] = role === 'user' 
  ? useUserLogoutMutation() 
  : role === 'tutor'
  ? useTutorLogoutMutation()
  : useAdminLogoutMutation()

  const stateLogout = role === 'user' 
  ? userLogout 
  : role === 'tutor'
  ? tutorLogout
  : adminLogout

  const handleLogout = async() =>{
    const toastId = toast.loading('Please wait . . .')
      try {
        await logout().unwrap()
        stateLogout()
        toast.success('Logout successfull',{id : toastId})
      } catch (error) {
        toast.error(error?.data?.message || 'Error logout',{id : toastId})
      }

  }

  return (
    <nav className="border-b bg-white">
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

        {/* Search Bar */}
        <div className="hidden w-full max-w-xl md:flex justify-center px-8">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search courses"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Right Side (Icons + Menu Button for Mobile) */}
        <div className="flex items-center gap-4">
          {/* Show for Desktop */}
          {user.isAuthenticated || tutor.isAuthenticated || admin.isAuthenticated ? (
            <>
              {user && !admin.isAuthenticated && (
                <Link to="/user/cart" className="hidden text-gray-600 hover:text-purple-600 md:block">
                  <ShoppingCart className="h-6 w-6" />
                </Link>
              )}

              {!admin.isAuthenticated && (
                <Link
                  to={user.isAuthenticated ? `/user/profile/messages` : `/tutor/profile/messages`}
                  className="hidden text-gray-600 hover:text-purple-600 md:block"
                >
                  <MessageSquare className="h-6 w-6" />
                </Link>
              )}

              <Link to={`/${role}/profile`} className="hidden text-gray-600 hover:text-purple-600 md:block">
                <UserCircle className="h-6 w-6" />
              </Link>

              <button
                onClick={
                  handleLogout
                }
                className="hidden text-gray-600 hover:text-red-600 md:block"
              >
                <LogOut className="h-6 w-6" />
              </button>
            </>
          ) : (
            <div className="hidden gap-4 md:flex">
              <Link
                to="/user/login"
                className="rounded-full px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Log in
              </Link>
              <Link
                to="/user/sign-up"
                className="rounded-full bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700"
              >
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button className="block md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t bg-white p-4">
          {user.isAuthenticated || tutor.isAuthenticated || admin.isAuthenticated ? (
            <>
              {user && !admin.isAuthenticated && (
                <Link to="/user/cart" className="block py-2 text-gray-600 hover:text-purple-600">
                  <ShoppingCart className="h-6 w-6 inline-block mr-2" />
                  Cart
                </Link>
              )}

              {!admin.isAuthenticated && (
                <Link
                  to={user.isAuthenticated ? `/user/profile/messages` : `/tutor/profile/messages`}
                  className="block py-2 text-gray-600 hover:text-purple-600"
                >
                  <MessageSquare className="h-6 w-6 inline-block mr-2" />
                  Messages
                </Link>
              )}

              <Link to={`/${role}/profile`} className="block py-2 text-gray-600 hover:text-purple-600">
                <UserCircle className="h-6 w-6 inline-block mr-2" />
                Profile
              </Link>

              <button
                onClick={
                  handleLogout
                }
                className="block py-2 text-gray-600 hover:text-red-600"
              >
                <LogOut className="h-6 w-6 inline-block mr-2" />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/user/login"
                className="block rounded-full px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Log in
              </Link>
              <Link
                to="/user/sign-up"
                className="block rounded-full bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;