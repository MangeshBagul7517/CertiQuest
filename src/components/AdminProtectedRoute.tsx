
import { useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { useAdmin } from '@/contexts/AdminContext';
import { toast } from 'sonner';

const AdminProtectedRoute = () => {
  const { checkAdminStatus } = useAdmin();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!checkAdminStatus()) {
      toast.error('Admin access required');
      navigate('/admin/login');
    }
  }, [navigate, checkAdminStatus]);
  
  return checkAdminStatus() ? <Outlet /> : null;
};

export default AdminProtectedRoute;
