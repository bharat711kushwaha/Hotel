
import api from './api';
import { FoodItem, FoodCategory } from '@/types';

export const getAllFoodItems = async (category?: FoodCategory) => {
  const response = await api.get('/food', { 
    params: category && category !== 'all' ? { category } : {} 
  });
  return response.data;
};

export const getFoodItemById = async (id: string) => {
  const response = await api.get(`/food/${id}`);
  return response.data;
};

export const createFoodItem = async (foodItem: Omit<FoodItem, 'id'>) => {
  const response = await api.post('/food', foodItem);
  return response.data;
};

export const updateFoodItem = async (id: string, foodItem: Partial<FoodItem>) => {
  const response = await api.put(`/food/${id}`, foodItem);
  return response.data;
};

export const deleteFoodItem = async (id: string) => {
  const response = await api.delete(`/food/${id}`);
  return response.data;
};
