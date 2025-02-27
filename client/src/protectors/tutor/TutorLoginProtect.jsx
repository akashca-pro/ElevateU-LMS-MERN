import React,{useEffect} from 'react'
import { useSelect } from '@/hooks/useSelect.js'
import { useNavigate } from 'react-router-dom'

const TutorLoginProtect = ({children}) => {
    const {tutor} = useSelect()
    const navigate = useNavigate()
    useEffect(()=>{

        if(!tutor?.isAuthenticated) {
            navigate('/tutor/login')
        }

    },[tutor, navigate])

    if(!tutor?.isAuthenticated) return null

  return <>{children}</>
}

export default TutorLoginProtect
