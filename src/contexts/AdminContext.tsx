
import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface AdminContextType {
  isAdmin: boolean;
  adminLogout: () => void;
  checkAdminStatus: () => boolean;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  
  useEffect(() => {
    const adminAuth = localStorage.getItem('adminAuth');
    setIsAdmin(adminAuth === 'true');
  }, []);

  const adminLogout = () => {
    localStorage.removeItem('adminAuth');
    setIsAdmin(false);
    toast.info('Admin logged out');
  };

  const checkAdminStatus = () => {
    const adminAuth = localStorage.getItem('adminAuth');
    return adminAuth === 'true';
  };

  return (
    <AdminContext.Provider value={{ isAdmin, adminLogout, checkAdminStatus }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
