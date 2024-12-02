import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');

  if (!token || !user) {
    
    return <Navigate to="/login" replace />;
  }

  try {
    
    JSON.parse(user);
    return children;
  } catch {
    
    localStorage.clear();
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;