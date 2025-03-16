
export interface CourseType {
  id: string;
  title: string;
  instructor: string;
  description: string;
  price: number;
  rating: number;
  reviews: number;
  reviewCount?: number;
  duration: string;
  level: string;
  thumbnail?: string;
  image: string;
  category: string;
  students: number;
  isFeatured?: boolean;
  isPopular?: boolean;
  isBestseller?: boolean;
  hasDiscount?: boolean;
  originalPrice?: number;
  driveLink?: string;
}
