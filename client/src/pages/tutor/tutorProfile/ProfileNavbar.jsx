import React from 'react'
import { useTutorAuthActions } from '@/hooks/useDispatch'
import { useNavigate } from 'react-router-dom'


const ProfileNavbar = () => {
  const navigate = useNavigate()
  const {logout} = useTutorAuthActions()

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto h-32 w-32 overflow-hidden rounded-full">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/profile%20page-GiteHV5UJScHlrd4tHL5DsKiB6nzcO.png"
            alt="Profile"
            className="h-full w-full object-cover"
          />
        </div>
        <h2 className="mt-4 text-xl font-bold">John Doe</h2>
        <button className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
          </svg>
          Share Profile
        </button>
      </div>

      <nav className="space-y-1">
        {[
          { name: "Profile", path: "/tutor/profile" },
          {name : "Dashboard" ,path : "/tutor/dashboard"},
          { name: "Courses", path: "/tutor/profile/courses" },
          { name: "Message", path: "/tutor/profile/messages" },
          { name: "Quiz", path: "/tutor/profile/quiz" },
          { name: "Wishlist", path: "/tutor/profile/" },
          { name: "Certificates", path: "/tutor/profile/certificates" },
        ].map((item) => (
          <button
            key={item.name}
            onClick={() => navigate(item.path)}
            className="w-full text-left flex items-center rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            {item.name}
          </button>
        ))}
        <button onClick={()=>logout()} className="w-full text-left flex items-center rounded-lg px-4 py-2 text-sm font-medium text-red-600 hover:bg-gray-50">
          Logout
        </button>
      </nav>
    </div>
  )
}

export default ProfileNavbar