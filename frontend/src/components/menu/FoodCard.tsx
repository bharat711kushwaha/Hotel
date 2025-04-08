
import React from 'react';
import { FoodItem } from '@/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

interface FoodCardProps {
  foodItem: FoodItem;
}

const FoodCard: React.FC<FoodCardProps> = ({ foodItem }) => {
  const { addItem } = useCart();
  
  const handleAddToCart = () => {
    addItem(foodItem, 1);
  };
  
  return (
    <Card className="card-hover overflow-hidden h-full flex flex-col">
      <div className="relative h-48 bg-muted">
        <img 
          src={foodItem.image} 
          alt={foodItem.name}
          className="w-full h-full object-cover"
        />
        {!foodItem.available && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white font-semibold text-lg">Currently Unavailable</span>
          </div>
        )}
      </div>
      
      <CardContent className="pt-4 flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg">{foodItem.name}</h3>
          <span className="font-medium text-restaurant-primary">${foodItem.price.toFixed(2)}</span>
        </div>
        <p className="text-muted-foreground text-sm">{foodItem.description}</p>
      </CardContent>
      
      <CardFooter className="pt-0">
        <Button 
          onClick={handleAddToCart}
          className="w-full bg-restaurant-primary hover:bg-restaurant-dark text-white"
          disabled={!foodItem.available}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FoodCard;
