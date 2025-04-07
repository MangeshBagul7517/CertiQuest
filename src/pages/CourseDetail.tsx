
import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft, Clock, User, BarChart2 } from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Course, loadCourses } from "@/lib/data";

const CourseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  const { toast } = useToast();
  const { addToCart, isInCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourse = async () => {
      setIsLoading(true);
      const courses = await loadCourses();
      const foundCourse = courses.find(c => c.id === id);
      setCourse(foundCourse || null);
      setIsLoading(false);
    };

    fetchCourse();
  }, [id]);

  const handleAddToCart = () => {
    if (!course) return;
    
    if (!user) {
      setIsLoginDialogOpen(true);
      return;
    }
    
    if (!isInCart(course.id)) {
      addToCart(course);
      toast({
        title: "Added to cart",
        description: `${course.title} has been added to your cart.`,
      });
    } else {
      toast({
        title: "Already in cart",
        description: "This course is already in your cart.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto py-8">
          <div className="animate-pulse">
            <div className="h-6 w-40 bg-slate-200 rounded mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="aspect-video w-full bg-slate-200 rounded-lg mb-6"></div>
                <div className="h-8 w-3/4 bg-slate-200 rounded mb-4"></div>
                <div className="h-4 w-full bg-slate-200 rounded mb-2"></div>
                <div className="h-4 w-full bg-slate-200 rounded mb-2"></div>
                <div className="h-4 w-2/3 bg-slate-200 rounded mb-6"></div>
              </div>
              <div className="bg-slate-50 p-6 rounded-lg h-fit">
                <div className="h-6 w-1/2 bg-slate-200 rounded mb-4"></div>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-5 h-5 bg-slate-200 rounded-full mr-3"></div>
                    <div>
                      <div className="h-3 w-20 bg-slate-200 rounded"></div>
                      <div className="h-4 w-24 bg-slate-200 rounded mt-1"></div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-5 h-5 bg-slate-200 rounded-full mr-3"></div>
                    <div>
                      <div className="h-3 w-20 bg-slate-200 rounded"></div>
                      <div className="h-4 w-32 bg-slate-200 rounded mt-1"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!course) {
    return (
      <Layout>
        <div className="container mx-auto py-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Course not found</h2>
          <p className="mb-8">The course you're looking for doesn't exist or has been removed.</p>
          <Link to="/courses">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Courses
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <Link to="/courses" className="inline-flex items-center mb-6 text-primary hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Courses
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="aspect-video w-full overflow-hidden rounded-lg mb-6">
              <img 
                src={course.image} 
                alt={course.title} 
                className="h-full w-full object-cover"
              />
            </div>
            <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
            <p className="text-lg mb-6 whitespace-pre-line">{course.description}</p>
            
            <Separator className="my-6" />
            
            <h2 className="text-2xl font-semibold mb-4">Course Details</h2>
            <p className="mb-6 whitespace-pre-line">{course.details || "No detailed description available for this course."}</p>
            
            <div className="my-8">
              <Button 
                onClick={handleAddToCart} 
                size="lg" 
                className="w-full md:w-auto"
                variant={isInCart(course.id) ? "secondary" : "default"}
              >
                {isInCart(course.id) ? "Already in Cart" : `Enroll Now for ${course.currency || "₹"}${course.price}`}
              </Button>
            </div>
          </div>
          
          <div className="bg-slate-50 p-6 rounded-lg h-fit">
            <h3 className="text-xl font-semibold mb-4">Course Information</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-3 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <p className="font-medium">{course.duration}</p>
                </div>
              </div>
              <div className="flex items-center">
                <User className="h-5 w-5 mr-3 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Instructor</p>
                  <p className="font-medium">{course.instructor}</p>
                </div>
              </div>
              <div className="flex items-center">
                <BarChart2 className="h-5 w-5 mr-3 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Level</p>
                  <p className="font-medium">{course.level}</p>
                </div>
              </div>
            </div>
            
            <Separator className="my-6" />
            
            <div className="text-center">
              <p className="text-2xl font-bold mb-2">{course.currency || "₹"}{course.price}</p>
              <Button 
                onClick={handleAddToCart} 
                className="w-full"
                variant={isInCart(course.id) ? "secondary" : "default"}
              >
                {isInCart(course.id) ? "Already in Cart" : "Add to Cart"}
              </Button>
            </div>
          </div>
        </div>

        {/* Login Dialog */}
        <Dialog open={isLoginDialogOpen} onOpenChange={setIsLoginDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Login Required</DialogTitle>
              <DialogDescription>
                Please log in to purchase this course.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex sm:justify-between">
              <Button 
                variant="outline" 
                onClick={() => setIsLoginDialogOpen(false)}
              >
                Cancel
              </Button>
              <div className="flex gap-2 mt-2 sm:mt-0">
                <Button onClick={() => {
                  setIsLoginDialogOpen(false);
                  navigate('/register');
                }}>
                  Register
                </Button>
                <Button onClick={() => {
                  setIsLoginDialogOpen(false);
                  navigate('/login');
                }}>
                  Login
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default CourseDetail;
