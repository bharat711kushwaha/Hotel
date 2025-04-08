
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { OrderStatus, Order, FoodItem } from '@/types';
import { fetchAllOrders, updateOrderStatus, fetchFoodItems } from '@/data/mockData';
import OrderStatusBadge from '@/components/orders/OrderStatusBadge';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Utensils, 
  Clock, 
  Check, 
  X, 
  AlertCircle,
  Plus
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from "sonner";

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // If user is not logged in or not an admin, redirect to login
    if (!user) {
      navigate('/login', { state: { from: '/admin' } });
      return;
    }
    
    if (!user.isAdmin) {
      navigate('/');
      return;
    }
    
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch orders and food items in parallel
        const [ordersData, foodItemsData] = await Promise.all([
          fetchAllOrders(),
          fetchFoodItems()
        ]);
        
        setOrders(ordersData);
        setFoodItems(foodItemsData);
      } catch (error) {
        console.error('Failed to fetch admin data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [user, navigate]);
  
  const handleStatusUpdate = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const updatedOrder = await updateOrderStatus(orderId, newStatus);
      
      // Update the order in the local state
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId ? updatedOrder : order
        )
      );
      
      toast.success(`Order status updated to ${newStatus}`, {
        description: `Order #${orderId.substring(orderId.length - 6)} status has been updated.`
      });
    } catch (error) {
      toast.error("Failed to update order status", {
        description: "Please try again later."
      });
    }
  };
  
  // Filter orders by status for the tabs
  const pendingOrders = orders.filter(order => order.status === 'pending');
  const preparingOrders = orders.filter(order => order.status === 'preparing');
  const completedOrders = orders.filter(order => 
    order.status === 'delivered' || order.status === 'cancelled'
  );
  
  const formatDate = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };
  
  // Dashboard statistics
  const totalSales = orders
    .filter(order => order.status !== 'cancelled')
    .reduce((sum, order) => sum + order.total, 0);
  
  const totalOrders = orders.length;
  const totalItems = foodItems.length;
  const pendingCount = pendingOrders.length;
  
  return (
    <Layout>
      <div className="restaurant-container py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <h1 className="page-title flex items-center mb-4 md:mb-0">
            <LayoutDashboard className="mr-2 h-8 w-8 text-restaurant-primary" />
            Admin Dashboard
          </h1>
          
          <div>
            <Button 
              className="bg-restaurant-primary hover:bg-restaurant-dark text-white"
              onClick={() => navigate('/admin/add-food')}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add New Food Item
            </Button>
          </div>
        </div>
        
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalSales.toFixed(2)}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalOrders}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Menu Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalItems}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingCount}</div>
            </CardContent>
          </Card>
        </div>
        
        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="orders" className="data-[state=active]:bg-restaurant-primary data-[state=active]:text-white">
              <ShoppingBag className="mr-2 h-4 w-4" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="menu" className="data-[state=active]:bg-restaurant-primary data-[state=active]:text-white">
              <Utensils className="mr-2 h-4 w-4" />
              Menu Items
            </TabsTrigger>
          </TabsList>
          
          {/* Orders Tab Content */}
          <TabsContent value="orders" className="space-y-6">
            {isLoading ? (
              <div className="min-h-[400px] flex items-center justify-center">
                <p className="text-muted-foreground">Loading orders...</p>
              </div>
            ) : (
              <Tabs defaultValue="pending">
                <TabsList className="mb-4">
                  <TabsTrigger value="pending" className="relative">
                    Pending
                    {pendingOrders.length > 0 && (
                      <Badge className="ml-2 bg-restaurant-primary">{pendingOrders.length}</Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="preparing" className="relative">
                    Preparing
                    {preparingOrders.length > 0 && (
                      <Badge className="ml-2 bg-restaurant-secondary">{preparingOrders.length}</Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="completed">
                    Completed
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="pending" className="space-y-4">
                  {pendingOrders.length > 0 ? (
                    pendingOrders.map(order => (
                      <Card key={order.id}>
                        <CardContent className="p-6">
                          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4">
                            <div>
                              <div className="flex items-center space-x-2 mb-2">
                                <h3 className="font-semibold">Order #{order.id.substring(order.id.length - 6)}</h3>
                                <OrderStatusBadge status={order.status} />
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">
                                Placed {formatDate(order.createdAt)} by {order.userName}
                              </p>
                              <p className="font-medium">${order.total.toFixed(2)}</p>
                            </div>
                            
                            <div className="flex flex-wrap gap-2 mt-4 lg:mt-0">
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="flex-1 lg:flex-none"
                                onClick={() => handleStatusUpdate(order.id, 'preparing')}
                              >
                                <Clock className="mr-2 h-4 w-4" />
                                Mark as Preparing
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="flex-1 lg:flex-none text-destructive border-destructive hover:bg-destructive/10"
                                onClick={() => handleStatusUpdate(order.id, 'cancelled')}
                              >
                                <X className="mr-2 h-4 w-4" />
                                Cancel Order
                              </Button>
                            </div>
                          </div>
                          
                          <Separator className="mb-4" />
                          
                          <div>
                            <h4 className="text-sm font-medium mb-2">Items</h4>
                            <ul className="space-y-1">
                              {order.items.map(item => (
                                <li key={item.item.id} className="text-sm text-muted-foreground">
                                  {item.quantity}x {item.item.name} (${item.item.price.toFixed(2)} each)
                                </li>
                              ))}
                            </ul>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No pending orders at the moment.</p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="preparing" className="space-y-4">
                  {preparingOrders.length > 0 ? (
                    preparingOrders.map(order => (
                      <Card key={order.id}>
                        <CardContent className="p-6">
                          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4">
                            <div>
                              <div className="flex items-center space-x-2 mb-2">
                                <h3 className="font-semibold">Order #{order.id.substring(order.id.length - 6)}</h3>
                                <OrderStatusBadge status={order.status} />
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">
                                Placed {formatDate(order.createdAt)} by {order.userName}
                              </p>
                              <p className="font-medium">${order.total.toFixed(2)}</p>
                            </div>
                            
                            <div className="flex flex-wrap gap-2 mt-4 lg:mt-0">
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="flex-1 lg:flex-none"
                                onClick={() => handleStatusUpdate(order.id, 'delivered')}
                              >
                                <Check className="mr-2 h-4 w-4" />
                                Mark as Delivered
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="flex-1 lg:flex-none text-destructive border-destructive hover:bg-destructive/10"
                                onClick={() => handleStatusUpdate(order.id, 'cancelled')}
                              >
                                <X className="mr-2 h-4 w-4" />
                                Cancel Order
                              </Button>
                            </div>
                          </div>
                          
                          <Separator className="mb-4" />
                          
                          <div>
                            <h4 className="text-sm font-medium mb-2">Items</h4>
                            <ul className="space-y-1">
                              {order.items.map(item => (
                                <li key={item.item.id} className="text-sm text-muted-foreground">
                                  {item.quantity}x {item.item.name} (${item.item.price.toFixed(2)} each)
                                </li>
                              ))}
                            </ul>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No orders being prepared at the moment.</p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="completed" className="space-y-4">
                  {completedOrders.length > 0 ? (
                    completedOrders.map(order => (
                      <Card key={order.id}>
                        <CardContent className="p-6">
                          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4">
                            <div>
                              <div className="flex items-center space-x-2 mb-2">
                                <h3 className="font-semibold">Order #{order.id.substring(order.id.length - 6)}</h3>
                                <OrderStatusBadge status={order.status} />
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">
                                Placed {formatDate(order.createdAt)} by {order.userName}
                              </p>
                              <p className="font-medium">${order.total.toFixed(2)}</p>
                            </div>
                          </div>
                          
                          <Separator className="mb-4" />
                          
                          <div>
                            <h4 className="text-sm font-medium mb-2">Items</h4>
                            <ul className="space-y-1">
                              {order.items.map(item => (
                                <li key={item.item.id} className="text-sm text-muted-foreground">
                                  {item.quantity}x {item.item.name} (${item.item.price.toFixed(2)} each)
                                </li>
                              ))}
                            </ul>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No completed orders yet.</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            )}
          </TabsContent>
          
          {/* Menu Items Tab Content */}
          <TabsContent value="menu">
            {isLoading ? (
              <div className="min-h-[400px] flex items-center justify-center">
                <p className="text-muted-foreground">Loading menu items...</p>
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="section-title mb-0">Menu Items ({foodItems.length})</h2>
                  <Button 
                    onClick={() => navigate('/admin/add-food')}
                    className="bg-restaurant-primary hover:bg-restaurant-dark text-white"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Item
                  </Button>
                </div>
                
                <div className="rounded-md border">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="p-3 text-left font-medium">Name</th>
                        <th className="p-3 text-left font-medium hidden md:table-cell">Category</th>
                        <th className="p-3 text-left font-medium">Price</th>
                        <th className="p-3 text-left font-medium hidden md:table-cell">Status</th>
                        <th className="p-3 text-left font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {foodItems.map(item => (
                        <tr key={item.id} className="border-b">
                          <td className="p-3">
                            <div className="flex items-center space-x-3">
                              <div className="h-10 w-10 bg-muted rounded-md overflow-hidden">
                                <img 
                                  src={item.image} 
                                  alt={item.name} 
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div>
                                <div className="font-medium">{item.name}</div>
                                <div className="text-xs text-muted-foreground md:hidden">
                                  {item.category.replace('_', ' ')}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="p-3 hidden md:table-cell capitalize">
                            {item.category.replace('_', ' ')}
                          </td>
                          <td className="p-3 font-medium">
                            ${item.price.toFixed(2)}
                          </td>
                          <td className="p-3 hidden md:table-cell">
                            <Badge variant={item.available ? 'default' : 'secondary'}>
                              {item.available ? 'Available' : 'Unavailable'}
                            </Badge>
                          </td>
                          <td className="p-3">
                            <div className="flex space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => navigate(`/admin/edit-food/${item.id}`)}
                              >
                                Edit
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
