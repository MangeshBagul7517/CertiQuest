
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Search, User, ShoppingCart } from "lucide-react";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Courses", path: "/courses" },
    { name: "Certificates", path: "/certificates" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? "glass-nav py-2" : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            CertiQuest
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`text-sm font-medium transition-all hover:text-primary ${
                location.pathname === link.path ? "text-primary" : "text-foreground"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </Button>
          <Link to="/cart">
            <Button 
              variant="ghost" 
              size="icon"
              aria-label="Shopping Cart"
            >
              <ShoppingCart className="h-5 w-5" />
            </Button>
          </Link>
          <Link to="/login">
            <Button 
              variant="ghost" 
              size="icon"
              aria-label="User Account"
            >
              <User className="h-5 w-5" />
            </Button>
          </Link>
          <Link to="/login">
            <Button className="font-medium">
              Sign In
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? "Close Menu" : "Open Menu"}
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 glass-card animate-slide-down p-4 md:hidden">
            <nav className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-sm font-medium py-2 px-4 rounded-md transition-colors ${
                    location.pathname === link.path
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-secondary"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <div className="flex flex-col space-y-2 pt-2 border-t">
                <Link to="/login">
                  <Button className="w-full" variant="outline">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="w-full">
                    Register
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
