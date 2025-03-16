
import React from "react";
import { Link } from "react-router-dom";
import { ExternalLink, FileText, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CourseType } from "@/types/course";

interface EnrolledCourseCardProps {
  course: CourseType;
  progress?: number;
}

const EnrolledCourseCard = ({ course, progress = 0 }: EnrolledCourseCardProps) => {
  return (
    <div className="glass-card rounded-lg overflow-hidden transition-all duration-300 h-full flex flex-col">
      <div className="relative">
        <img
          src={course.image}
          alt={course.title}
          className="w-full aspect-video object-cover"
        />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
          <Button variant="secondary" size="sm" asChild>
            <Link to={`/course/${course.id}`}>
              <Play className="mr-2 h-4 w-4" />
              Resume Course
            </Link>
          </Button>
        </div>
        <Badge className="absolute top-3 right-3 bg-primary">{course.category}</Badge>
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <Link to={`/course/${course.id}`}>
          <h3 className="font-semibold text-lg mb-1 hover:text-primary transition-colors">
            {course.title}
          </h3>
        </Link>
        
        <p className="text-sm text-muted-foreground mb-4">
          {course.instructor}
        </p>
        
        <div className="mt-auto space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          
          {course.driveLink && (
            <Button className="w-full" asChild>
              <a href={course.driveLink} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                Access Course Materials
              </a>
            </Button>
          )}
          
          <Button variant="outline" className="w-full" asChild>
            <Link to={`/course/${course.id}`}>
              <FileText className="mr-2 h-4 w-4" />
              View Course Details
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EnrolledCourseCard;
