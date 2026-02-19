
import { useState, useEffect } from "react";
import { Routes, Route, useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { LogOut, User, Settings, BookOpen, ExternalLink, Lock, LayoutDashboard } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import EnrollmentForm from "@/components/EnrollmentForm";
import ChangePasswordForm from "@/components/ChangePasswordForm";
import Layout from "@/components/Layout";

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  
  const handleSaveProfile = () => {
    setIsEditing(false);
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully",
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">My Profile</h2>
        {isEditing ? (
          <div className="space-x-2">
            <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
            <Button onClick={handleSaveProfile}>Save Changes</Button>
          </div>
        ) : (
          <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
        )}
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <User className="h-12 w-12" />
              </div>
              <div>
                <h3 className="text-xl font-medium">{user?.name || "User"}</h3>
                <p className="text-muted-foreground">{user?.email || "email@example.com"}</p>
              </div>
            </div>
            
            <Separator />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-1">Full Name</h4>
                <p>{user?.name || "User"}</p>
              </div>
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-1">Email</h4>
                <p>{user?.email || "email@example.com"}</p>
              </div>
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-1">Phone</h4>
                <p>Not provided</p>
              </div>
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-1">Member Since</h4>
                <p>July 2023</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const EnrolledCourses = () => {
  const { user } = useAuth();
  const [assignedCourses, setAssignedCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchAssignedCourses = async () => {
      if (!user) {
        setAssignedCourses([]);
        setIsLoading(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('course_assignments')
          .select('*')
          .eq('user_id', user.id);

        if (error) {
          console.error('Error fetching assigned courses:', error);
          setAssignedCourses([]);
        } else {
          setAssignedCourses(data || []);
        }
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAssignedCourses();
  }, [user]);
  
  if (isLoading) {
    return <div className="text-center py-8">Loading your courses...</div>;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">My Courses</h2>
        <Link to="/courses">
          <Button variant="outline">
            <BookOpen className="mr-2 h-4 w-4" />
            Browse More Courses
          </Button>
        </Link>
      </div>

      {assignedCourses.length === 0 ? (
        <div className="py-8">
          <div className="mb-6">
            <h3 className="text-xl font-medium mb-2">You haven't been assigned any courses yet</h3>
            <p className="text-muted-foreground mb-4">Browse our catalog and enroll to get started.</p>
            <Link to="/courses">
              <Button>
                <BookOpen className="mr-2 h-4 w-4" />
                Browse Courses
              </Button>
            </Link>
          </div>
          <EnrollmentForm />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assignedCourses.map(course => (
            <Card key={course.id} className="overflow-hidden">
              <div className="aspect-video bg-muted">
                <img src={course.course_image} alt={course.course_title} className="w-full h-full object-cover" />
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-2">{course.course_title}</h3>
                <div className="flex justify-between text-sm text-muted-foreground mb-4">
                  <span>{course.course_instructor}</span>
                  <span>{course.course_duration}</span>
                </div>
                {course.drive_link ? (
                  <a href={course.drive_link} target="_blank" rel="noopener noreferrer">
                    <Button size="sm" className="w-full">
                      Access Course Material
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </Button>
                  </a>
                ) : (
                  <div className="text-center p-2 text-sm text-muted-foreground">
                    Course material will be available soon
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

const SecuritySettings = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Security Settings</h2>
      
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4 flex items-center">
                <Lock className="mr-2 h-5 w-5" /> Change Password
              </h3>
              <ChangePasswordForm />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const AccountSettings = () => {
  const { toast } = useToast();
  
  const handleSaveSettings = () => {
    toast({
      title: "Settings saved",
      description: "Your account settings have been updated",
    });
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Account Settings</h2>
      
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Email Notifications</h3>
            <div className="space-y-2">
              <p className="text-muted-foreground">
                Notification settings will be available soon.
              </p>
            </div>
            
            <Separator />
            
            <h3 className="text-lg font-medium">Delete Account</h3>
            <p className="text-muted-foreground">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <Button variant="destructive">Delete Account</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  
  if (!user) {
    navigate("/login");
    return null;
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    navigate(`/dashboard${value === "profile" ? "" : `/${value}`}`);
  };
  
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4 md:px-6">
        <header className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground">Welcome back, {user?.name || "User"}</p>
            </div>
            <Button variant="outline" onClick={handleLogout} className="mt-4 md:mt-0">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
          
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full md:w-auto grid-cols-4 mb-8">
              <TabsTrigger value="profile">
                <User className="h-4 w-4 mr-2" />
                <span className="hidden md:inline">Profile</span>
              </TabsTrigger>
              <TabsTrigger value="courses">
                <BookOpen className="h-4 w-4 mr-2" />
                <span className="hidden md:inline">My Courses</span>
              </TabsTrigger>
              <TabsTrigger value="security">
                <Lock className="h-4 w-4 mr-2" />
                <span className="hidden md:inline">Security</span>
              </TabsTrigger>
              <TabsTrigger value="settings">
                <Settings className="h-4 w-4 mr-2" />
                <span className="hidden md:inline">Settings</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile">
              <Profile />
            </TabsContent>
            <TabsContent value="courses">
              <EnrolledCourses />
            </TabsContent>
            <TabsContent value="security">
              <SecuritySettings />
            </TabsContent>
            <TabsContent value="settings">
              <AccountSettings />
            </TabsContent>
          </Tabs>
        </header>

        <Routes>
          <Route index element={null} />
          <Route path="courses" element={null} />
          <Route path="security" element={null} />
          <Route path="settings" element={null} />
        </Routes>
      </div>
    </Layout>
  );
};

export default Dashboard;
