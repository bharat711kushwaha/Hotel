
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { OrderStatus } from '@/types';

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({ status }) => {
  let badgeVariant: 'default' | 'secondary' | 'destructive' | 'outline' = 'default';
  let badgeText = '';
  
  switch (status) {
    case 'pending':
      badgeVariant = 'outline';
      badgeText = 'Pending';
      break;
    case 'preparing':
      badgeVariant = 'secondary';
      badgeText = 'Preparing';
      break;
    case 'delivered':
      badgeVariant = 'default';
      badgeText = 'Delivered';
      break;
    case 'cancelled':
      badgeVariant = 'destructive';
      badgeText = 'Cancelled';
      break;
  }
  
  return (
    <Badge variant={badgeVariant}>{badgeText}</Badge>
  );
};

export default OrderStatusBadge;
