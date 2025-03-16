
import { useState } from "react";
import PageTransition from "@/components/PageTransition";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { LineChart, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Line, Bar, ResponsiveContainer } from "recharts";
import { Users, BookOpen, Award, DollarSign, TrendingUp, ShoppingCart } from "lucide-react";

const mockData = [
  { name: "Jan", sales: 4000, students: 2400, certificates: 1800 },
  { name: "Feb", sales: 3000, students: 1398, certificates: 1200 },
  { name: "Mar", sales: 2000, students: 9800, certificates: 2400 },
  { name: "Apr", sales: 2780, students: 3908, certificates: 1800 },
  { name: "May", sales: 1890, students: 4800, certificates: 2200 },
  { name: "Jun", sales: 2390, students: 3800, certificates: 2600 },
];

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-24">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome, {user?.name}</h1>
          <p className="text-muted-foreground">Manage your course platform from one place</p>
        </header>

        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 md:grid-cols-5 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="certificates">Certificates</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$45,231.89</div>
                  <p className="text-xs text-muted-foreground flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                    +20.1% from last month
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Active Students</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2,350</div>
                  <p className="text-xs text-muted-foreground flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                    +18% from last month
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">25</div>
                  <p className="text-xs text-muted-foreground flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                    +2 new this month
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Certificates Issued</CardTitle>
                  <Award className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,428</div>
                  <p className="text-xs text-muted-foreground flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                    +12.3% from last month
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>Sales Overview</CardTitle>
                  <CardDescription>Revenue and enrollment trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={mockData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="sales" stroke="#8884d8" activeDot={{ r: 8 }} name="Revenue ($)" />
                      <Line type="monotone" dataKey="students" stroke="#82ca9d" name="Students" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Certificate Distribution</CardTitle>
                  <CardDescription>Certificates issued by month</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={mockData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="certificates" fill="#8884d8" name="Certificates" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="courses">
            <div className="glass-card p-6 rounded-lg">
              <h2 className="text-xl font-bold mb-4">Course Management</h2>
              <p className="text-muted-foreground mb-6">Add, edit or remove courses from your platform</p>
              <Button>Add New Course</Button>
              
              <div className="mt-8">
                <p>Course editor and management interface would go here</p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="users">
            <div className="glass-card p-6 rounded-lg">
              <h2 className="text-xl font-bold mb-4">User Management</h2>
              <p className="text-muted-foreground mb-6">Manage users, permissions and enrollments</p>
              
              <div className="mt-4">
                <p>User management interface would go here</p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="certificates">
            <div className="glass-card p-6 rounded-lg">
              <h2 className="text-xl font-bold mb-4">Certificate Management</h2>
              <p className="text-muted-foreground mb-6">Create and customize certificate templates</p>
              
              <div className="mt-4">
                <p>Certificate template editor would go here</p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="settings">
            <div className="glass-card p-6 rounded-lg">
              <h2 className="text-xl font-bold mb-4">Platform Settings</h2>
              <p className="text-muted-foreground mb-6">Configure your platform settings</p>
              
              <div className="mt-4">
                <p>Platform settings interface would go here</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageTransition>
  );
};

export default AdminDashboard;
