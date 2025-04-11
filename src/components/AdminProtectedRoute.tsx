
import { useEffect, useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

// Define admin email
const ADMIN_EMAIL = "mangeshbbagul@gmail.com";

const AdminProtectedRoute = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
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
      
      setIsVerified(true);
    };
    
    checkAdmin();
  }, [navigate, user]);
  
  return isVerified ? <Outlet /> : null;
};

export default AdminProtectedRoute;
