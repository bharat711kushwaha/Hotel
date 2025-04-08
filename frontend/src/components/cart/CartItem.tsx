
import React from 'react';
import { CartItem as CartItemType } from '@/types';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

interface CartItemProps {
  item: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeItem } = useCart();
  
  const handleIncrease = () => {
    updateQuantity(item.item.id, item.quantity + 1);
  };
  
  const handleDecrease = () => {
    if (item.quantity > 1) {
      updateQuantity(item.item.id, item.quantity - 1);
    } else {
      removeItem(item.item.id);
    }
  };
  
  const handleRemove = () => {
    removeItem(item.item.id);
  };
  
  return (
    <div className="flex items-center py-4 space-x-4">
      <div className="h-16 w-16 bg-muted rounded-md overflow-hidden flex-shrink-0">
        <img 
          src={item.item.image} 
          alt={item.item.name}
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="flex-grow">
        <h3 className="font-medium">{item.item.name}</h3>
        <p className="text-sm text-muted-foreground">${item.item.price.toFixed(2)}</p>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button 
          variant="outline" 
          size="icon" 
          className="h-8 w-8"
          onClick={handleDecrease}
        >
          <Minus className="h-4 w-4" />
        </Button>
        
        <span className="w-8 text-center">{item.quantity}</span>
        
        <Button 
          variant="outline" 
          size="icon" 
          className="h-8 w-8"
          onClick={handleIncrease}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="text-right font-medium w-20">
        ${(item.item.price * item.quantity).toFixed(2)}
      </div>
      
      <Button 
        variant="ghost" 
        size="icon" 
        className="text-muted-foreground hover:text-destructive"
        onClick={handleRemove}
      >
        <Trash2 className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default CartItem;
