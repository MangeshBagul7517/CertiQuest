
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, Clock, BarChart } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CourseCardProps {
  id: string;
  title: string;
  instructor: string;
  description: string;
  price: number;
  rating: number;
  reviewCount: number;
  duration: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  thumbnail: string;
  category: string;
  isFeatured?: boolean;
  isBestseller?: boolean;
  hasDiscount?: boolean;
  originalPrice?: number;
}

const CourseCard = ({
  id,
  title,
  instructor,
  description,
  price,
  rating,
  reviewCount,
  duration,
  level,
  thumbnail,
  category,
  isFeatured = false,
  isBestseller = false,
  hasDiscount = false,
  originalPrice
}: CourseCardProps) => {
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);

  const formattedOriginalPrice = originalPrice 
    ? new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(originalPrice)
    : null;

  const discountPercentage = hasDiscount && originalPrice 
    ? Math.round(((originalPrice - price) / originalPrice) * 100) 
    : null;

  // Set level color
  const levelColor = {
    Beginner: "bg-green-100 text-green-800",
    Intermediate: "bg-blue-100 text-blue-800",
    Advanced: "bg-purple-100 text-purple-800"
  }[level];

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="group glass-card rounded-lg overflow-hidden transition-all duration-300 h-full flex flex-col"
    >
      <Link to={`/courses/${id}`} className="block overflow-hidden relative">
        <div className="aspect-video w-full relative overflow-hidden image-loading">
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
          {(isFeatured || isBestseller) && (
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {isFeatured && (
                <Badge className="bg-primary text-white">Featured</Badge>
              )}
              {isBestseller && (
                <Badge className="bg-amber-500 text-white">Bestseller</Badge>
              )}
            </div>
          )}
          {hasDiscount && discountPercentage && (
            <div className="absolute top-4 right-4">
              <Badge className="bg-red-500 text-white">Save {discountPercentage}%</Badge>
            </div>
          )}
        </div>
      </Link>
      
      <div className="p-6 flex flex-col flex-grow">
        <div className="mb-2 flex items-center justify-between">
          <Badge variant="secondary" className="text-xs font-medium">
            {category}
          </Badge>
          <Badge variant="outline" className={`text-xs font-medium ${levelColor}`}>
            {level}
          </Badge>
        </div>
        
        <Link to={`/courses/${id}`} className="block">
          <h3 className="text-lg font-semibold mb-1 transition-colors group-hover:text-primary line-clamp-2">
            {title}
          </h3>
        </Link>
        
        <p className="text-sm text-muted-foreground mb-3">{instructor}</p>
        
        <p className="text-sm text-foreground/80 mb-4 line-clamp-2">
          {description}
        </p>
        
        <div className="flex items-center space-x-4 mb-4 text-sm">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
            <span className="text-muted-foreground">{duration}</span>
          </div>
          <div className="flex items-center">
            <BarChart className="h-4 w-4 mr-1 text-muted-foreground" />
            <span className="text-muted-foreground">{level}</span>
          </div>
        </div>
        
        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span className="font-medium">{rating.toFixed(1)}</span>
            <span className="text-sm text-muted-foreground">({reviewCount})</span>
          </div>
          
          <div className="text-right">
            {hasDiscount && formattedOriginalPrice && (
              <span className="text-sm text-muted-foreground line-through mr-2">
                {formattedOriginalPrice}
              </span>
            )}
            <span className="font-bold text-lg">{formattedPrice}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CourseCard;
