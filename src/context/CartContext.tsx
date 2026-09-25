import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product, PackSize } from '../types/index.ts';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, selectedPackSize?: PackSize, quantity?: number) => void;
  updateQuantity: (productId: string, size: string, quantity: number) => void;
  removeFromCart: (productId: string, size: string) => void;
  clearCart: () => void;
  cartCount: number;
  subtotal: number;
  deliveryCharge: number;
  tax: number;
  grandTotal: number;
  freeShippingThreshold: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('et_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('et_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cart]);

  const addToCart = (product: Product, selectedPackSize?: PackSize, quantity: number = 1) => {
    const size = selectedPackSize ? selectedPackSize.size : (product.packSizes && product.packSizes.length > 0 ? product.packSizes[0].size : 'Standard');
    const price = selectedPackSize ? selectedPackSize.price : (product.packSizes && product.packSizes.length > 0 ? product.packSizes[0].price : product.startingPrice);
    const priceAvailable = selectedPackSize ? selectedPackSize.priceAvailable : product.priceAvailable;

    setCart(prev => {
      const existingIndex = prev.findIndex(item => item.productId === product._id && item.size === size);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [
          ...prev,
          {
            productId: product._id,
            name: product.name,
            slug: product.slug,
            size,
            price,
            priceAvailable,
            quantity,
            image: product.images && product.images.length > 0 ? product.images[0] : '/images/products/placeholder.svg'
          }
        ];
      }
    });
  };

  const updateQuantity = (productId: string, size: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, size);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.productId === productId && item.size === size
          ? { ...item, quantity }
          : item
      )
    );
  };

  const removeFromCart = (productId: string, size: string) => {
    setCart(prev => prev.filter(item => !(item.productId === productId && item.size === size)));
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Subtotal considers items where price is available
  const subtotal = cart.reduce((sum, item) => {
    return sum + (item.priceAvailable ? item.price * item.quantity : 0);
  }, 0);

  const freeShippingThreshold = 1500;
  const deliveryCharge = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 80;
  const tax = Math.round(subtotal * 0.05 * 100) / 100; // 5% GST on fertilizers / agro inputs
  const grandTotal = Math.round((subtotal + deliveryCharge + tax) * 100) / 100;

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        subtotal,
        deliveryCharge,
        tax,
        grandTotal,
        freeShippingThreshold
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
