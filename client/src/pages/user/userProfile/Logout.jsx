import React from 'react'
import {useUserAuthActions} from '@/hooks/useDispatch'
const Logout = () => {

    const {logout} = useUserAuthActions()

  return (
    <div>
        <button onClick={logout}>Logout</button>
    </div>
  )
}

export default Logout
