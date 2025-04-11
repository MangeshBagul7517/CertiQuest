
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';
import { Menu, Search, ShoppingCart, X, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useAdmin } from '@/contexts/AdminContext';

const NavLink = ({ to, children, className }: { to: string; children: React.ReactNode; className?: string }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={cn(
        "px-4 py-2 text-sm font-medium transition-colors hover:text-primary",
        isActive ? "text-primary" : "text-foreground/70",
        className
      )}
    >
      {children}
    </Link>
  );
};

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const { isAdmin } = useAdmin();

  // Update scroll state
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close search on route change
  useEffect(() => {
    setIsSearchOpen(false);
  }, [location]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to search results
      window.location.href = `/courses?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled
          ? "bg-background/80 backdrop-blur-lg shadow-sm border-b"
          : "bg-background"
      )}
    >
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold tracking-tight">CertiQuest</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-4">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/courses">Courses</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/contact">Contact</NavLink>
          {/* Admin button removed */}
        </nav>

        {/* Desktop Right Section */}
        <div className="hidden md:flex items-center space-x-4">
          {/* Search */}
          <div className="relative">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              aria-label="Search"
            >
              {isSearchOpen ? <X size={20} /> : <Search size={20} />}
            </Button>
            
            {isSearchOpen && (
              <form 
                onSubmit={handleSearch}
                className="absolute right-0 top-full mt-2 bg-background rounded-md shadow-lg border p-2 animate-fade-in"
              >
                <div className="flex">
                  <Input
                    type="search"
                    placeholder="Search courses..."
                    className="w-60"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                  />
                  <Button type="submit" variant="ghost" size="icon">
                    <Search size={18} />
                  </Button>
                </div>
              </form>
            )}
          </div>

          {/* Cart */}
          <Link to="/cart" className="relative">
            <Button variant="ghost" size="icon" aria-label="Cart">
              <ShoppingCart size={20} />
              {totalItems > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  {totalItems}
                </Badge>
              )}
            </Button>
          </Link>

          {/* Auth */}
          {user ? (
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent">
                    <User size={18} className="mr-2" />
                    <span className="text-sm">{user.name.split(' ')[0]}</span>
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[200px] gap-1 p-2">
                      <li>
                        <Link to="/dashboard" className={navigationMenuTriggerStyle()}>
                          Dashboard
                        </Link>
                      </li>
                      <li>
                        <Link to="/dashboard/profile" className={navigationMenuTriggerStyle()}>
                          Profile
                        </Link>
                      </li>
                      <li>
                        <button 
                          onClick={logout} 
                          className={cn(navigationMenuTriggerStyle(), "w-full text-left")}
                        >
                          Logout
                        </button>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          ) : (
            <div className="flex items-center space-x-2">
              <Link to="/login">
                <Button variant="ghost" size="sm">Login</Button>
              </Link>
              <Link to="/register">
                <Button size="sm">Register</Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="flex md:hidden items-center space-x-4">
          {/* Mobile Search Button */}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            aria-label="Search"
          >
            {isSearchOpen ? <X size={20} /> : <Search size={20} />}
          </Button>

          {/* Mobile Cart */}
          <Link to="/cart" className="relative">
            <Button variant="ghost" size="icon" aria-label="Cart">
              <ShoppingCart size={20} />
              {totalItems > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  {totalItems}
                </Badge>
              )}
            </Button>
          </Link>

          {/* Mobile Menu Trigger */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Menu">
                <Menu size={20} />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="flex flex-col space-y-4 mt-8">
                <Link to="/" className="text-lg font-medium py-2 hover:text-primary">
                  Home
                </Link>
                <Link to="/courses" className="text-lg font-medium py-2 hover:text-primary">
                  Courses
                </Link>
                <Link to="/about" className="text-lg font-medium py-2 hover:text-primary">
                  About
                </Link>
                <Link to="/contact" className="text-lg font-medium py-2 hover:text-primary">
                  Contact
                </Link>
                
                <div className="h-px bg-border my-2" />
                
                {user ? (
                  <>
                    <div className="flex items-center space-x-2 mb-2">
                      <User size={18} />
                      <span>{user.name}</span>
                    </div>
                    <Link to="/dashboard" className="text-md py-2 hover:text-primary">
                      Dashboard
                    </Link>
                    <Link to="/dashboard/profile" className="text-md py-2 hover:text-primary">
                      Profile
                    </Link>
                    <button 
                      onClick={logout} 
                      className="text-md py-2 text-left hover:text-primary"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col space-y-2">
                    <Link to="/login">
                      <Button variant="outline" className="w-full">Login</Button>
                    </Link>
                    <Link to="/register">
                      <Button className="w-full">Register</Button>
                    </Link>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {isSearchOpen && (
        <div className="md:hidden border-t animate-slide-in">
          <form onSubmit={handleSearch} className="container mx-auto px-4 py-2">
            <div className="flex">
              <Input
                type="search"
                placeholder="Search courses..."
                className="flex-1"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <Button type="submit" variant="ghost" size="icon">
                <Search size={18} />
              </Button>
            </div>
          </form>
        </div>
      )}
    </header>
  );
};

export default Navbar;
