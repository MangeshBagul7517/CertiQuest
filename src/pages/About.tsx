
import { Check, Users, Award, Target } from 'lucide-react';
import Layout from '@/components/Layout';
import { Separator } from '@/components/ui/separator';

const AboutPage = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-16 md:py-24 animate-fade-in">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">About CertiQuest</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Empowering professionals with the skills and certifications they need to succeed in today's competitive landscape.
            </p>
          </div>
          
          <div className="aspect-video overflow-hidden rounded-xl shadow-lg">
            <img 
              src="/placeholder.svg" 
              alt="CertiQuest team" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>
      
      {/* Mission & Vision */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div className="space-y-4">
              <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground">
                Our Mission
              </div>
              <h2 className="text-3xl font-bold tracking-tight">Transforming careers through accessible certification</h2>
              <p className="text-muted-foreground">
                At CertiQuest, we believe in the power of education to transform lives. Our mission is to provide accessible, industry-relevant certification programs that help professionals advance their careers and organizations build stronger teams.
              </p>
              <ul className="space-y-2">
                {[
                  "Make quality certification accessible to all",
                  "Provide industry-relevant curriculum",
                  "Support continuous professional development",
                  "Maintain rigorous quality standards"
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="space-y-4">
              <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground">
                Our Vision
              </div>
              <h2 className="text-3xl font-bold tracking-tight">A world where certification opens doors</h2>
              <p className="text-muted-foreground">
                We envision a world where quality certification is accessible to everyone, regardless of location or background. Where professionals can continuously upskill to meet the demands of a rapidly evolving job market, and where employers value certified skills.
              </p>
              <div className="relative overflow-hidden rounded-lg shadow-md aspect-video">
                <img 
                  src="/placeholder.svg" 
                  alt="CertiQuest vision" 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Core Values */}
      <section className="py-16">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Our Core Values</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              These principles guide our approach to certification and education
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Users className="h-10 w-10 text-primary" />,
                title: "Inclusivity",
                description: "We believe quality education should be accessible to everyone, regardless of background or location."
              },
              {
                icon: <Award className="h-10 w-10 text-primary" />,
                title: "Excellence",
                description: "We maintain high standards in our curriculum, instruction, and certification process."
              },
              {
                icon: <Target className="h-10 w-10 text-primary" />,
                title: "Relevance",
                description: "Our programs are designed to meet the current and future needs of the industry."
              }
            ].map((value, index) => (
              <div key={index} className="bg-muted/30 rounded-lg p-8 text-center hover:shadow-md transition-shadow duration-300">
                <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Our Story */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/10 rounded-lg transform rotate-3"></div>
              <img 
                src="/placeholder.svg" 
                alt="CertiQuest founder" 
                className="relative z-10 rounded-lg shadow-lg"
              />
            </div>
            
            <div className="space-y-6">
              <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground">
                Our Story
              </div>
              <h2 className="text-3xl font-bold tracking-tight">From Idea to Impact</h2>
              <p className="text-muted-foreground">
                CertiQuest was founded in 2020 with a simple but powerful idea: to make professional certification more accessible, practical, and impactful.
              </p>
              <p className="text-muted-foreground">
                Our founder, experienced in both industry and education, noticed a gap between what traditional certification programs offered and what professionals actually needed. Traditional programs were often outdated, expensive, or divorced from real-world application.
              </p>
              <p className="text-muted-foreground">
                CertiQuest was created to bridge this gap, offering certification programs designed by industry experts, focused on practical skills, and delivered in flexible formats to accommodate working professionals.
              </p>
              <p className="text-muted-foreground">
                Today, we've helped thousands of professionals advance their careers through our certification programs, and we're just getting started.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Team */}
      <section className="py-16">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Our Leadership Team</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Meet the experts behind CertiQuest's certification programs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: "Rajesh Kumar",
                role: "CEO & Founder",
                image: "/placeholder.svg",
                bio: "Rajesh has 15+ years of experience in education technology and professional certification."
              },
              {
                name: "Priya Sharma",
                role: "Director of Curriculum",
                image: "/placeholder.svg",
                bio: "Priya leads our curriculum development team with expertise in instructional design and adult education."
              },
              {
                name: "Vikram Singh",
                role: "Chief Technology Officer",
                image: "/placeholder.svg",
                bio: "Vikram oversees our learning platform and technology infrastructure."
              },
              {
                name: "Ananya Patel",
                role: "Head of Student Success",
                image: "/placeholder.svg",
                bio: "Ananya ensures our students receive the support they need to successfully complete their certification."
              }
            ].map((member, index) => (
              <div key={index} className="group">
                <div className="relative overflow-hidden rounded-lg shadow-md aspect-square mb-4">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <h3 className="text-xl font-semibold">{member.name}</h3>
                <p className="text-primary text-sm font-medium mb-2">{member.role}</p>
                <p className="text-sm text-muted-foreground">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* FAQ section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-muted-foreground">
              Common questions about CertiQuest and our certification programs
            </p>
          </div>
          
          <div className="space-y-6">
            {[
              {
                question: "How are CertiQuest certifications recognized in the industry?",
                answer: "CertiQuest certifications are designed in collaboration with industry experts and aligned with industry standards. Our programs are recognized by employers across India and internationally."
              },
              {
                question: "What is the format of CertiQuest certification programs?",
                answer: "Our programs combine self-paced online learning with live virtual workshops and hands-on projects. This blended approach ensures both flexibility and practical skill development."
              },
              {
                question: "How long does it take to complete a certification?",
                answer: "Program duration varies based on the certification level and complexity. Most of our programs can be completed in 4-12 weeks, depending on your pace and prior knowledge."
              },
              {
                question: "Do you offer job placement assistance after certification?",
                answer: "Yes, we provide career support including resume reviews, interview preparation, and access to our employer network. We're committed to helping you leverage your certification for career advancement."
              },
              {
                question: "Are there any prerequisites for enrolling in your courses?",
                answer: "Prerequisites vary by program. Some advanced certifications require prior knowledge or experience, while our foundational programs are accessible to beginners. Each course page lists specific prerequisites."
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

export default AboutPage;
