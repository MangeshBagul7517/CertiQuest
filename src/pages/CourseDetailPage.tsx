
import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, BarChart, Users, Star, Check, Award, Download, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import TestimonialCard from "@/components/TestimonialCard";
import { allCourses } from "@/data/courses-data";
import { testimonials } from "@/data/home-data";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

// Mock enrolled courses
const enrolledCoursesIds: string[] = [];

const CourseDetailPage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [activeTab, setActiveTab] = useState("overview");
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Find the course from the data
  const course = allCourses.find(c => c.id === courseId);
  
  // Check if user is enrolled in this course
  const isEnrolled = user && enrolledCoursesIds.includes(courseId || "");
  
  // Handle enrollment
  const handleEnrollClick = () => {
    if (!user) {
      setShowLoginDialog(true);
      return;
    }
    
    setShowPaymentDialog(true);
  };
  
  // Handle payment completion
  const handlePaymentComplete = () => {
    // In a real app, this would add the course to the user's enrolled courses in the database
    enrolledCoursesIds.push(courseId || "");
    setShowPaymentDialog(false);
    toast.success("Successfully enrolled in the course!");
  };
  
  // If course doesn't exist, show a message
  if (!course) {
    return (
      <PageTransition>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <div className="flex-grow container mx-auto px-4 py-24 flex flex-col items-center justify-center">
            <h1 className="text-3xl font-bold mb-4">Course Not Found</h1>
            <p className="text-lg text-muted-foreground mb-8">The course you're looking for doesn't exist or has been removed.</p>
            <Link to="/courses">
              <Button>Browse All Courses</Button>
            </Link>
          </div>
          <Footer />
        </div>
      </PageTransition>
    );
  }
  
  // Course curriculum sections (example data)
  const curriculum = [
    {
      title: "Getting Started",
      lessons: [
        { title: "Introduction to the Course", duration: "10:00", isPreview: true },
        { title: "Setting Up Your Environment", duration: "15:30", isPreview: false },
        { title: "Understanding the Core Concepts", duration: "20:15", isPreview: false },
      ]
    },
    {
      title: "Core Principles",
      lessons: [
        { title: "Key Framework Components", duration: "25:45", isPreview: false },
        { title: "Best Practices and Methodologies", duration: "30:00", isPreview: false },
        { title: "Practical Applications", duration: "35:20", isPreview: false },
        { title: "Common Pitfalls and How to Avoid Them", duration: "18:30", isPreview: false },
      ]
    },
    {
      title: "Advanced Techniques",
      lessons: [
        { title: "Advanced Strategies", duration: "40:15", isPreview: false },
        { title: "Real-world Case Studies", duration: "45:00", isPreview: false },
        { title: "Problem Solving Workshop", duration: "50:30", isPreview: false },
      ]
    },
    {
      title: "Certification Preparation",
      lessons: [
        { title: "Exam Structure and Format", duration: "15:45", isPreview: false },
        { title: "Practice Questions", duration: "30:00", isPreview: false },
        { title: "Mock Exam", duration: "60:00", isPreview: false },
        { title: "Final Review and Tips", duration: "25:15", isPreview: false },
      ]
    }
  ];
  
  // Course features
  const features = [
    "Lifetime access to course materials",
    "Certificate of completion",
    "24/7 support from instructors",
    "Real-world projects and exercises",
    "Regular content updates",
    "Access on mobile and desktop",
    "Downloadable resources"
  ];
  
  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-grow">
          {/* Course Header */}
          <section className="bg-secondary/20 pt-24 pb-10 md:pb-20">
            <div className="container mx-auto px-4">
              <div className="flex items-center mb-6">
                <Link to="/courses" className="flex items-center text-sm hover:underline gap-1 text-muted-foreground">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Courses
                </Link>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                <div className="lg:col-span-2">
                  <Badge variant="outline" className="mb-4">
                    {course.category}
                  </Badge>
                  <h1 className="heading-lg mb-4">{course.title}</h1>
                  <p className="subheading mb-6">
                    {course.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-4 mb-6">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <BarChart className="h-4 w-4" />
                      <span>{course.level}</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>{course.students.toLocaleString()} students</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      <span>{course.rating}</span>
                      <span className="text-muted-foreground">({course.reviews} reviews)</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 mb-8">
                    <div className="h-10 w-10 rounded-full overflow-hidden">
                      <img
                        src={`https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 50)}.jpg`}
                        alt={course.instructor}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium">{course.instructor}</p>
                      <p className="text-sm text-muted-foreground">Lead Instructor</p>
                    </div>
                  </div>
                </div>
                
                <div className="lg:col-span-1">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="glass-card rounded-lg overflow-hidden sticky top-24"
                  >
                    <div className="aspect-video overflow-hidden">
                      <img 
                        src={course.image} 
                        alt={course.title}
                        className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-3xl font-bold">${course.price}</h3>
                        <Badge>{course.level}</Badge>
                      </div>
                      
                      {isEnrolled ? (
                        <>
                          <Button className="w-full mb-4 py-6" asChild>
                            <a 
                              href={course.driveLink || "#"} 
                              target="_blank" 
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="mr-2 h-5 w-5" />
                              Access Course Materials
                            </a>
                          </Button>
                          <div className="pt-4 border-t border-border mb-6">
                            <div className="flex justify-between text-sm mb-2">
                              <span>Course Completion</span>
                              <span className="font-medium">25%</span>
                            </div>
                            <Progress value={25} className="h-2" />
                          </div>
                        </>
                      ) : (
                        <>
                          <Button className="w-full mb-4 py-6" onClick={handleEnrollClick}>
                            Enroll Now
                          </Button>
                          <Button variant="outline" className="w-full mb-6 py-6">
                            Try For Free
                          </Button>
                        </>
                      )}
                      
                      <div className="space-y-3 mb-6">
                        {features.slice(0, 4).map((feature, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                            <span className="text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                      
                      {isEnrolled && (
                        <div className="pt-4 border-t border-border">
                          <Button variant="outline" className="w-full" asChild>
                            <Link to="/my-courses">
                              View All My Courses
                            </Link>
                          </Button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </section>
          
          {/* Course Content */}
          <section className="py-12">
            <div className="container mx-auto px-4">
              <Tabs defaultValue="overview" onValueChange={setActiveTab} className="w-full">
                <div className="border-b mb-8">
                  <TabsList className="bg-transparent h-auto p-0 mb-0">
                    <TabsTrigger 
                      value="overview" 
                      className={`px-6 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent`}
                    >
                      Overview
                    </TabsTrigger>
                    <TabsTrigger 
                      value="curriculum" 
                      className={`px-6 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent`}
                    >
                      Curriculum
                    </TabsTrigger>
                    <TabsTrigger 
                      value="instructor" 
                      className={`px-6 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent`}
                    >
                      Instructor
                    </TabsTrigger>
                    <TabsTrigger 
                      value="reviews" 
                      className={`px-6 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent`}
                    >
                      Reviews
                    </TabsTrigger>
                  </TabsList>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                  <div className="lg:col-span-2">
                    <TabsContent value="overview" className="mt-0">
                      <div className="space-y-8">
                        <div>
                          <h2 className="text-2xl font-semibold mb-4">About This Course</h2>
                          <div className="space-y-4">
                            <p>
                              This comprehensive certification course is designed to provide you with the knowledge and skills needed to excel in today's competitive job market. Whether you're looking to advance your career or transition to a new field, this course will equip you with industry-recognized credentials.
                            </p>
                            <p>
                              Our expert instructors bring real-world experience to the classroom, offering practical insights and guidance throughout your learning journey. The curriculum covers all the essential topics required for certification, with a focus on hands-on learning and practical applications.
                            </p>
                            <p>
                              By the end of this course, you'll be fully prepared to take the certification exam with confidence and join thousands of successful professionals who have advanced their careers through our program.
                            </p>
                          </div>
                        </div>
                        
                        <div>
                          <h2 className="text-2xl font-semibold mb-4">What You'll Learn</h2>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {[
                              "Master core concepts and frameworks",
                              "Apply best practices in real-world scenarios",
                              "Develop critical problem-solving skills",
                              "Prepare for the certification exam",
                              "Implement effective strategies",
                              "Network with industry professionals",
                              "Access exclusive resources and tools",
                              "Receive ongoing support and guidance"
                            ].map((item, index) => (
                              <div key={index} className="flex items-start gap-2">
                                <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                <span>{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h2 className="text-2xl font-semibold mb-4">Requirements</h2>
                          <ul className="list-disc pl-5 space-y-2">
                            <li>Basic understanding of industry concepts</li>
                            <li>Access to a computer with internet connection</li>
                            <li>Dedication to complete all course materials</li>
                            <li>Willingness to participate in hands-on exercises</li>
                          </ul>
                        </div>
                        
                        <div>
                          <h2 className="text-2xl font-semibold mb-4">Featured Certificate</h2>
                          <div className="glass-card rounded-lg p-6 border border-border/50">
                            <div className="flex items-center gap-4 mb-4">
                              <Award className="h-10 w-10 text-primary" />
                              <div>
                                <h3 className="font-medium">Official Certification</h3>
                                <p className="text-sm text-muted-foreground">Industry-recognized credential</p>
                              </div>
                            </div>
                            <div className="aspect-video bg-background/50 rounded-md flex items-center justify-center mb-4">
                              <img
                                src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80"
                                alt="Certificate Preview"
                                className="max-h-full max-w-full rounded-md"
                              />
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-muted-foreground">Preview certificate</span>
                              <Button variant="ghost" size="sm" className="gap-1">
                                <Download className="h-4 w-4" />
                                Sample
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="curriculum" className="mt-0">
                      <div>
                        <h2 className="text-2xl font-semibold mb-4">Course Content</h2>
                        <div className="flex flex-wrap gap-4 text-sm mb-6">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{curriculum.reduce((acc, section) => acc + section.lessons.length, 0)} lessons</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>{course.duration} total</span>
                          </div>
                        </div>
                        
                        <Accordion type="single" collapsible className="w-full">
                          {curriculum.map((section, sectionIndex) => (
                            <AccordionItem key={sectionIndex} value={`section-${sectionIndex}`}>
                              <AccordionTrigger className="hover:no-underline py-4">
                                <div className="flex items-start">
                                  <div>
                                    <h3 className="font-medium text-left">{section.title}</h3>
                                    <p className="text-sm text-muted-foreground text-left">
                                      {section.lessons.length} lessons • 
                                      {section.lessons.reduce((acc, lesson) => {
                                        const [mins, secs] = lesson.duration.split(':').map(Number);
                                        return acc + mins + secs / 60;
                                      }, 0).toFixed(0)} mins
                                    </p>
                                  </div>
                                </div>
                              </AccordionTrigger>
                              <AccordionContent>
                                <div className="space-y-1 py-2">
                                  {section.lessons.map((lesson, lessonIndex) => (
                                    <div
                                      key={lessonIndex}
                                      className="flex items-center justify-between py-3 px-4 hover:bg-accent/50 rounded-md transition-colors"
                                    >
                                      <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm">
                                          {sectionIndex + 1}.{lessonIndex + 1}
                                        </div>
                                        <span>{lesson.title}</span>
                                        {lesson.isPreview && (
                                          <Badge variant="outline" className="ml-2">Preview</Badge>
                                        )}
                                      </div>
                                      <div className="text-sm text-muted-foreground">{lesson.duration}</div>
                                    </div>
                                  ))}
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="instructor" className="mt-0">
                      <div className="space-y-8">
                        <div className="flex items-start gap-6">
                          <div className="h-20 w-20 rounded-full overflow-hidden shrink-0">
                            <img
                              src={`https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 50)}.jpg`}
                              alt={course.instructor}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div>
                            <h2 className="text-2xl font-semibold mb-1">{course.instructor}</h2>
                            <p className="text-muted-foreground mb-4">Lead Instructor & Certification Expert</p>
                            <div className="flex flex-wrap gap-4 mb-4">
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                                <span>4.9 Instructor Rating</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                <span>15,400+ Students</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Award className="h-4 w-4" />
                                <span>12 Courses</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-xl font-semibold mb-3">About the Instructor</h3>
                          <div className="space-y-4">
                            <p>
                              {course.instructor} is a certified professional with over 15 years of experience in the field. They have worked with leading organizations and have trained thousands of professionals who have gone on to successful careers.
                            </p>
                            <p>
                              As an industry expert, they bring real-world insights and practical knowledge to the classroom, ensuring that students not only understand theoretical concepts but also how to apply them in professional settings.
                            </p>
                            <p>
                              Their teaching methodology focuses on hands-on learning, problem-solving, and preparing students for certification exams with a high success rate. They are passionate about helping students achieve their career goals and are consistently rated as one of our top instructors.
                            </p>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="reviews" className="mt-0">
                      <div className="space-y-8">
                        <div>
                          <h2 className="text-2xl font-semibold mb-4">Student Reviews</h2>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 items-start">
                            <div className="glass-card rounded-lg p-6">
                              <div className="mb-4">
                                <h3 className="font-medium mb-2">Course Rating</h3>
                                <div className="flex items-center gap-4">
                                  <div className="text-4xl font-bold">{course.rating}</div>
                                  <div className="flex">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                      <Star 
                                        key={i} 
                                        className={`w-5 h-5 ${i < Math.floor(course.rating) ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground'}`} 
                                      />
                                    ))}
                                  </div>
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">{course.reviews} reviews</p>
                              </div>
                              
                              <div className="space-y-2">
                                {[5, 4, 3, 2, 1].map(rating => {
                                  // Calculate percentage based on the rating (mock data)
                                  const percentage = rating === 5 ? 68 : 
                                                    rating === 4 ? 20 : 
                                                    rating === 3 ? 8 : 
                                                    rating === 2 ? 3 : 1;
                                  
                                  return (
                                    <div key={rating} className="flex items-center gap-3">
                                      <div className="flex items-center gap-1 w-12">
                                        <span>{rating}</span>
                                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                      </div>
                                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                                        <div
                                          className="h-full bg-amber-400"
                                          style={{ width: `${percentage}%` }}
                                        ></div>
                                      </div>
                                      <div className="w-12 text-right text-sm text-muted-foreground">
                                        {percentage}%
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                            
                            <div>
                              <h3 className="font-medium mb-4">Write a Review</h3>
                              <p className="text-muted-foreground mb-4">
                                Share your experience with this course to help other students make better decisions.
                              </p>
                              <Button>Write a Review</Button>
                            </div>
                          </div>
                          
                          <Separator className="my-8" />
                          
                          <div className="space-y-6">
                            {testimonials.map((testimonial, index) => (
                              <TestimonialCard key={index} {...testimonial} />
                            ))}
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </div>
                  
                  <div className="hidden lg:block lg:col-span-1">
                    <div className="sticky top-24 space-y-6">
                      <div className="glass-card rounded-lg p-6">
                        <h3 className="font-semibold mb-4">Course Features</h3>
                        <div className="space-y-3">
                          {features.map((feature, index) => (
                            <div key={index} className="flex items-start gap-2">
                              <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                              <span className="text-sm">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="glass-card rounded-lg p-6">
                        <h3 className="font-semibold mb-4">Related Courses</h3>
                        <div className="space-y-4">
                          {allCourses
                            .filter(c => c.category === course.category && c.id !== course.id)
                            .slice(0, 3)
                            .map((relatedCourse, index) => (
                              <Link 
                                key={index} 
                                to={`/course/${relatedCourse.id}`} 
                                className="flex items-start gap-3 group"
                              >
                                <div className="h-12 w-12 rounded overflow-hidden shrink-0">
                                  <img 
                                    src={relatedCourse.image} 
                                    alt={relatedCourse.title} 
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                                <div>
                                  <h4 className="text-sm font-medium group-hover:text-primary transition-colors line-clamp-2">
                                    {relatedCourse.title}
                                  </h4>
                                  <div className="flex items-center gap-1 mt-1">
                                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                    <span className="text-xs">{relatedCourse.rating}</span>
                                    <span className="text-xs text-muted-foreground">({relatedCourse.reviews})</span>
                                  </div>
                                </div>
                              </Link>
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Tabs>
            </div>
          </section>
        </main>
        
        <Footer />
        
        {/* Login Dialog */}
        <AlertDialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Sign In Required</AlertDialogTitle>
              <AlertDialogDescription>
                You need to be signed in to enroll in this course. Would you like to sign in now?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => {
                setShowLoginDialog(false);
                navigate("/login", { state: { returnTo: `/course/${courseId}` } });
              }}>
                Sign In
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        
        {/* Payment Dialog */}
        <AlertDialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
          <AlertDialogContent className="sm:max-w-[425px]">
            <AlertDialogHeader>
              <AlertDialogTitle>Complete Your Purchase</AlertDialogTitle>
              <AlertDialogDescription>
                You're about to enroll in <span className="font-semibold">{course.title}</span> for ${course.price}.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="py-4">
              <div className="rounded-lg overflow-hidden mb-4">
                <img 
                  src={course.image} 
                  alt={course.title}
                  className="w-full h-32 object-cover"
                />
              </div>
              <div className="space-y-4">
                <div className="flex justify-between py-2 border-b">
                  <span>Course Price</span>
                  <span className="font-semibold">${course.price}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span>Tax</span>
                  <span className="font-semibold">${(course.price * 0.1).toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2 font-bold">
                  <span>Total</span>
                  <span>${(course.price * 1.1).toFixed(2)}</span>
                </div>
              </div>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handlePaymentComplete}>
                Complete Purchase
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </PageTransition>
  );
};

export default CourseDetailPage;
