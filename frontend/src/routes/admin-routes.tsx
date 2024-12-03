import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }: { children: JSX.Element }) => {
  const user = localStorage.getItem('user');
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  try {
    const userData = JSON.parse(user);
    if (!userData.isAdmin) {
      return <Navigate to="/home" replace />;
    }
    return children;
  } catch {
    localStorage.clear();
    return <Navigate to="/login" replace />;
  }
};

export default AdminRoute;