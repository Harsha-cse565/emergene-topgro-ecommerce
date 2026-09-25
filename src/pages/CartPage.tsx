import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ArrowLeft, ArrowRight, ShoppingBag, ShieldCheck, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext.tsx';

export const CartPage: React.FC = () => {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    deliveryCharge,
    tax,
    grandTotal,
    freeShippingThreshold
  } = useCart();

  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto mb-4">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-stone-900">Your shopping cart is empty</h2>
        <p className="mt-1 text-xs text-stone-500 max-w-sm mx-auto">
          Explore our complete catalogue of 85 fertilizers, crop protection, and agricultural formulations.
        </p>
        <div className="mt-6">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
          >
            <span>Browse Products</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  const freeShippingDifference = freeShippingThreshold - subtotal;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
            Shopping Cart
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            {cart.reduce((sum, i) => sum + i.quantity, 0)} items in your cart
          </p>
        </div>

        <button
          onClick={clearCart}
          className="text-xs font-semibold text-red-600 hover:text-red-800 flex items-center gap-1 cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Cart</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Cart Items Table / List (Stage 8) */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Free Shipping Alert Banner */}
          {freeShippingDifference > 0 ? (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center gap-2">
              <Truck className="w-4 h-4 text-amber-700 shrink-0" />
              <span>
                Add <strong>₹{freeShippingDifference}</strong> more to qualify for <strong>FREE DELIVERY</strong>!
              </span>
            </div>
          ) : (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center gap-2">
              <Truck className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>
                Your order qualifies for <strong>FREE DELIVERY</strong>!
              </span>
            </div>
          )}

          <div className="bg-white rounded-xl border border-stone-200 divide-y divide-stone-100 overflow-hidden shadow-xs">
            {cart.map((item, idx) => {
              const itemTotal = item.priceAvailable ? item.price * item.quantity : null;

              return (
                <div key={`${item.productId}-${item.size}-${idx}`} className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  
                  {/* Thumbnail */}
                  <Link to={`/products/${item.slug}`} className="w-20 h-20 bg-stone-50 rounded-lg p-2 shrink-0 border border-stone-100 flex items-center justify-center">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-contain"
                    />
                  </Link>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <Link to={`/products/${item.slug}`} className="text-sm sm:text-base font-bold text-stone-900 hover:text-emerald-700 transition-colors">
                      {item.name}
                    </Link>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Pack Size: <span className="font-semibold text-stone-800">{item.size}</span>
                    </p>
                    <div className="mt-1">
                      {item.priceAvailable ? (
                        <span className="text-xs font-semibold text-stone-700">
                          ₹{item.price} each
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-amber-700">
                          Price on Request
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Quantity controls */}
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="flex items-center border border-stone-300 rounded-lg overflow-hidden bg-stone-50">
                      <button
                        onClick={() => updateQuantity(item.productId, item.size, item.quantity - 1)}
                        className="px-2.5 py-1 text-stone-600 hover:bg-stone-200 font-bold text-xs"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-xs font-bold text-stone-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1)}
                        className="px-2.5 py-1 text-stone-600 hover:bg-stone-200 font-bold text-xs"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.productId, item.size)}
                      className="p-1.5 text-stone-400 hover:text-red-600 rounded-lg transition-colors ml-2"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Subtotal */}
                  <div className="text-right shrink-0 min-w-[80px]">
                    {itemTotal !== null ? (
                      <span className="text-sm font-black text-stone-900">
                        ₹{itemTotal.toLocaleString('en-IN')}
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-amber-700">
                        Enquiry
                      </span>
                    )}
                  </div>

                </div>
              );
            })}
          </div>

          <div className="pt-2">
            <Link
              to="/products"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Continue Shopping</span>
            </Link>
          </div>

        </div>

        {/* Cart Summary Card (Stage 8) */}
        <div className="lg:col-span-4">
          <div className="bg-white p-5 sm:p-6 rounded-xl border border-stone-200 shadow-xs space-y-4 sticky top-24">
            <h2 className="text-base font-bold text-stone-900 pb-3 border-b border-stone-100">
              Order Summary
            </h2>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal</span>
                <span className="font-semibold text-stone-900">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between text-stone-600">
                <span>Delivery</span>
                {deliveryCharge === 0 ? (
                  <span className="font-bold text-emerald-700">FREE</span>
                ) : (
                  <span className="font-semibold text-stone-900">₹{deliveryCharge}</span>
                )}
              </div>

              <div className="flex justify-between text-stone-600">
                <span>Estimated GST (5%)</span>
                <span className="font-semibold text-stone-900">₹{tax}</span>
              </div>

              <div className="pt-3 border-t border-stone-200 flex justify-between text-sm sm:text-base font-black text-stone-900">
                <span>Grand Total</span>
                <span>₹{grandTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="pt-3">
              <button
                onClick={() => navigate('/checkout')}
                className="w-full py-3.5 px-4 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="pt-2 text-center">
              <p className="text-[11px] text-stone-400 flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                GST Invoice generated upon dispatch
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
