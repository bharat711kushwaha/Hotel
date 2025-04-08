
const Order = require('../models/Order');
const FoodItem = require('../models/FoodItem');
const Razorpay = require('razorpay');
const crypto = require('crypto');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  try {
    const { items, paymentMethod } = req.body;
    
    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }
    
    // Fetch food items from DB to get current prices
    const itemIds = items.map(item => item.itemId);
    const foodItems = await FoodItem.find({ _id: { $in: itemIds } });
    
    // Map food items with quantities and calculate total
    const orderItems = [];
    let totalAmount = 0;
    
    for (const item of items) {
      const foodItem = foodItems.find(f => f._id.toString() === item.itemId);
      
      if (!foodItem) {
        return res.status(404).json({ message: `Food item ${item.itemId} not found` });
      }
      
      orderItems.push({
        foodItem: foodItem._id,
        name: foodItem.name,
        price: foodItem.price,
        quantity: item.quantity,
      });
      
      totalAmount += foodItem.price * item.quantity;
    }
    
    // Create order in database
    const order = new Order({
      user: req.user._id,
      userName: req.user.name,
      items: orderItems,
      total: totalAmount,
      status: 'pending',
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending',
    });
    
    // If payment method is Razorpay, create payment order
    if (paymentMethod === 'razorpay') {
      const options = {
        amount: totalAmount * 100, // Razorpay accepts amount in paise
        currency: 'INR',
        receipt: `order_${Date.now()}`,
      };
      
      const razorpayOrder = await razorpay.orders.create(options);
      
      // Save order with payment details
      order.paymentId = razorpayOrder.id;
      const createdOrder = await order.save();
      
      res.status(201).json({
        orderId: createdOrder._id,
        razorpayOrder,
      });
    } else {
      // For COD, just save the order
      const createdOrder = await order.save();
      res.status(201).json(createdOrder);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (order) {
      // Check if user is admin or the order belongs to the user
      if (req.user.isAdmin || order.user.toString() === req.user._id.toString()) {
        res.json(order);
      } else {
        res.status(403).json({ message: 'Not authorized to access this order' });
      }
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = async (req, res) => {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Verify Razorpay signature
    const body = order.paymentId + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");
      
    const isAuthentic = expectedSignature === razorpay_signature;
    
    if (isAuthentic) {
      order.paymentStatus = 'completed';
      order.status = 'preparing';
      order.updatedAt = Date.now();
      
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(400).json({ message: 'Payment verification failed' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    const order = await Order.findById(req.params.id);
    
    if (order) {
      order.status = status;
      order.updatedAt = Date.now();
      
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user', 'name').sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createOrder,
  getOrderById,
  updateOrderToPaid,
  updateOrderStatus,
  getMyOrders,
  getOrders,
};
