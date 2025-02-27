import React, { useEffect } from 'react'
import { useSelect } from '@/hooks/useSelect'
import { useNavigate, useLocation } from 'react-router-dom'

const UserLogoutProtect = ({ children }) => {
    const { user, tutor } = useSelect()
    const location = useLocation()
    const navigate = useNavigate()

    useEffect(() => {
        if (user?.isAuthenticated || tutor?.isAuthenticated) {
            navigate(location.pathname, { replace: true }) 
        }
    }, [user, tutor, navigate, location.pathname])

    if (user?.isAuthenticated || tutor?.isAuthenticated) return null

    return <>{children}</>
}

export default UserLogoutProtect