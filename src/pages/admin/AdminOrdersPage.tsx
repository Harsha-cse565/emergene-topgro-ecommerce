import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, Eye, CheckCircle2, Truck, AlertCircle, X } from 'lucide-react';
import { api } from '../../services/api.ts';
import { Order } from '../../types/index.ts';
import { LoadingSpinner } from '../../components/StateIndicators.tsx';

const ALL_STATUSES = [
  'Order Placed',
  'Confirmed',
  'Processing',
  'Shipped',
  'Out for Delivery',
  'Delivered',
  'Cancelled'
];

export const AdminOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await api.getOrders();
      setOrders(data);
    } catch (err) {
      console.error('Failed to load orders', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      const updated = await api.updateOrderStatus(orderId, newStatus, `Status updated to ${newStatus} by Admin`);
      setOrders(prev => prev.map(o => o._id === orderId ? updated : o));
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder(updated);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update order status');
    }
  };

  const filteredOrders = orders.filter(o => {
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customer.phone.includes(searchQuery);
    const matchesStatus = statusFilter === 'All' || o.orderStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight">
            Order Fulfillment Management ({orders.length} Orders)
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Monitor consignment tracking, status lifecycles, and dispatch logistics.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search by order #, farmer name, or phone..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="px-3 py-2 text-xs font-semibold bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 text-stone-800"
        >
          <option value="All">All Statuses</option>
          {ALL_STATUSES.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Orders Table (Stage 15) */}
      {loading ? (
        <LoadingSpinner message="Fetching order consignments..." />
      ) : (
        <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-700">
              <thead className="bg-stone-50 border-b border-stone-200 uppercase text-[10px] font-black text-stone-500 tracking-wider">
                <tr>
                  <th className="p-3.5">Order ID</th>
                  <th className="p-3.5">Customer</th>
                  <th className="p-3.5">Date</th>
                  <th className="p-3.5">Products</th>
                  <th className="p-3.5">Total</th>
                  <th className="p-3.5">Payment</th>
                  <th className="p-3.5">Order Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-medium">
                {filteredOrders.map(order => (
                  <tr key={order._id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="p-3.5 font-bold font-mono text-stone-900">
                      #{order.orderNumber}
                    </td>

                    <td className="p-3.5">
                      <p className="font-bold text-stone-900">{order.customer.name}</p>
                      <p className="text-[11px] text-stone-500">{order.customer.phone}</p>
                    </td>

                    <td className="p-3.5 text-stone-600">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>

                    <td className="p-3.5">
                      <span className="font-semibold text-stone-900">{order.items.length} item(s)</span>
                      <p className="text-[10px] text-stone-500 truncate max-w-[150px]">
                        {order.items.map(i => i.name).join(', ')}
                      </p>
                    </td>

                    <td className="p-3.5 font-bold text-stone-900">
                      ₹{order.total}
                    </td>

                    <td className="p-3.5">
                      <div className="flex flex-col">
                        <span className={`text-[10px] font-bold w-max px-2 py-0.5 rounded-full ${
                          order.paymentStatus === 'Paid'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {order.paymentStatus}
                        </span>
                        <span className="text-[10px] text-stone-400 mt-0.5">{order.paymentMethod}</span>
                      </div>
                    </td>

                    <td className="p-3.5">
                      <select
                        value={order.orderStatus}
                        onChange={e => handleUpdateStatus(order._id, e.target.value)}
                        className="text-xs font-bold px-2 py-1 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
                      >
                        {ALL_STATUSES.map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>

                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-1.5 text-stone-600 hover:text-amber-700 hover:bg-stone-100 rounded cursor-pointer"
                        title="View Order Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-stone-200 shadow-2xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div>
                <h2 className="text-base font-black text-stone-900">
                  Order #{selectedOrder.orderNumber}
                </h2>
                <p className="text-[11px] text-stone-500">
                  Placed: {new Date(selectedOrder.createdAt).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1 text-stone-400 hover:text-stone-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer & Shipping */}
            <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-100 text-xs space-y-1">
              <p className="font-bold text-stone-900">Shipping Details</p>
              <p>{selectedOrder.shippingAddress.fullName} ({selectedOrder.shippingAddress.phone})</p>
              <p className="text-stone-600">{selectedOrder.shippingAddress.address}</p>
              <p className="text-stone-600">
                {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.pinCode}
              </p>
            </div>

            {/* Items */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                Consignment Items
              </h3>
              <div className="divide-y divide-stone-100">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="py-2 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-stone-900">{item.name}</p>
                      <p className="text-[11px] text-stone-500">Pack: {item.size} • Qty: {item.quantity}</p>
                    </div>
                    <span className="font-bold text-stone-900">
                      {item.priceAvailable ? `₹${item.price * item.quantity}` : 'On Request'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div className="pt-2 border-t border-stone-200 text-xs space-y-1">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{selectedOrder.subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery</span>
                <span>{selectedOrder.deliveryCharge === 0 ? 'FREE' : `₹${selectedOrder.deliveryCharge}`}</span>
              </div>
              <div className="flex justify-between">
                <span>GST</span>
                <span>₹{selectedOrder.tax}</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-stone-900 pt-1 border-t border-stone-100">
                <span>Total Amount</span>
                <span>₹{selectedOrder.total}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-stone-200">
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-full py-2 bg-stone-900 hover:bg-black text-white font-bold text-xs rounded-xl"
              >
                Close Consignment View
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
