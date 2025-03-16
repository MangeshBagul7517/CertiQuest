
import { useState } from "react";
import { motion } from "framer-motion";
import { Search, BookOpen, BookCopy, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import ProtectedRoute from "@/components/ProtectedRoute";
import EnrolledCourseCard from "@/components/EnrolledCourseCard";
import { allCourses } from "@/data/courses-data";

// Mock data for enrolled courses (in a real app, this would come from a database)
const enrolledCourseIds = ["course-1", "course-3", "course-5"];

const MyCoursesPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  
  // Filter courses that the user is enrolled in
  const enrolledCourses = allCourses.filter(course => 
    enrolledCourseIds.includes(course.id)
  );
  
  // Filter based on search query and tab
  const filteredCourses = enrolledCourses.filter(course => {
    const matchesSearch = searchQuery === "" || 
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      course.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTab = activeTab === "all" || 
      (activeTab === "inProgress" && true) || // In a real app, you'd check progress
      (activeTab === "completed" && false);   // In a real app, you'd check completion
    
    return matchesSearch && matchesTab;
  });
  
  // Mock progress values
  const getProgress = (courseId: string) => {
    const progresses: {[key: string]: number} = {
      "course-1": 75,
      "course-3": 30,
      "course-5": 10
    };
    
    return progresses[courseId] || 0;
  };
  
  return (
    <ProtectedRoute>
      <PageTransition>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          
          <main className="flex-grow pt-24">
            {/* Hero Section */}
            <section className="bg-secondary/30 py-12 md:py-16">
              <div className="container mx-auto px-4">
                <div className="max-w-3xl">
                  <Badge variant="outline" className="mb-4">
                    My Learning
                  </Badge>
                  <h1 className="heading-lg mb-4">Your Enrolled Courses</h1>
                  <p className="subheading mb-8">
                    Continue your learning journey with your enrolled courses. Track your progress and access course materials anytime.
                  </p>
                  
                  {/* Search Bar */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                    <Input
                      type="search"
                      placeholder="Search your courses..."
                      className="pl-10 py-6 bg-white/80 backdrop-blur-sm"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </section>
            
            {/* Courses Section */}
            <section className="py-12">
              <div className="container mx-auto px-4">
                <Tabs defaultValue="all" onValueChange={setActiveTab} className="mb-8">
                  <div className="flex items-center justify-between mb-6">
                    <TabsList>
                      <TabsTrigger value="all" className="gap-2">
                        <BookOpen className="h-4 w-4" />
                        All Courses
                      </TabsTrigger>
                      <TabsTrigger value="inProgress" className="gap-2">
                        <BookCopy className="h-4 w-4" />
                        In Progress
                      </TabsTrigger>
                      <TabsTrigger value="completed" className="gap-2">
                        <GraduationCap className="h-4 w-4" />
                        Completed
                      </TabsTrigger>
                    </TabsList>
                    
                    <Button variant="outline" asChild>
                      <a href="/courses">Browse More Courses</a>
                    </Button>
                  </div>
                  
                  <TabsContent value="all" className="mt-0">
                    {filteredCourses.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredCourses.map((course, index) => (
                          <motion.div
                            key={course.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.05 }}
                          >
                            <EnrolledCourseCard 
                              course={course} 
                              progress={getProgress(course.id)} 
                            />
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="glass-card rounded-lg p-12 text-center">
                        <h3 className="text-xl font-semibold mb-2">No courses found</h3>
                        <p className="text-muted-foreground mb-6">
                          {searchQuery 
                            ? "Try adjusting your search" 
                            : "You haven't enrolled in any courses yet"}
                        </p>
                        <Button asChild>
                          <a href="/courses">Browse Courses</a>
                        </Button>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="inProgress" className="mt-0">
                    {filteredCourses.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredCourses.map((course, index) => (
                          <motion.div
                            key={course.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.05 }}
                          >
                            <EnrolledCourseCard 
                              course={course} 
                              progress={getProgress(course.id)} 
                            />
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="glass-card rounded-lg p-12 text-center">
                        <h3 className="text-xl font-semibold mb-2">No courses in progress</h3>
                        <p className="text-muted-foreground mb-6">
                          You don't have any courses in progress
                        </p>
                        <Button asChild>
                          <a href="/courses">Browse Courses</a>
                        </Button>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="completed" className="mt-0">
                    <div className="glass-card rounded-lg p-12 text-center">
                      <h3 className="text-xl font-semibold mb-2">No completed courses</h3>
                      <p className="text-muted-foreground mb-6">
                        You haven't completed any courses yet. Keep learning!
                      </p>
                      <Button asChild>
                        <a href="/courses">Browse Courses</a>
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </section>
          </main>
          
          <Footer />
        </div>
      </PageTransition>
    </ProtectedRoute>
  );
};

export default MyCoursesPage;
