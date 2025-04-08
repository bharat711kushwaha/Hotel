
# Food Fusion Restaurant Management System

A complete restaurant management system with user and admin functionality.

## Features

### User Features
- Register/Login using JWT
- Browse food menu (dish name, price, image, description)
- Add multiple items to cart with quantity
- View cart & place an order
- Razorpay payment integration
- View order history with live status

### Admin Features
- Admin login (JWT-based)
- Add/Edit/Delete food items
- View all orders with user details
- Update order status (Pending, Preparing, Delivered, Cancelled)

## Tech Stack

### Frontend
- React.js with TypeScript
- Tailwind CSS for styling
- Context API for state management
- React Router for navigation
- Axios for API requests

### Backend
- Node.js + Express.js
- MongoDB with Mongoose
- JWT for authentication
- Bcrypt for password hashing
- Razorpay integration for payments

## Setup Instructions

### Backend Setup
1. Navigate to the backend directory: `cd backend`
2. Install dependencies: `npm install`
3. Create .env file with the following variables:
   ```
   NODE_ENV=development
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   ```
4. Start the backend server: `npm run dev`

### Frontend Setup
1. Navigate to the root directory
2. Install dependencies: `npm install`
3. Start the frontend development server: `npm run dev`

### Running Both (Backend and Frontend)
1. In the backend directory, run: `npm run dev`

## Admin Login Credentials
- Email: admin@restaurant.com
- Password: admin123

## Regular User Login Credentials
- Email: user@example.com
- Password: user123

## API Documentation

### Auth Routes
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login user
- GET /api/auth/profile - Get user profile (Protected)

### Food Routes
- GET /api/food - Get all food items
- GET /api/food/:id - Get food item by ID
- POST /api/food - Create food item (Admin)
- PUT /api/food/:id - Update food item (Admin)
- DELETE /api/food/:id - Delete food item (Admin)

### Order Routes
- POST /api/orders - Create a new order (Protected)
- GET /api/orders/myorders - Get logged in user orders (Protected)
- GET /api/orders/:id - Get order by ID (Protected)
- PUT /api/orders/:id/pay - Update order to paid (Protected)
- PUT /api/orders/:id/status - Update order status (Admin)
- GET /api/orders - Get all orders (Admin)
