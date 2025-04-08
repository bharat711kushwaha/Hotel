
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Cart, CartItem, FoodItem } from '@/types';
import { toast } from "sonner";

// Cart Actions
type CartAction = 
  | { type: 'ADD_ITEM'; payload: { item: FoodItem; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { itemId: string; quantity: number } }
  | { type: 'CLEAR_CART' };

// Initial state
const initialState: Cart = {
  items: [],
  total: 0
};

// Calculate cart total
const calculateTotal = (items: CartItem[]): number => {
  return items.reduce((sum, cartItem) => sum + (cartItem.item.price * cartItem.quantity), 0);
};

// Cart Reducer
const cartReducer = (state: Cart, action: CartAction): Cart => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { item, quantity } = action.payload;
      const existingItemIndex = state.items.findIndex(cartItem => cartItem.item.id === item.id);
      
      let updatedItems;
      if (existingItemIndex >= 0) {
        // Item exists, update quantity
        updatedItems = [...state.items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + quantity
        };
      } else {
        // New item
        updatedItems = [...state.items, { item, quantity }];
      }
      
      return {
        items: updatedItems,
        total: calculateTotal(updatedItems)
      };
    }
    
    case 'REMOVE_ITEM': {
      const updatedItems = state.items.filter(cartItem => cartItem.item.id !== action.payload);
      return {
        items: updatedItems,
        total: calculateTotal(updatedItems)
      };
    }
    
    case 'UPDATE_QUANTITY': {
      const { itemId, quantity } = action.payload;
      if (quantity <= 0) {
        // If quantity is 0 or less, remove the item
        return cartReducer(state, { type: 'REMOVE_ITEM', payload: itemId });
      }
      
      const updatedItems = state.items.map(cartItem => 
        cartItem.item.id === itemId 
          ? { ...cartItem, quantity } 
          : cartItem
      );
      
      return {
        items: updatedItems,
        total: calculateTotal(updatedItems)
      };
    }
    
    case 'CLEAR_CART':
      return initialState;
      
    default:
      return state;
  }
};

// Cart Context
interface CartContextType extends Cart {
  addItem: (item: FoodItem, quantity?: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  
  // Load cart from localStorage on initial render
  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      try {
        const parsedCart = JSON.parse(storedCart);
        // Use the reducer to set the initial state with proper total calculation
        parsedCart.items.forEach((item: CartItem) => {
          dispatch({
            type: 'ADD_ITEM',
            payload: { item: item.item, quantity: item.quantity }
          });
        });
      } catch (error) {
        console.error('Failed to load cart from localStorage', error);
        localStorage.removeItem('cart');
      }
    }
  }, []);

  // Update localStorage when cart changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state));
  }, [state]);

  // Add item to cart
  const addItem = (item: FoodItem, quantity = 1) => {
    dispatch({ type: 'ADD_ITEM', payload: { item, quantity } });
    toast.success(`Added ${item.name} to cart`);
  };

  // Remove item from cart
  const removeItem = (itemId: string) => {
    const itemName = state.items.find(item => item.item.id === itemId)?.item.name || 'Item';
    dispatch({ type: 'REMOVE_ITEM', payload: itemId });
    toast.info(`Removed ${itemName} from cart`);
  };

  // Update item quantity
  const updateQuantity = (itemId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { itemId, quantity } });
  };

  // Clear cart
  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
    toast.info('Cart cleared');
  };

  return (
    <CartContext.Provider 
      value={{ 
        ...state, 
        addItem, 
        removeItem, 
        updateQuantity, 
        clearCart 
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
