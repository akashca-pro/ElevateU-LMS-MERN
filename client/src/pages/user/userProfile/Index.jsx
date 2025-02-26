import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { Outlet } from "react-router-dom"

const Profile = () => {
    return (
      <>
      <Navbar/>
      <div className="mx-auto max-w-7xl px-4 py-8">
       

        <Outlet/>
          
        
      </div>
      <Footer/>
      </>
    )
  }
  
  export default Profile
  
  