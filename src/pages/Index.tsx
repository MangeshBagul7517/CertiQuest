
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Bookmark, Clock, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import Layout from '@/components/Layout';
import { loadCourses, Course } from '@/lib/data';

const Index = () => {
  const [featuredCourses, setFeaturedCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Load courses from data service
    const fetchCourses = async () => {
      setIsLoading(true);
      try {
        const courses = await loadCourses();
        setFeaturedCourses(courses.slice(0, 6)); // Show up to 6 featured courses
      } catch (error) {
        console.error("Error loading courses:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCourses();
  }, []);

  const heroImages = [
    '/hero-image-1.jpg',
    '/placeholder.svg',
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-fade-in">
              <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground">
                Premier Certification Provider
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                Elevate Your Career with Expert Certifications
              </h1>
              <p className="text-xl text-muted-foreground">
                Master in-demand skills with our industry-recognized certification courses. Advance your career with credibility.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/courses">
                  <Button size="lg" className="w-full sm:w-auto">
                    Explore Courses
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Contact Us
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-lg shadow-xl animate-fade-in">
              <img
                src={heroImages[0] || heroImages[1]}
                alt="Students learning online"
                className="w-full h-auto object-cover transition-transform duration-300 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Why Choose CertiQuest?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We provide the most comprehensive certification programs designed by industry experts.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Card className="bg-background/60 backdrop-blur-sm border-border/50 transition-all duration-300 hover:shadow-md hover:border-border">
              <CardContent className="p-6">
                <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                  <Bookmark className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Industry-Recognized</h3>
                <p className="text-muted-foreground">
                  Our certifications are recognized across industries, giving your resume a competitive edge.
                </p>
              </CardContent>
            </Card>
            
            {/* Feature 2 */}
            <Card className="bg-background/60 backdrop-blur-sm border-border/50 transition-all duration-300 hover:shadow-md hover:border-border">
              <CardContent className="p-6">
                <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Flexible Learning</h3>
                <p className="text-muted-foreground">
                  Learn at your own pace with accessible online content and flexible schedules.
                </p>
              </CardContent>
            </Card>
            
            {/* Feature 3 */}
            <Card className="bg-background/60 backdrop-blur-sm border-border/50 transition-all duration-300 hover:shadow-md hover:border-border">
              <CardContent className="p-6">
                <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Expert Instructors</h3>
                <p className="text-muted-foreground">
                  Learn from industry professionals with years of real-world experience and expertise.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="py-16">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-2">Featured Courses</h2>
              <p className="text-lg text-muted-foreground">
                Explore our most popular certification programs
              </p>
            </div>
            <Link to="/courses" className="mt-4 md:mt-0">
              <Button variant="outline">
                View All Courses
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>

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
          ) : featuredCourses.length > 0 ? (
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent>
                {featuredCourses.map((course) => (
                  <CarouselItem key={course.id} className="basis-1/1 md:basis-1/2 lg:basis-1/3">
                    <div className="p-1">
                      <Card className="overflow-hidden border-border/50 h-full transition-all duration-300 hover:shadow-md">
                        <div className="aspect-video relative overflow-hidden">
                          <img
                            src={course.image || '/placeholder.svg'}
                            alt={course.title}
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                          />
                          <div className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm text-foreground px-2 py-1 rounded-md text-sm font-medium">
                            {course.currency} {course.price.toLocaleString('en-IN')}
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="space-y-2">
                              <h3 className="font-semibold line-clamp-2">{course.title}</h3>
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {course.description}
                              </p>
                            </div>
                          </div>
                          <div className="mt-4">
                            <Link to={`/course/${course.id}`}>
                              <Button variant="default" className="w-full">
                                View Course
                              </Button>
                            </Link>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="flex justify-end space-x-2 mt-6">
                <CarouselPrevious className="relative inset-0 translate-y-0" />
                <CarouselNext className="relative inset-0 translate-y-0" />
              </div>
            </Carousel>
          ) : (
            <div className="text-center p-12 border rounded-lg bg-muted/30">
              <h3 className="text-xl font-medium mb-2">New Courses Coming Soon!</h3>
              <p className="text-muted-foreground mb-6">
                Our team is working on creating high-quality certification courses for you.
              </p>
              <Link to="/courses">
                <Button>Browse All Courses</Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary/5">
        <div className="container mx-auto max-w-7xl">
          <div className="rounded-2xl bg-gradient-to-r from-primary/90 to-primary p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="text-primary-foreground space-y-4">
                <h2 className="text-3xl font-bold tracking-tight">Ready to advance your career?</h2>
                <p className="text-primary-foreground/80 text-lg">
                  Join thousands of professionals who have transformed their careers with our certification programs.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/courses">
                    <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                      Get Started
                    </Button>
                  </Link>
                  <Link to="/contact">
                    <Button size="lg" variant="outline" className="border-primary-foreground/20 text-black hover:bg-primary-foreground/10 w-full sm:w-auto">
                      Contact Sales
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="hidden md:block">
                <img 
                  src="/placeholder.svg" 
                  alt="Students celebrating graduation" 
                  className="w-full h-auto rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
