
export interface Course {
  id: string;
  title: string;
  description: string;
  image: string;
  price: number;
  rating: number;
  reviews: number;
  students: number;
  duration: string;
  level: string;
  instructor: string;
  category: string;
  isFeatured?: boolean;
  isPopular?: boolean;
  details?: string;
  currency?: string;
  driveLink?: string;
}
