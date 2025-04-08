const dotenv = require('dotenv');
const Order = require('../models/Order');
const FoodItem = require('../models/FoodItem');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const mongoose = require('mongoose'); // Import mongoose for ObjectId validation

dotenv.config();
// Initialize Razorpay with error handling
let razorpay;
try {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_b7xXFHwa5522AQ",
    key_secret: process.env.RAZORPAY_KEY_SECRET || "your_razorpay_key_secret",
  });
} catch (error) {
  console.error('Failed to initialize Razorpay:', error.message);
  console.error('Please check your Razorpay API keys in the .env file');
}

// Helper function to check if a string is a valid ObjectId
const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  try {
    const { items, paymentMethod } = req.body;
    
    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }
    
    // Validate all item IDs first
    const validItemIds = [];
    const invalidItemIds = [];
    
    for (const item of items) {
      if (isValidObjectId(item.itemId)) {
        validItemIds.push(mongoose.Types.ObjectId(item.itemId));
      } else {
        invalidItemIds.push(item.itemId);
      }
    }
    
    if (invalidItemIds.length > 0) {
      return res.status(400).json({ 
        message: 'Invalid food item IDs', 
        invalidIds: invalidItemIds 
      });
    }
    
    // Fetch food items from DB to get current prices
    const foodItems = await FoodItem.find({ _id: { $in: validItemIds } });
    
    // Check if all items were found
    if (foodItems.length !== validItemIds.length) {
      return res.status(404).json({ 
        message: 'Some food items were not found' 
      });
    }
    
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
      // Check if Razorpay is properly initialized
      if (!razorpay) {
        return res.status(500).json({ 
          message: 'Payment service is not available. Please try Cash on Delivery or contact support.' 
        });
      }
      
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
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Verify Razorpay payment
// @route   POST /api/orders/verify
// @access  Private
const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    
    // Find the order by payment ID
    const order = await Order.findOne({ paymentId: razorpay_order_id });
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Verify signature
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || "your_razorpay_key_secret")
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');
    
    if (generatedSignature === razorpay_signature) {
      // Payment verified successfully
      order.paymentStatus = 'completed';
      order.status = 'processing';
      order.transactionId = razorpay_payment_id;
      await order.save();
      
      res.status(200).json({
        success: true,
        message: 'Payment verified successfully',
        order
      });
    } else {
      order.paymentStatus = 'failed';
      await order.save();
      
      res.status(400).json({
        success: false,
        message: 'Payment verification failed'
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all food items
// @route   GET /api/foods
// @access  Public
const getFoodItems = async (req, res) => {
  try {
    const foodItems = await FoodItem.find({});
    res.json(foodItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get food item by ID
// @route   GET /api/foods/:id
// @access  Public
const getFoodItemById = async (req, res) => {
  try {
    const id = req.params.id;
    
    // Check if the ID is a valid ObjectId
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid food item ID format' });
    }
    
    const foodItem = await FoodItem.findById(id);
    
    if (foodItem) {
      res.json(foodItem);
    } else {
      res.status(404).json({ message: 'Food item not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create a food item
// @route   POST /api/foods
// @access  Private/Admin
const createFoodItem = async (req, res) => {
  try {
    const { name, description, price, image, category, isVeg } = req.body;
    
    const foodItem = new FoodItem({
      name,
      description,
      price,
      image,
      category,
      isVeg
    });
    
    const createdFoodItem = await foodItem.save();
    res.status(201).json(createdFoodItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update a food item
// @route   PUT /api/foods/:id
// @access  Private/Admin
const updateFoodItem = async (req, res) => {
  try {
    const id = req.params.id;
    
    // Check if the ID is a valid ObjectId
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid food item ID format' });
    }
    
    const { name, description, price, image, category, isVeg } = req.body;
    
    const foodItem = await FoodItem.findById(id);
    
    if (foodItem) {
      foodItem.name = name || foodItem.name;
      foodItem.description = description || foodItem.description;
      foodItem.price = price || foodItem.price;
      foodItem.image = image || foodItem.image;
      foodItem.category = category || foodItem.category;
      foodItem.isVeg = isVeg !== undefined ? isVeg : foodItem.isVeg;
      
      const updatedFoodItem = await foodItem.save();
      res.json(updatedFoodItem);
    } else {
      res.status(404).json({ message: 'Food item not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete a food item
// @route   DELETE /api/foods/:id
// @access  Private/Admin
const deleteFoodItem = async (req, res) => {
  try {
    const id = req.params.id;
    
    // Check if the ID is a valid ObjectId
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid food item ID format' });
    }
    
    const foodItem = await FoodItem.findById(id);
    
    if (foodItem) {
      await FoodItem.deleteOne({ _id: foodItem._id });
      res.json({ message: 'Food item removed' });
    } else {
      res.status(404).json({ message: 'Food item not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getFoodItems,
  getFoodItemById,
  createFoodItem,
  updateFoodItem,
  deleteFoodItem,
  createOrder,
  verifyPayment
};