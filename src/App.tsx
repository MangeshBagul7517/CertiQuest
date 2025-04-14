
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, useNavigationType, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { CartProvider } from "@/contexts/CartContext";
import { AdminProvider } from "@/contexts/AdminContext";
import { AuthProvider } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import ScrollToTop from "./components/ScrollToTop";
import { Toaster } from "@/components/ui/sonner";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

// Scroll restoration component
const ScrollRestoration = () => {
  const { pathname } = useLocation();
  const navigationType = useNavigationType();
  
  useEffect(() => {
    // Only scroll to top on new navigations, not back/forward
    if (navigationType !== 'POP') {
      window.scrollTo(0, 0);
    }
  }, [pathname, navigationType]);
  
  return null;
};

// Check for auth status changes
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth state changed:', event);
  
  // Check for admin status
  const isAdmin = session?.user?.email === "mangeshbbagul@gmail.com";
  
  if (isAdmin) {
    sessionStorage.setItem('isAdmin', 'true');
    console.log('Admin status set in sessionStorage');
  } else if (event === 'SIGNED_OUT') {
    sessionStorage.removeItem('isAdmin');
    console.log('Admin status removed from sessionStorage');
  }
});

// Main App component
const App = () => {
  useEffect(() => {
    // Handle password reset URLs
    const handlePasswordReset = async () => {
      // Check for hash parameters in URL
      const hashParams = new URLSearchParams(window.location.hash.slice(1));
      const type = hashParams.get('type');
      const accessToken = hashParams.get('access_token');
      
      console.log('URL hash parameters:', { type, accessToken: accessToken ? 'exists' : 'missing' });
      
      // If this is a password recovery link with a token
      if (type === 'recovery' && accessToken) {
        console.log('Password recovery detected, setting session with token');
        try {
          // Set the session using the token from the URL
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: '',
          });
          
          if (error) {
            console.error('Error setting session from URL token:', error);
          } else {
            console.log('Session set successfully, redirecting to reset-password');
            // Redirect to reset password page
            window.location.href = '/reset-password';
            return;
          }
        } catch (err) {
          console.error('Exception during session setting:', err);
        }
      }
      
      // Regular session check
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error retrieving session:', error);
        return;
      }
    };
    
    handlePasswordReset();
  }, []);
  
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <CartProvider>
            <AdminProvider>
              <Toaster position="top-right" closeButton={true} richColors={true} />
              <BrowserRouter>
                <ScrollRestoration />
                <ScrollToTop />
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/courses" element={<Courses />} />
                  <Route path="/course/:id" element={<CourseDetail />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/dashboard/*" element={<Dashboard />} />
                  
                  {/* Admin Routes */}
                  <Route element={<AdminProtectedRoute />}>
                    <Route path="/admin/dashboard/*" element={<AdminDashboard />} />
                  </Route>
                  
                  {/* Handle all routes, including 404 */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </AdminProvider>
          </CartProvider>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
