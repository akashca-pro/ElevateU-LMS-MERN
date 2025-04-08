import React from 'react'
import { Outlet, Route,Routes } from 'react-router-dom'

import {LayoutDashboard, SquareUser, Settings, ListCollapse, ClockArrowUp, 
GraduationCap, Contact, BellRing,
Sticker,BookOpen,
IndianRupee} from 'lucide-react'

import {useAdminSignupMutation, useAdminLoginMutation} from '@/services/adminApi/adminAuthApi'
import {useAdminAuthActions} from '@/hooks/useDispatch'

// re-used component
import SignUp from '@/components/auth/SignUp'
import Login from '@/components/auth/Login'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ProtectedRoute from '@/protectors/ProtectedRoute'
import ProtectAuthPage from '@/protectors/ProtectAuthPage'
import NotFound from '@/components/FallbackUI/NotFound'
import Layout from '@/components/Drawer/Layout'

//protected routes
import Profile from './Profile/Index'
import Dashboard from './Dashboard/Index'
import Orders from './Orders/Index'
import Setting from './Settings/Index'
import Notification from './Notification/Index'

import StudentsLayout from './Students/Index'
import StudentList from './Students/StudentList'
import StudentDetails from './Students/StudentDetails'

import TutorsLayout from './Tutors/Index'
import TutorsList from './Tutors/TutorsList'
import TutorsDetails from './Tutors/TutorsDetails'


import CategoryList from './Category/List'
import CouponList from './Coupon/Index'

import CourseList from './Courses/Index'
import WalletPage from './Wallet/WalletPage'

const AdminIndex = () => {
  return (
   <>
   <Outlet/>
   </>
  )
}

const menuItems = [
  { id: 1, title: "Dashboard", icon: LayoutDashboard, path: "/admin/profile/dashboard" },
  { id: 2, title: "Revenue", icon: IndianRupee, path: "/admin/profile/revenue" },
  { id: 3, title: "Profile", icon: SquareUser, path: "/admin/profile" },
  { id: 4, title: "Category Management", icon: ListCollapse, path: "/admin/profile/category" },
  { id: 5, title: "Course Management", icon: BookOpen, path: "/admin/profile/courses" },
  { id: 6, title: "Coupon Management", icon: Sticker, path: "/admin/profile/coupon" },
  { id: 7, title: "Order List", icon: ClockArrowUp, path: "/admin/profile/orders" },
  { id: 8, title: "Notifications", icon: BellRing, path: "/admin/profile/notification" },
  { id: 9, title: "Students", icon: GraduationCap, path: "/admin/profile/students" },
  { id: 10, title: "Tutors", icon: Contact, path: "/admin/profile/tutors" },
  { id: 11, title: "Settings", icon: Settings, path: "/admin/profile/settings" },
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
          <Route path='revenue' element={<WalletPage/>}/>
          <Route path='category' element={<CategoryList/>}/>
          <Route path='courses' element={<CourseList/>}/>
          <Route path='coupon' element={<CouponList/>}/>
          <Route path='orders' element={<Orders/>}/>
          <Route path='notification' element={<Notification/>}/>
          <Route path='students' element={<StudentsLayout/>}>
            <Route index element={<StudentList/>}/>
            <Route path=':studentId'element={<StudentDetails/>}/> 
          </Route>
          <Route path='tutors' element={<TutorsLayout/>}>
            <Route index element={<TutorsList/>}/>
            <Route path = ':tutorId' element={<TutorsDetails/>}/>
          </Route>
          <Route path='settings' element={<Setting/>}/>
        </Route>
        <Route path='*' element={<NotFound/>}/>
      </Route>
    </Routes>
  )
}

export default AdminRoutes
