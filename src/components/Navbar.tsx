import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, X, Phone, MessageSquare, Shield, Sprout, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import fallbackProducts from '../data/products.json';
import { Product, Settings } from '../types/index.ts';
import { api } from '../services/api.ts';

export const Navbar: React.FC = () => {
  const { cartCount } = useCart();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => { api.getSettings().then(setSettings).catch(() => {}); }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchFocused(false);
  }, [location.pathname]);

  // Global instant search logic (Stage 5)
  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const q = searchQuery.toLowerCase().trim();
      const hits = (fallbackProducts as unknown as Product[]).filter(p => {
        return (
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.usedFor && p.usedFor.toLowerCase().includes(q)) ||
          p.sku.toLowerCase().includes(q) ||
          (p.packSizes && p.packSizes.some(ps => ps.size.toLowerCase().includes(q)))
        );
      }).slice(0, 6);
      setSearchResults(hits);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  // Click outside to close search dropdown
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchFocused(false);
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'Categories', path: '/products#categories' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-stone-200 shadow-xs">
      {/* Top Notice Bar */}
      <div className="bg-emerald-900 text-emerald-100 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 font-semibold text-emerald-200">
              <Sprout className="w-3.5 h-3.5 text-emerald-400" />
              Emergene &amp; Topgro 2026 Product Catalogue
            </span>
            <span className="hidden sm:inline text-emerald-400">•</span>
            <span className="hidden sm:inline text-emerald-300">85 Verified Agricultural Products</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-medium text-emerald-200">
            <a href="tel:+919500798493" className="hover:text-white flex items-center gap-1">
              <Phone className="w-3 h-3" />
              <span>+91 9500798493</span>
            </a>
            {isAdmin ? (
              <Link to="/admin" className="flex items-center gap-1 text-amber-300 font-bold hover:text-amber-200">
                <Shield className="w-3 h-3" />
                <span>Admin Dashboard</span>
              </Link>
            ) : (
              <Link to="/admin/login" className="hover:text-white text-[10px] text-emerald-400">
                Admin Portal
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-white border border-stone-200 flex items-center justify-center overflow-hidden shadow-xs">
              {settings?.logo ? <img src={settings.logo} alt="Company logo" className="w-full h-full object-contain p-1" /> : <Sprout className="w-6 h-6 text-emerald-700" />}
            </div>
            <div>
              <span className="block text-base sm:text-lg font-black text-stone-900 tracking-tight leading-none">
                {settings?.companyName || 'EMERGENE & TOPGRO'}
              </span>
              <span className="block text-[10px] font-bold text-emerald-700 tracking-wider uppercase mt-0.5">
                Agricultural Solutions
              </span>
            </div>
          </Link>

          {/* Desktop Search Bar (Global Instant Search) */}
          <div ref={searchRef} className="hidden md:block flex-1 max-w-md mx-4 relative">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search products, zinc, NPK, herbicides, seeds..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                className="w-full pl-10 pr-4 py-2 text-sm bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </form>

            {/* Instant Search Dropdown (Stage 5) */}
            {searchFocused && searchResults.length > 0 && (
              <div className="absolute top-full mt-1.5 left-0 right-0 bg-white border border-stone-200 rounded-xl shadow-xl overflow-hidden z-50 divide-y divide-stone-100">
                <div className="p-2 bg-stone-50 text-[11px] font-semibold text-stone-500 uppercase tracking-wider flex justify-between items-center">
                  <span>Found {searchResults.length} Products</span>
                  <Link
                    to={`/products?search=${encodeURIComponent(searchQuery)}`}
                    onClick={() => setSearchFocused(false)}
                    className="text-emerald-700 hover:underline flex items-center gap-0.5"
                  >
                    View all <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {searchResults.map(p => (
                    <Link
                      key={p._id}
                      to={`/products/${p.slug}`}
                      onClick={() => setSearchFocused(false)}
                      className="flex items-center gap-3 p-2.5 hover:bg-emerald-50/50 transition-colors"
                    >
                      <img
                        src={p.images[0] || '/images/products/placeholder.svg'}
                        alt={p.name}
                        className="w-10 h-10 object-contain p-1 bg-stone-100 rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-stone-900 truncate">{p.name}</p>
                        <p className="text-[10px] text-emerald-700 font-medium">{p.category}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-xs font-bold text-stone-900">
                          {p.priceAvailable ? `₹${p.startingPrice}` : 'On Request'}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-stone-700">
            {navLinks.map(link => (
              <Link
                key={link.name}
                to={link.path}
                className={`hover:text-emerald-700 transition-colors ${
                  location.pathname === link.path ? 'text-emerald-700 font-bold' : ''
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Action Icons: Cart & Account */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Account link */}
            {isAuthenticated ? (
              <div className="relative group">
                <Link
                  to="/account"
                  className="flex items-center gap-1.5 p-2 rounded-lg text-stone-700 hover:text-emerald-700 hover:bg-stone-100 transition-colors"
                  title="My Account"
                >
                  <User className="w-5 h-5 text-emerald-700" />
                  <span className="hidden xl:inline text-xs font-bold max-w-[90px] truncate">
                    {user?.name.split(' ')[0]}
                  </span>
                </Link>
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-stone-700 hover:text-emerald-700 hover:bg-stone-100 rounded-lg transition-colors"
              >
                <User className="w-4 h-4" />
                <span>Login</span>
              </Link>
            )}

            {/* Shopping Cart Button */}
            <Link
              to="/cart"
              className="relative p-2 text-stone-700 hover:text-emerald-700 hover:bg-stone-100 rounded-lg transition-colors"
              title="View Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-emerald-700 text-white font-extrabold text-[11px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-stone-700 hover:bg-stone-100 rounded-lg lg:hidden"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>

        {/* Mobile Search Bar in Navbar */}
        <div className="pb-3 md:hidden">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search all 85 products..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-600"
            />
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </form>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-stone-200 px-4 pt-2 pb-6 space-y-2 shadow-lg">
          <div className="flex flex-col space-y-1 pt-1 pb-2 border-b border-stone-100">
            {navLinks.map(link => (
              <Link
                key={link.name}
                to={link.path}
                className="px-3 py-2 rounded-lg text-sm font-semibold text-stone-800 hover:bg-emerald-50 hover:text-emerald-800"
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="pt-2 flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                <Link
                  to="/account"
                  className="flex items-center justify-between px-3 py-2 text-sm font-semibold text-stone-800 bg-stone-50 rounded-lg"
                >
                  <span className="flex items-center gap-2">
                    <User className="w-4 h-4 text-emerald-700" />
                    Account: {user?.name}
                  </span>
                  <span className="text-xs text-stone-500">Orders &amp; Profile</span>
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-2 px-3 py-2 text-sm font-bold text-amber-800 bg-amber-50 rounded-lg"
                  >
                    <Shield className="w-4 h-4 text-amber-600" />
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="text-left px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  className="text-center py-2 text-xs font-bold text-stone-700 bg-stone-100 rounded-lg"
                >
                  Customer Login
                </Link>
                <Link
                  to="/register"
                  className="text-center py-2 text-xs font-bold text-white bg-emerald-700 rounded-lg"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
