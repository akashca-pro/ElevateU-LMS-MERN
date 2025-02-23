import {user} from '../../hooks/useSelect.js'
import { useNavigate } from 'react-router-dom'
import React from 'react'

const LoggedInProtector = ({children}) => {
    
    const navigate = useNavigate()
    if(user===null || user === undefined){
        navigate('/user/login')
    }
    
    return (
        <>
        {children}
        </>
    )
}

export default LoggedInProtector
