
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Award, Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CertificateCardProps {
  id: string;
  name: string;
  recipientName: string;
  issueDate: string;
  courseTitle: string;
  previewImage: string;
}

const CertificateCard = ({
  id,
  name,
  recipientName,
  issueDate,
  courseTitle,
  previewImage
}: CertificateCardProps) => {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="glass-card rounded-lg overflow-hidden transition-all duration-300 h-full flex flex-col"
    >
      <div className="p-6 pb-0">
        <h3 className="text-lg font-semibold mb-2">{name}</h3>
        <p className="text-sm text-muted-foreground mb-4">{courseTitle}</p>
      </div>
      
      <div className="px-6 pb-4 flex-grow relative">
        <div className="relative bg-white/50 p-4 rounded-lg shadow-sm border border-white/20 overflow-hidden">
          <img
            src={previewImage}
            alt={`${name} Certificate Preview`}
            className="w-full h-auto object-cover rounded"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/80 flex items-end justify-center p-4">
            <Link to={`/certificates/${id}`}>
              <Button size="sm" variant="secondary" className="gap-1">
                <Award className="h-4 w-4" />
                View Certificate
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      <div className="p-6 pt-2 border-t border-border/20">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center text-sm">
            <User className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="text-foreground/80">Recipient: <span className="font-medium">{recipientName}</span></span>
          </div>
          <div className="flex items-center text-sm">
            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="text-foreground/80">Issued: <span className="font-medium">{issueDate}</span></span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CertificateCard;
