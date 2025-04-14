
import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface AdminContextType {
  isAdmin: boolean;
  adminLogout: () => void;
  checkAdminStatus: () => boolean;
  fetchSupabaseUsers: () => Promise<any[]>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

// Define admin email for consistency
const ADMIN_EMAIL = "mangeshbbagul@gmail.com";

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  
  useEffect(() => {
    const checkAdminStatus = () => {
      // Check both session storage and user email
      const adminAuth = sessionStorage.getItem('isAdmin') === 'true';
      
      // Also verify with Supabase session if available
      supabase.auth.getSession().then(({ data }) => {
        const isAdminEmail = data.session?.user?.email === ADMIN_EMAIL;
        if (isAdminEmail) {
          sessionStorage.setItem('isAdmin', 'true');
          setIsAdmin(true);
        } else if (!adminAuth) {
          // Only set to false if both checks fail
          setIsAdmin(false);
        }
      });
      
      setIsAdmin(adminAuth);
    };
    
    // Check on initial load
    checkAdminStatus();
    
    // Set up listener for changes
    const authListener = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user?.email === ADMIN_EMAIL) {
        sessionStorage.setItem('isAdmin', 'true');
        setIsAdmin(true);
      } else if (event === 'SIGNED_OUT') {
        sessionStorage.removeItem('isAdmin');
        setIsAdmin(false);
      }
    });
    
    return () => {
      authListener.data.subscription.unsubscribe();
    };
  }, []);

  const adminLogout = () => {
    sessionStorage.removeItem('isAdmin');
    setIsAdmin(false);
    toast.info('Admin logged out');
  };

  const checkAdminStatus = () => {
    return sessionStorage.getItem('isAdmin') === 'true';
  };
  
  const fetchSupabaseUsers = async () => {
    try {
      // Only admins should be able to fetch users
      if (!isAdmin) {
        console.error('Only admins can fetch users');
        return [];
      }
      
      // Get users from Supabase
      const { data: userData, error } = await supabase.auth.admin.listUsers();
      
      if (error) {
        console.error('Error fetching users:', error);
        return [];
      }
      
      // Transform the data to match the expected format
      const formattedUsers = userData.users.map(user => ({
        id: user.id,
        name: user.user_metadata?.name || 'Unknown',
        email: user.email || '',
        enrolledCourses: user.user_metadata?.enrolledCourses || [],
        isAdmin: user.email === ADMIN_EMAIL
      }));
      
      return formattedUsers;
    } catch (error: any) {
      console.error('Error fetching users:', error);
      return [];
    }
  };

  return (
    <AdminContext.Provider value={{ 
      isAdmin, 
      adminLogout, 
      checkAdminStatus,
      fetchSupabaseUsers
    }}>
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
