
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { ArrowRight, UtensilsCrossed } from 'lucide-react';
import { mockFoodItems } from '@/data/mockData';
import FoodCard from '@/components/menu/FoodCard';

const Home: React.FC = () => {
  // Get featured food items (just showing a few items from different categories)
  const featuredItems = mockFoodItems.filter(item => 
    ['1', '5', '8', '12'].includes(item.id)
  );
  
  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-restaurant-background py-16 md:py-24">
        <div className="restaurant-container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Experience Culinary Excellence at Food Fusion
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Discover a world of flavors with our curated menu, prepared by expert chefs and delivered to your doorstep.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button 
                size="lg" 
                className="bg-restaurant-primary hover:bg-restaurant-dark text-white"
                asChild
              >
                <Link to="/menu">
                  View Our Menu
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                asChild
              >
                <Link to="/register">
                  Sign Up for Free
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Items Section */}
      <section className="py-16">
        <div className="restaurant-container">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              <UtensilsCrossed className="inline-block mr-2 h-7 w-7 text-restaurant-primary" />
              Featured Dishes
            </h2>
            <Button 
              variant="link" 
              className="text-restaurant-primary"
              asChild
            >
              <Link to="/menu">
                View All
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredItems.map(item => (
              <FoodCard key={item.id} foodItem={item} />
            ))}
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-16 bg-muted">
        <div className="restaurant-container">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-12">
            How It Works
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card rounded-lg p-6 text-center">
              <div className="w-16 h-16 bg-restaurant-primary rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-3">Browse Our Menu</h3>
              <p className="text-muted-foreground">
                Explore our wide selection of delicious meals, sides, and beverages.
              </p>
            </div>
            
            <div className="bg-card rounded-lg p-6 text-center">
              <div className="w-16 h-16 bg-restaurant-primary rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-3">Place Your Order</h3>
              <p className="text-muted-foreground">
                Add items to your cart, customize as needed, and check out securely.
              </p>
            </div>
            
            <div className="bg-card rounded-lg p-6 text-center">
              <div className="w-16 h-16 bg-restaurant-primary rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-3">Enjoy Your Food</h3>
              <p className="text-muted-foreground">
                Track your order in real-time and enjoy our delicious food when it arrives.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Call To Action */}
      <section className="py-16 bg-restaurant-primary">
        <div className="restaurant-container text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
            Ready to Order?
          </h2>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto">
            Join our community of food enthusiasts and start enjoying our delicious meals today.
          </p>
          <Button 
            size="lg" 
            className="bg-white text-restaurant-primary hover:bg-white/90"
            asChild
          >
            <Link to="/menu">
              Order Now
            </Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
