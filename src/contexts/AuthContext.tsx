
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
  resetPassword: (password: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define admin email
const ADMIN_EMAIL = "admin@certiquest.store";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);

  // Initialize session and set up listener
  useEffect(() => {
    console.log('AuthContext - Initializing');
    
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('AuthContext - Auth event:', event);
        setSession(session);
        
        if (session?.user) {
          console.log('Auth user data:', session.user);
          // Convert Supabase user to our AuthUser format
          const authUser: AuthUser = {
            id: session.user.id,
            name: session.user.user_metadata?.name || '',
            email: session.user.email || '',
            enrolledCourses: session.user.user_metadata?.enrolledCourses || [],
            // Check if the user is an admin
            isAdmin: session.user.email === ADMIN_EMAIL
          };
          setUser(authUser);
          
          // Store admin status if this is the admin user
          if (authUser.isAdmin) {
            console.log('AuthContext - Setting admin status in sessionStorage');
            sessionStorage.setItem('isAdmin', 'true');
          } else {
            sessionStorage.removeItem('isAdmin');
          }
        } else {
          setUser(null);
          sessionStorage.removeItem('isAdmin');
        }
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('AuthContext - Got session:', session ? 'yes' : 'no');
      setSession(session);
      
      if (session?.user) {
        console.log('Initial user data:', session.user);
        // Convert Supabase user to our AuthUser format
        const authUser: AuthUser = {
          id: session.user.id,
          name: session.user.user_metadata?.name || '',
          email: session.user.email || '',
          enrolledCourses: session.user.user_metadata?.enrolledCourses || [],
          // Check if the user is an admin
          isAdmin: session.user.email === ADMIN_EMAIL
        };
        setUser(authUser);
        
        // Store admin status if this is the admin user
        if (authUser.isAdmin) {
          console.log('AuthContext - Setting admin status in sessionStorage (initial)');
          sessionStorage.setItem('isAdmin', 'true');
        }
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
      console.log('Attempting login for:', email);
      // Check if admin credentials
      const isAdmin = email === ADMIN_EMAIL;
      
      // Regular login with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error('Login error:', error);
        toast.error('Login failed: ' + error.message);
        return false;
      }
      
      console.log('Login successful:', data);
      
      // Set admin flag if this is the admin email
      if (isAdmin) {
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
      console.log('Attempting registration for:', email);
      // Register with Supabase
      const redirectUrl = `${window.location.origin}/`;
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            name,
            enrolledCourses: []
          }
        }
      });

      if (error) {
        console.error('Registration error:', error);
        toast.error(error.message || 'Registration failed');
        return false;
      }

      console.log('Registration successful:', data);
      toast.success('Registration successful!');
      
      // Save to localStorage as well for backup
      const storedUsers = localStorage.getItem('users') || '[]';
      const users = JSON.parse(storedUsers);
      if (data.user) {
        users.push({
          id: data.user.id,
          name,
          email,
          enrolledCourses: [],
          isAdmin: email === ADMIN_EMAIL
        });
        localStorage.setItem('users', JSON.stringify(users));
      }
      
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
  
  const resetPassword = async (password: string): Promise<boolean> => {
    try {
      console.log('AuthContext - Resetting password');
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        console.error('AuthContext - Password reset error:', error);
        toast.error(error.message || 'Password reset failed');
        return false;
      }

      console.log('AuthContext - Password reset successful');
      toast.success('Password has been reset successfully. Please login with your new password.');
      
      // Sign out the user after password reset to force a fresh login
      await supabase.auth.signOut();
      
      return true;
    } catch (error: any) {
      console.error('AuthContext - Password reset exception:', error);
      toast.error(error?.message || 'An error occurred during password reset');
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
      
      // Update in localStorage as well
      const storedUsers = localStorage.getItem('users') || '[]';
      const users = JSON.parse(storedUsers);
      const updatedUsers = users.map((u: any) => {
        if (u.id === user.id) {
          return {
            ...u,
            enrolledCourses
          };
        }
        return u;
      });
      localStorage.setItem('users', JSON.stringify(updatedUsers));

    } catch (error) {
      console.error('Update courses error:', error);
      toast.error('An error occurred while updating courses');
    }
  };

  const logout = async () => {
    sessionStorage.removeItem('isAdmin');
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error('Error signing out');
    } else {
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
      changePassword,
      resetPassword
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
