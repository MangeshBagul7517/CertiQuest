
import React, { createContext, useContext, useState } from 'react';
import { Course } from '@/lib/data';

export interface CartContextType {
  cart: Course[];
  addToCart: (course: Course) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  isInCart: (id: string) => boolean;
  totalItems: number;
}

const CartContext = createContext<CartContextType>({
  cart: [],
  addToCart: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
  isInCart: () => false,
  totalItems: 0,
});

export const useCart = () => useContext(CartContext);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<Course[]>([]);

  const addToCart = (course: Course) => {
    if (isInCart(course.id)) return;
    setCart([...cart, course]);
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  const isInCart = (id: string) => {
    return cart.some(item => item.id === id);
  };
  
  const totalItems = cart.length;

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, isInCart, totalItems }}>
      {children}
    </CartContext.Provider>
  );
};
