import {useDispatch} from 'react-redux'
import {setUserCredentials,removeUserCredentials} from '@/features/auth/user/userAuthSlice.js'

export const useUserAuthActions = () => {
    const dispatch = useDispatch();
  
    return {
      login: (userData) => dispatch(setUserCredentials(userData)),
      logout: () => dispatch(removeUserCredentials()),
    };
};