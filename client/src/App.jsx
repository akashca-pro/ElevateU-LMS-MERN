import React from 'react'
import {Routes , Route} from 'react-router-dom'

import UserRoutes from './pages/user/UserIndex'
import TutorRoutes from './pages/tutor/TutorIndex'
import AdminRoutes from './pages/admin/AdminIndex'

const App = () => {
  return (
    <Routes>
      
      <Route path='/user/*' element ={<UserRoutes/>}/>

      <Route path='/tutor/*' element ={<TutorRoutes/>}/>

      <Route path='/admin/*' element ={<AdminRoutes/>}/>

    </Routes>
  )
}

export default App
