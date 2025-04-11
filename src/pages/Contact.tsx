
import { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { toast } from 'sonner';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import emailjs from '@emailjs/browser';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { 
  Card, 
  CardContent 
} from '@/components/ui/card';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    inquiryType: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, inquiryType: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Send email via EmailJS
      const response = await emailjs.send(
        'service_jnwp6jj', // Replace with your EmailJS service ID
        'template_w9gnvdn', // Replace with your EmailJS template ID
        {
          from_name: formData.name,
          from_email: formData.email,
          phone: formData.phone,
          inquiry_type: formData.inquiryType,
          subject: formData.subject,
          message: formData.message
        },
        'RtNvifJglWDbjZCyo' // Replace with your EmailJS public key
      );
      
      if (response.status === 200) {
        toast.success('Message sent successfully! We will get back to you soon.');
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
          inquiryType: ''
        });
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-16 md:py-24 animate-fade-in">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Contact Us</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Have questions about our certification programs? We're here to help.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Cards */}
            <Card className="border-border/50 hover:border-border/80 transition-colors duration-300">
              <CardContent className="p-6 flex items-start space-x-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Phone</h3>
                  <p className="text-sm text-muted-foreground mb-1">Customer Support:</p>
                  <a href="tel:+919876543210" className="text-primary hover:underline">+91 8686656526</a>
                  <p className="text-sm text-muted-foreground mt-2 mb-1">Sales Inquiries:</p>
                  <a href="tel:+919876543211" className="text-primary hover:underline">+91 8686656526</a>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-border/50 hover:border-border/80 transition-colors duration-300">
              <CardContent className="p-6 flex items-start space-x-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Email</h3>
                  <p className="text-sm text-muted-foreground mb-1">General Inquiries:</p>
                  <a href="mailto:info@certiquest.store" className="text-primary hover:underline">info@certiquest.store</a>
                  <p className="text-sm text-muted-foreground mt-2 mb-1">Support:</p>
                  <a href="mailto:support@certiquest.store" className="text-primary hover:underline">support@certiquest.store</a>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-border/50 hover:border-border/80 transition-colors duration-300">
              <CardContent className="p-6 flex items-start space-x-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Address</h3>
                  <p className="text-sm text-muted-foreground">CertiQuest Headquarters</p>
                  <p className="text-sm text-muted-foreground"></p>
                  <p className="text-sm text-muted-foreground">Mumbai, Maharashtra 400001</p>
                  <p className="text-sm text-muted-foreground">India</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Contact Form Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold tracking-tight">Get in Touch</h2>
              <p className="text-muted-foreground">
                Fill out the form and our team will get back to you within 24 hours.
              </p>
              
              <div className="aspect-square md:aspect-video relative overflow-hidden rounded-lg shadow-md">
                <img 
                  src="https://i.ibb.co/ycXMhRfF/contact.jpg" 
                  alt="CertiQuest office" 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Operating Hours</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Monday - Friday:</span>
                    <span>9:00 AM - 6:00 PM IST</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Saturday:</span>
                    <span>10:00 AM - 4:00 PM IST</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Sunday:</span>
                    <span>Closed</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-background rounded-lg shadow-sm border p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your.email@example.com"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="phone">Phone (optional)</Label>
                      <Input 
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Your phone number"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="inquiryType">Inquiry Type</Label>
                    <Select 
                      value={formData.inquiryType} 
                      onValueChange={handleSelectChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select inquiry type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General Inquiry</SelectItem>
                        <SelectItem value="courses">Course Information</SelectItem>
                        <SelectItem value="certification">Certification Process</SelectItem>
                        <SelectItem value="corporate">Corporate Training</SelectItem>
                        <SelectItem value="support">Technical Support</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Input 
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Subject of your message"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea 
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="How can we help you?"
                      rows={6}
                      required
                    />
                  </div>
                </div>
                
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>Processing...</>
                  ) : (
                    <>
                      Send Message
                      <Send className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-muted-foreground">
              Quick answers to common inquiries
            </p>
          </div>
          
          <div className="space-y-6 text-blue-500">
            {[
              {
                question: "How quickly can I expect a response to my inquiry?",
                answer: "We aim to respond to all inquiries within 24 business hours. For urgent matters, please call our customer support line."
              },
              {
                question: "Do you offer corporate training packages?",
                answer: "Yes, we provide customized certification programs for corporate teams. Please contact our sales team for more information."
              },
              {
                question: "Can I visit your office to discuss certification options in person?",
                answer: "Yes, you can schedule an appointment with our counselors by calling our office or using the contact form above."
              },
              {
                question: "How can I request a certificate for a completed course?",
                answer: "For certificate requests, please fill out the contact form with the inquiry type 'Certification Process' and provide your course details."
              }
            ].map((faq, index) => (
              <div key={index} className="border-b border-border/50 pb-6">
                <h3 className="text-lg font-semibold mb-3">{faq.question}</h3>
                <p className="text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ContactPage;
