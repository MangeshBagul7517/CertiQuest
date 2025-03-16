
import { motion } from "framer-motion";
import { Star } from "lucide-react";

interface TestimonialCardProps {
  name: string;
  role: string;
  testimonial: string;
  avatar: string;
  rating: number;
  courseTitle?: string;
}

const TestimonialCard = ({
  name,
  role,
  testimonial,
  avatar,
  rating,
  courseTitle
}: TestimonialCardProps) => {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="glass-card rounded-lg p-6 h-full flex flex-col"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center">
          <div className="w-12 h-12 rounded-full overflow-hidden mr-4 border-2 border-white/50">
            <img
              src={avatar}
              alt={name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h3 className="font-semibold">{name}</h3>
            <p className="text-sm text-muted-foreground">{role}</p>
          </div>
        </div>
        <div className="flex">
          {Array.from({ length: rating }).map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
          ))}
        </div>
      </div>
      
      <p className="text-foreground/80 italic mb-4 flex-grow">"{testimonial}"</p>
      
      {courseTitle && (
        <div className="pt-4 border-t border-border/20 mt-auto">
          <p className="text-sm">
            <span className="text-muted-foreground">Course: </span>
            <span className="font-medium">{courseTitle}</span>
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default TestimonialCard;
