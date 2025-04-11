
import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

interface AuthUser {
  id: string;
  name: string;
  email: string;
  enrolledCourses?: string[];
  isAdmin?: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUserCourses: (courseId: string) => void;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define admin email
const ADMIN_EMAIL = "admin@certiquest.com";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);

  // Initialize session and set up listener
  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        if (session?.user) {
          // Convert Supabase user to our AuthUser format
          const authUser: AuthUser = {
            id: session.user.id,
            name: session.user.user_metadata.name || '',
            email: session.user.email || '',
            enrolledCourses: session.user.user_metadata.enrolledCourses || [],
            // Check if the user is an admin
            isAdmin: session.user.email === ADMIN_EMAIL
          };
          setUser(authUser);
        } else {
          setUser(null);
        }
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        // Convert Supabase user to our AuthUser format
        const authUser: AuthUser = {
          id: session.user.id,
          name: session.user.user_metadata.name || '',
          email: session.user.email || '',
          enrolledCourses: session.user.user_metadata.enrolledCourses || [],
          // Check if the user is an admin
          isAdmin: session.user.email === ADMIN_EMAIL
        };
        setUser(authUser);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Check if admin credentials
      const isAdmin = email === ADMIN_EMAIL;
      
      // Regular login with Supabase
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        toast.error('Login failed: ' + error.message);
        return false;
      }
      
      // Set admin flag if this is the admin email
      if (isAdmin) {
        localStorage.setItem('adminAuth', 'true');
        toast.success('Admin login successful');
      } else {
        toast.success('Login successful');
      }
      
      return true;
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error?.message || 'An error occurred during login');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Register with Supabase
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            enrolledCourses: []
          }
        }
      });

      if (error) {
        toast.error(error.message || 'Registration failed');
        return false;
      }

      toast.success('Registration successful! Please verify your email if required.');
      return true;
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error(error?.message || 'An error occurred during registration');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    try {
      // First verify the current password by attempting to sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user?.email || '',
        password: currentPassword
      });

      if (signInError) {
        toast.error('Current password is incorrect');
        return false;
      }

      // Update the password
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        toast.error(error.message || 'Password change failed');
        return false;
      }

      toast.success('Password changed successfully');
      return true;
    } catch (error: any) {
      console.error('Password change error:', error);
      toast.error(error?.message || 'An error occurred while changing password');
      return false;
    }
  };

  const updateUserCourses = async (courseId: string) => {
    if (!user) return;

    try {
      // Get current enrolled courses
      const enrolledCourses = [...(user.enrolledCourses || []), courseId];

      // Update user metadata in Supabase
      const { error } = await supabase.auth.updateUser({
        data: { enrolledCourses }
      });

      if (error) {
        toast.error('Failed to update enrolled courses');
        return;
      }

      // Update local state
      setUser({
        ...user,
        enrolledCourses
      });

    } catch (error) {
      console.error('Update courses error:', error);
      toast.error('An error occurred while updating courses');
    }
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error('Error signing out');
    } else {
      localStorage.removeItem('adminAuth');
      toast.info('You have been logged out');
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      login, 
      register, 
      logout, 
      updateUserCourses,
      changePassword 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
