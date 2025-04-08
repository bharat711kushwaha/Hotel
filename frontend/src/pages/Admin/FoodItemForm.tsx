
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { FoodCategory, FoodItem } from '@/types';
import { addFoodItem, updateFoodItem, getFoodItemById } from '@/data/mockData';
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from "sonner";

interface FormData {
  name: string;
  description: string;
  price: string;
  category: FoodCategory;
  available: boolean;
  image: string;
}

const FoodItemForm: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    price: '',
    category: 'main_course',
    available: true,
    image: '/placeholder.svg'
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    // If user is not logged in or not an admin, redirect to login
    if (!user) {
      navigate('/login', { state: { from: isEditMode ? `/admin/edit-food/${id}` : '/admin/add-food' } });
      return;
    }
    
    if (!user.isAdmin) {
      navigate('/');
      return;
    }
    
    // If in edit mode, fetch food item data
    if (isEditMode && id) {
      const fetchFoodItem = async () => {
        setIsLoading(true);
        try {
          const foodItem = await getFoodItemById(id);
          if (foodItem) {
            setFormData({
              name: foodItem.name,
              description: foodItem.description,
              price: foodItem.price.toString(),
              category: foodItem.category,
              available: foodItem.available,
              image: foodItem.image
            });
          } else {
            toast.error("Food item not found");
            navigate('/admin');
          }
        } catch (error) {
          console.error('Failed to fetch food item:', error);
          toast.error("Failed to load food item");
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchFoodItem();
    }
  }, [user, navigate, id, isEditMode]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (value: string, name: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSwitchChange = (checked: boolean, name: string) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }
    
    if (!formData.description.trim()) {
      toast.error("Description is required");
      return;
    }
    
    const price = parseFloat(formData.price);
    if (isNaN(price) || price <= 0) {
      toast.error("Price must be a positive number");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const foodItemData: Omit<FoodItem, 'id'> = {
        name: formData.name,
        description: formData.description,
        price,
        category: formData.category,
        available: formData.available,
        image: formData.image
      };
      
      if (isEditMode && id) {
        await updateFoodItem({ id, ...foodItemData });
        toast.success("Food item updated successfully");
      } else {
        await addFoodItem(foodItemData);
        toast.success("Food item added successfully");
      }
      
      // Redirect back to admin dashboard
      navigate('/admin');
    } catch (error) {
      console.error('Failed to save food item:', error);
      toast.error(isEditMode ? "Failed to update food item" : "Failed to add food item");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Layout>
      <div className="restaurant-container py-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/admin')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
        
        <h1 className="page-title">{isEditMode ? 'Edit Food Item' : 'Add New Food Item'}</h1>
        
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>{isEditMode ? 'Edit Item Details' : 'New Item Details'}</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="min-h-[300px] flex items-center justify-center">
                <p className="text-muted-foreground">Loading item details...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input 
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Chicken Alfredo Pasta"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="e.g. Fettuccine pasta with creamy alfredo sauce and grilled chicken"
                    required
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price ($)</Label>
                    <Input 
                      id="price"
                      name="price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="e.g. 12.99"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select 
                      value={formData.category} 
                      onValueChange={(value) => handleSelectChange(value, 'category')}
                    >
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="starters">Starters</SelectItem>
                        <SelectItem value="main_course">Main Course</SelectItem>
                        <SelectItem value="desserts">Desserts</SelectItem>
                        <SelectItem value="beverages">Beverages</SelectItem>
                        <SelectItem value="specials">Chef's Specials</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="available"
                    checked={formData.available}
                    onCheckedChange={(checked) => handleSwitchChange(checked, 'available')}
                  />
                  <Label htmlFor="available">Item is available</Label>
                </div>
                
                <div className="pt-4">
                  <Button 
                    type="submit" 
                    className="w-full bg-restaurant-primary hover:bg-restaurant-dark text-white"
                    disabled={isSubmitting}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {isSubmitting ? 'Saving...' : 'Save Food Item'}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default FoodItemForm;
