import React from 'react'
import { Outlet, Route,Routes } from 'react-router-dom'

import {LayoutDashboard, SquareUser, Settings, ListCollapse, ClockArrowUp, 
GraduationCap, Contact, BellRing} from 'lucide-react'

import {useAdminSignupMutation, useAdminLoginMutation} from '@/services/adminApi/adminAuthApi'
import {useAdminAuthActions} from '@/hooks/useDispatch'

// re-used component
import SignUp from '@/components/auth/SignUp'
import Login from '@/components/auth/Login'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ProtectedRoute from '@/protectors/ProtectedRoute'
import ProtectAuthPage from '@/protectors/ProtectAuthPage'
import NotFound from '@/pages/NotFound'
import Layout from '@/components/Drawer/Layout'


//protected routes
import Profile from './Profile/Index'
import Dashboard from './Dashboard/Index'
import Orders from './Orders/Index'
import Setting from './Settings/Index'
import Students from './Students/Index'
import Tutors from './Tutors/Index'
import Notification from './Notification/Index'

import CategoryLayout from './Category/Index'
import List from './Category/List'
import CategoryList from './Category/CategoryList'
import CourseDetails from './Category/CourseDetails'

const AdminIndex = () => {
  return (
   <>
   <Outlet/>
   </>
  )
}

const menuItems = [
  { id: 1, title: "Dashboard", icon: LayoutDashboard, path: "/admin/profile/dashboard" },
  { id: 2, title: "Profile", icon: SquareUser, path: "/admin/profile" },
  { id: 3, title: "Category", icon: ListCollapse, path: "/admin/profile/category" },
  { id: 4, title: "Orders", icon: ClockArrowUp, path: "/admin/profile/orders" },
  { id: 5, title: "Notification", icon: BellRing, path: "/admin/profile/notification" },
  { id: 6, title: "Students", icon: GraduationCap, path: "/admin/profile/students" },
  { id: 7, title: "Tutors", icon: Contact, path: "/admin/profile/tutors" },
  { id: 8, title: "Settings", icon: Settings, path: "/admin/profile/settings" },
]

const ProtectedLayout = () =>{
  return (
    <>
    <ProtectedRoute role={'admin'}>
    <Navbar/>
    <Layout menuItems={menuItems}>
    <Outlet/>
    </Layout>
    <Footer/>
    </ProtectedRoute>
    </>
  )
}

const AdminRoutes = ()=>{
  return (
    <Routes>
      <Route path='/' element={<AdminIndex/>}>
        <Route path='sign-up' element={
          <ProtectAuthPage>
          <SignUp role={'admin'} useSignup={useAdminSignupMutation}/>
          </ProtectAuthPage>
          }/>
        <Route path='login' element={
          <ProtectAuthPage>
          <Login role={'admin'} useLogin={useAdminLoginMutation} useAuthActions={useAdminAuthActions}/>
          </ProtectAuthPage>
          }/>
        <Route path='profile' element={<ProtectedLayout/>}>
          <Route index element={<Profile/>}/>
          <Route path='dashboard' element={<Dashboard/>}/>
          <Route path='category' element={<CategoryLayout/>}>
            <Route index element={<List/>}/>
            <Route path=':categoryName' element = {<CategoryList/>}/>
            <Route path=':categoryName/:courseDetails' element={<CourseDetails/>}/>
          </Route>
          <Route path='orders' element={<Orders/>}/>
          <Route path='notification' element={<Notification/>}/>
          <Route path='students' element={<Students/>}/>
          <Route path='tutors' element={<Tutors/>}/>
          <Route path='settings' element={<Setting/>}/>
        </Route>
        <Route path='*' element={<NotFound/>}/>
      </Route>
    </Routes>
  )
}

export default AdminRoutes
