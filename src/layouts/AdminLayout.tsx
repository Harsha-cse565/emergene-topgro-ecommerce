import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingBag,
  Boxes,
  MessageSquare,
  Settings,
  FileCheck2,
  LogOut,
  Menu,
  X,
  Store,
  Shield,
  Sprout
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';

export const AdminLayout: React.FC = () => {
  const { user, isAdmin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Protected route check (Stage 12)
  if (!isAdmin) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mb-4">
          <Shield className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-stone-900">Administrator Access Required</h2>
        <p className="text-xs text-stone-500 mt-1 max-w-sm">
          You must log in with an authorized admin account to view this section.
        </p>
        <div className="mt-6 flex gap-3">
          <Link
            to="/admin/login"
            className="px-4 py-2 bg-amber-700 text-white font-bold text-xs rounded-lg hover:bg-amber-800"
          >
            Admin Sign In
          </Link>
          <Link
            to="/"
            className="px-4 py-2 border border-stone-300 text-stone-700 font-semibold text-xs rounded-lg hover:bg-stone-50"
          >
            Return to Store
          </Link>
        </div>
      </div>
    );
  }

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard className="w-4 h-4" /> },
    { name: 'Products (85)', path: '/admin/products', icon: <Package className="w-4 h-4" /> },
    { name: 'Categories (9)', path: '/admin/categories', icon: <FolderTree className="w-4 h-4" /> },
    { name: 'Orders', path: '/admin/orders', icon: <ShoppingBag className="w-4 h-4" /> },
    { name: 'Inventory', path: '/admin/inventory', icon: <Boxes className="w-4 h-4" /> },
    { name: 'Enquiries', path: '/admin/enquiries', icon: <MessageSquare className="w-4 h-4" /> },
    { name: 'Settings', path: '/admin/settings', icon: <Settings className="w-4 h-4" /> },
    { name: 'Catalog Check', path: '/admin/catalog-check', icon: <FileCheck2 className="w-4 h-4" /> },
  ];

  const handleSignOut = () => {
    logout();
    navigate('/admin/login');
  };

  const navLinksMarkup = (
    <div className="space-y-1">
      {navItems.map(item => {
        const isActive = item.path === '/admin'
          ? location.pathname === '/admin'
          : location.pathname.startsWith(item.path);

        return (
          <Link
            key={item.name}
            to={item.path}
            onClick={() => setMobileNavOpen(false)}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              isActive
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-stone-300 hover:bg-stone-800 hover:text-white'
            }`}
          >
            {item.icon}
            <span>{item.name}</span>
          </Link>
        );
      })}
    </div>
  );

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col md:flex-row">
      
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-stone-900 text-stone-200 border-r border-stone-800 p-5 shrink-0 justify-between">
        <div className="space-y-6">
          
          {/* Admin Header */}
          <div className="flex items-center gap-2.5 pb-4 border-b border-stone-800">
            <div className="w-9 h-9 rounded-lg bg-amber-600 text-white flex items-center justify-center font-black">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <span className="block font-black text-sm text-white tracking-tight leading-none">
                EMERGENE ADMIN
              </span>
              <span className="block text-[10px] font-bold text-amber-400 tracking-wider uppercase mt-1">
                Catalogue Console
              </span>
            </div>
          </div>

          {/* Navigation */}
          {navLinksMarkup}
        </div>

        {/* Bottom actions */}
        <div className="pt-6 border-t border-stone-800 space-y-2">
          <Link
            to="/"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <Store className="w-4 h-4 text-emerald-400" />
            <span>Go to Customer Store</span>
          </Link>

          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Admin Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <header className="md:hidden bg-stone-900 text-white p-4 flex items-center justify-between border-b border-stone-800">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-amber-500" />
          <span className="font-black text-sm">Emergene Admin</span>
        </div>
        <button
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
          className="p-1.5 rounded-lg bg-stone-800 text-stone-300"
        >
          {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileNavOpen && (
        <div className="md:hidden bg-stone-900 text-stone-200 p-4 border-b border-stone-800 space-y-4">
          {navLinksMarkup}
          <div className="pt-3 border-t border-stone-800 flex justify-between">
            <Link to="/" className="text-xs text-emerald-400 flex items-center gap-1 font-bold">
              <Store className="w-4 h-4" /> Store
            </Link>
            <button onClick={handleSignOut} className="text-xs text-red-400 flex items-center gap-1 font-bold">
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>
      )}

      {/* Main Outlet Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <Outlet />
      </main>

    </div>
  );
};
