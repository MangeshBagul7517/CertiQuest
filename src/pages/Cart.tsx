
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { useCart } from "@/contexts/CartContext";
import { Trash2, ShoppingCart } from "lucide-react";

const Cart = () => {
  const { cart, removeFromCart, clearCart, totalItems } = useCart();
  const { toast } = useToast();

  const handleRemoveItem = (id: string) => {
    removeFromCart(id);
    toast({
      title: "Item removed",
      description: "The course has been removed from your cart.",
    });
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price, 0);
  };

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6 flex items-center">
          <ShoppingCart className="mr-3 h-8 w-8" />
          Your Cart {totalItems > 0 && `(${totalItems})`}
        </h1>

        {cart.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-medium mb-4">Your cart is empty</h2>
            <p className="text-muted-foreground mb-8">Add some courses to get started</p>
            <Link to="/courses">
              <Button>Browse Courses</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {cart.map((item) => (
                  <Card key={item.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex flex-col sm:flex-row">
                        <div className="sm:w-48 h-32 overflow-hidden">
                          <img 
                            src={item.image} 
                            alt={item.title} 
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="p-4 flex-1 flex flex-col justify-between">
                          <div>
                            <h3 className="font-semibold text-lg">{item.title}</h3>
                            <p className="text-muted-foreground text-sm mt-1">
                              {item.duration} • {item.instructor}
                            </p>
                          </div>
                          <div className="flex justify-between items-center mt-4">
                            <span className="font-medium">{item.currency || "₹"}{item.price}</span>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleRemoveItem(item.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Remove
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            
            <div>
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
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
                  
                  <div className="flex justify-between font-bold text-lg mb-6">
                    <span>Total</span>
                    <span>₹{calculateTotal()}</span>
                  </div>
                  
                  <Link to="/checkout">
                    <Button className="w-full mb-4">Proceed to Checkout</Button>
                  </Link>
                  
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      clearCart();
                      toast({
                        title: "Cart cleared",
                        description: "All items have been removed from your cart.",
                      });
                    }}
                  >
                    Clear Cart
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Cart;
