
import { CourseType } from "./courses-data";

export const featuredCourses: CourseType[] = [
  {
    id: "course-1",
    title: "Project Management Professional (PMP)",
    description: "Prepare for the PMP certification with this comprehensive course covering all exam domains.",
    image: "https://images.unsplash.com/photo-1542626991-cbc4e32524cc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
    price: 199,
    rating: 4.9,
    reviews: 342,
    students: 5680,
    duration: "40 hours",
    level: "Intermediate",
    instructor: "Jennifer Wilson",
    category: "Business",
    isFeatured: true,
    isPopular: true,
  },
  {
    id: "course-2",
    title: "Certified Information Systems Security Professional (CISSP)",
    description: "Master cybersecurity concepts and prepare for the CISSP certification exam.",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
    price: 249,
    rating: 4.8,
    reviews: 289,
    students: 4320,
    duration: "60 hours",
    level: "Advanced",
    instructor: "Michael Chen",
    category: "IT & Software",
    isFeatured: true,
    isPopular: true,
  },
  {
    id: "course-3",
    title: "AWS Certified Solutions Architect",
    description: "Learn to design and deploy scalable systems on Amazon Web Services and prepare for the certification exam.",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
    price: 179,
    rating: 4.9,
    reviews: 412,
    students: 7840,
    duration: "35 hours",
    level: "Intermediate",
    instructor: "David Rodriguez",
    category: "Cloud Computing",
    isFeatured: true,
    isPopular: true,
  }
];

export const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Marketing Director",
    testimonial: "The PMP certification course was exactly what I needed to advance my career. The content was comprehensive and the instructor was excellent. I passed the exam on my first attempt!",
    avatar: "https://randomuser.me/api/portraits/women/1.jpg",
    rating: 5,
    courseTitle: "Project Management Professional (PMP)"
  },
  {
    name: "Michael Chen",
    role: "Software Engineer",
    testimonial: "The AWS Solutions Architect course provided practical, hands-on learning that I could immediately apply to my job. The certification has opened up new opportunities for me.",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 5,
    courseTitle: "AWS Certified Solutions Architect"
  },
  {
    name: "Emily Rodriguez",
    role: "IT Security Specialist",
    testimonial: "The CISSP course was challenging but incredibly rewarding. The material was up-to-date with current security practices and the practice exams were very helpful.",
    avatar: "https://randomuser.me/api/portraits/women/23.jpg",
    rating: 4,
    courseTitle: "Certified Information Systems Security Professional (CISSP)"
  }
];

export const partners = [
  {
    name: "Microsoft",
    logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg"
  },
  {
    name: "Google",
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg"
  },
  {
    name: "Amazon",
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg"
  },
  {
    name: "IBM",
    logo: "https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg"
  },
  {
    name: "Oracle",
    logo: "https://upload.wikimedia.org/wikipedia/commons/5/50/Oracle_logo.svg"
  },
  {
    name: "Salesforce",
    logo: "https://upload.wikimedia.org/wikipedia/commons/f/f9/Salesforce.com_logo.svg"
  }
];
