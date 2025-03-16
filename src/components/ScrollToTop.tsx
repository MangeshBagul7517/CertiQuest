
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronUp } from 'lucide-react';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled down
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Set the top coordinate to 0
  // Make scrolling smooth
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    <div className={`scroll-to-top ${isVisible ? 'visible' : ''}`}>
      <Button
        onClick={scrollToTop}
        variant="outline"
        size="icon"
        className="rounded-full shadow-lg bg-background/80 backdrop-blur-sm hover:bg-background"
        aria-label="Scroll to top"
      >
        <ChevronUp className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ScrollToTop;
