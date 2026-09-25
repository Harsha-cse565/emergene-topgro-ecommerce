import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  User,
  Package,
  MapPin,
  Clock,
  CheckCircle2,
  ExternalLink,
  Plus,
  Trash2,
  LogOut,
  Shield,
  Phone,
  Mail
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { api } from '../services/api.ts';
import { Order } from '../types/index.ts';
import { LoadingSpinner } from '../components/StateIndicators.tsx';

export const CustomerAccountPage: React.FC = () => {
  const { user, isAuthenticated, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'profile'>('orders');

  // Address form modal/state
  const [addresses, setAddresses] = useState<any[]>(user?.addresses || []);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newState, setNewState] = useState('Karnataka');
  const [newPinCode, setNewPinCode] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    async function loadOrders() {
      try {
        const list = await api.getMyOrders();
        setOrders(list);
      } catch (err) {
        console.error('Failed to load user orders', err);
      } finally {
        setLoadingOrders(false);
      }
    }
    loadOrders();
  }, [isAuthenticated, navigate]);

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddress || !newCity || !newPinCode) return;
    const item = {
      id: `addr_${Date.now()}`,
      title: newTitle || 'Delivery Address',
      address: newAddress,
      city: newCity,
      state: newState,
      pinCode: newPinCode
    };
    const updated = [...addresses, item];
    setAddresses(updated);
    setShowAddressForm(false);
    setNewTitle('');
    setNewAddress('');
    setNewCity('');
    setNewPinCode('');
  };

  const handleDeleteAddress = (id: string) => {
    setAddresses(prev => prev.filter(a => a.id !== id));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Account Header */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-black text-xl shadow-xs">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-stone-900">
                {user?.name}
              </h1>
              {isAdmin && (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                  Administrator
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500 mt-1">
              <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {user?.email}</span>
              {user?.phone && (
                <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> {user.phone}</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isAdmin && (
            <Link
              to="/admin"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl transition-colors shadow-xs"
            >
              <Shield className="w-4 h-4" />
              <span>Admin Dashboard</span>
            </Link>
          )}

          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-stone-300 hover:bg-stone-50 text-stone-700 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-stone-500" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs (Stage 11) */}
      <div className="flex border-b border-stone-200 gap-6 text-sm font-bold">
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'orders'
              ? 'border-emerald-700 text-emerald-800'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>My Orders ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('addresses')}
          className={`pb-3 border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'addresses'
              ? 'border-emerald-700 text-emerald-800'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Saved Addresses ({addresses.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-3 border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'profile'
              ? 'border-emerald-700 text-emerald-800'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Profile Details</span>
        </button>
      </div>

      {/* TAB 1: Orders (Stage 11) */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {loadingOrders ? (
            <LoadingSpinner message="Retrieving your orders..." />
          ) : orders.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-xl border border-stone-200">
              <Package className="w-12 h-12 text-stone-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-stone-800">No orders placed yet</h3>
              <p className="text-xs text-stone-500 mt-1 mb-4">
                Explore our catalogue of 85 products to place your first agricultural order.
              </p>
              <Link
                to="/products"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-700 text-white font-bold text-xs rounded-lg hover:bg-emerald-800"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map(order => (
                <div
                  key={order._id}
                  className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-stone-100 text-xs">
                    <div>
                      <span className="text-stone-400 font-medium">Order Number: </span>
                      <strong className="text-stone-900 font-mono">#{order.orderNumber}</strong>
                    </div>
                    <div>
                      <span className="text-stone-400 font-medium">Placed On: </span>
                      <span className="text-stone-700 font-medium">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                    <div>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        order.orderStatus === 'Delivered'
                          ? 'bg-emerald-100 text-emerald-800'
                          : order.orderStatus === 'Cancelled'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {order.orderStatus}
                      </span>
                    </div>
                  </div>

                  {/* Items preview */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-2 bg-stone-50 rounded-lg border border-stone-100">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-10 h-10 object-contain p-1 bg-white rounded border border-stone-200"
                        />
                        <div className="min-w-0 text-xs">
                          <p className="font-bold text-stone-900 truncate">{item.name}</p>
                          <p className="text-[11px] text-stone-500">
                            {item.quantity} × {item.size}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Footer & Track Link */}
                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-stone-500">Total: </span>
                      <strong className="text-stone-900 text-sm">₹{order.total}</strong>
                      <span className="ml-2 text-[11px] text-stone-400">({order.paymentMethod})</span>
                    </div>

                    <Link
                      to={`/order-confirmation/${order.orderNumber}`}
                      className="inline-flex items-center gap-1 font-bold text-emerald-700 hover:text-emerald-900"
                    >
                      <span>Track Order</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Manage Addresses (Stage 11) */}
      {activeTab === 'addresses' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-xs text-stone-600">
              Save your farmland or regional distributor delivery locations for fast checkout.
            </p>
            <button
              onClick={() => setShowAddressForm(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Address</span>
            </button>
          </div>

          {showAddressForm && (
            <form onSubmit={handleSaveAddress} className="bg-stone-50 p-5 rounded-xl border border-stone-300 space-y-4">
              <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                New Address Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-semibold mb-1">Address Label</label>
                  <input
                    type="text"
                    placeholder="e.g. Main Farm / Warehouse Plot"
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-stone-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">PIN Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="580024"
                    value={newPinCode}
                    onChange={e => setNewPinCode(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-stone-300 rounded-lg"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block font-semibold mb-1">Street Address / Survey Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="Plot / Survey No, Village, Landmark"
                    value={newAddress}
                    onChange={e => setNewAddress(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-stone-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">City / Taluk *</label>
                  <input
                    type="text"
                    required
                    placeholder="Hubballi"
                    value={newCity}
                    onChange={e => setNewCity(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-stone-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">State *</label>
                  <input
                    type="text"
                    required
                    value={newState}
                    onChange={e => setNewState(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-stone-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddressForm(false)}
                  className="px-3 py-1.5 text-xs font-semibold text-stone-600 hover:bg-stone-200 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg cursor-pointer"
                >
                  Save Address
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {addresses.map(addr => (
              <div key={addr.id} className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs relative">
                <div className="flex items-center justify-between pb-2 border-b border-stone-100 mb-2">
                  <span className="font-bold text-xs text-stone-900">{addr.title}</span>
                  <button
                    onClick={() => handleDeleteAddress(addr.id)}
                    className="text-stone-400 hover:text-red-600 p-1 rounded"
                    title="Delete address"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-xs text-stone-700 leading-relaxed">{addr.address}</p>
                <p className="text-xs text-stone-500 mt-1">
                  {addr.city}, {addr.state} - {addr.pinCode}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Profile Details */}
      {activeTab === 'profile' && (
        <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-xs max-w-xl space-y-4 text-xs">
          <h3 className="text-sm font-bold text-stone-900 pb-2 border-b border-stone-100">
            Account Profile
          </h3>
          <div className="space-y-3">
            <div>
              <span className="font-semibold text-stone-500 block mb-1">Account Name</span>
              <p className="font-bold text-stone-900 text-sm">{user?.name}</p>
            </div>
            <div>
              <span className="font-semibold text-stone-500 block mb-1">Email Address</span>
              <p className="font-mono text-stone-800">{user?.email}</p>
            </div>
            <div>
              <span className="font-semibold text-stone-500 block mb-1">Contact Phone</span>
              <p className="text-stone-800">{user?.phone || 'Not provided'}</p>
            </div>
            <div>
              <span className="font-semibold text-stone-500 block mb-1">User Role</span>
              <p className="font-semibold text-emerald-800 capitalize">{user?.role}</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
