
import { FoodItem, Order, OrderStatus } from '@/types';

export const mockFoodItems: FoodItem[] =[
  {
    id: '1',
    name: 'Paneer Tikka',
    description: 'Tandoor-grilled cottage cheese cubes marinated in spices',
    price: 7.99,
    image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8UGFuZWVyJTIwVGlra2F8ZW58MHx8MHx8fDA%3D',
    category: 'starters',
    available: true
  },
  {
    id: '2',
    name: 'Veg Samosa',
    description: 'Crispy pastry filled with spiced potatoes and peas',
    price: 4.99,
    image: 'https://media.istockphoto.com/id/951235330/photo/veg-samosa-is-a-triangle-shape-pakora-stuffed-with-aloo-sabji-served-with-green-chutney-and.webp?a=1&b=1&s=612x612&w=0&k=20&c=3XggGgQ160jcu-8cQ-SRN5As7689c4ruNPHU5_aimG4=',
    category: 'starters',
    available: true
  },
  {
    id: '3',
    name: 'Hara Bhara Kabab',
    description: 'Spinach and green pea patties served with mint chutney',
    price: 6.99,
    image: 'https://images.unsplash.com/photo-1630585577431-03c64600308a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fEhhcmElMjBCaGFyYSUyMEthYmFifGVufDB8fDB8fHww',
    category: 'starters',
    available: true
  },
  {
    id: '4',
    name: 'Paneer Butter Masala',
    description: 'Paneer cubes in rich, creamy tomato gravy',
    price: 13.99,
    image: 'https://plus.unsplash.com/premium_photo-1700593907553-05ba83be4173?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8UGFuZWVyJTIwQnV0dGVyJTIwTWFzYWxhfGVufDB8fDB8fHww',
    category: 'main_course',
    available: true
  },
  {
    id: '5',
    name: 'Veg Biryani',
    description: 'Aromatic basmati rice cooked with mixed vegetables and spices',
    price: 12.49,
    image: 'https://images.unsplash.com/photo-1630409346824-4f0e7b080087?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8VmVnJTIwQmlyeWFuaXxlbnwwfHwwfHx8MA%3D%3D',
    category: 'main_course',
    available: true
  },
  {
    id: '6',
    name: 'Chole Bhature',
    description: 'Spicy chickpeas curry served with deep-fried bread',
    price: 10.99,
    image: 'https://media.istockphoto.com/id/979914742/photo/chole-bhature-or-chick-pea-curry-and-fried-puri-served-in-terracotta-crockery-over-white.webp?a=1&b=1&s=612x612&w=0&k=20&c=8pmBVIcNb-GIFnsBT0sYqfy-YtzNq7pOqc6lQZgFOPo=',
    category: 'main_course',
    available: true
  },
  {
    id: '7',
    name: 'Dal Makhani',
    description: 'Slow-cooked black lentils in creamy tomato gravy',
    price: 11.99,
    image: 'https://media.istockphoto.com/id/1170374719/photo/dal-makhani-at-dark-background.webp?a=1&b=1&s=612x612&w=0&k=20&c=FWHhW6SnrLvmwaR-APN3pIxEjLJe073-PQ0cfvOGoTI=',
    category: 'main_course',
    available: true
  },
  {
    id: '8',
    name: 'Gulab Jamun',
    description: 'Soft khoya balls soaked in saffron sugar syrup',
    price: 5.99,
    image: 'https://media.istockphoto.com/id/1188000786/photo/gulab-jamun-in-bowl-on-wooden-background-indian-dessert-or-sweet-dish.webp?a=1&b=1&s=612x612&w=0&k=20&c=4kVDa_BP4pypOSvfDSL2mmLNO3SYdoAs1VG-qi4WAtI=',
    category: 'desserts',
    available: true
  },
  {
    id: '9',
    name: 'Rasgulla',
    description: 'Spongy cottage cheese balls in light sugar syrup',
    price: 5.49,
    image: 'https://images.unsplash.com/photo-1714799263412-2e0c1f875959?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8UmFzZ3VsbGF8ZW58MHx8MHx8fDA%3D',
    category: 'desserts',
    available: true
  },
  {
    id: '10',
    name: 'Masala Chaas',
    description: 'Spiced buttermilk with cumin and coriander',
    price: 2.99,
    image: 'https://media.istockphoto.com/id/1427294117/photo/close-up-of-summer-drink-buttermilk-or-mattha-or-chhachh-glass-garnished-with-coriander-made.webp?a=1&b=1&s=612x612&w=0&k=20&c=5bsoIBQcIu5dZvVw4DunqFLCYT8QIg2NHpJYqjL81uI=',
    category: 'beverages',
    available: true
  },
  {
    id: '11',
    name: 'Fresh Sugarcane Juice',
    description: 'Freshly pressed sugarcane with a hint of lemon and ginger',
    price: 3.99,
    image: 'https://plus.unsplash.com/premium_photo-1695055513638-92886435c7eb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8RnJlc2glMjBTdWdhcmNhbmUlMjBKdWljZXxlbnwwfHwwfHx8MA%3D%3D',
    category: 'beverages',
    available: true
  },
  {
    id: '12',
    name: 'Vegetarian Thali',
    description: 'Assorted Indian vegetarian dishes served in a traditional platter',
    price: 15.99,
    image: 'https://media.istockphoto.com/id/1040749178/photo/thali-meal-indian-food.webp?a=1&b=1&s=612x612&w=0&k=20&c=xx7nRIm-kWAPx8nc4mmcEsULYuztwBXITVskt690ibs=',
    category: 'specials',
    available: true
  }
]

