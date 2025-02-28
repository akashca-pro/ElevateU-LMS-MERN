import { useEffect } from 'react';
import { useSelect } from '@/hooks/useSelect';
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ role, children }) => {
    const navigate = useNavigate();
    const { user, tutor, admin } = useSelect();

    let loginPath = '/login';
    if (role === 'user') loginPath = '/user/login';
    else if (role === 'tutor') loginPath = '/tutor/login';
    else if (role === 'admin') loginPath = '/admin/login';

    const isAuthenticated =
        (role === 'user' && user?.isAuthenticated) ||
        (role === 'tutor' && tutor?.isAuthenticated) ||
        (role === 'admin' && admin?.isAuthenticated);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate(loginPath, { replace: true });
        }
    }, [isAuthenticated, navigate, loginPath]);

    if (!isAuthenticated) {
        return null; // Prevents rendering if not authenticated
    }

    return <>{children}</>;
};

export default ProtectedRoute;