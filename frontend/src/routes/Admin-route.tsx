
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }: { children: JSX.Element }) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!user.isAdmin) {
        return <Navigate to="/home" replace />;
    }

    return children;
};

export default AdminRoute;
