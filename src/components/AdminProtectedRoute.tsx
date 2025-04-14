
import { useEffect, useState } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

// Define admin email
const ADMIN_EMAIL = "mangeshbbagul@gmail.com";

const AdminProtectedRoute = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isVerified, setIsVerified] = useState(false);
  
  useEffect(() => {
    const checkAdmin = async () => {
      // Check if the user is logged in and is an admin
      const isAdminUser = user?.email === ADMIN_EMAIL;
      
      if (!user) {
        toast.error('Please login first');
        navigate('/login');
        return;
      }
      
      if (!isAdminUser) {
        toast.error('Admin access required');
        navigate('/dashboard');
        return;
      }
      
      // Store admin status in session storage to persist across page refreshes
      sessionStorage.setItem('isAdmin', 'true');
      setIsVerified(true);
    };
    
    // Always recheck admin status when this component renders or the path changes
    setIsVerified(false);
    checkAdmin();

    // Add a console log to debug the admin status
    console.log('AdminProtectedRoute - User:', user);
    console.log('AdminProtectedRoute - isAdmin in sessionStorage:', sessionStorage.getItem('isAdmin'));
  }, [navigate, user, location.pathname]);
  
  return isVerified ? <Outlet /> : null;
};

export default AdminProtectedRoute;
