
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-secondary py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link to="/" className="inline-block">
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                CertiQuest
              </span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-xs">
              Empower your future with professional certifications and courses designed to accelerate your career.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Facebook">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Twitter">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Instagram">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="LinkedIn">
                <Linkedin className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="YouTube">
                <Youtube className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div>
            <h3 className="text-base font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">Home</Link></li>
              <li><Link to="/courses" className="text-sm text-muted-foreground hover:text-primary transition-colors">Courses</Link></li>
              <li><Link to="/certificates" className="text-sm text-muted-foreground hover:text-primary transition-colors">Certificates</Link></li>
              <li><Link to="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-base font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li><Link to="/help" className="text-sm text-muted-foreground hover:text-primary transition-colors">Help Center</Link></li>
              <li><Link to="/faq" className="text-sm text-muted-foreground hover:text-primary transition-colors">FAQ</Link></li>
              <li><Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link to="/refund" className="text-sm text-muted-foreground hover:text-primary transition-colors">Refund Policy</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-base font-semibold mb-4">Subscribe to Our Newsletter</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Get the latest updates on new courses and special offers.
            </p>
            <div className="space-y-2">
              <div className="flex space-x-2">
                <Input 
                  type="email" 
                  placeholder="Your email address"
                  className="bg-white/50"
                />
                <Button size="sm" className="shrink-0">
                  <Mail className="h-4 w-4 mr-2" />
                  Subscribe
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                By subscribing, you agree to our privacy policy.
              </p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © {currentYear} CertiQuest. All rights reserved.
          </p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <Link to="/privacy" className="text-xs text-muted-foreground hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link to="/terms" className="text-xs text-muted-foreground hover:text-primary transition-colors">
              Terms of Service
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link to="/cookies" className="text-xs text-muted-foreground hover:text-primary transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
