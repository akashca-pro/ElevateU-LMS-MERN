// import ProfileDetails from "./ProfileDetails"
import ProfileNavbar from "./ProfileNavbar"

import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { Outlet } from "react-router-dom"

const Profile = () => {
    return (
      <>
      <Navbar/>
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-8 md:grid-cols-[240px_1fr]">
          {/* Sidebar */}
         
         <ProfileNavbar />
  
          {/* Main Content */}

        <Outlet/>
          
        </div>
      </div>
      <Footer/>
      </>
    )
  }
  
  export default Profile
  
  