'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [], itemCount: 0, subtotal: 0 });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchCart = useCallback(async () => {
    if (!user) {
      setCart({ items: [], itemCount: 0, subtotal: 0 });
      return;
    }
    try {
      setLoading(true);
      const data = await api.getCart();
      if (data.success) {
        setCart(data.cart);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (productId, quantity = 1) => {
    if (!user) {
      showToast('Veuillez vous connecter pour ajouter au panier.', 'error');
      return { success: false };
    }

    const data = await api.addToCart(productId, quantity);
    if (data.success) {
      setCart(data.cart);
      showToast(data.message);
    } else {
      showToast(data.message || 'Erreur lors de l\'ajout.', 'error');
    }
    return data;
  };

  const updateQuantity = async (productId, quantity) => {
    const data = await api.updateCartItem(productId, quantity);
    if (data.success) {
      setCart(data.cart);
    }
    return data;
  };

  const removeItem = async (productId) => {
    const data = await api.removeFromCart(productId);
    if (data.success) {
      setCart(data.cart);
      showToast('Produit retiré du panier.');
    }
    return data;
  };

  const clearCart = async () => {
    const data = await api.clearCart();
    if (data.success) {
      setCart(data.cart);
    }
    return data;
  };

  return (
    <CartContext.Provider value={{ cart, loading, addToCart, updateQuantity, removeItem, clearCart, fetchCart, toast }}>
      {children}
      {toast && (
        <div className={`toast toast-${toast.type}`}>
          <span>{toast.type === 'success' ? '✓' : '✕'}</span>
          <span style={{ marginLeft: '8px' }}>{toast.message}</span>
        </div>
      )}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
