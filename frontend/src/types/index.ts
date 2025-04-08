
export interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

export type FoodCategory = 
  | "starters" 
  | "main_course" 
  | "desserts" 
  | "beverages" 
  | "specials";

export interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: FoodCategory;
  available: boolean;
}

export interface CartItem {
  item: FoodItem;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
}

export type OrderStatus = 
  | "pending" 
  | "preparing" 
  | "delivered" 
  | "cancelled";

export interface Order {
  id: string;
  userId: string;
  userName: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  paymentStatus: "pending" | "completed" | "failed";
  createdAt: string;
  updatedAt: string;
}

export interface OrderSummary {
  id: string;
  total: number;
  status: OrderStatus;
  createdAt: string;
  itemCount: number;
}
