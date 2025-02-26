import {useDispatch} from 'react-redux'
import {setUserCredentials, removeUserCredentials} from '@/features/auth/user/userAuthSlice.js'
import {setTutorCredentials, removeTutorCredentials} from '@/features/auth/tutor/tutorAuthSlice.js'

export const useUserAuthActions = () => {
    const dispatch = useDispatch();
  
    return {
      login: (userData) => dispatch(setUserCredentials(userData)),
      logout: () => dispatch(removeUserCredentials()),
    };
};

export const useTutorAuthActions = () =>{
    const dispatch = useDispatch();

    return {
        login : (userData) => dispatch(setTutorCredentials(userData)),
        logout : () => dispatch(removeTutorCredentials())
    }
}