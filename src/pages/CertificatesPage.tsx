
import { motion } from "framer-motion";
import { Award, Search, Filter, CheckCircle, Clock, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import { Separator } from "@/components/ui/separator";
import { allCourses } from "@/data/courses-data";

// Define certificate types
interface Certificate {
  id: string;
  title: string;
  course: string;
  issuedDate: string;
  expiryDate: string;
  image: string;
  credentialId: string;
  issuer: string;
}

// Sample certificates data
const sampleCertificates: Certificate[] = [
  {
    id: "cert-1",
    title: "Project Management Professional (PMP)",
    course: "Project Management Professional (PMP)",
    issuedDate: "June 15, 2023",
    expiryDate: "June 15, 2026",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
    credentialId: "PMP-123456",
    issuer: "Project Management Institute"
  },
  {
    id: "cert-2",
    title: "AWS Certified Solutions Architect",
    course: "AWS Certified Solutions Architect",
    issuedDate: "March 10, 2023",
    expiryDate: "March 10, 2026",
    image: "https://images.unsplash.com/photo-1496171367470-9ed9a91ea931?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
    credentialId: "AWS-789012",
    issuer: "Amazon Web Services"
  },
  {
    id: "cert-3",
    title: "Certified Information Systems Security Professional",
    course: "Certified Information Systems Security Professional (CISSP)",
    issuedDate: "January 20, 2023",
    expiryDate: "January 20, 2026",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
    credentialId: "CISSP-345678",
    issuer: "ISC²"
  }
];

const CertificatesPage = () => {
  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-grow pt-24">
          {/* Hero Section */}
          <section className="bg-secondary/30 py-12 md:py-20">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl">
                <Badge variant="outline" className="mb-4">
                  Professional Certificates
                </Badge>
                <h1 className="heading-lg mb-4">Your Path to Professional Certification</h1>
                <p className="subheading mb-8">
                  Explore our range of industry-recognized certificates to enhance your career prospects and validate your expertise.
                </p>
                
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                  <Input
                    type="search"
                    placeholder="Search for certificates..."
                    className="pl-10 py-6 bg-white/80 backdrop-blur-sm"
                  />
                </div>
              </div>
            </div>
          </section>
          
          {/* Certificates Section */}
          <section className="py-12">
            <div className="container mx-auto px-4">
              <Tabs defaultValue="all" className="w-full">
                <div className="flex justify-between items-center mb-8">
                  <TabsList className="glass-card">
                    <TabsTrigger value="all">All Certificates</TabsTrigger>
                    <TabsTrigger value="available">Available</TabsTrigger>
                    <TabsTrigger value="achieved">My Achievements</TabsTrigger>
                  </TabsList>
                  
                  <Button variant="outline" size="sm" className="gap-2">
                    <Filter className="h-4 w-4" />
                    Filter
                  </Button>
                </div>
                
                <TabsContent value="all" className="mt-0">
                  <div className="mb-8">
                    <h2 className="text-2xl font-semibold mb-6">Featured Certifications</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {sampleCertificates.map((cert, index) => (
                        <motion.div
                          key={cert.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: index * 0.1 }}
                          className="glass-card rounded-lg overflow-hidden"
                        >
                          <div className="relative aspect-[4/3] bg-primary/5">
                            <img
                              src={cert.image}
                              alt={cert.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute top-4 right-4">
                              <Badge className="bg-primary/90 hover:bg-primary">
                                <Award className="h-3 w-3 mr-1" />
                                Professional
                              </Badge>
                            </div>
                          </div>
                          <div className="p-6">
                            <h3 className="font-semibold text-lg mb-2 line-clamp-2">{cert.title}</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                              Issued by {cert.issuer}
                            </p>
                            
                            <div className="flex items-center gap-2 text-sm mb-2">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <span>Accredited Certificate</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm mb-4">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span>Valid for 3 years</span>
                            </div>
                            
                            <Separator className="my-4" />
                            
                            <div className="flex justify-between items-center">
                              <Button variant="outline" size="sm">
                                View Details
                              </Button>
                              <Button variant="ghost" size="sm" className="gap-1">
                                <Download className="h-4 w-4" />
                                Sample
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h2 className="text-2xl font-semibold mb-6">All Available Certifications</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {allCourses.slice(0, 6).map((course, index) => (
                        <motion.div
                          key={course.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: index * 0.1 }}
                          className="glass-card rounded-lg overflow-hidden"
                        >
                          <div className="relative aspect-[4/3] bg-primary/5">
                            <img
                              src={course.image}
                              alt={course.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute top-4 right-4">
                              <Badge variant="outline" className="bg-background/80 backdrop-blur-sm">
                                {course.category}
                              </Badge>
                            </div>
                          </div>
                          <div className="p-6">
                            <h3 className="font-semibold text-lg mb-2 line-clamp-2">{course.title}</h3>
                            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                              {course.description}
                            </p>
                            
                            <div className="flex flex-wrap gap-2 mb-4">
                              <Badge variant="secondary">{course.level}</Badge>
                              <Badge variant="secondary">{course.duration}</Badge>
                            </div>
                            
                            <Separator className="my-4" />
                            
                            <Button className="w-full">
                              Get Certified
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="available" className="mt-0">
                  <div className="text-center py-12">
                    <h2 className="text-2xl font-semibold mb-4">Explore Available Certificates</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
                      Browse our complete catalog of professional certificates available for you to earn through our courses.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {allCourses.slice(0, 6).map((course, index) => (
                        <motion.div
                          key={course.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: index * 0.1 }}
                          className="glass-card rounded-lg overflow-hidden"
                        >
                          <div className="relative aspect-[4/3] bg-primary/5">
                            <img
                              src={course.image}
                              alt={course.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute top-4 right-4">
                              <Badge variant="outline" className="bg-background/80 backdrop-blur-sm">
                                {course.category}
                              </Badge>
                            </div>
                          </div>
                          <div className="p-6">
                            <h3 className="font-semibold text-lg mb-2 line-clamp-2">{course.title}</h3>
                            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                              {course.description}
                            </p>
                            
                            <div className="flex flex-wrap gap-2 mb-4">
                              <Badge variant="secondary">{course.level}</Badge>
                              <Badge variant="secondary">{course.duration}</Badge>
                            </div>
                            
                            <Separator className="my-4" />
                            
                            <Button className="w-full">
                              Get Certified
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="achieved" className="mt-0">
                  <div className="py-12 text-center">
                    <div className="max-w-md mx-auto glass-card rounded-lg p-8">
                      <Award className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                      <h2 className="text-2xl font-semibold mb-2">No Certificates Yet</h2>
                      <p className="text-muted-foreground mb-6">
                        You haven't earned any certificates yet. Complete a course to receive your first certificate.
                      </p>
                      <Button>Explore Courses</Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </section>
          
          {/* FAQ Section */}
          <section className="py-16 bg-secondary/20">
            <div className="container mx-auto px-4">
              <div className="text-center max-w-3xl mx-auto mb-12">
                <Badge variant="outline" className="mb-4">
                  FAQ
                </Badge>
                <h2 className="heading-lg mb-4">Frequently Asked Questions</h2>
                <p className="subheading">
                  Find answers to common questions about our certification process.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {[
                  {
                    question: "How long are certificates valid?",
                    answer: "Most of our professional certificates are valid for 3 years from the date of issue. However, some specialized certifications may have different validity periods, which will be clearly indicated on the certificate details page."
                  },
                  {
                    question: "Are your certificates recognized by employers?",
                    answer: "Yes, our certificates are recognized by leading employers worldwide. We partner with industry leaders to ensure our certifications meet current professional standards and requirements."
                  },
                  {
                    question: "How do I verify a certificate's authenticity?",
                    answer: "Each certificate comes with a unique verification code that can be used on our verification portal. Employers can use this code to confirm the authenticity and validity of your certification."
                  },
                  {
                    question: "What happens if I don't pass the certification exam?",
                    answer: "If you don't pass the certification exam on your first attempt, you can retake it after a waiting period of 14 days. Most of our courses include two exam attempts in the initial fee."
                  },
                  {
                    question: "Can I get a digital and physical copy of my certificate?",
                    answer: "Yes, upon successful completion of your course and certification exam, you'll receive a digital certificate immediately. You can also request a physical copy for an additional printing and shipping fee."
                  },
                  {
                    question: "How do I maintain my certification?",
                    answer: "To maintain your certification, you'll need to complete a certain number of continuing education credits before your certificate expires. Details on maintenance requirements are provided with each specific certification."
                  }
                ].map((faq, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="glass-card rounded-lg p-6"
                  >
                    <h3 className="font-semibold text-lg mb-3">{faq.question}</h3>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        </main>
        
        <Footer />
      </div>
    </PageTransition>
  );
};

export default CertificatesPage;
