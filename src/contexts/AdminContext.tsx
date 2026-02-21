
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Course } from '@/lib/types';

// Define the User type to fix type errors
type User = {
  id: string;
  email: string;
  raw_user_meta_data: {
    full_name?: string;
  };
};

interface AdminContextType {
  courses: Course[];
  users: User[];
  loading: boolean;
  error: string | null;
  isAdmin: boolean; // Add this property
  addCourse: (course: Omit<Course, 'id'>) => Promise<void>;
  updateCourse: (id: string, course: Partial<Course>) => Promise<void>;
  deleteCourse: (id: string) => Promise<void>;
  assignCourseToUser: (userId: string, courseId: string) => Promise<void>;
  unassignCourseFromUser: (userId: string, courseId: string) => Promise<void>;
  getUserCourses: (userId: string) => Promise<string[]>;
  fetchSupabaseUsers: () => Promise<User[]>; // Add this method
  adminLogout: () => void; // Add this method
}

export const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

interface AdminProviderProps {
  children: ReactNode;
}

export const AdminProvider = ({ children }: AdminProviderProps) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false); // Add this state

  useEffect(() => {
    fetchCourses();
    fetchUsers();
    
    // Check if user is admin
    const checkAdmin = () => {
      const isAdminValue = sessionStorage.getItem('isAdmin');
      setIsAdmin(isAdminValue === 'true');
    };
    
    checkAdmin();
    
    // Listen for admin status changes
    window.addEventListener('storage', checkAdmin);
    
    return () => {
      window.removeEventListener('storage', checkAdmin);
    };
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      
      // Since we don't have the 'courses' table in Supabase yet, 
      // let's fallback to localStorage
      const storedCourses = localStorage.getItem('courses');
      if (storedCourses) {
        setCourses(JSON.parse(storedCourses));
      } else {
        // Initialize with empty array if not in localStorage
        setCourses([]);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      setError('Failed to fetch courses');
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Since we don't have the 'users' table in Supabase yet,
      // let's fallback to localStorage
      const storedUsers = localStorage.getItem('users');
      if (storedUsers) {
        setUsers(JSON.parse(storedUsers));
      } else {
        // Initialize with empty array if not in localStorage
        setUsers([]);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to fetch users');
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const fetchSupabaseUsers = async (): Promise<User[]> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return [];

      const response = await supabase.functions.invoke('list-users');
      
      if (response.error) {
        console.error('Error fetching users:', response.error);
        toast.error('Failed to fetch users');
        return [];
      }

      const fetchedUsers = response.data?.users || [];
      return fetchedUsers.map((u: any) => ({
        id: u.id,
        email: u.email,
        name: u.name,
        enrolledCourses: u.enrolledCourses || [],
        raw_user_meta_data: { full_name: u.name },
      }));
    } catch (error) {
      console.error('Error fetching Supabase users:', error);
      toast.error('Failed to fetch users');
      return [];
    }
  };

  const addCourse = async (course: Omit<Course, 'id'>) => {
    try {
      setLoading(true);
      
      // Generate random ID (in a real app, Supabase would do this)
      const newCourse = {
        ...course,
        id: crypto.randomUUID()
      };
      
      // Update local state
      const updatedCourses = [...courses, newCourse];
      setCourses(updatedCourses);
      
      // Save to localStorage
      localStorage.setItem('courses', JSON.stringify(updatedCourses));
      
      toast.success('Course added successfully');
    } catch (error) {
      console.error('Error adding course:', error);
      setError('Failed to add course');
      toast.error('Failed to add course');
    } finally {
      setLoading(false);
    }
  };

  const updateCourse = async (id: string, course: Partial<Course>) => {
    try {
      setLoading(true);
      
      // Update in local state
      const updatedCourses = courses.map(c => 
        c.id === id ? { ...c, ...course } : c
      );
      
      setCourses(updatedCourses);
      
      // Save to localStorage
      localStorage.setItem('courses', JSON.stringify(updatedCourses));
      
      toast.success('Course updated successfully');
    } catch (error) {
      console.error('Error updating course:', error);
      setError('Failed to update course');
      toast.error('Failed to update course');
    } finally {
      setLoading(false);
    }
  };

  const deleteCourse = async (id: string) => {
    try {
      setLoading(true);
      
      // Delete from local state
      const updatedCourses = courses.filter(c => c.id !== id);
      setCourses(updatedCourses);
      
      // Save to localStorage
      localStorage.setItem('courses', JSON.stringify(updatedCourses));
      
      toast.success('Course deleted successfully');
    } catch (error) {
      console.error('Error deleting course:', error);
      setError('Failed to delete course');
      toast.error('Failed to delete course');
    } finally {
      setLoading(false);
    }
  };

  const assignCourseToUser = async (userId: string, courseId: string) => {
    try {
      setLoading(true);
      
      // Store user_courses mappings in localStorage
      const userCourses = JSON.parse(localStorage.getItem('user_courses') || '[]');
      
      // Check if mapping already exists
      const exists = userCourses.some(
        (uc: { user_id: string, course_id: string }) => 
          uc.user_id === userId && uc.course_id === courseId
      );
      
      if (!exists) {
        userCourses.push({ user_id: userId, course_id: courseId });
        localStorage.setItem('user_courses', JSON.stringify(userCourses));
      }
      
      toast.success('Course assigned successfully');
    } catch (error) {
      console.error('Error assigning course:', error);
      setError('Failed to assign course');
      toast.error('Failed to assign course');
    } finally {
      setLoading(false);
    }
  };

  const unassignCourseFromUser = async (userId: string, courseId: string) => {
    try {
      setLoading(true);
      
      // Get user_courses from localStorage
      const userCourses = JSON.parse(localStorage.getItem('user_courses') || '[]');
      
      // Filter out the mapping
      const updatedUserCourses = userCourses.filter(
        (uc: { user_id: string, course_id: string }) => 
          !(uc.user_id === userId && uc.course_id === courseId)
      );
      
      localStorage.setItem('user_courses', JSON.stringify(updatedUserCourses));
      
      toast.success('Course unassigned successfully');
    } catch (error) {
      console.error('Error unassigning course:', error);
      setError('Failed to unassign course');
      toast.error('Failed to unassign course');
    } finally {
      setLoading(false);
    }
  };

  const getUserCourses = async (userId: string) => {
    try {
      // Get user_courses from localStorage
      const userCourses = JSON.parse(localStorage.getItem('user_courses') || '[]');
      
      // Filter courses for the user
      const userCoursesIds = userCourses
        .filter((uc: { user_id: string, course_id: string }) => uc.user_id === userId)
        .map((uc: { user_id: string, course_id: string }) => uc.course_id);
      
      return userCoursesIds;
    } catch (error) {
      console.error('Error fetching user courses:', error);
      setError('Failed to fetch user courses');
      toast.error('Failed to fetch user courses');
      return [];
    }
  };

  const adminLogout = () => {
    // Clear admin status from sessionStorage
    sessionStorage.removeItem('isAdmin');
    setIsAdmin(false);
    toast.success('Logged out successfully');
  };

  return (
    <AdminContext.Provider
      value={{
        courses,
        users,
        loading,
        error,
        isAdmin,
        addCourse,
        updateCourse,
        deleteCourse,
        assignCourseToUser,
        unassignCourseFromUser,
        getUserCourses,
        fetchSupabaseUsers,
        adminLogout,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};
