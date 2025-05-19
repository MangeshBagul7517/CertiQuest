
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
  addCourse: (course: Omit<Course, 'id'>) => Promise<void>;
  updateCourse: (id: string, course: Partial<Course>) => Promise<void>;
  deleteCourse: (id: string) => Promise<void>;
  assignCourseToUser: (userId: string, courseId: string) => Promise<void>;
  unassignCourseFromUser: (userId: string, courseId: string) => Promise<void>;
  getUserCourses: (userId: string) => Promise<string[]>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

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

  useEffect(() => {
    fetchCourses();
    fetchUsers();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('courses')
        .select('*');

      if (error) throw error;

      setCourses(data || []);
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
      
      // Get users from auth.users
      const { data: authUsers, error: authError } = await supabase
        .from('users')
        .select('*');

      if (authError) throw authError;
      
      setUsers(authUsers || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to fetch users');
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const addCourse = async (course: Omit<Course, 'id'>) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('courses')
        .insert([course])
        .select();

      if (error) throw error;

      setCourses([...courses, data[0]]);
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
      const { error } = await supabase
        .from('courses')
        .update(course)
        .eq('id', id);

      if (error) throw error;

      setCourses(courses.map(c => c.id === id ? { ...c, ...course } : c));
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
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setCourses(courses.filter(c => c.id !== id));
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
      const { error } = await supabase
        .from('user_courses')
        .insert([{ user_id: userId, course_id: courseId }]);

      if (error) throw error;

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
      const { error } = await supabase
        .from('user_courses')
        .delete()
        .eq('user_id', userId)
        .eq('course_id', courseId);

      if (error) throw error;

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
      const { data, error } = await supabase
        .from('user_courses')
        .select('course_id')
        .eq('user_id', userId);

      if (error) throw error;

      return data.map(item => item.course_id);
    } catch (error) {
      console.error('Error fetching user courses:', error);
      setError('Failed to fetch user courses');
      toast.error('Failed to fetch user courses');
      return [];
    }
  };

  return (
    <AdminContext.Provider
      value={{
        courses,
        users,
        loading,
        error,
        addCourse,
        updateCourse,
        deleteCourse,
        assignCourseToUser,
        unassignCourseFromUser,
        getUserCourses,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};
