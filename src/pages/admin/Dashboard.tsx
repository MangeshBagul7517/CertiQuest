
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
  Search
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

// User Management Component
const UserManagement = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAssignCourseDialogOpen, setIsAssignCourseDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Load users from localStorage
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    }
    
    // Load courses
    const fetchCourses = async () => {
      const loadedCourses = await loadCourses();
      setCourses(loadedCourses);
      setIsLoading(false);
    };
    
    fetchCourses();
  }, []);
  
  const openAssignDialog = (user: any) => {
    setSelectedUser(user);
    setSelectedCourseId('');
    setIsAssignCourseDialogOpen(true);
  };
  
  const handleAssignCourse = () => {
    if (!selectedUser || !selectedCourseId) {
      toast.error('Please select a course to assign');
      return;
    }
    
    // Update user's enrolled courses
    const updatedUsers = users.map(user => {
      if (user.id === selectedUser.id) {
        const enrolledCourses = user.enrolledCourses || [];
        
        // Check if course is already assigned
        if (enrolledCourses.includes(selectedCourseId)) {
          toast.error('Course already assigned to this user');
          return user;
        }
        
        return {
          ...user,
          enrolledCourses: [...enrolledCourses, selectedCourseId]
        };
      }
      return user;
    });
    
    // Save updated users to localStorage
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    setUsers(updatedUsers);
    
    // Update current user if they're logged in
    const currentUser = localStorage.getItem('user');
    if (currentUser) {
      const parsedUser = JSON.parse(currentUser);
      if (parsedUser.id === selectedUser.id) {
        const enrolledCourses = parsedUser.enrolledCourses || [];
        if (!enrolledCourses.includes(selectedCourseId)) {
          parsedUser.enrolledCourses = [...enrolledCourses, selectedCourseId];
          localStorage.setItem('user', JSON.stringify(parsedUser));
        }
      }
    }
    
    toast.success('Course assigned successfully');
    setIsAssignCourseDialogOpen(false);
  };
  
  const filteredUsers = searchTerm
    ? users.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
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
      
      {filteredUsers.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No users found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredUsers.map((user) => (
            <Card key={user.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <div>
                    <CardTitle>{user.name}</CardTitle>
                    <CardDescription>{user.email}</CardDescription>
                  </div>
                  <Button onClick={() => openAssignDialog(user)} variant="outline">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Assign Course
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <h4 className="font-semibold mb-2">Enrolled Courses</h4>
                {user.enrolledCourses?.length ? (
                  <ul className="space-y-1">
                    {user.enrolledCourses.map((courseId: string) => {
                      const course = courses.find(c => c.id === courseId);
                      return (
                        <li key={courseId} className="px-3 py-1 bg-slate-50 rounded flex justify-between">
                          <span>{course?.title || 'Unknown Course'}</span>
                          <span className="text-muted-foreground">{course?.price ? `${course.currency || '₹'}${course.price}` : ''}</span>
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
    // Load stats
    const loadStats = async () => {
      // Load users
      const storedUsers = localStorage.getItem('users');
      const users = storedUsers ? JSON.parse(storedUsers) : [];
      setUserCount(users.length);
      
      // Load courses
      const courses = await loadCourses();
      setcourseCount(courses.length);
      
      // Count enrollments
      let totalEnrollments = 0;
      users.forEach((user: any) => {
        if (user.enrolledCourses) {
          totalEnrollments += user.enrolledCourses.length;
        }
      });
      setEnrollmentCount(totalEnrollments);
    };
    
    loadStats();
  }, []);
  
  const handleLogout = () => {
    adminLogout();
    navigate('/');
  };
  
  return (
    <Layout>
      <div className="container mx-auto py-8">
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
          <TabsList className="grid grid-cols-2 mb-8">
            <TabsTrigger value="courses">Course Management</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
          </TabsList>
          
          <TabsContent value="courses" className="mt-6">
            <CourseManagement />
          </TabsContent>
          
          <TabsContent value="users" className="mt-6">
            <UserManagement />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
