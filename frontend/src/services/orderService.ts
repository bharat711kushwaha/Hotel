
import api from './api';
import { CartItem, OrderStatus } from '@/types';

interface CreateOrderPayload {
  items: { itemId: string; quantity: number }[];
  paymentMethod: 'razorpay' | 'cod';
}

export const createOrder = async (orderData: CreateOrderPayload) => {
  const response = await api.post('/orders', orderData);
  return response.data;
};

export const getOrderById = async (id: string) => {
  const response = await api.get(`/orders/${id}`);
  return response.data;
};

export const updateOrderToPaid = async (
  orderId: string, 
  paymentData: { 
    razorpay_payment_id: string; 
    razorpay_order_id: string; 
    razorpay_signature: string 
  }
) => {
  const response = await api.put(`/orders/${orderId}/pay`, paymentData);
  return response.data;
};

export const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
  const response = await api.put(`/orders/${orderId}/status`, { status });
  return response.data;
};

export const getMyOrders = async () => {
  const response = await api.get('/orders/myorders');
  return response.data;
};

export const getAllOrders = async () => {
  const response = await api.get('/orders');
  return response.data;
};
