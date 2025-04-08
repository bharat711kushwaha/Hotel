
const express = require('express');
const { 
  getFoodItems, 
  getFoodItemById, 
  createFoodItem, 
  updateFoodItem, 
  deleteFoodItem 
} = require('../controllers/foodController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .get(getFoodItems)
  .post(protect, admin, createFoodItem);

router.route('/:id')
  .get(getFoodItemById)
  .put(protect, admin, updateFoodItem)
  .delete(protect, admin, deleteFoodItem);

module.exports = router;
