
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t mt-10">
      <div className="restaurant-container py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Food Fusion</h3>
            <p className="text-muted-foreground mb-4">
              Delicious food delivered to your doorstep. Explore our menu and enjoy a variety of culinary delights.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-restaurant-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-restaurant-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-restaurant-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-restaurant-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/menu" className="text-muted-foreground hover:text-restaurant-primary transition-colors">
                  Menu
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-muted-foreground hover:text-restaurant-primary transition-colors">
                  Cart
                </Link>
              </li>
              <li>
                <Link to="/orders" className="text-muted-foreground hover:text-restaurant-primary transition-colors">
                  My Orders
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>123 Restaurant Lane</li>
              <li>Foodville, CA 90210</li>
              <li>Phone: (123) 456-7890</li>
              <li>Email: info@foodfusion.com</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Hours</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>Monday - Friday: 10am - 10pm</li>
              <li>Saturday: 11am - 11pm</li>
              <li>Sunday: 11am - 9pm</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t mt-8 pt-6 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Food Fusion. All rights reserved.</p>
          <p className="mt-1">
            <Link to="/privacy" className="hover:text-restaurant-primary transition-colors">
              Privacy Policy
            </Link>
            {" • "}
            <Link to="/terms" className="hover:text-restaurant-primary transition-colors">
              Terms of Service
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
