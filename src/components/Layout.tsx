
import { ReactNode, useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { useLocation } from 'react-router-dom';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();

  // Apply animation class to main content on route change
  useEffect(() => {
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.classList.add('animate-fade-in');
      const timer = setTimeout(() => {
        mainContent.classList.remove('animate-fade-in');
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main id="main-content" className="flex-grow px-4 md:px-6 transition-all duration-300">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
