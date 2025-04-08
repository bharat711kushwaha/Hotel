
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AuthState, User } from '@/types';
import { toast } from "sonner";
import * as authService from '../services/authService';

// Auth Actions
type AuthAction = 
  | { type: 'LOGIN_REQUEST' }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'REGISTER_REQUEST' }
  | { type: 'REGISTER_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'REGISTER_FAILURE'; payload: string }
  | { type: 'LOGOUT' };

// Initial state
const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: false,
  error: null
};

// Auth Reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_REQUEST':
    case 'REGISTER_REQUEST':
      return {
        ...state,
        isLoading: true,
        error: null
      };
    case 'LOGIN_SUCCESS':
    case 'REGISTER_SUCCESS':
      return {
        ...state,
        isLoading: false,
        user: action.payload.user,
        token: action.payload.token,
        error: null
      };
    case 'LOGIN_FAILURE':
    case 'REGISTER_FAILURE':
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };
    case 'LOGOUT':
      return {
        ...initialState
      };
    default:
      return state;
  }
};

// Auth Context
interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load auth state from localStorage on initial render
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser && storedToken) {
      try {
        const user = JSON.parse(storedUser);
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: { user, token: storedToken }
        });
      } catch (error) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
  }, []);

  // Update localStorage when auth state changes
  useEffect(() => {
    if (state.user && state.token) {
      localStorage.setItem('user', JSON.stringify(state.user));
      localStorage.setItem('token', state.token);
    } else {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  }, [state.user, state.token]);

  // Login function
  const login = async (email: string, password: string) => {
    dispatch({ type: 'LOGIN_REQUEST' });
    try {
      const result = await authService.login(email, password);
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          user: {
            id: result._id,
            name: result.name,
            email: result.email,
            isAdmin: result.isAdmin
          },
          token: result.token
        }
      });
      toast.success("Login successful");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: errorMessage
      });
      toast.error("Login failed");
    }
  };

  // Register function
  const register = async (name: string, email: string, password: string) => {
    dispatch({ type: 'REGISTER_REQUEST' });
    try {
      const result = await authService.register(name, email, password);
      dispatch({
        type: 'REGISTER_SUCCESS',
        payload: {
          user: {
            id: result._id,
            name: result.name,
            email: result.email,
            isAdmin: result.isAdmin
          },
          token: result.token
        }
      });
      toast.success("Registration successful");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      dispatch({
        type: 'REGISTER_FAILURE',
        payload: errorMessage
      });
      toast.error("Registration failed");
    }
  };

  // Logout function
  const logout = () => {
    dispatch({ type: 'LOGOUT' });
    toast.info("Logged out successfully");
  };

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
