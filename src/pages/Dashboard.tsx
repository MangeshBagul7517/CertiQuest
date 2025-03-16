
import { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { LogOut, User, Settings, BookOpen } from "lucide-react";

// Dashboard sub-components
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
              {/* Profile information fields would go here, static for now */}
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
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">My Courses</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Example enrolled course cards */}
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <div className="aspect-video bg-slate-100"></div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-2">Course {i + 1}</h3>
              <div className="flex justify-between text-sm text-muted-foreground mb-4">
                <span>Progress: 60%</span>
                <span>4h 30m</span>
              </div>
              <Button size="sm" className="w-full">Continue Learning</Button>
            </CardContent>
          </Card>
        ))}
      </div>
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
              {/* Notification settings would go here */}
              <p className="text-muted-foreground">
                Notification settings will be available soon.
              </p>
            </div>
            
            <Separator />
            
            <h3 className="text-lg font-medium">Password</h3>
            <div className="space-y-2">
              {/* Password change form would go here */}
              <p className="text-muted-foreground">
                Password change feature will be available soon.
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

// Main Dashboard component
const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  // If not logged in, redirect to login
  if (!user) {
    navigate("/login");
    return null;
  }
  
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto py-8 px-4 md:px-6">
        <header className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground">Welcome back, {user?.name || "User"}</p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
          
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full md:w-auto grid-cols-3 mb-8">
              <TabsTrigger value="profile" onClick={() => navigate("/dashboard")}>
                <User className="h-4 w-4 mr-2" />
                <span className="hidden md:inline">Profile</span>
              </TabsTrigger>
              <TabsTrigger value="courses" onClick={() => navigate("/dashboard/courses")}>
                <BookOpen className="h-4 w-4 mr-2" />
                <span className="hidden md:inline">My Courses</span>
              </TabsTrigger>
              <TabsTrigger value="settings" onClick={() => navigate("/dashboard/settings")}>
                <Settings className="h-4 w-4 mr-2" />
                <span className="hidden md:inline">Settings</span>
              </TabsTrigger>
            </TabsList>
            
            {/* This content will be managed by nested routes */}
            <TabsContent value="profile">
              <Routes>
                <Route index element={<Profile />} />
                <Route path="courses" element={<EnrolledCourses />} />
                <Route path="settings" element={<AccountSettings />} />
                <Route path="*" element={<Profile />} />
              </Routes>
            </TabsContent>
            <TabsContent value="courses">
              <EnrolledCourses />
            </TabsContent>
            <TabsContent value="settings">
              <AccountSettings />
            </TabsContent>
          </Tabs>
        </header>
      </div>
    </div>
  );
};

export default Dashboard;
