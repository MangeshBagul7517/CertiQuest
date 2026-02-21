import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useAdmin } from '@/contexts/AdminContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CourseManagement from './CourseManagement';
import { 
  BarChart3, 
  BookOpen, 
  LogOut, 
  Users, 
  UserPlus, 
  Search,
  ExternalLink,
  Mail
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import { loadCourses, Course } from '@/lib/data';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';
import { EnrollmentForm } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';

// User Management Component
const UserManagement = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAssignCourseDialogOpen, setIsAssignCourseDialogOpen] = useState(false);
  const [isAddDriveLinkDialogOpen, setIsAddDriveLinkDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [selectedUserCourse, setSelectedUserCourse] = useState<any>(null);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [driveLink, setDriveLink] = useState('');
  const [enrollmentRequests, setEnrollmentRequests] = useState<EnrollmentForm[]>([]);
  const { fetchSupabaseUsers } = useAdmin();
  
  useEffect(() => {
    // Load users from Supabase
    const loadUsers = async () => {
      setIsLoading(true);
      try {
        const supabaseUsers = await fetchSupabaseUsers();
        
        if (supabaseUsers && supabaseUsers.length > 0) {
          setUsers(supabaseUsers);
        } else {
          // Fallback to localStorage if there's an issue with Supabase
          const storedUsers = localStorage.getItem('users');
          if (storedUsers) {
            setUsers(JSON.parse(storedUsers));
          }
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Could not load users");
        
        // Fallback to localStorage
        const storedUsers = localStorage.getItem('users');
        if (storedUsers) {
          setUsers(JSON.parse(storedUsers));
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    // Load enrollment requests
    const storedRequests = localStorage.getItem('enrollmentRequests');
    if (storedRequests) {
      setEnrollmentRequests(JSON.parse(storedRequests));
    }
    
    // Load courses
    const fetchCourses = async () => {
      const loadedCourses = await loadCourses();
      setCourses(loadedCourses);
    };
    
    loadUsers();
    fetchCourses();
  }, [fetchSupabaseUsers]);
  
  const openAssignDialog = (user: any) => {
    setSelectedUser(user);
    setSelectedCourseId('');
    setIsAssignCourseDialogOpen(true);
  };

  const openDriveLinkDialog = (user: any, courseId: string) => {
    const course = courses.find(c => c.id === courseId);
    setSelectedUser(user);
    setSelectedUserCourse(course);
    setDriveLink(course?.driveLink || '');
    setIsAddDriveLinkDialogOpen(true);
  };
  
  const handleAssignCourse = async () => {
    if (!selectedUser || !selectedCourseId) {
      toast.error('Please select a course to assign');
      return;
    }
    
    const course = courses.find(c => c.id === selectedCourseId);
    if (!course) {
      toast.error('Course not found');
      return;
    }

    try {
      const { error } = await supabase.from('course_assignments').upsert({
        user_id: selectedUser.id,
        course_id: selectedCourseId,
        course_title: course.title,
        course_image: course.image,
        course_instructor: course.instructor,
        course_duration: course.duration,
        drive_link: course.driveLink || null,
      }, { onConflict: 'user_id,course_id' });

      if (error) {
        console.error('Error assigning course:', error);
        toast.error('Failed to assign course: ' + error.message);
        return;
      }

      // Update local state for display
      const updatedUsers = users.map(user => {
        if (user.id === selectedUser.id) {
          const enrolledCourses = user.enrolledCourses || [];
          if (enrolledCourses.includes(selectedCourseId)) return user;
          return { ...user, enrolledCourses: [...enrolledCourses, selectedCourseId] };
        }
        return user;
      });
      setUsers(updatedUsers);

      toast.success('Course assigned successfully');
      setIsAssignCourseDialogOpen(false);
    } catch (error) {
      console.error('Error assigning course:', error);
      toast.error('Failed to assign course');
    }
  };

  const handleAddDriveLink = async () => {
    if (!selectedUser || !selectedUserCourse || !driveLink) {
      toast.error('Please enter a valid drive link');
      return;
    }

    try {
      // Update in database
      const { error } = await supabase
        .from('course_assignments')
        .update({ drive_link: driveLink })
        .eq('user_id', selectedUser.id)
        .eq('course_id', selectedUserCourse.id);

      if (error) {
        console.error('Error adding drive link:', error);
        toast.error('Failed to add drive link: ' + error.message);
        return;
      }

      // Also update localStorage courses for backwards compat
      const storedCourses = localStorage.getItem('courses');
      if (storedCourses) {
        const parsedCourses = JSON.parse(storedCourses);
        const updatedCourses = parsedCourses.map((course: Course) => {
          if (course.id === selectedUserCourse.id) return { ...course, driveLink };
          return course;
        });
        localStorage.setItem('courses', JSON.stringify(updatedCourses));
        setCourses(updatedCourses);
      }

      toast.success('Drive link added successfully');
      setIsAddDriveLinkDialogOpen(false);
    } catch (error) {
      console.error('Error adding drive link:', error);
      toast.error('Failed to add drive link');
    }
  };

  const handleApproveEnrollment = (request: EnrollmentForm) => {
    // Find the user or create a new one
    const { name, email, courseId } = request;
    const updatedUsers = [...users];
    
    // Check if user already exists
    const existingUserIndex = updatedUsers.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (existingUserIndex >= 0) {
      // User exists, update their courses
      const enrolledCourses = updatedUsers[existingUserIndex].enrolledCourses || [];
      
      if (!enrolledCourses.includes(courseId)) {
        updatedUsers[existingUserIndex].enrolledCourses = [...enrolledCourses, courseId];
      }
    } else {
      // Create new user
      const newUser = {
        id: crypto.randomUUID(),
        name,
        email,
        password: 'defaultpassword', // In a real app, would generate random password
        enrolledCourses: [courseId]
      };
      
      updatedUsers.push(newUser);
    }
    
    // Update users in localStorage
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    setUsers(updatedUsers);
    
    // Remove the request from enrollment requests
    const updatedRequests = enrollmentRequests.filter(r => 
      !(r.email === email && r.courseId === courseId)
    );
    
    localStorage.setItem('enrollmentRequests', JSON.stringify(updatedRequests));
    setEnrollmentRequests(updatedRequests);
    
    toast.success('Enrollment approved successfully');
  };

  const handleDenyEnrollment = (request: EnrollmentForm) => {
    // Remove the request from enrollment requests
    const updatedRequests = enrollmentRequests.filter(r => 
      !(r.email === request.email && r.courseId === request.courseId)
    );
    
    localStorage.setItem('enrollmentRequests', JSON.stringify(updatedRequests));
    setEnrollmentRequests(updatedRequests);
    
    toast.success('Enrollment request denied');
  };
  
  const filteredUsers = searchTerm
    ? users.filter(user => 
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : users;
  
  if (isLoading) {
    return <div className="text-center py-8">Loading user data...</div>;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h2 className="text-2xl font-bold">User Management</h2>
        <div className="relative w-full md:w-64 mt-4 md:mt-0">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Enrollment Requests Section */}
      {enrollmentRequests.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Pending Enrollment Requests</h3>
          <div className="grid grid-cols-1 gap-4">
            {enrollmentRequests.map((request, index) => {
              const course = courses.find(c => c.id === request.courseId);
              return (
                <Card key={`request-${index}`}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{request.name}</CardTitle>
                    <CardDescription>{request.email} • {request.phone}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-3">
                      <p className="font-medium">Requested Course:</p>
                      <p>{course?.title || 'Unknown Course'}</p>
                    </div>
                    {request.message && (
                      <div>
                        <p className="font-medium">Message:</p>
                        <p className="text-sm text-muted-foreground">{request.message}</p>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2 pt-0">
                    <Button 
                      variant="outline" 
                      onClick={() => handleDenyEnrollment(request)}
                    >
                      Deny
                    </Button>
                    <Button 
                      onClick={() => handleApproveEnrollment(request)}
                    >
                      Approve
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </div>
      )}
      
      {/* Users List */}
      {filteredUsers.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No users found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredUsers.map((user) => (
            <Card key={user.id}>
              <CardHeader className="pb-2">
                <div className="flex flex-col sm:flex-row justify-between gap-2">
                  <div>
                    <CardTitle className="text-base sm:text-lg">{user.name}</CardTitle>
                    <CardDescription className="text-sm break-all">{user.email}</CardDescription>
                  </div>
                  <Button onClick={() => openAssignDialog(user)} variant="outline" size="sm" className="self-start">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Assign Course
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <h4 className="font-semibold mb-2">Enrolled Courses</h4>
                {user.enrolledCourses?.length ? (
                  <ul className="space-y-2">
                    {user.enrolledCourses.map((courseId: string) => {
                      const course = courses.find(c => c.id === courseId);
                      return (
                        <li key={courseId} className="px-3 py-2 bg-muted rounded flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                          <span className="flex-1">{course?.title || 'Unknown Course'}</span>
                          <span className="text-muted-foreground mx-2">{course?.price ? `${course.currency || '₹'}${course.price}` : ''}</span>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => openDriveLinkDialog(user, courseId)}
                          >
                            <ExternalLink className="h-4 w-4 mr-1" />
                            {course?.driveLink ? 'Update Link' : 'Add Link'}
                          </Button>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="text-muted-foreground">No courses assigned</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {/* Assign Course Dialog */}
      <Dialog open={isAssignCourseDialogOpen} onOpenChange={setIsAssignCourseDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Course to User</DialogTitle>
            <DialogDescription>
              Select a course to assign to {selectedUser?.name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a course" />
              </SelectTrigger>
              <SelectContent>
                {courses.map(course => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.title} ({course.currency || "₹"}{course.price})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAssignCourseDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAssignCourse}>Assign Course</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Drive Link Dialog */}
      <Dialog open={isAddDriveLinkDialogOpen} onOpenChange={setIsAddDriveLinkDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Course Access Link</DialogTitle>
            <DialogDescription>
              Add a Google Drive or resource link for {selectedUserCourse?.title}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <label className="block text-sm font-medium mb-2">Drive/Resource Link</label>
            <Input
              placeholder="https://drive.google.com/..."
              value={driveLink}
              onChange={(e) => setDriveLink(e.target.value)}
            />
            <p className="text-sm text-muted-foreground mt-2">
              This link will be available to all users enrolled in this course.
            </p>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDriveLinkDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddDriveLink}>Save Link</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Newsletter Emails Component
const NewsletterEmails = () => {
  const [emails, setEmails] = useState<{ id: string; email: string; subscribed_at: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEmails = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase.from('newsletter_emails').select('*').order('subscribed_at', { ascending: false });
        if (error) throw error;
        setEmails(data || []);
      } catch (error) {
        console.error('Error fetching newsletter emails:', error);
        toast.error('Failed to load newsletter emails');
      } finally {
        setIsLoading(false);
      }
    };
    fetchEmails();
  }, []);

  if (isLoading) return <div className="text-center py-8">Loading newsletter emails...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Newsletter Subscribers</h2>
        <span className="text-muted-foreground">{emails.length} subscribers</span>
      </div>
      {emails.length === 0 ? (
        <div className="text-center py-8">
          <Mail className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No newsletter subscribers yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {emails.map((item) => (
            <Card key={item.id}>
              <CardContent className="flex items-center justify-between py-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{item.email}</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {new Date(item.subscribed_at).toLocaleDateString()}
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('courses');
  const { adminLogout } = useAdmin();
  const navigate = useNavigate();
  const [userCount, setUserCount] = useState(0);
  const [courseCount, setcourseCount] = useState(0);
  const [enrollmentCount, setEnrollmentCount] = useState(0);
  
  useEffect(() => {
    const loadStats = async () => {
      try {
        // Fetch user count from edge function
        const response = await supabase.functions.invoke('list-users');
        const users = response.data?.users || [];
        setUserCount(users.length);
        
        // Count enrollments from course_assignments
        const { count } = await supabase
          .from('course_assignments')
          .select('*', { count: 'exact', head: true });
        setEnrollmentCount(count || 0);
      } catch (error) {
        console.error('Error loading stats:', error);
      }
      
      // Load courses
      const courses = await loadCourses();
      setcourseCount(courses.length);
    };
    
    loadStats();
  }, []);
  
  const handleLogout = () => {
    adminLogout();
    navigate('/');
  };
  
  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your courses and platform content</p>
          </div>
          <Button variant="destructive" onClick={handleLogout} className="mt-4 md:mt-0">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <BookOpen className="h-5 w-5 text-muted-foreground mr-2" />
                <div className="text-2xl font-bold">{courseCount}</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Users className="h-5 w-5 text-muted-foreground mr-2" />
                <div className="text-2xl font-bold">{userCount}</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Course Enrollments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <BarChart3 className="h-5 w-5 text-muted-foreground mr-2" />
                <div className="text-2xl font-bold">{enrollmentCount}</div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="courses" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 text-xs sm:text-sm">
            <TabsTrigger value="courses">Course Management</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="newsletter">Newsletter Emails</TabsTrigger>
          </TabsList>
          
          <TabsContent value="courses" className="mt-6">
            <CourseManagement />
          </TabsContent>
          
          <TabsContent value="users" className="mt-6">
            <UserManagement />
          </TabsContent>

          <TabsContent value="newsletter" className="mt-6">
            <NewsletterEmails />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
