import { Course as CourseType } from './types';

// Helper function to load courses from localStorage or initial data
export const loadCourses = async (): Promise<CourseType[]> => {
  const storedCourses = localStorage.getItem('courses');
  if (storedCourses) {
    return JSON.parse(storedCourses);
  }
  return courses;
};

// Export the CourseType for use in other components
export type Course = CourseType & {
  driveLink?: string;
};

// Initial courses data
export const courses: CourseType[] = [
  {
    id: "1",
    title: "Artificial Intelligence with Deep learning",
    description: "Master AI and Deep Learning techniques. Build intelligent models with real-world datasets.",
    price: 199,
    duration: "4 weeks",
    image: "https://i.ibb.co/cS49gwjB/aidl.png",
    instructor: "AI Specielist",
    level: "Beginner",
    details: "Dive deep into Artificial Intelligence and master neural networks, CNNs, RNNs, and more. Learn TensorFlow, Keras, and PyTorch to build smart AI models and solve real-world problems like image recognition and language processing.",
    currency: "₹"
  },
  {
    id: "2",
    title: "Microsoft Project BEGINNER to EXPERT",
    description: "Learn Microsoft Project from scratch to expert level. Manage projects like a pro.",
    price: 199,
    duration: "8 weeks",
    image: "https://i.ibb.co/PHy9hd0/m.jpg",
    instructor: "Prof. Hack Master",
    level: "Advanced",
    details: "This course takes you through Microsoft Project fundamentals to advanced skills. Plan, execute, and track projects effectively using Gantt charts, resource management, and reporting tools to deliver successful projects on time and within budget.",
    currency: "₹"
  },
  {
    id: "3",
    title: "Microsoft Azure Administrator",
    description: "Become a certified Azure Administrator. Manage cloud infrastructure with confidence.",
    price: 199,
    duration: "6 weeks",
    image: "https://i.ibb.co/5pSJLQ9/mza.webp",
    instructor: "Cloud Security Expert",
    level: "Intermediate",
    details: "Learn how to implement, monitor, and maintain Microsoft Azure solutions. Gain hands-on experience with Azure services, security, storage, and networking essentials to prepare for real-world cloud administration and certification.",
    currency: "₹"
  },
  {
    id: "4",
    title: "Introduction to Cyber Security",
    description: "Get started with Cyber Security. Protect systems and data from cyber threats.",
    price: 199,
    duration: "6 weeks",
    image: "https://i.ibb.co/XrDNQpZL/introduction-to-cybersecurity.png",
    instructor: "Cloud Security Expert",
    level: "Intermediate",
    details: "Understand cybersecurity basics, threat landscapes, and protection techniques. Learn about network security, encryption, firewalls, and ethical hacking essentials to start your journey in the cybersecurity world.",
    currency: "₹"
  },
  {
    id: "5",
    title: "AWS Master Class Databases In The Cloud",
    description: "Master AWS cloud databases. Learn storage, management, and optimization.",
    price: 199,
    duration: "6 weeks",
    image: "https://i.ibb.co/FLbz2H2Q/AWSM.png",
    instructor: "Cloud Security Expert",
    level: "Intermediate",
    details: "Learn how AWS database services like RDS, DynamoDB, and Redshift work. This course covers cloud database design, security, backup, and recovery strategies — essential skills for modern cloud architects and developers.",
    currency: "₹"
  },
  {
    id: "6",
    title: "Learning VMware vSAN",
    description: "Learn how to deploy and manage VMware vSAN environments efficiently.",
    price: 199,
    duration: "6 weeks",
    image: "https://i.ibb.co/cKWxsxD9/vmware-training.webp",
    instructor: "Cloud Security Expert",
    level: "Intermediate",
    details: "Understand how VMware’s software-defined storage solution works. Set up, configure, and optimize vSAN clusters for better scalability and performance across your enterprise infrastructure.",
    currency: "₹"
  },
  {
    id: "7",
    title: "Big Data Specialty",
    description: "Specialize in Big Data technologies and analytics platforms.",
    price: 199,
    duration: "6 weeks",
    image: "https://i.ibb.co/235qrJH8/bigdata.png",
    instructor: "Cloud Security Expert",
    level: "Intermediate",
    details: "Master core Big Data concepts including Hadoop, Spark, and data warehousing. Learn to handle, store, and analyze massive datasets and prepare for Big Data certification exams.",
    currency: "₹"
  },
  {
    id: "8",
    title: "Big Data Analytics with AWS and Microsoft Azure",
    description: "Analyze big data using AWS and Azure tools effectively.",
    price: 199,
    duration: "6 weeks",
    image: "https://i.ibb.co/fdXRBVRg/Big-Data-analytics.jpg",
    instructor: "Cloud Security Expert",
    level: "Intermediate",
    details: "Dive into cloud-based big data analytics using Amazon Web Services and Microsoft Azure. Learn about data lakes, real-time analytics, machine learning integrations, and visualization to build powerful data-driven solutions.",
    currency: "₹"
  },
  {
    id: "9",
    title: "Microsoft Office 365 SharePoint",
    description: "Master SharePoint for seamless team collaboration and content management.",
    price: 199,
    duration: "6 weeks",
    image: "https://i.ibb.co/8qQFtXD/Sharepoint-Office-new.webp",
    instructor: "Cloud Security Expert",
    level: "Intermediate",
    details: "Learn how to build, manage, and customize SharePoint sites with Office 365. Understand document libraries, workflows, permissions, and integrations to boost organizational productivity.",
    currency: "₹"
  },
  {
    id: "10",
    title: "Photoshop Training From Beginner to Pro",
    description: "Learn Photoshop from basics to expert-level editing and design.",
    price: 199,
    duration: "6 weeks",
    image: "https://i.ibb.co/YFGzHL9h/maxresdefault.jpg",
    instructor: "Cloud Security Expert",
    level: "Intermediate",
    details: "Master Adobe Photoshop tools and techniques, from simple edits to complex compositions. This course covers retouching, graphic design, UI/UX mockups, and creative projects to help you build a professional design portfolio.",
    currency: "₹"
  },
  {
    id: "11",
    title: "Business Intelligence Analyst",
    description: "Become a skilled Business Intelligence Analyst. Turn data into decisions.",
    price: 199,
    duration: "6 weeks",
    image: "https://i.ibb.co/SwZVbGRx/CP-Business-Intelligence-Analyst.jpg",
    instructor: "Cloud Security Expert",
    level: "Intermediate",
    details: "Learn how to gather, analyze, and visualize business data using BI tools like Power BI, Tableau, and SQL. Understand business strategy and decision-making based on data-driven insights.",
    currency: "₹"
  },
  {
    id: "12",
    title: "Intro to Project Management",
    description: "Learn the basics of project management and key methodologies.",
    price: 199,
    duration: "6 weeks",
    image: "https://i.ibb.co/YTP1hgTc/pm.png",
    instructor: "Cloud Security Expert",
    level: "Intermediate",
    details: "This course introduces you to project planning, execution, monitoring, and closure. Explore popular methodologies like Agile, Scrum, and Waterfall to manage projects efficiently across industries.",
    currency: "₹"
  },
  {
    id: "13",
    title: "PHP Full Stack Web Development",
    description: "Understand how to secure cloud infrastructure and applications across major cloud platforms.",
    price: 199,
    duration: "6 weeks",
    image: "https://i.ibb.co/Kjd67M9s/phpwd.webp",
    instructor: "Cloud Security Expert",
    level: "Intermediate",
    details: "Learn frontend skills (HTML, CSS, JavaScript) and backend PHP development. Work with databases like MySQL, create APIs, and deploy full-stack web applications with real-world projects to kickstart your career in web development.",
    currency: "₹"
  },
];
