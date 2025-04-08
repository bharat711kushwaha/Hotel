
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { OrderStatus, Order } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { fetchOrdersByUserId } from '@/data/mockData';
import OrderStatusBadge from '@/components/orders/OrderStatusBadge';
import { ClipboardList, ChevronRight, ShoppingBag } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { formatDistanceToNow } from 'date-fns';

const Orders: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // If user is not logged in, redirect to login
    if (!user) {
      navigate('/login', { state: { from: '/orders' } });
      return;
    }
    
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        const userOrders = await fetchOrdersByUserId(user.id);
        setOrders(userOrders);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOrders();
  }, [user, navigate]);
  
  // Group orders by status
  const activeOrders = orders.filter(order => 
    order.status === 'pending' || order.status === 'preparing'
  ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  
  const pastOrders = orders.filter(order => 
    order.status === 'delivered' || order.status === 'cancelled'
  ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  
  const formatDate = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };
  
  return (
    <Layout>
      <div className="restaurant-container py-8">
        <h1 className="page-title flex items-center">
          <ClipboardList className="mr-2 h-8 w-8 text-restaurant-primary" />
          My Orders
        </h1>
        
        {isLoading ? (
          <div className="min-h-[400px] flex items-center justify-center">
            <p className="text-muted-foreground">Loading orders...</p>
          </div>
        ) : orders.length > 0 ? (
          <div className="space-y-8">
            {/* Active Orders */}
            <div>
              <h2 className="section-title">Active Orders</h2>
              {activeOrders.length > 0 ? (
                <div className="space-y-4">
                  {activeOrders.map(order => (
                    <Card key={order.id} className="card-hover">
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                          <div>
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="font-semibold">Order #{order.id.substring(order.id.length - 6)}</h3>
                              <OrderStatusBadge status={order.status} />
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Placed {formatDate(order.createdAt)}
                            </p>
                          </div>
                          <div className="flex items-center mt-3 md:mt-0">
                            <p className="font-semibold text-lg mr-4">${order.total.toFixed(2)}</p>
                            <Button variant="ghost" size="sm" className="text-restaurant-primary">
                              Details
                              <ChevronRight className="ml-1 h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <Separator className="mb-4" />
                        
                        <div>
                          <h4 className="text-sm font-medium mb-2">Items</h4>
                          <ul className="space-y-1">
                            {order.items.map(item => (
                              <li key={item.item.id} className="text-sm text-muted-foreground">
                                {item.quantity}x {item.item.name}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="bg-muted/50">
                  <CardContent className="p-6 text-center">
                    <p className="text-muted-foreground">You have no active orders.</p>
                  </CardContent>
                </Card>
              )}
            </div>
            
            {/* Past Orders */}
            <div>
              <h2 className="section-title">Past Orders</h2>
              {pastOrders.length > 0 ? (
                <div className="space-y-4">
                  {pastOrders.map(order => (
                    <Card key={order.id} className="card-hover">
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                          <div>
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="font-semibold">Order #{order.id.substring(order.id.length - 6)}</h3>
                              <OrderStatusBadge status={order.status} />
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Placed {formatDate(order.createdAt)}
                            </p>
                          </div>
                          <div className="flex items-center mt-3 md:mt-0">
                            <p className="font-semibold text-lg mr-4">${order.total.toFixed(2)}</p>
                            <Button variant="ghost" size="sm" className="text-restaurant-primary">
                              Details
                              <ChevronRight className="ml-1 h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <Separator className="mb-4" />
                        
                        <div>
                          <h4 className="text-sm font-medium mb-2">Items</h4>
                          <ul className="space-y-1">
                            {order.items.map(item => (
                              <li key={item.item.id} className="text-sm text-muted-foreground">
                                {item.quantity}x {item.item.name}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="bg-muted/50">
                  <CardContent className="p-6 text-center">
                    <p className="text-muted-foreground">You have no past orders.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="inline-flex justify-center items-center w-24 h-24 bg-muted rounded-full mb-6">
              <ShoppingBag className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">No orders yet</h2>
            <p className="text-muted-foreground mb-6">You haven't placed any orders yet.</p>
            <Button 
              className="bg-restaurant-primary hover:bg-restaurant-dark text-white"
              onClick={() => navigate('/menu')}
            >
              Browse Menu
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Orders;
