import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  CheckCircle2,
  Package,
  Truck,
  Clock,
  MapPin,
  Phone,
  ArrowRight,
  ShieldCheck,
  Download,
  AlertCircle
} from 'lucide-react';
import { api } from '../services/api.ts';
import { Order } from '../types/index.ts';
import { LoadingSpinner, ErrorMessage } from '../components/StateIndicators.tsx';

const STATUS_STEPS = [
  'Order Placed',
  'Confirmed',
  'Processing',
  'Shipped',
  'Out for Delivery',
  'Delivered'
];

export const OrderConfirmationPage: React.FC = () => {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadOrder() {
      if (!orderNumber) return;
      try {
        const data = await api.trackOrder(orderNumber);
        setOrder(data);
      } catch (err: any) {
        setError(err.message || 'Order reference not found');
      } finally {
        setLoading(false);
      }
    }
    loadOrder();
  }, [orderNumber]);

  if (loading) {
    return <LoadingSpinner message="Locating order record..." />;
  }

  if (error || !order) {
    return (
      <div className="max-w-md mx-auto my-16 p-6 text-center">
        <ErrorMessage message={error || 'Order reference not found.'} />
        <Link
          to="/products"
          className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-700 text-white text-xs font-bold rounded-lg"
        >
          Return to Store
        </Link>
      </div>
    );
  }

  const currentStepIndex = STATUS_STEPS.indexOf(order.orderStatus);
  const isCancelled = order.orderStatus === 'Cancelled';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Success banner */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 sm:p-8 text-center space-y-3">
        <div className="w-16 h-16 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
          Order Successfully Received
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-stone-900">
          Order #{order.orderNumber}
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 max-w-lg mx-auto">
          Thank you for choosing Emergene &amp; Topgro. We have received your order and our logistics depot is preparing the dispatch.
        </p>
      </div>

      {/* Tracking Timeline (Stage 10) */}
      <div className="bg-white p-6 sm:p-8 rounded-xl border border-stone-200 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
            <Truck className="w-4 h-4 text-emerald-700" />
            <span>Order Status &amp; Fulfillment Timeline</span>
          </h2>
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
            isCancelled ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
          }`}>
            Current: {order.orderStatus}
          </span>
        </div>

        {isCancelled ? (
          <div className="p-4 bg-red-50 text-red-800 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <span>This order has been cancelled. Please contact customer support if this was unintended.</span>
          </div>
        ) : (
          <div className="py-2">
            {/* Steps bar */}
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
              {STATUS_STEPS.map((step, idx) => {
                const isCompleted = idx <= currentStepIndex;
                const isCurrent = idx === currentStepIndex;

                return (
                  <div key={step} className="flex flex-col items-center text-center p-2 rounded-lg bg-stone-50 border border-stone-100">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mb-1.5 ${
                      isCurrent
                        ? 'bg-emerald-700 text-white ring-2 ring-emerald-300'
                        : isCompleted
                        ? 'bg-emerald-600 text-white'
                        : 'bg-stone-200 text-stone-500'
                    }`}>
                      {isCompleted ? '✓' : idx + 1}
                    </div>
                    <span className={`text-[11px] leading-tight ${
                      isCurrent ? 'font-bold text-emerald-800' : isCompleted ? 'font-semibold text-stone-800' : 'text-stone-400'
                    }`}>
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>

            {order.trackingNotes && (
              <p className="mt-4 text-xs text-stone-500 bg-stone-50 p-3 rounded-lg border border-stone-200">
                <strong className="text-stone-700">Depot Note:</strong> {order.trackingNotes}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Details Grid: Order items & Shipping Details */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Ordered items */}
        <div className="md:col-span-7 bg-white p-6 rounded-xl border border-stone-200 shadow-xs space-y-4">
          <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider pb-2 border-b border-stone-100">
            Ordered Products ({order.items.length})
          </h3>

          <div className="divide-y divide-stone-100">
            {order.items.map((item, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-10 h-10 object-contain p-1 bg-stone-50 rounded border border-stone-100 shrink-0"
                  />
                  <div>
                    <p className="font-bold text-stone-900">{item.name}</p>
                    <p className="text-[11px] text-stone-500">
                      Pack: {item.size} • Qty: {item.quantity}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-bold text-stone-900">
                    {item.priceAvailable ? `₹${item.price * item.quantity}` : 'Price on Request'}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-stone-200 space-y-1.5 text-xs text-stone-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-stone-900">₹{order.subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Charge</span>
              <span className="font-semibold text-stone-900">
                {order.deliveryCharge === 0 ? 'FREE' : `₹${order.deliveryCharge}`}
              </span>
            </div>
            <div className="flex justify-between">
              <span>GST (5%)</span>
              <span className="font-semibold text-stone-900">₹{order.tax}</span>
            </div>
            <div className="pt-2 border-t border-stone-200 flex justify-between font-bold text-sm text-stone-900">
              <span>Total Paid / Due</span>
              <span>₹{order.total}</span>
            </div>
          </div>
        </div>

        {/* Shipping & Payment Meta */}
        <div className="md:col-span-5 space-y-4">
          <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs space-y-3 text-xs">
            <h3 className="font-bold text-stone-700 uppercase tracking-wider pb-2 border-b border-stone-100 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-700" />
              <span>Delivery Destination</span>
            </h3>
            <p className="font-bold text-stone-900">{order.shippingAddress.fullName}</p>
            <p className="text-stone-600 leading-relaxed">{order.shippingAddress.address}</p>
            <p className="text-stone-600">
              {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pinCode}
            </p>
            <p className="text-stone-600 flex items-center gap-1.5 pt-1 border-t border-stone-100">
              <Phone className="w-3 h-3 text-emerald-600" />
              {order.shippingAddress.phone}
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs space-y-2 text-xs">
            <h3 className="font-bold text-stone-700 uppercase tracking-wider pb-2 border-b border-stone-100">
              Payment Information
            </h3>
            <div className="flex justify-between">
              <span className="text-stone-500">Method</span>
              <span className="font-bold text-stone-900">{order.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Payment Status</span>
              <span className={`font-bold ${
                order.paymentStatus === 'Paid' ? 'text-emerald-700' : 'text-amber-700'
              }`}>
                {order.paymentStatus}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Order Placed On</span>
              <span className="text-stone-800">
                {new Date(order.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })}
              </span>
            </div>
          </div>
        </div>

      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 pt-4">
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl transition-colors"
        >
          <span>Continue Shopping</span>
          <ArrowRight className="w-4 h-4" />
        </Link>

        <Link
          to="/account"
          className="text-xs font-bold text-stone-700 hover:text-emerald-700 underline"
        >
          View All Your Orders in Account
        </Link>
      </div>

    </div>
  );
};
