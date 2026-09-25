import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  X,
  SlidersHorizontal,
  RotateCcw,
  Check,
  ChevronDown,
  PackageSearch
} from 'lucide-react';
import { ProductCard } from '../components/ProductCard.tsx';
import { LoadingSpinner, ErrorMessage } from '../components/StateIndicators.tsx';
import { api } from '../services/api.ts';
import { Product, Category } from '../types/index.ts';

export const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters State
  const initialCategory = searchParams.get('category') || 'All';
  const initialSearch = searchParams.get('search') || '';

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [selectedPackSize, setSelectedPackSize] = useState<string>('All');
  const [priceFilter, setPriceFilter] = useState<string>('All'); // 'All' | 'under-200' | '200-500' | '500-1500' | 'above-1500' | 'on-request'
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [featuredOnly, setFeaturedOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('catalog'); // 'catalog' | 'name-asc' | 'name-desc' | 'price-low' | 'price-high'

  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);

  // Sync URL search params
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setSelectedCategory(cat);
    const s = searchParams.get('search');
    if (s) setSearchQuery(s);
  }, [searchParams]);

  const loadAllProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const [prodRes, catRes] = await Promise.all([
        api.getProducts({ limit: 100 }),
        api.getCategories()
      ]);
      setProducts(prodRes.products);
      setCategories(catRes);
    } catch (err: any) {
      setError(err.message || 'Unable to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllProducts();
  }, []);

  // Update query params in URL when user filters
  const updateQueryParam = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value && value !== 'All') {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams, { replace: true });
  };

  const handleCategoryChange = (catName: string) => {
    setSelectedCategory(catName);
    updateQueryParam('category', catName);
  };

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    updateQueryParam('search', val);
  };

  const resetFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    setSelectedPackSize('All');
    setPriceFilter('All');
    setInStockOnly(false);
    setFeaturedOnly(false);
    setSortBy('catalog');
    setSearchParams({}, { replace: true });
  };

  // Distinct pack sizes available across all 85 products
  const availablePackSizes = useMemo(() => {
    const sizes = new Set<string>();
    products.forEach(p => {
      p.packSizes?.forEach(ps => sizes.add(ps.size));
    });
    return Array.from(sizes).sort();
  }, [products]);

  // Client-side filtering & sorting
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Global Search (name, category, usedFor, sku, brand, packSize)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(p => {
        const nameMatch = p.name.toLowerCase().includes(q);
        const catMatch = p.category.toLowerCase().includes(q);
        const usedMatch = (p.usedFor || '').toLowerCase().includes(q);
        const skuMatch = (p.sku || '').toLowerCase().includes(q);
        const brandMatch = (p.brand || '').toLowerCase().includes(q);
        const sizeMatch = p.packSizes?.some(ps => ps.size.toLowerCase().includes(q));
        return nameMatch || catMatch || usedMatch || skuMatch || brandMatch || sizeMatch;
      });
    }

    // Category Filter
    if (selectedCategory !== 'All') {
      result = result.filter(p => p.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    // Pack Size Filter
    if (selectedPackSize !== 'All') {
      result = result.filter(p => p.packSizes?.some(ps => ps.size.toLowerCase() === selectedPackSize.toLowerCase()));
    }

    // Price Filter
    if (priceFilter === 'on-request') {
      result = result.filter(p => !p.priceAvailable);
    } else if (priceFilter === 'under-200') {
      result = result.filter(p => p.priceAvailable && p.startingPrice < 200);
    } else if (priceFilter === '200-500') {
      result = result.filter(p => p.priceAvailable && p.startingPrice >= 200 && p.startingPrice <= 500);
    } else if (priceFilter === '500-1500') {
      result = result.filter(p => p.priceAvailable && p.startingPrice > 500 && p.startingPrice <= 1500);
    } else if (priceFilter === 'above-1500') {
      result = result.filter(p => p.priceAvailable && p.startingPrice > 1500);
    }

    // Stock Filter
    if (inStockOnly) {
      result = result.filter(p => p.stock > 0);
    }

    // Featured Filter
    if (featuredOnly) {
      result = result.filter(p => p.featured);
    }

    // Sorting
    if (sortBy === 'name-asc') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'name-desc') {
      result.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortBy === 'price-low') {
      result.sort((a, b) => {
        if (!a.priceAvailable) return 1;
        if (!b.priceAvailable) return -1;
        return a.startingPrice - b.startingPrice;
      });
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => {
        if (!a.priceAvailable) return 1;
        if (!b.priceAvailable) return -1;
        return b.startingPrice - a.startingPrice;
      });
    } else {
      // Catalog Order (Default)
      result.sort((a, b) => (a.catalogPage - b.catalogPage) || (a.itemOnPage - b.itemOnPage));
    }

    return result;
  }, [
    products,
    searchQuery,
    selectedCategory,
    selectedPackSize,
    priceFilter,
    inStockOnly,
    featuredOnly,
    sortBy
  ]);

  const filterSidebarContent = (
    <div className="space-y-6 text-sm">
      {/* Search Filter in Sidebar */}
      <div>
        <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
          Search Products
        </label>
        <div className="relative">
          <input
            type="text"
            placeholder="Name, category, crop use..."
            value={searchQuery}
            onChange={e => handleSearchChange(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:bg-white focus:ring-1 focus:ring-emerald-600"
          />
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          {searchQuery && (
            <button
              onClick={() => handleSearchChange('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Categories Filter */}
      <div>
        <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
          Category
        </label>
        <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
          <button
            onClick={() => handleCategoryChange('All')}
            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              selectedCategory === 'All'
                ? 'bg-emerald-700 text-white font-bold'
                : 'text-stone-700 hover:bg-stone-100'
            }`}
          >
            <span>All Categories</span>
            <span className="text-[11px] opacity-80">{products.length}</span>
          </button>
          {categories.map(cat => {
            const count = products.filter(p => p.category.toLowerCase() === cat.name.toLowerCase()).length;
            const isSelected = selectedCategory.toLowerCase() === cat.name.toLowerCase();
            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.name)}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors text-left ${
                  isSelected
                    ? 'bg-emerald-700 text-white font-bold'
                    : 'text-stone-700 hover:bg-stone-100'
                }`}
              >
                <span className="truncate pr-2">{cat.name}</span>
                <span className="text-[11px] opacity-80 shrink-0">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Filter */}
      <div>
        <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
          Price Range
        </label>
        <div className="space-y-1.5">
          {[
            { id: 'All', label: 'All Prices' },
            { id: 'under-200', label: 'Under ₹200' },
            { id: '200-500', label: '₹200 - ₹500' },
            { id: '500-1500', label: '₹500 - ₹1,500' },
            { id: 'above-1500', label: 'Above ₹1,500' },
            { id: 'on-request', label: 'Price on Request' },
          ].map(opt => (
            <label key={opt.id} className="flex items-center gap-2 cursor-pointer text-xs text-stone-700">
              <input
                type="radio"
                name="priceFilter"
                checked={priceFilter === opt.id}
                onChange={() => setPriceFilter(opt.id)}
                className="text-emerald-700 focus:ring-emerald-600 rounded-xs"
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Pack Size Filter */}
      {availablePackSizes.length > 0 && (
        <div>
          <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
            Pack Size
          </label>
          <select
            value={selectedPackSize}
            onChange={e => setSelectedPackSize(e.target.value)}
            className="w-full px-2.5 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600"
          >
            <option value="All">All Pack Sizes</option>
            {availablePackSizes.map(size => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Toggles: Stock & Featured */}
      <div className="pt-2 border-t border-stone-200 space-y-2">
        <label className="flex items-center gap-2 cursor-pointer text-xs text-stone-700 font-medium">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={e => setInStockOnly(e.target.checked)}
            className="rounded text-emerald-700 focus:ring-emerald-600"
          />
          <span>In Stock Only</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer text-xs text-stone-700 font-medium">
          <input
            type="checkbox"
            checked={featuredOnly}
            onChange={e => setFeaturedOnly(e.target.checked)}
            className="rounded text-emerald-700 focus:ring-emerald-600"
          />
          <span>Featured Only</span>
        </label>
      </div>

      {/* Reset Button */}
      <div className="pt-2">
        <button
          onClick={resetFilters}
          className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset All Filters</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      {/* Header & Breadcrumb */}
      <div className="mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-stone-200">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
              Agricultural Products Catalogue
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-stone-500">
              Complete inventory of 85 products from the Emergene &amp; Topgro 2026 catalogue.
            </p>
          </div>

          {/* Quick Filters Toggle (Mobile) & Sorting dropdown */}
          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-stone-800 bg-stone-100 hover:bg-stone-200 border border-stone-200 rounded-lg"
            >
              <SlidersHorizontal className="w-4 h-4 text-emerald-700" />
              <span>Filters ({selectedCategory !== 'All' || priceFilter !== 'All' || inStockOnly || featuredOnly || searchQuery ? 'Active' : 'All'})</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-stone-500 hidden sm:inline">Sort:</span>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="px-3 py-2 text-xs font-semibold bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 text-stone-800"
              >
                <option value="catalog">Catalogue Order</option>
                <option value="name-asc">Name: A to Z</option>
                <option value="name-desc">Name: Z to A</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Filter Pills Bar */}
        {(selectedCategory !== 'All' || priceFilter !== 'All' || selectedPackSize !== 'All' || inStockOnly || featuredOnly || searchQuery) && (
          <div className="flex flex-wrap items-center gap-2 pt-3">
            <span className="text-[11px] font-semibold text-stone-400">Active filters:</span>
            {selectedCategory !== 'All' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                Category: {selectedCategory}
                <button onClick={() => handleCategoryChange('All')}><X className="w-3 h-3" /></button>
              </span>
            )}
            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                Search: "{searchQuery}"
                <button onClick={() => handleSearchChange('')}><X className="w-3 h-3" /></button>
              </span>
            )}
            {priceFilter !== 'All' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                Price: {priceFilter}
                <button onClick={() => setPriceFilter('All')}><X className="w-3 h-3" /></button>
              </span>
            )}
            {selectedPackSize !== 'All' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                Pack: {selectedPackSize}
                <button onClick={() => setSelectedPackSize('All')}><X className="w-3 h-3" /></button>
              </span>
            )}
            {inStockOnly && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                In Stock Only
                <button onClick={() => setInStockOnly(false)}><X className="w-3 h-3" /></button>
              </span>
            )}
            {featuredOnly && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                Featured Only
                <button onClick={() => setFeaturedOnly(false)}><X className="w-3 h-3" /></button>
              </span>
            )}
            <button
              onClick={resetFilters}
              className="text-[11px] font-bold text-emerald-700 hover:underline ml-1"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Main Content Layout: Sidebar + Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block bg-white p-5 rounded-xl border border-stone-200 sticky top-24">
          <div className="flex items-center justify-between pb-3 border-b border-stone-200 mb-4">
            <h3 className="text-sm font-black text-stone-900 flex items-center gap-1.5">
              <Filter className="w-4 h-4 text-emerald-700" />
              <span>Filters</span>
            </h3>
            <span className="text-[11px] font-semibold text-stone-400">
              {filteredProducts.length} Results
            </span>
          </div>
          {filterSidebarContent}
        </aside>

        {/* Products Grid Area */}
        <main className="lg:col-span-3 space-y-6">
          
          {loading ? (
            <LoadingSpinner message="Loading all 85 products from database..." />
          ) : error ? (
            <ErrorMessage message={error} onRetry={loadAllProducts} />
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16 px-4 bg-white rounded-xl border border-stone-200">
              <PackageSearch className="w-12 h-12 text-stone-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-stone-800">No products match your criteria</h3>
              <p className="mt-1 text-xs text-stone-500 max-w-sm mx-auto">
                Try adjusting your search terms, category selections, or pack size filters.
              </p>
              <button
                onClick={resetFilters}
                className="mt-4 px-4 py-2 bg-emerald-700 text-white font-bold text-xs rounded-lg hover:bg-emerald-800 transition-colors cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div>
              {/* Product Grid: 4 per row desktop, 3 per row tablet, 2 per row mobile (Stage 4) */}
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-5">
                {filteredProducts.map(product => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {/* Bottom Catalog Status */}
              <div className="mt-12 text-center text-xs text-stone-400 py-4 border-t border-stone-200">
                Displaying {filteredProducts.length} of {products.length} products • Sourced from Emergene &amp; Topgro 2026 Catalogue
              </div>
            </div>
          )}

        </main>

      </div>

      {/* Mobile Filter Drawer (Stage 6) */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-stone-900/50 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="relative ml-auto w-full max-w-xs bg-white h-full p-5 overflow-y-auto shadow-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-stone-200 mb-4">
                <h3 className="text-base font-bold text-stone-900 flex items-center gap-1.5">
                  <SlidersHorizontal className="w-4 h-4 text-emerald-700" />
                  <span>Filter Products</span>
                </h3>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 text-stone-400 hover:text-stone-700 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {filterSidebarContent}
            </div>

            <div className="pt-4 mt-6 border-t border-stone-200">
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-lg transition-colors"
              >
                Apply Filters ({filteredProducts.length} Products)
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
