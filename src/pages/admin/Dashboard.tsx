
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  PlusCircle, Users, BookOpen, Award, BarChart4, Edit, Trash2,
  ChevronDown, ChevronUp, Save, X, DollarSign, Clock, BookText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { allCourses } from "@/data/courses-data";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Dashboard Schema for course management
const courseFormSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters" }),
  description: z.string().min(20, { message: "Description must be at least 20 characters" }),
  instructor: z.string().min(3, { message: "Instructor name is required" }),
  price: z.coerce.number().min(0, { message: "Price must be a positive number" }),
  originalPrice: z.coerce.number().min(0, { message: "Original price must be a positive number" }).optional(),
  hasDiscount: z.boolean().default(false),
  duration: z.string().min(3, { message: "Duration is required" }),
  level: z.enum(["Beginner", "Intermediate", "Advanced"]),
  category: z.string().min(3, { message: "Category is required" }),
  isFeatured: z.boolean().default(false),
  isBestseller: z.boolean().default(false),
  rating: z.coerce.number().min(0).max(5, { message: "Rating must be between 0 and 5" }),
  thumbnail: z.string().url({ message: "Please provide a valid image URL" })
});

type CourseFormValues = z.infer<typeof courseFormSchema>;

const AdminDashboard = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState(allCourses);
  const [editingCourse, setEditingCourse] = useState<any | null>(null);
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);
  
  // Stats for admin dashboard
  const stats = [
    { title: "Total Courses", value: courses.length, icon: BookOpen, color: "bg-blue-500" },
    { title: "Active Students", value: "2,451", icon: Users, color: "bg-green-500" },
    { title: "Certificates Issued", value: "874", icon: Award, color: "bg-amber-500" },
    { title: "Revenue", value: "$142,384", icon: DollarSign, color: "bg-purple-500" },
  ];

  // Form for adding/editing courses
  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      title: "",
      description: "",
      instructor: "",
      price: 0,
      originalPrice: 0,
      hasDiscount: false,
      duration: "",
      level: "Beginner",
      category: "",
      isFeatured: false,
      isBestseller: false,
      rating: 0,
      thumbnail: ""
    }
  });

  // Load course data into form when editing
  const editCourse = (course: any) => {
    setEditingCourse(course);
    form.reset({
      title: course.title,
      description: course.description,
      instructor: course.instructor,
      price: course.price,
      originalPrice: course.originalPrice || course.price,
      hasDiscount: course.hasDiscount || false,
      duration: course.duration,
      level: course.level as "Beginner" | "Intermediate" | "Advanced",
      category: course.category,
      isFeatured: course.isFeatured || false,
      isBestseller: course.isBestseller || course.isPopular || false,
      rating: course.rating,
      thumbnail: course.thumbnail || course.image
    });
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingCourse(null);
    form.reset();
  };

  // Handle form submission
  const onSubmit = (data: CourseFormValues) => {
    try {
      if (editingCourse) {
        // Update existing course
        setCourses(courses.map(course => 
          course.id === editingCourse.id 
            ? { ...course, ...data, id: editingCourse.id } 
            : course
        ));
        toast.success("Course updated successfully");
      } else {
        // Add new course
        const newCourse = {
          ...data,
          id: `course-${Date.now()}`,
          reviewCount: 0,
          students: 0
        };
        setCourses([...courses, newCourse]);
        toast.success("New course added successfully");
      }
      
      setEditingCourse(null);
      form.reset();
    } catch (error) {
      toast.error("Failed to save course");
      console.error(error);
    }
  };

  // Delete course
  const deleteCourse = (id: string) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      setCourses(courses.filter(course => course.id !== id));
      toast.success("Course deleted successfully");
    }
  };

  // Toggle expanded view for a course
  const toggleExpand = (id: string) => {
    setExpandedCourse(expandedCourse === id ? null : id);
  };

  // Check if we're in edit mode
  const isEditing = !!editingCourse;

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="mb-6">You do not have permission to access the admin dashboard.</p>
          <Button onClick={() => navigate("/")}>Return to Home Page</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
          <div>
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {user?.name}! Manage your certification platform.
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button onClick={() => navigate("/")} variant="outline" className="mr-2">
              View Site
            </Button>
            <Button onClick={() => setEditingCourse({})}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Course
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6 flex items-center space-x-4">
                <div className={`p-3 rounded-full ${stat.color} text-white`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">{stat.title}</p>
                  <h3 className="text-2xl font-bold">{stat.value}</h3>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Dashboard Content */}
        <Tabs defaultValue="courses" className="mb-8">
          <TabsList className="mb-8">
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="certificates">Certificates</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Courses Tab */}
          <TabsContent value="courses">
            {isEditing ? (
              <Card>
                <CardHeader>
                  <CardTitle>{editingCourse.id ? "Edit Course" : "Add New Course"}</CardTitle>
                  <CardDescription>
                    {editingCourse.id 
                      ? "Update the details for this course" 
                      : "Create a new certification course"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Course Title</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter course title" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="instructor"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Instructor</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter instructor name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Enter course description" 
                                rows={4}
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <FormField
                          control={form.control}
                          name="price"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Price ($)</FormLabel>
                              <FormControl>
                                <Input type="number" min="0" step="0.01" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="originalPrice"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Original Price ($)</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  min="0" 
                                  step="0.01" 
                                  placeholder="Original price if discounted"
                                  {...field}
                                  value={field.value || ""}
                                />
                              </FormControl>
                              <FormDescription>
                                Leave empty if no discount
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="hasDiscount"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-end space-x-2 space-y-0 pt-6">
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <FormLabel>Has Discount</FormLabel>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <FormField
                          control={form.control}
                          name="category"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Category</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. Web Development" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="duration"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Duration</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. 8 weeks" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="level"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Level</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                                value={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select level" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Beginner">Beginner</SelectItem>
                                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                                  <SelectItem value="Advanced">Advanced</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="thumbnail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Thumbnail URL</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter image URL" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <FormField
                          control={form.control}
                          name="isFeatured"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <FormLabel>Featured Course</FormLabel>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="isBestseller"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <FormLabel>Bestseller</FormLabel>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="rating"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Rating (0-5)</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  min="0" 
                                  max="5" 
                                  step="0.1"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="flex justify-end space-x-4 pt-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={cancelEdit}
                        >
                          <X className="mr-2 h-4 w-4" />
                          Cancel
                        </Button>
                        <Button type="submit">
                          <Save className="mr-2 h-4 w-4" />
                          {editingCourse.id ? "Update Course" : "Create Course"}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Manage Courses</CardTitle>
                  <CardDescription>
                    View, edit, or delete your certification courses
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[50px]"></TableHead>
                          <TableHead>Course</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Level</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {courses.map((course) => (
                          <React.Fragment key={course.id}>
                            <TableRow>
                              <TableCell>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => toggleExpand(course.id)}
                                >
                                  {expandedCourse === course.id ? (
                                    <ChevronUp className="h-4 w-4" />
                                  ) : (
                                    <ChevronDown className="h-4 w-4" />
                                  )}
                                </Button>
                              </TableCell>
                              <TableCell className="font-medium">
                                <div className="flex items-center space-x-3">
                                  <div className="h-10 w-10 overflow-hidden rounded">
                                    <img
                                      src={course.thumbnail || course.image}
                                      alt={course.title}
                                      className="h-full w-full object-cover"
                                    />
                                  </div>
                                  <div>
                                    <div className="font-medium">{course.title}</div>
                                    <div className="text-sm text-muted-foreground">{course.instructor}</div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>{course.category}</TableCell>
                              <TableCell>
                                {course.hasDiscount && course.originalPrice ? (
                                  <div>
                                    <span className="text-sm line-through text-muted-foreground">
                                      ${course.originalPrice}
                                    </span>
                                    <span className="ml-2 font-medium text-green-600">
                                      ${course.price}
                                    </span>
                                  </div>
                                ) : (
                                  <span>${course.price}</span>
                                )}
                              </TableCell>
                              <TableCell>{course.level}</TableCell>
                              <TableCell>
                                <div className="flex space-x-1">
                                  {course.isFeatured && (
                                    <Badge variant="outline" className="bg-primary/10 text-primary">
                                      Featured
                                    </Badge>
                                  )}
                                  {(course.isBestseller || course.isPopular) && (
                                    <Badge variant="outline" className="bg-amber-100 text-amber-800">
                                      Bestseller
                                    </Badge>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => editCourse(course)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => deleteCourse(course.id)}
                                  className="text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                            
                            {/* Expanded Course Row */}
                            {expandedCourse === course.id && (
                              <TableRow>
                                <TableCell colSpan={7}>
                                  <div className="px-4 py-2 bg-muted/30 rounded-md">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                      <div>
                                        <h4 className="font-semibold flex items-center mb-1">
                                          <BookText className="mr-2 h-4 w-4" />
                                          Description
                                        </h4>
                                        <p className="text-muted-foreground">
                                          {course.description}
                                        </p>
                                      </div>
                                      <div>
                                        <h4 className="font-semibold flex items-center mb-1">
                                          <Clock className="mr-2 h-4 w-4" />
                                          Course Details
                                        </h4>
                                        <p className="text-muted-foreground">Duration: {course.duration}</p>
                                        <p className="text-muted-foreground">Students: {course.students || 0}</p>
                                      </div>
                                      <div>
                                        <h4 className="font-semibold flex items-center mb-1">
                                          <BarChart4 className="mr-2 h-4 w-4" />
                                          Statistics
                                        </h4>
                                        <p className="text-muted-foreground">
                                          Rating: {course.rating} ({course.reviewCount || course.reviews || 0} reviews)
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </TableCell>
                              </TableRow>
                            )}
                          </React.Fragment>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          {/* Students Tab - Placeholder */}
          <TabsContent value="students">
            <Card>
              <CardHeader>
                <CardTitle>Students Management</CardTitle>
                <CardDescription>
                  Manage student accounts, enrollments, and progress
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <h3 className="text-xl font-semibold mb-4">Coming Soon</h3>
                  <p className="text-muted-foreground">
                    Student management features are currently in development.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Certificates Tab - Placeholder */}
          <TabsContent value="certificates">
            <Card>
              <CardHeader>
                <CardTitle>Certificates Management</CardTitle>
                <CardDescription>
                  Manage and issue course completion certificates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <h3 className="text-xl font-semibold mb-4">Coming Soon</h3>
                  <p className="text-muted-foreground">
                    Certificate management features are currently in development.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Analytics Tab - Placeholder */}
          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Analytics</CardTitle>
                <CardDescription>
                  View detailed analytics and reports
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <h3 className="text-xl font-semibold mb-4">Coming Soon</h3>
                  <p className="text-muted-foreground">
                    Analytics features are currently in development.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
