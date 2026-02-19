import { useState, useEffect } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Send } from "lucide-react";
import { loadCourses } from '@/lib/data';
import { EnrollmentForm as EnrollmentFormType } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import emailjs from '@emailjs/browser';

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  courseId: z.string().min(1, "Please select a course"),
  message: z.string().optional(),
});

export default function EnrollmentForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [courses, setCourses] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      const allCourses = await loadCourses();
      setCourses(allCourses);
    };
    fetchCourses();
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      courseId: "",
      message: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    try {
      // Get the selected course details
      const selectedCourse = courses.find(course => course.id === values.courseId);
      
      // Send email via EmailJS
      const response = await emailjs.send(
        'service_jnwp6jj', // EmailJS service ID
        'template_w9gnvdn', // EmailJS template ID
        {
          from_name: values.name,
          from_email: values.email,
          phone: values.phone,
          inquiry_type: 'Enrollment',
          subject: `Enrollment Request: ${selectedCourse?.title || values.courseId}`,
          message: `
Course: ${selectedCourse?.title || values.courseId}
Price: ${selectedCourse?.currency || "₹"}${selectedCourse?.price || ""}

Additional Information:
${values.message || "None provided"}
          `
        },
        'RtNvifJglWDbjZCyo' // EmailJS public key
      );
      
      if (response.status === 200) {
        // Store enrollment request in localStorage for backup
        const enrollments = JSON.parse(localStorage.getItem('enrollmentRequests') || '[]');
        
        const newEnrollment: EnrollmentFormType = {
          name: values.name,
          email: values.email,
          phone: values.phone,
          courseId: values.courseId,
          message: values.message || "",
        };
        
        enrollments.push(newEnrollment);
        localStorage.setItem('enrollmentRequests', JSON.stringify(enrollments));
        
        toast.success('Enrollment request submitted successfully! We will contact you shortly.');
        form.reset();
      } else {
        throw new Error('Failed to submit enrollment request');
      }
    } catch (error) {
      console.error('Enrollment submission error:', error);
      toast.error('Failed to submit enrollment request. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Request Course Enrollment</CardTitle>
        <CardDescription>
          Fill in the form below to request enrollment in a course. We will contact you shortly with further instructions.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="name@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="+91 98765XXXXXX" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="courseId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Course</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a course" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {courses.map((course) => (
                        <SelectItem key={course.id} value={course.id}>
                          {course.title} ({course.currency || "₹"}{course.price})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Information (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Let us know if you have any specific requirements or questions"
                      className="min-h-[100px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? (
                <>Processing...</>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" /> Submit Enrollment Request
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
