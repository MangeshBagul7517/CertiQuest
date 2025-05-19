
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
          console.log('AdminContext - Admin confirmed via Supabase session');
        } else if (adminAuth) {
          // If session storage says admin but Supabase doesn't, trust session storage
          // This handles cases where the page is refreshed
          setIsAdmin(true);
          console.log('AdminContext - Admin confirmed via sessionStorage');
        } else {
          // Only set to false if both checks fail
          setIsAdmin(false);
          console.log('AdminContext - Not admin');
        }
      });
    };
    
    // Check on initial load
    checkAdminStatus();
    
    // Set up listener for changes
    const authListener = supabase.auth.onAuthStateChange((event, session) => {
      console.log('AdminContext - Auth state changed:', event);
      if (event === 'SIGNED_IN' && session?.user?.email === ADMIN_EMAIL) {
        sessionStorage.setItem('isAdmin', 'true');
        setIsAdmin(true);
        console.log('AdminContext - Admin signed in');
      } else if (event === 'SIGNED_OUT') {
        sessionStorage.removeItem('isAdmin');
        setIsAdmin(false);
        console.log('AdminContext - User signed out');
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
    const status = sessionStorage.getItem('isAdmin') === 'true';
    console.log('AdminContext - Checking admin status:', status);
    return status;
  };
  
  const fetchSupabaseUsers = async () => {
    try {
      // Only admins should be able to fetch users
      if (!isAdmin && sessionStorage.getItem('isAdmin') !== 'true') {
        console.error('Only admins can fetch users');
        return [];
      }
      
      console.log('AdminContext - Fetching users from Supabase');
      
      // Use the direct data API to get users instead of admin functions
      // which require more permissions
      const { data: authUsers, error: authError } = await supabase.auth.getUser();
      
      if (authError) {
        console.error('Error fetching current user:', authError);
        return [];
      }
      
      // Get all users directly from the database
      const { data: userData, error: usersError } = await supabase
        .from('users')
        .select('*');
        
      if (usersError) {
        console.error('Error fetching users:', usersError);
        
        // Fallback to get all users from auth.users if possible
        const { data: signups, error: signupsError } = await supabase
          .from('auth_users')
          .select('*');
          
        if (signupsError || !signups) {
          console.error('Error fetching auth users:', signupsError);
          
          // Last resort: use the current user plus any from localStorage
          const storedUsers = localStorage.getItem('users');
          const localUsers = storedUsers ? JSON.parse(storedUsers) : [];
          
          // If we have at least the current user, include them
          if (authUsers?.user) {
            const currentUser = {
              id: authUsers.user.id,
              name: authUsers.user.user_metadata?.name || 'Unknown',
              email: authUsers.user.email || '',
              enrolledCourses: authUsers.user.user_metadata?.enrolledCourses || [],
              isAdmin: authUsers.user.email === ADMIN_EMAIL
            };
            
            // Merge with local users, avoiding duplicates
            const combinedUsers = [...localUsers];
            if (!combinedUsers.some(u => u.id === currentUser.id)) {
              combinedUsers.push(currentUser);
            }
            
            return combinedUsers;
          }
          
          return localUsers;
        }
        
        // Parse from auth_users table
        return signups.map(user => ({
          id: user.id,
          name: user.raw_user_meta_data?.name || 'Unknown',
          email: user.email || '',
          enrolledCourses: user.raw_user_meta_data?.enrolledCourses || [],
          isAdmin: user.email === ADMIN_EMAIL
        }));
      }
      
      // Use the data from the users table if available
      return userData.map((user: any) => ({
        id: user.id,
        name: user.name || user.user_metadata?.name || 'Unknown',
        email: user.email || '',
        enrolledCourses: user.enrolled_courses || user.user_metadata?.enrolledCourses || [],
        isAdmin: user.email === ADMIN_EMAIL
      }));
      
    } catch (error: any) {
      console.error('Error fetching users:', error);
      
      // Fallback to localStorage if everything else fails
      const storedUsers = localStorage.getItem('users');
      if (storedUsers) {
        return JSON.parse(storedUsers);
      }
      
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
