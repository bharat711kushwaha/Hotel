
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FoodCategory } from '@/types';

interface FoodCategoryTabsProps {
  activeCategory: FoodCategory | 'all';
  onCategoryChange: (category: FoodCategory | 'all') => void;
}

const FoodCategoryTabs: React.FC<FoodCategoryTabsProps> = ({ activeCategory, onCategoryChange }) => {
  const categories: Array<{ value: FoodCategory | 'all'; label: string }> = [
    { value: 'all', label: 'All' },
    { value: 'starters', label: 'Starters' },
    { value: 'main_course', label: 'Main Course' },
    { value: 'desserts', label: 'Desserts' },
    { value: 'beverages', label: 'Beverages' },
    { value: 'specials', label: 'Chef\'s Specials' }
  ];
  
  return (
    <Tabs defaultValue={activeCategory} onValueChange={(value) => onCategoryChange(value as FoodCategory | 'all')}>
      <TabsList className="w-full mb-6 overflow-x-auto flex flex-nowrap justify-start sm:justify-center">
        {categories.map((category) => (
          <TabsTrigger 
            key={category.value} 
            value={category.value}
            className="py-2 px-4 data-[state=active]:bg-restaurant-primary data-[state=active]:text-white"
          >
            {category.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};

export default FoodCategoryTabs;
