
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import FoodCard from '@/components/menu/FoodCard';
import FoodCategoryTabs from '@/components/menu/FoodCategoryTabs';
import { Input } from '@/components/ui/input';
import { FoodCategory, FoodItem } from '@/types';
import { fetchFoodItems, searchFoodItems } from '@/data/mockData';
import { Search } from 'lucide-react';

const Menu: React.FC = () => {
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<FoodItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<FoodCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch all food items on component mount
  useEffect(() => {
    const loadFoodItems = async () => {
      setIsLoading(true);
      try {
        const items = await fetchFoodItems();
        setFoodItems(items);
        setFilteredItems(items);
      } catch (error) {
        console.error('Failed to fetch food items:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadFoodItems();
  }, []);
  
  // Handle category change
  const handleCategoryChange = (category: FoodCategory | 'all') => {
    setActiveCategory(category);
    setSearchQuery(''); // Clear search when changing category
    
    if (category === 'all') {
      setFilteredItems(foodItems);
    } else {
      setFilteredItems(foodItems.filter(item => item.category === category));
    }
  };
  
  // Handle search
  const handleSearch = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);
    
    if (query.trim() === '') {
      // If search is cleared, filter based on active category
      if (activeCategory === 'all') {
        setFilteredItems(foodItems);
      } else {
        setFilteredItems(foodItems.filter(item => item.category === activeCategory));
      }
    } else {
      // Search within the active category
      const results = await searchFoodItems(query);
      if (activeCategory === 'all') {
        setFilteredItems(results);
      } else {
        setFilteredItems(results.filter(item => item.category === activeCategory));
      }
    }
  };
  
  return (
    <Layout>
      <div className="restaurant-container py-8">
        <h1 className="page-title text-center">Our Menu</h1>
        
        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-8 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <Input
            type="text"
            placeholder="Search for dishes..."
            value={searchQuery}
            onChange={handleSearch}
            className="pl-10"
          />
        </div>
        
        {/* Category Tabs */}
        <FoodCategoryTabs 
          activeCategory={activeCategory} 
          onCategoryChange={handleCategoryChange} 
        />
        
        {/* Food Items Grid */}
        {isLoading ? (
          <div className="min-h-[400px] flex items-center justify-center">
            <p className="text-muted-foreground">Loading menu items...</p>
          </div>
        ) : filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map(item => (
              <FoodCard key={item.id} foodItem={item} />
            ))}
          </div>
        ) : (
          <div className="min-h-[200px] flex items-center justify-center">
            <p className="text-muted-foreground">
              {searchQuery ? 'No items matching your search.' : 'No items in this category.'}
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Menu;
