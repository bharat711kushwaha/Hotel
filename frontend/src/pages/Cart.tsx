
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import CartItem from '@/components/cart/CartItem';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, ArrowLeft, Trash2 } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from "sonner";
import { createOrder } from '@/data/mockData';

const Cart: React.FC = () => {
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const handleCheckout = async () => {
    // Check if user is logged in
    if (!user) {
      toast.error("Please log in to place an order", {
        description: "You need to be logged in to complete your purchase."
      });
      navigate('/login', { state: { from: '/cart' } });
      return;
    }
    
    try {
      // Create the order
      await createOrder({
        userId: user.id,
        userName: user.name,
        items: items,
        total: total,
        status: 'pending',
        paymentStatus: 'completed', // For demo purposes, we'll set this to completed
      });
      
      // Clear the cart
      clearCart();
      
      // Show success message
      toast.success("Order placed successfully!");
      
      // Redirect to orders page
      navigate('/orders');
    } catch (error) {
      toast.error("Failed to place order", {
        description: "Please try again later."
      });
    }
  };
  
  return (
    <Layout>
      <div className="restaurant-container py-8">
        <h1 className="page-title flex items-center">
          <ShoppingCart className="mr-2 h-8 w-8 text-restaurant-primary" />
          Your Cart
        </h1>
        
        {items.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items List */}
            <div className="lg:col-span-2">
              <div className="bg-card rounded-lg shadow-sm border p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Items ({items.reduce((sum, item) => sum + item.quantity, 0)})</h2>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-muted-foreground hover:text-destructive"
                    onClick={clearCart}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Clear Cart
                  </Button>
                </div>
                
                <Separator className="mb-4" />
                
                {items.map(item => (
                  <React.Fragment key={item.item.id}>
                    <CartItem item={item} />
                    <Separator />
                  </React.Fragment>
                ))}
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-lg shadow-sm border p-6 sticky top-24">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                <Separator className="mb-4" />
                
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Delivery Fee</span>
                    <span>$0.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span>$0.00</span>
                  </div>
                </div>
                
                <Separator className="mb-4" />
                
                <div className="flex justify-between font-semibold text-lg mb-6">
                  <span>Total</span>
                  <span className="text-restaurant-primary">${total.toFixed(2)}</span>
                </div>
                
                <Button 
                  className="w-full bg-restaurant-primary hover:bg-restaurant-dark text-white mb-3"
                  onClick={handleCheckout}
                >
                  Proceed to Checkout
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  asChild
                >
                  <Link to="/menu">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Continue Shopping
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="inline-flex justify-center items-center w-24 h-24 bg-muted rounded-full mb-6">
              <ShoppingCart className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">Looks like you haven't added anything to your cart yet.</p>
            <Button 
              className="bg-restaurant-primary hover:bg-restaurant-dark text-white"
              asChild
            >
              <Link to="/menu">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Browse Menu
              </Link>
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Cart;
