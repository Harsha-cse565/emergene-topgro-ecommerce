import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  CreditCard,
  Truck,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowLeft,
  Smartphone,
  Building2,
  Banknote
} from 'lucide-react';
import { useCart } from '../context/CartContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { api } from '../services/api.ts';
import { Settings } from '../types/index.ts';

interface CheckoutFormData {
  fullName: string;
  mobile: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
  paymentMethod: string;
  notes?: string;
}

export const CheckoutPage: React.FC = () => {
  const { cart, subtotal, deliveryCharge, tax, grandTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [settings, setSettings] = useState<Settings | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<CheckoutFormData>({
    defaultValues: {
      fullName: user?.name || '',
      email: user?.email || '',
      mobile: user?.phone || '',
      address: user?.addresses?.[0]?.address || '',
      city: user?.addresses?.[0]?.city || '',
      state: user?.addresses?.[0]?.state || 'Karnataka',
      pinCode: user?.addresses?.[0]?.pinCode || '',
      paymentMethod: 'UPI'
    }
  });

  const selectedPaymentMethod = watch('paymentMethod');

  useEffect(() => { api.getSettings().then(setSettings).catch(() => {}); }, []);

  if (cart.length === 0) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white border border-stone-200 rounded-xl text-center">
        <h2 className="text-lg font-bold text-stone-900 mb-2">No items to checkout</h2>
        <p className="text-xs text-stone-500 mb-6">
          Your cart is currently empty. Please add agricultural products first.
        </p>
        <Link
          to="/products"
          className="px-4 py-2 bg-emerald-700 text-white font-bold text-xs rounded-lg hover:bg-emerald-800"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  const onSubmit = async (data: CheckoutFormData) => {
    setSubmitting(true);
    setErrorMessage(null);
    try {
      const orderPayload = {
        customer: {
          userId: user?.id,
          name: data.fullName,
          email: data.email,
          phone: data.mobile
        },
        items: cart,
        shippingAddress: {
          fullName: data.fullName,
          phone: data.mobile,
          address: data.address,
          city: data.city,
          state: data.state,
          pinCode: data.pinCode
        },
        subtotal,
        deliveryCharge,
        tax,
        total: grandTotal,
        paymentMethod: data.paymentMethod,
        paymentStatus: data.paymentMethod === 'Cash on Delivery' ? 'Pending' : 'Paid'
      };

      const createdOrder = await api.createOrder(orderPayload);
      clearCart();
      navigate(`/order-confirmation/${createdOrder.orderNumber}`);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      <div className="mb-6 pb-4 border-b border-stone-200 flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
            Checkout &amp; Shipping
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Deliveries fulfilled across India with certified agricultural batch invoicing.
          </p>
        </div>
        <Link
          to="/cart"
          className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Cart</span>
        </Link>
      </div>

      {errorMessage && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 font-medium">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Shipping & Delivery Form (Stage 9) */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="bg-white p-5 sm:p-6 rounded-xl border border-stone-200 shadow-xs space-y-4">
              <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider pb-2 border-b border-stone-100 flex items-center gap-2">
                <Truck className="w-4 h-4 text-emerald-700" />
                <span>Shipping Address</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Full Name / Farmer Name *
                  </label>
                  <input
                    type="text"
                    {...register('fullName', { required: 'Full name is required' })}
                    placeholder="e.g. Ramesh Patil"
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:bg-white focus:ring-1 focus:ring-emerald-600"
                  />
                  {errors.fullName && (
                    <span className="text-[11px] text-red-600 mt-0.5 block">{errors.fullName.message}</span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    {...register('mobile', { required: 'Mobile number is required' })}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:bg-white focus:ring-1 focus:ring-emerald-600"
                  />
                  {errors.mobile && (
                    <span className="text-[11px] text-red-600 mt-0.5 block">{errors.mobile.message}</span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    {...register('email', { required: 'Email address is required' })}
                    placeholder="farmer@example.com"
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:bg-white focus:ring-1 focus:ring-emerald-600"
                  />
                  {errors.email && (
                    <span className="text-[11px] text-red-600 mt-0.5 block">{errors.email.message}</span>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Complete Street Address / Farm Plot Survey No *
                  </label>
                  <textarea
                    rows={2}
                    {...register('address', { required: 'Address is required' })}
                    placeholder="House/Plot/Survey No, Village, Landmark, Taluk"
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:bg-white focus:ring-1 focus:ring-emerald-600"
                  />
                  {errors.address && (
                    <span className="text-[11px] text-red-600 mt-0.5 block">{errors.address.message}</span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    City / Town *
                  </label>
                  <input
                    type="text"
                    {...register('city', { required: 'City is required' })}
                    placeholder="Hubballi"
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:bg-white focus:ring-1 focus:ring-emerald-600"
                  />
                  {errors.city && (
                    <span className="text-[11px] text-red-600 mt-0.5 block">{errors.city.message}</span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    {...register('state', { required: 'State is required' })}
                    placeholder="Karnataka"
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:bg-white focus:ring-1 focus:ring-emerald-600"
                  />
                  {errors.state && (
                    <span className="text-[11px] text-red-600 mt-0.5 block">{errors.state.message}</span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    PIN Code *
                  </label>
                  <input
                    type="text"
                    {...register('pinCode', { required: 'PIN code is required' })}
                    placeholder="580024"
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:bg-white focus:ring-1 focus:ring-emerald-600"
                  />
                  {errors.pinCode && (
                    <span className="text-[11px] text-red-600 mt-0.5 block">{errors.pinCode.message}</span>
                  )}
                </div>

              </div>
            </div>

            {/* Payment Method Selector (Stage 9) */}
            <div className="bg-white p-5 sm:p-6 rounded-xl border border-stone-200 shadow-xs space-y-4">
              <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider pb-2 border-b border-stone-100 flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-700" />
                <span>Payment Method</span>
              </h2>

              <div className="space-y-3">
                {[
                  {
                    id: 'UPI',
                    name: 'UPI / QR Code',
                    desc: 'Instant payment via GPay, PhonePe, Paytm or BHIM UPI',
                    icon: <Smartphone className="w-5 h-5 text-emerald-700" />
                  },
                  {
                    id: 'Razorpay',
                    name: 'Razorpay Payment Gateway',
                    desc: 'Secure checkout with cards, EMI & banking',
                    icon: <CreditCard className="w-5 h-5 text-emerald-700" />
                  },
                  {
                    id: 'Card',
                    name: 'Credit / Debit Card',
                    desc: 'Visa, MasterCard, RuPay accepted. Credentials securely handled.',
                    icon: <CreditCard className="w-5 h-5 text-emerald-700" />
                  },
                  {
                    id: 'Net Banking',
                    name: 'Net Banking',
                    desc: 'Direct account transfer across 50+ Indian commercial banks',
                    icon: <Building2 className="w-5 h-5 text-emerald-700" />
                  },
                  {
                    id: 'Cash on Delivery',
                    name: 'Cash on Delivery (COD)',
                    desc: 'Pay cash upon parcel delivery at your farm or doorstep',
                    icon: <Banknote className="w-5 h-5 text-emerald-700" />
                  }
                ].map(opt => {
                  const isChecked = selectedPaymentMethod === opt.id;
                  return (
                    <label
                      key={opt.id}
                      className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all cursor-pointer ${
                        isChecked
                          ? 'border-emerald-600 bg-emerald-50/50 shadow-xs ring-1 ring-emerald-600'
                          : 'border-stone-200 bg-white hover:bg-stone-50'
                      }`}
                    >
                      <input
                        type="radio"
                        value={opt.id}
                        {...register('paymentMethod')}
                        className="mt-1 text-emerald-700 focus:ring-emerald-600"
                      />
                      <div className="p-1 rounded-md bg-stone-100 shrink-0">
                        {opt.icon}
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-bold text-stone-900">{opt.name}</p>
                        <p className="text-[11px] text-stone-500 mt-0.5">{opt.desc}</p>
                      </div>
                    </label>
                  );
                })}
              </div>

              {selectedPaymentMethod === 'UPI' && settings?.paymentQr && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
                  <p className="text-xs font-bold text-emerald-900 mb-2">Scan to Pay via UPI</p>
                  <img src={settings.paymentQr} alt="UPI payment QR code" className="w-48 h-48 mx-auto object-contain bg-white rounded-lg p-2 border border-emerald-100" />
                  <p className="text-[10px] text-emerald-800 mt-2">Use GPay, PhonePe, Paytm or another UPI app to scan this QR code.</p>
                </div>
              )}

              <div className="p-3 bg-stone-50 rounded-lg text-[11px] text-stone-500 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Card &amp; banking credentials are processed through encrypted payment gateways. No card details stored.</span>
              </div>
            </div>

          </div>

          {/* Checkout Order Summary Side Card */}
          <div className="lg:col-span-5">
            <div className="bg-white p-5 sm:p-6 rounded-xl border border-stone-200 shadow-xs space-y-4 sticky top-24">
              <h2 className="text-base font-bold text-stone-900 pb-3 border-b border-stone-100">
                Order Review ({cart.reduce((s, i) => s + i.quantity, 0)} Items)
              </h2>

              <div className="max-h-60 overflow-y-auto divide-y divide-stone-100 pr-1 space-y-2">
                {cart.map((item, idx) => (
                  <div key={idx} className="pt-2 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-9 h-9 object-contain bg-stone-50 rounded p-1 shrink-0 border border-stone-100"
                      />
                      <div className="truncate">
                        <p className="font-bold text-stone-900 truncate">{item.name}</p>
                        <p className="text-[10px] text-stone-500">
                          {item.quantity} × {item.size}
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-semibold text-stone-900">
                        {item.priceAvailable ? `₹${item.price * item.quantity}` : 'Price on Request'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-stone-200 space-y-2 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-stone-900">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Delivery Charge</span>
                  <span className="font-semibold text-stone-900">
                    {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
                  </span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>GST (5%)</span>
                  <span className="font-semibold text-stone-900">₹{tax}</span>
                </div>
                <div className="pt-2 border-t border-stone-200 flex justify-between text-sm sm:text-base font-black text-stone-900">
                  <span>Payable Total</span>
                  <span>₹{grandTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm text-white shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    submitting
                      ? 'bg-stone-400 cursor-not-allowed'
                      : 'bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900'
                  }`}
                >
                  {submitting ? (
                    <span>Placing Order...</span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Place Order (₹{grandTotal.toLocaleString('en-IN')})</span>
                    </>
                  )}
                </button>
              </div>

              <div className="pt-2 text-center text-[10px] text-stone-400">
                By placing this order you acknowledge standard agricultural usage notices.
              </div>

            </div>
          </div>

        </div>
      </form>

    </div>
  );
};
