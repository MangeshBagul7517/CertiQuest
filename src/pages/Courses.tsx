
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Link } from "react-router-dom";
import { Course, loadCourses } from "@/lib/data";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/components/ui/use-toast";

const Courses = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart, isInCart } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true);
      const data = await loadCourses();
      setFilteredCourses(data);
      setIsLoading(false);
    };

    fetchCourses();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const filtered = await loadCourses(searchQuery);
    setFilteredCourses(filtered);
    setIsLoading(false);
  };

  const handleAddToCart = (e: React.MouseEvent, course: Course) => {
    e.preventDefault();
    e.stopPropagation();
    
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

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">All Courses</h1>
        
        <div className="mb-8">
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-md"
            />
            <Button type="submit">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </form>
        </div>

        <Separator className="my-6" />
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, index) => (
              <Card key={index} className="h-full transition-all hover:shadow-md">
                <div className="aspect-video w-full bg-slate-200 animate-pulse"></div>
                <CardContent className="p-4">
                  <div className="w-3/4 h-6 bg-slate-200 rounded animate-pulse mb-2"></div>
                  <div className="w-full h-4 bg-slate-200 rounded animate-pulse mb-1"></div>
                  <div className="w-2/3 h-4 bg-slate-200 rounded animate-pulse mb-4"></div>
                  <div className="flex justify-between items-center">
                    <div className="w-1/4 h-5 bg-slate-200 rounded animate-pulse"></div>
                    <div className="w-1/5 h-5 bg-slate-200 rounded animate-pulse"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium">No courses found</h3>
            <p className="text-muted-foreground mt-2">Try a different search term</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <Link key={course.id} to={`/course/${course.id}`}>
                <Card className="h-full transition-all hover:shadow-md">
                  <div className="aspect-video w-full overflow-hidden">
                    <img 
                      src={course.image} 
                      alt={course.title} 
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-xl mb-2">{course.title}</h3>
                    <p className="text-muted-foreground line-clamp-2 mb-4">{course.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-lg">{course.currency || "₹"}{course.price}</span>
                      <span className="text-sm text-muted-foreground">{course.duration}</span>
                    </div>
                    <Button 
                      onClick={(e) => handleAddToCart(e, course)}
                      className="w-full mt-4"
                      variant={isInCart(course.id) ? "secondary" : "default"}
                    >
                      {isInCart(course.id) ? "Already in Cart" : "Add to Cart"}
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Courses;