export const mockOrders: Order[] = [
  {
    id: 'order-1',
    userId: 'user-1',
    userName: 'John Doe',
    items: [
      { 
        item: mockFoodItems[0],
        quantity: 2
      },
      {
        item: mockFoodItems[3],
        quantity: 1
      }
    ],
    total: 28.97,
    status: 'delivered',
    paymentStatus: 'completed',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
    updatedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'order-2',
    userId: 'user-1',
    userName: 'John Doe',
    items: [
      {
        item: mockFoodItems[5],
        quantity: 1
      },
      {
        item: mockFoodItems[8],
        quantity: 2
      }
    ],
    total: 27.97,
    status: 'preparing',
    paymentStatus: 'completed',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'order-3',
    userId: 'user-2',
    userName: 'Jane Smith',
    items: [
      {
        item: mockFoodItems[4],
        quantity: 2
      },
      {
        item: mockFoodItems[10],
        quantity: 2
      }
    ],
    total: 35.96,
    status: 'pending',
    paymentStatus: 'completed',
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
    updatedAt: new Date(Date.now() - 25 * 60 * 1000).toISOString()
  }
];

// Mock API function to get all food items
export const fetchFoodItems = async (): Promise<FoodItem[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  return [...mockFoodItems];
};

// Mock API function to get food items by category
export const fetchFoodItemsByCategory = async (category: string): Promise<FoodItem[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  return mockFoodItems.filter(item => item.category === category);
};

// Mock API function to search food items
export const searchFoodItems = async (query: string): Promise<FoodItem[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  const normalizedQuery = query.toLowerCase();
  return mockFoodItems.filter(
    item => 
      item.name.toLowerCase().includes(normalizedQuery) || 
      item.description.toLowerCase().includes(normalizedQuery)
  );
};

// Mock API function to get a food item by ID
export const getFoodItemById = async (id: string): Promise<FoodItem | undefined> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockFoodItems.find(item => item.id === id);
};

// Mock API function to get all orders
export const fetchAllOrders = async (): Promise<Order[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  return [...mockOrders];
};

// Mock API function to get orders by user ID
export const fetchOrdersByUserId = async (userId: string): Promise<Order[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  return mockOrders.filter(order => order.userId === userId);
};

// Mock API function to create a new order
export const createOrder = async (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<Order> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const newOrder: Order = {
    ...order,
    id: `order-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  // In a real app, this would add the order to the database
  mockOrders.push(newOrder);
  
  return newOrder;
};

// Mock API function to update order status
export const updateOrderStatus = async (orderId: string, status: OrderStatus): Promise<Order> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const orderIndex = mockOrders.findIndex(order => order.id === orderId);
  if (orderIndex === -1) {
    throw new Error('Order not found');
  }
  
  mockOrders[orderIndex] = {
    ...mockOrders[orderIndex],
    status,
    updatedAt: new Date().toISOString()
  };
  
  return mockOrders[orderIndex];
};

// Mock API function to add a new food item
export const addFoodItem = async (item: Omit<FoodItem, 'id'>): Promise<FoodItem> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const newItem: FoodItem = {
    ...item,
    id: `food-${Date.now()}`
  };
  
  // In a real app, this would add the item to the database
  mockFoodItems.push(newItem);
  
  return newItem;
};

// Mock API function to update a food item
export const updateFoodItem = async (item: FoodItem): Promise<FoodItem> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const itemIndex = mockFoodItems.findIndex(foodItem => foodItem.id === item.id);
  if (itemIndex === -1) {
    throw new Error('Food item not found');
  }
  
  mockFoodItems[itemIndex] = item;
  
  return item;
};

// Mock API function to delete a food item
export const deleteFoodItem = async (id: string): Promise<boolean> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const itemIndex = mockFoodItems.findIndex(foodItem => foodItem.id === id);
  if (itemIndex === -1) {
    return false;
  }
  
  mockFoodItems.splice(itemIndex, 1);
  
  return true;
};
