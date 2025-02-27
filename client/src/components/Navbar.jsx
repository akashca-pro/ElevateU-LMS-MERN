import { Link } from "react-router-dom";
import { UserCircle , ShoppingCart, MessageSquare, LogOut } from "lucide-react"; 
import { useSelect } from "@/hooks/useSelect";
import { useUserAuthActions, useTutorAuthActions } from "@/hooks/useDispatch";

const Navbar = () => {
  const {user,tutor} = useSelect()

  const {logout : userLogout} = useUserAuthActions()
  const {logout : tutorLogout} = useTutorAuthActions()

  return (
    <nav className="border-b bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.svg" alt="ElevateU Logo" className="h-8 w-8" />
            <span className="text-xl font-bold">ElevateU</span>
          </Link>
          <Link to="/courses" className="text-gray-600 hover:text-purple-600">
            Explore
          </Link>
        </div>

        <div className="flex flex-1 justify-center px-8">
          <div className="relative w-full max-w-xl">
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

        <div className="flex items-center gap-4">
       { user.isAuthenticated || tutor.isAuthenticated
       ? ( <>{ user && <Link to="/user/cart" className="text-gray-600 hover:text-purple-600">
            <ShoppingCart className="h-6 w-6" />
          </Link> }

          <Link to={user.isAuthenticated ? `/user/profile/messages  ` 
            : `/tutor/profile/messages`
          } className="text-gray-600 hover:text-purple-600">
            <MessageSquare className="h-6 w-6" />
          </Link>
          
          <Link to={user.isAuthenticated ? `/user/profile  ` 
            : `/tutor/profile`
          } className="text-gray-600 hover:text-purple-600">
            <UserCircle className="h-6 w-6" />
          </Link> 

          <Link onClick={()=>user.isAuthenticated ? userLogout() : tutorLogout()}
          className="text-gray-600 hover:text-red-600">
            <LogOut className="h-6 w-6"/>
          </Link>

          </> ) 
          : <>
          <div className="flex gap-4">
            
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
          </div></>}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;