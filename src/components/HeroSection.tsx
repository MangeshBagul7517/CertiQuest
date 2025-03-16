
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

interface HeroSectionProps {
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  image?: string;
  backgroundImage?: string;
}

const HeroSection = ({
  title,
  subtitle,
  buttonText,
  buttonLink,
  secondaryButtonText,
  secondaryButtonLink,
  image,
  backgroundImage
}: HeroSectionProps) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <section className="relative min-h-[90vh] flex items-center pt-24 pb-16 md:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {backgroundImage ? (
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${backgroundImage})` }}>
            <div className="absolute inset-0 bg-gradient-to-r from-background to-background/60"></div>
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-secondary/50 via-background to-background"></div>
        )}

        {/* Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIj48cGF0aCBkPSJNMCAwaDYwdjYwSDB6Ii8+PHBhdGggZD0iTTU0LjAyIDI4LjA3YzguMDYgOC4wNiA4LjA2IDIxLjA4IDAgMjkuMTRzLTIxLjA4IDguMDYtMjkuMTQgMHMtOC4wNi0yMS4wOCAwLTI5LjE0czIxLjA4LTguMDYgMjkuMTQgMHptLTE5IDguNjhjMy4zOC0zLjM4IDguODYtMy4zOCAxMi4yNCAwczMuMzggOC44NiAwIDEyLjI0LTguODYgMy4zOC0xMi4yNCAwLTMuMzgtOC44NiAwLTEyLjI0eiIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjIiLz48L2c+PC9zdmc+')]"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="max-w-3xl"
          >
            <motion.div variants={item} className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary mb-6">
              <Sparkles className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">Transform your career with certifications</span>
            </motion.div>
            
            <motion.h1 
              variants={item}
              className="heading-xl mb-6"
            >
              {title}
            </motion.h1>
            
            <motion.p 
              variants={item}
              className="subheading mb-8"
            >
              {subtitle}
            </motion.p>
            
            <motion.div 
              variants={item}
              className="flex flex-wrap gap-4"
            >
              <Link to={buttonLink}>
                <Button size="lg" className="rounded-full group">
                  {buttonText}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              
              {secondaryButtonText && secondaryButtonLink && (
                <Link to={secondaryButtonLink}>
                  <Button size="lg" variant="outline" className="rounded-full">
                    {secondaryButtonText}
                  </Button>
                </Link>
              )}
            </motion.div>
            
            <motion.div 
              variants={item}
              className="mt-10 flex items-center space-x-6"
            >
              <div className="flex -space-x-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white text-xs font-medium border-2 border-white"
                  >
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
              </div>
              <div>
                <div className="font-medium">Join 10,000+ students</div>
                <div className="text-sm text-muted-foreground">Start your certification journey today</div>
              </div>
            </motion.div>
          </motion.div>
          
          {image && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="relative hidden lg:block"
            >
              <div className="relative z-10">
                <img 
                  src={image} 
                  alt="Hero image"
                  className="w-full h-auto object-cover rounded-xl shadow-2xl"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-2/3 h-2/3 bg-primary/10 rounded-xl -z-10 animate-pulse-soft"></div>
              <div className="absolute -top-6 -left-6 w-1/2 h-1/2 bg-secondary rounded-xl -z-10"></div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
