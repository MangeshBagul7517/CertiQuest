
import { useEffect, useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const AdminProtectedRoute = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  
  useEffect(() => {
    const checkAdmin = async () => {
      // Check if the user is logged in and is an admin
      const isAdminUser = user?.email === "mangeshbbagul@gmail.com";
      
      setIsAdmin(isAdminUser);
      
      if (!isAdminUser) {
        toast.error('Admin access required');
        navigate('/login');
      }
    };
    
    checkAdmin();
  }, [navigate, user]);
  
  return isAdmin ? <Outlet /> : null;
};

export default AdminProtectedRoute;
