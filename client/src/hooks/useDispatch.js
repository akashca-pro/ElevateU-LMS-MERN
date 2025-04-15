import {useDispatch} from 'react-redux'
import {setUserCredentials, removeUserCredentials} from '@/features/auth/user/userAuthSlice.js'
import {setTutorCredentials, removeTutorCredentials} from '@/features/auth/tutor/tutorAuthSlice.js'
import {setAdminCredentials, removeAdminCredentials} from '@/features/auth/admin/adminAuthSlice.js'
import { setCourseId, removeCourseId } from '@/features/courseSlice.js' 

export const useUserAuthActions = () => {
    const dispatch = useDispatch();
  
    return {
      login: (payload) => dispatch(setUserCredentials(payload)),
      logout: () => dispatch(removeUserCredentials()),
    };
};

export const useTutorAuthActions = () =>{
    const dispatch = useDispatch();

    return {
        login : (payload) => dispatch(setTutorCredentials(payload)),
        logout : () => dispatch(removeTutorCredentials())
    }
}

export const useAdminAuthActions = ()=>{
    const dispatch = useDispatch()

    return {
        login : (payload) => dispatch(setAdminCredentials(payload)),
        logout : () => dispatch(removeAdminCredentials())
    }
}

export const useCourseActions = () => {
    const dispatch = useDispatch();

    return {
        setCourseId : (payload) => dispatch(setCourseId(payload)),
        removeCourseId : ()=> dispatch(removeCourseId())
    }
}