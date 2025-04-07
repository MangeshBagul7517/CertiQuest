
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { CreditCard, ArrowRight } from "lucide-react";

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { cart, clearCart, totalItems } = useCart();
  const { user, updateUserCourses } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Form state
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  
  // Check if redirected from login
  useEffect(() => {
    const redirectAfterLogin = localStorage.getItem('redirectAfterLogin');
    if (redirectAfterLogin === 'payment' && user) {
      localStorage.removeItem('redirectAfterLogin');
      // Redirect to payment gateway directly
      window.location.href = "https://payments.cashfree.com/forms?code=certiqiest";
    }
  }, [user]);

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      // Store redirection info
      localStorage.setItem('redirectAfterLogin', 'payment');
      
      toast({
        title: "Login Required",
        description: "Please login to complete your purchase",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }
    
    if (!name || !email || !phone || !address || !city || !pincode) {
      toast({
        title: "Missing Information",
        description: "Please fill in all the required fields",
        variant: "destructive"
      });
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate payment processing and course enrollment
    setTimeout(() => {
      // Assign courses to user
      cart.forEach(course => {
        updateUserCourses(course.id);
      });
      
      setIsProcessing(false);
      clearCart();
      
      toast({
        title: "Please Proceed with payment",
        description: "Kindly contact us if you have any queries",
      });
      
      // Redirect to payment gateway
      window.location.href = "https://payments.cashfree.com/forms?code=certiqiest";
    }, 2000);
  };

  if (cart.length === 0) {
    navigate("/courses");
    return null;
  }

  return (
    <Layout>
      <div className="container mx-auto py-8 max-w-5xl px-4">
        <h1 className="text-3xl font-bold mb-6">Checkout</h1>
        <h2 className="text-xl font-semibold mb-6">Note: Kindly take a screenshot of the order summary present on right for your reference and further use</h2>

        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-6">Personal Information</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input 
                        id="name" 
                        placeholder="John Doe" 
                        required 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="phone">Contact Number</Label>
                      <Input 
                        id="phone" 
                        placeholder="+91 987654XXXX" 
                        required 
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input 
                        id="email" 
                        placeholder="yourname@mail.com" 
                        type="email"
                        required 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Billing Address</h2>
                    
                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Input 
                        id="address" 
                        placeholder="123 Main St" 
                        required 
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input 
                          id="city" 
                          placeholder="Mumbai" 
                          required 
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="pincode">PIN Code</Label>
                        <Input 
                          id="pincode" 
                          placeholder="400001" 
                          required 
                          value={pincode}
                          onChange={(e) => setPincode(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={isProcessing}>
                    {isProcessing ? (
                      <>Processing...</>
                    ) : (
                      <>
                        <CreditCard className="mr-2 h-4 w-4" />
                        Pay ₹{calculateTotal()}
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
                
                <div className="space-y-4 mb-6">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <div className="flex-1 pr-4">
                        <p className="font-medium">{item.title}</p>
                        <p className="text-sm text-muted-foreground">{item.duration}</p>
                      </div>
                      <span>{item.currency || "₹"}{item.price}</span>
                    </div>
                  ))}
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'items'})</span>
                    <span>₹{calculateTotal()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>18%</span>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>₹{calculateTotal()}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Checkout;
