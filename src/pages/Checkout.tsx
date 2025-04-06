
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { useCart } from "@/contexts/CartContext";
import { CreditCard, ArrowRight } from "lucide-react";

const Checkout = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { cart, clearCart, totalItems } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      clearCart();
      toast({
        title: "Please Proceed with payment",
        description: "Kindly contact us if you have any queries",
      });
      navigate("/dashboard");
    }, 2000);
  };

  if (cart.length === 0) {
    navigate("/courses");
    return null;
  }

  return (
    <Layout>
      <div className="container mx-auto py-8 max-w-5xl">
        <h1 className="text-3xl font-bold mb-6">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-6">Personal Information</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="cardName">Name</Label>
                      <Input id="cardName" placeholder="John Doe" required />
                    </div>
                    
                    <div>
                      <Label htmlFor="cardNumber">Contact Number</Label>
                      <Input id="cardNumber" placeholder="+91 9876543210" required />
                    </div>

                    <div>
                      <Label htmlFor="cardNumber">Email Address</Label>
                      <Input id="cardNumber" placeholder="yourname@mail.com" required />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Billing Address</h2>
                    
                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Input id="address" placeholder="123 Main St" required />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input id="city" placeholder="Mumbai" required />
                      </div>
                      <div>
                        <Label htmlFor="pincode">PIN Code</Label>
                        <Input id="pincode" placeholder="400001" required />
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
                    <span>₹0</span>
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
