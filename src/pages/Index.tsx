
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Award, Bolt, BookOpen, Briefcase, CheckCircle, Clock, Laptop, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import HeroSection from "@/components/HeroSection";
import CourseCard from "@/components/CourseCard";
import TestimonialCard from "@/components/TestimonialCard";

// Placeholder data for demo purposes
import { featuredCourses, testimonials, partners } from "@/data/home-data";

const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);
  
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.6, ease: "easeOut" } 
    }
  };
  
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const features = [
    {
      title: "Professional Certification",
      description: "Earn industry-recognized certificates upon completion of courses.",
      icon: Award,
    },
    {
      title: "Expert Instructors",
      description: "Learn from industry professionals with real-world experience.",
      icon: Briefcase,
    },
    {
      title: "Self-Paced Learning",
      description: "Study at your own pace with lifetime access to course materials.",
      icon: Clock,
    },
    {
      title: "Practical Skills",
      description: "Gain hands-on experience with real-world projects and exercises.",
      icon: Laptop,
    },
    {
      title: "Career Advancement",
      description: "Boost your resume and unlock new career opportunities.",
      icon: Bolt,
    },
    {
      title: "Satisfaction Guarantee",
      description: "30-day money-back guarantee if you're not completely satisfied.",
      icon: Shield,
    },
  ];
  
  const stats = [
    { value: "100+", label: "Courses" },
    { value: "50K+", label: "Students" },
    { value: "95%", label: "Satisfaction" },
    { value: "200+", label: "Instructors" },
  ];

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        {/* Hero Section */}
        <HeroSection
          title="Unlock Your Potential with Professional Certifications"
          subtitle="Boost your career with industry-recognized courses and certifications. Learn at your own pace and join thousands of successful professionals."
          buttonText="Explore Courses"
          buttonLink="/courses"
          secondaryButtonText="View Certificates"
          secondaryButtonLink="/certificates"
          image="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80"
        />
        
        {/* Stats Section */}
        <section className="py-16 bg-secondary/50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="glass-card rounded-lg py-8 px-4"
                >
                  <h3 className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.value}</h3>
                  <p className="text-muted-foreground">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <Badge variant="outline" className="mb-4">
                Why Choose Us
              </Badge>
              <h2 className="heading-lg mb-4">Everything You Need to Succeed</h2>
              <p className="subheading">
                Our platform provides all the tools and resources you need to gain valuable skills and advance your career.
              </p>
            </div>
            
            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={fadeIn}
                  className="glass-card rounded-lg p-6 flex items-start transition-all duration-300 hover:shadow-md"
                >
                  <div className="mr-4 p-3 rounded-full bg-primary/10 text-primary">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
        
        {/* Featured Courses Section */}
        <section className="py-20 bg-gradient-to-b from-background to-secondary/20">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
              <div className="max-w-2xl mb-6 md:mb-0">
                <Badge variant="outline" className="mb-4">
                  Featured Courses
                </Badge>
                <h2 className="heading-lg mb-4">Popular Certification Courses</h2>
                <p className="subheading">
                  Our most in-demand courses to help you gain the skills employers are looking for.
                </p>
              </div>
              <Link to="/courses">
                <Button variant="outline" className="gap-2 group">
                  View All Courses
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredCourses.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <CourseCard {...course} />
                </motion.div>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Link to="/courses">
                <Button size="lg" className="gap-2 group">
                  Explore All Courses
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
        
        {/* How It Works Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <Badge variant="outline" className="mb-4">
                How It Works
              </Badge>
              <h2 className="heading-lg mb-4">Your Path to Certification</h2>
              <p className="subheading">
                Our simple process makes it easy to earn valuable certifications and advance your career.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {/* Connecting Line (Desktop) */}
              <div className="hidden md:block absolute top-1/3 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/20 via-primary to-primary/20"></div>
              
              {[
                {
                  step: "01",
                  title: "Choose Your Course",
                  description: "Browse our catalog of professional certification courses and select the one that aligns with your career goals.",
                  icon: BookOpen
                },
                {
                  step: "02",
                  title: "Complete the Curriculum",
                  description: "Work through comprehensive lessons, hands-on projects, and assessments at your own pace.",
                  icon: CheckCircle
                },
                {
                  step: "03",
                  title: "Earn Your Certificate",
                  description: "Pass the final exam to receive your professional certificate that you can share with employers.",
                  icon: Award
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className="glass-card rounded-lg p-8 text-center relative z-10"
                >
                  <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center mx-auto mb-6">
                    <span className="font-bold">{item.step}</span>
                  </div>
                  <div className="p-4 rounded-full bg-primary/10 inline-flex mx-auto mb-6">
                    <item.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Testimonials Section */}
        <section className="py-20 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <Badge variant="outline" className="mb-4">
                Testimonials
              </Badge>
              <h2 className="heading-lg mb-4">What Our Students Say</h2>
              <p className="subheading">
                Hear from professionals who have advanced their careers with our certification courses.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <TestimonialCard {...testimonial} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Partners Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <Badge variant="outline" className="mb-4">
                Trusted Partners
              </Badge>
              <h2 className="heading-lg mb-4">Recognized by Industry Leaders</h2>
              <p className="subheading">
                Our certifications are valued by top companies and organizations around the world.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
              {partners.map((partner, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-center justify-center py-4"
                >
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="h-12 object-contain opacity-70 hover:opacity-100 transition-opacity"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-primary/5 to-primary/20">
          <div className="container mx-auto px-4">
            <div className="glass-card rounded-xl overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="p-12 flex flex-col justify-center">
                  <h2 className="heading-lg mb-6">Ready to Advance Your Career?</h2>
                  <p className="text-lg mb-8">
                    Join thousands of professionals who have transformed their careers with our certification courses. Start your journey today.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Link to="/courses">
                      <Button size="lg" className="gap-2 group">
                        Get Started
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </Link>
                    <Link to="/contact">
                      <Button size="lg" variant="outline">
                        Contact Us
                      </Button>
                    </Link>
                  </div>
                </div>
                <div className="relative hidden lg:block">
                  <img
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80"
                    alt="Students collaborating"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-primary/30 mix-blend-multiply"></div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <Footer />
      </div>
    </PageTransition>
  );
};

export default Index;
