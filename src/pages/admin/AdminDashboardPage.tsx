import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  FolderTree,
  ShoppingBag,
  Clock,
  CheckCircle2,
  IndianRupee,
  AlertTriangle,
  XCircle,
  ArrowRight,
  TrendingUp,
  BarChart3,
  Boxes
} from 'lucide-react';
import { api } from '../../services/api.ts';
import { Product, Order, Category } from '../../types/index.ts';
import { LoadingSpinner } from '../../components/StateIndicators.tsx';

export const AdminDashboardPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const [prodRes, ordRes, catRes] = await Promise.all([
          api.getProducts({ limit: 100 }),
          api.getOrders(),
          api.getCategories()
        ]);
        setProducts(prodRes.products);
        setOrders(ordRes);
        setCategories(catRes);
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboardData();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Calculating inventory metrics and sales data..." />;
  }

  // Dashboard calculations (Stage 13)
  const totalProducts = products.length;
  const totalCategories = categories.length;
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.orderStatus !== 'Delivered' && o.orderStatus !== 'Cancelled').length;
  const completedOrders = orders.filter(o => o.orderStatus === 'Delivered').length;
  const totalSales = orders.reduce((sum, o) => sum + (o.paymentStatus === 'Paid' ? o.total : 0), 0);
  const lowStock = products.filter(p => p.stock > 0 && p.stock <= (p.lowStockThreshold || 10)).length;
  const outOfStock = products.filter(p => p.stock <= 0).length;

  // Category distribution
  const categoryCounts = categories.map(cat => ({
    name: cat.name,
    count: products.filter(p => p.category.toLowerCase() === cat.name.toLowerCase()).length
  }));

  return (
    <div className="space-y-8">
      
      {/* Dashboard Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Real-time catalog metrics, sales volume, and inventory status.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            to="/admin/catalog-check"
            className="px-3.5 py-2 bg-stone-900 text-white font-bold text-xs rounded-xl hover:bg-black transition-colors"
          >
            Run Diagnostic Check
          </Link>
        </div>
      </div>

      {/* 8 Metric Cards (Stage 13) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Products */}
        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Products</span>
            <Package className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-stone-900">{totalProducts}</p>
          <span className="text-[11px] text-stone-400 mt-1 block">100% Catalogue Linked</span>
        </div>

        {/* Total Categories */}
        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Categories</span>
            <FolderTree className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-stone-900">{totalCategories}</p>
          <span className="text-[11px] text-stone-400 mt-1 block">Active Segments</span>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Orders</span>
            <ShoppingBag className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-stone-900">{totalOrders}</p>
          <span className="text-[11px] text-stone-400 mt-1 block">Customer Shipments</span>
        </div>

        {/* Total Sales */}
        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Sales</span>
            <IndianRupee className="w-4 h-4 text-emerald-700" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-stone-900">₹{totalSales.toLocaleString('en-IN')}</p>
          <span className="text-[11px] text-emerald-700 font-semibold mt-1 block">Paid Invoices</span>
        </div>

        {/* Pending Orders */}
        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Pending Orders</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-amber-600">{pendingOrders}</p>
          <span className="text-[11px] text-stone-400 mt-1 block">Processing in Depot</span>
        </div>

        {/* Completed Orders */}
        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Completed Orders</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-emerald-700">{completedOrders}</p>
          <span className="text-[11px] text-stone-400 mt-1 block">Delivered to Farmers</span>
        </div>

        {/* Low Stock */}
        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Low Stock</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-stone-900">{lowStock}</p>
          <span className="text-[11px] text-amber-600 font-medium mt-1 block">Under 10 Units</span>
        </div>

        {/* Out of Stock */}
        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Out of Stock</span>
            <XCircle className="w-4 h-4 text-red-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-red-600">{outOfStock}</p>
          <span className="text-[11px] text-stone-400 mt-1 block">Immediate Restock</span>
        </div>

      </div>

      {/* Visual Breakdowns: Category Spread & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Products by Category Bar Chart */}
        <div className="lg:col-span-7 bg-white p-6 rounded-xl border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-700" />
              <span>Products by Category</span>
            </h2>
            <Link to="/admin/products" className="text-xs font-bold text-emerald-700 hover:underline">
              Manage
            </Link>
          </div>

          <div className="space-y-3 pt-2">
            {categoryCounts.map(item => {
              const percentage = Math.round((item.count / totalProducts) * 100) || 0;
              return (
                <div key={item.name} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-stone-700">
                    <span className="truncate pr-2">{item.name}</span>
                    <span className="shrink-0">{item.count} items ({percentage}%)</span>
                  </div>
                  <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Orders Overview */}
        <div className="lg:col-span-5 bg-white p-6 rounded-xl border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-emerald-700" />
              <span>Recent Orders</span>
            </h2>
            <Link to="/admin/orders" className="text-xs font-bold text-emerald-700 hover:underline">
              View All
            </Link>
          </div>

          <div className="divide-y divide-stone-100">
            {orders.slice(0, 5).map(o => (
              <div key={o._id} className="py-3 flex items-center justify-between gap-3 text-xs">
                <div>
                  <p className="font-bold text-stone-900">#{o.orderNumber}</p>
                  <p className="text-[11px] text-stone-500">{o.customer.name}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-stone-900">₹{o.total}</p>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    o.orderStatus === 'Delivered'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {o.orderStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
