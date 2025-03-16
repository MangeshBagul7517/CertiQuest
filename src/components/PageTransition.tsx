
import { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";

interface PageTransitionProps {
  children: ReactNode;
}

const PageTransition = ({ children }: PageTransitionProps) => {
  const location = useLocation();
  
  return (
    <motion.div 
      key={location.pathname}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="page-transition"
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
