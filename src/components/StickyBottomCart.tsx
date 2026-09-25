import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext.tsx';

export const StickyBottomCart: React.FC = () => {
  const { cartCount, subtotal } = useCart();
  const location = useLocation();

  // Hide on cart, checkout, and admin pages
  if (
    cartCount === 0 ||
    location.pathname.startsWith('/cart') ||
    location.pathname.startsWith('/checkout') ||
    location.pathname.startsWith('/admin')
  ) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 p-3 bg-white/95 backdrop-blur-md border-t border-stone-200 shadow-lg md:hidden">
      <div className="max-w-md mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="relative p-2 bg-emerald-100 text-emerald-800 rounded-lg">
            <ShoppingBag className="w-5 h-5" />
            <span className="absolute -top-1.5 -right-1.5 bg-emerald-700 text-white font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
              {cartCount}
            </span>
          </div>
          <div>
            <p className="text-[11px] text-stone-500 font-medium">Cart Total</p>
            <p className="text-sm font-bold text-stone-900">
              {subtotal > 0 ? `₹${subtotal.toLocaleString('en-IN')}` : 'Enquiry items'}
            </p>
          </div>
        </div>

        <Link
          to="/cart"
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-bold text-xs rounded-lg shadow-sm transition-colors"
        >
          <span>View Cart</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
