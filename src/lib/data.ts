
// Define Course interface
export interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  image: string;
  instructor: string;
  level: string;
  details?: string;
  currency?: string;
}

// Sample course data
export const courses: Course[] = [
  {
    id: "1",
    title: "Introduction to Cybersecurity",
    description: "Learn the fundamentals of cybersecurity, including network security, cryptography, and security best practices.",
    price: 4999,
    duration: "4 weeks",
    image: "/placeholder.svg",
    instructor: "Dr. Security Expert",
    level: "Beginner",
    details: "This course covers the essentials of cybersecurity including threat detection, vulnerability assessment, and security frameworks. Students will learn practical skills needed to protect digital assets and implement security protocols.",
    currency: "₹"
  },
  {
    id: "2",
    title: "Advanced Ethical Hacking",
    description: "Master advanced techniques in ethical hacking and penetration testing to protect systems from cyber threats.",
    price: 7999,
    duration: "8 weeks",
    image: "/placeholder.svg",
    instructor: "Prof. Hack Master",
    level: "Advanced",
    details: "This advanced course teaches professional penetration testing methodologies used by ethical hackers. Learn to identify and exploit vulnerabilities in systems, networks, and applications while understanding how to properly document and report findings.",
    currency: "₹"
  },
  {
    id: "3",
    title: "Cloud Security Fundamentals",
    description: "Understand how to secure cloud infrastructure and applications across major cloud platforms.",
    price: 5999,
    duration: "6 weeks",
    image: "/placeholder.svg",
    instructor: "Cloud Security Expert",
    level: "Intermediate",
    details: "This course focuses on securing cloud environments across AWS, Azure, and Google Cloud. Students will learn about identity and access management, data protection strategies, and security compliance in cloud environments.",
    currency: "₹"
  }
];

// Function to load courses (with optional filtering)
export const loadCourses = async (filter?: string): Promise<Course[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  if (!filter) {
    return courses;
  }
  
  // Filter courses based on search query
  return courses.filter(course => 
    course.title.toLowerCase().includes(filter.toLowerCase()) || 
    course.description.toLowerCase().includes(filter.toLowerCase())
  );
};
