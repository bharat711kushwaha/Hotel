
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { ShoppingCart, Menu, X, User, LogOut } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { items } = useCart();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="restaurant-container py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-restaurant-primary">
            Food Fusion
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/menu" className="text-foreground hover:text-restaurant-primary transition-colors">
              Menu
            </Link>
            
            {user && (
              <Link to="/orders" className="text-foreground hover:text-restaurant-primary transition-colors">
                My Orders
              </Link>
            )}
            
            {user?.isAdmin && (
              <Link to="/admin" className="text-foreground hover:text-restaurant-primary transition-colors">
                Admin Panel
              </Link>
            )}
            
            {/* Cart */}
            <Link to="/cart" className="relative">
              <ShoppingCart className="h-6 w-6 text-foreground hover:text-restaurant-primary transition-colors" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-restaurant-primary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>
            
            {/* Auth Buttons or User Menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="px-2 py-1.5 text-sm font-medium text-muted-foreground">
                    {user.name}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/orders')}>
                    My Orders
                  </DropdownMenuItem>
                  {user.isAdmin && (
                    <DropdownMenuItem onClick={() => navigate('/admin')}>
                      Admin Panel
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => navigate('/login')}
                >
                  Login
                </Button>
                <Button 
                  size="sm" 
                  onClick={() => navigate('/register')}
                  className="bg-restaurant-primary hover:bg-restaurant-dark text-white"
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-4 md:hidden">
            <Link to="/cart" className="relative">
              <ShoppingCart className="h-6 w-6 text-foreground" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-restaurant-primary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>
            <button onClick={toggleMobileMenu} className="text-foreground">
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="mt-4 pb-4 space-y-4 md:hidden">
            <Link 
              to="/menu" 
              className="block py-2 text-foreground hover:text-restaurant-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Menu
            </Link>
            
            {user && (
              <Link 
                to="/orders" 
                className="block py-2 text-foreground hover:text-restaurant-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                My Orders
              </Link>
            )}
            
            {user?.isAdmin && (
              <Link 
                to="/admin" 
                className="block py-2 text-foreground hover:text-restaurant-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Admin Panel
              </Link>
            )}
            
            {user ? (
              <div className="py-2">
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  Signed in as {user.name}
                </p>
                <Link 
                  to="/profile" 
                  className="block py-2 text-foreground hover:text-restaurant-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profile
                </Link>
                <button 
                  onClick={handleLogout} 
                  className="flex items-center w-full py-2 text-destructive hover:text-destructive/80 transition-colors"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-2">
                <Button 
                  variant="ghost"
                  onClick={() => {
                    navigate('/login');
                    setMobileMenuOpen(false);
                  }}
                >
                  Login
                </Button>
                <Button 
                  onClick={() => {
                    navigate('/register');
                    setMobileMenuOpen(false);
                  }}
                  className="bg-restaurant-primary hover:bg-restaurant-dark text-white"
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
