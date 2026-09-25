import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sprout,
  ArrowRight,
  ShieldCheck,
  Package,
  Layers,
  Search,
  CheckCircle2,
  PhoneCall,
  Sparkles,
  Bug,
  Scissors,
  TrendingUp,
  Leaf,
  Wheat,
  FileCheck
} from 'lucide-react';
import { ProductCard } from '../components/ProductCard.tsx';
import { LoadingSpinner } from '../components/StateIndicators.tsx';
import { api } from '../services/api.ts';
import { Product, Category } from '../types/index.ts';

const iconMap: Record<string, React.ReactNode> = {
  Sprout: <Sprout className="w-5 h-5" />,
  Layers: <Layers className="w-5 h-5" />,
  ShieldCheck: <ShieldCheck className="w-5 h-5" />,
  Bug: <Bug className="w-5 h-5" />,
  Scissors: <Scissors className="w-5 h-5" />,
  TrendingUp: <TrendingUp className="w-5 h-5" />,
  Leaf: <Leaf className="w-5 h-5" />,
  Wheat: <Wheat className="w-5 h-5" />,
  Sparkles: <Sparkles className="w-5 h-5" />
};

export const HomePage: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [prodRes, catRes] = await Promise.all([
          api.getProducts({ featured: true, limit: 12 }),
          api.getCategories()
        ]);
        setFeaturedProducts(prodRes.products.slice(0, 12));
        setCategories(catRes);
      } catch (err) {
        console.error('Failed to load homepage data', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-16 sm:space-y-20 pb-16">
      
      {/* Hero Section (Stage 2) */}
      <section className="relative bg-gradient-to-br from-emerald-900 via-emerald-800 to-stone-900 text-white overflow-hidden py-16 sm:py-24">
        {/* Subtle grid pattern backdrop */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 text-xs font-semibold">
                <FileCheck className="w-4 h-4 text-emerald-400" />
                <span>Emergene &amp; Topgro 2026 Official Catalogue</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                Quality Agricultural Products for Better Farming
              </h1>

              <p className="text-sm sm:text-base lg:text-lg text-emerald-100 max-w-2xl leading-relaxed">
                Explore crop protection, plant nutrition, fertilizers, growth promoters and other agricultural solutions from Emergene &amp; Topgro.
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-sm shadow-md hover:shadow-lg transition-all"
                >
                  <span>Shop Products</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href="#categories"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 backdrop-blur-xs transition-all"
                >
                  <span>Explore Categories</span>
                </a>
              </div>

              {/* Verified Catalog Stats */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-emerald-700/50 max-w-lg mx-auto lg:mx-0">
                <div>
                  <p className="text-2xl sm:text-3xl font-black text-white">85</p>
                  <p className="text-[11px] font-medium text-emerald-200 uppercase tracking-wider">
                    Catalogue Products
                  </p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-black text-white">9</p>
                  <p className="text-[11px] font-medium text-emerald-200 uppercase tracking-wider">
                    Agri Categories
                  </p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-black text-white">100%</p>
                  <p className="text-[11px] font-medium text-emerald-200 uppercase tracking-wider">
                    Packaging Verified
                  </p>
                </div>
              </div>
            </div>

            {/* Hero Right Visual: Showcase 3 Signature Catalogue Packaging Items */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="relative w-full max-w-sm sm:max-w-md bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/15 shadow-2xl">
                <div className="flex items-center justify-between pb-4 border-b border-white/10 text-xs font-semibold text-emerald-200">
                  <span>Catalogue Highlight</span>
                  <span className="bg-emerald-500/30 px-2 py-0.5 rounded text-white text-[10px]">Net Price + GST</span>
                </div>

                <div className="py-4 flex items-center justify-center">
                  <div className="relative w-56 h-64 sm:w-64 sm:h-72">
                    <img
                      src="/images/products/delite.svg"
                      alt="Delite agricultural product"
                      className="w-full h-full object-contain filter drop-shadow-xl"
                    />
                  </div>
                </div>

                <div className="bg-stone-900/60 backdrop-blur-xs p-3.5 rounded-xl border border-white/10 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-white">Delite Complete Nutrition</p>
                    <p className="text-xs text-emerald-300">Topgro • 100g to 5kg</p>
                  </div>
                  <Link
                    to="/products/delite"
                    className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs rounded-lg transition-colors"
                  >
                    View
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Category Section (Stage 2) */}
      <section id="categories" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
              <Sprout className="w-4 h-4" />
              <span>Browse by Segment</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
              Agricultural Product Categories
            </h2>
          </div>
          <Link
            to="/products"
            className="inline-flex items-center gap-1 text-sm font-bold text-emerald-700 hover:text-emerald-800"
          >
            <span>All 85 Products</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {categories.map(cat => (
            <Link
              key={cat.id}
              to={`/products?category=${encodeURIComponent(cat.name)}`}
              className="group p-5 bg-white rounded-xl border border-stone-200 hover:border-emerald-500 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors mb-3.5">
                  {iconMap[cat.icon] || <Sprout className="w-5 h-5" />}
                </div>
                <h3 className="text-base font-bold text-stone-900 group-hover:text-emerald-700 transition-colors">
                  {cat.name}
                </h3>
                <p className="mt-1 text-xs text-stone-500 line-clamp-2 leading-relaxed">
                  {cat.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                <span className="font-semibold text-emerald-700">
                  {cat.count} {cat.count === 1 ? 'Product' : 'Products'}
                </span>
                <span className="text-stone-400 group-hover:text-emerald-700 group-hover:translate-x-1 transition-all flex items-center gap-0.5 font-medium">
                  Explore <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products (Stage 2) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Recommended Solutions</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
              Featured Agricultural Products
            </h2>
          </div>
          <Link
            to="/products"
            className="inline-flex items-center gap-1 text-sm font-bold text-emerald-700 hover:text-emerald-800"
          >
            <span>View Full Catalogue</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner message="Loading catalogue products..." />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {featuredProducts.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Why Choose Us (Stage 2) */}
      <section className="bg-stone-100 py-16 border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
              Why Choose Emergene &amp; Topgro
            </h2>
            <p className="mt-2 text-sm text-stone-600">
              Clear, transparent agricultural supply directly sourced from verified product catalogues.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            
            <div className="bg-white p-5 rounded-xl border border-stone-200 text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-stone-900">Wide Product Range</h3>
              <p className="mt-1.5 text-xs text-stone-500 leading-relaxed">
                Comprehensive assortment of 85 products across 9 agricultural segments.
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-stone-200 text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-stone-900">Easy Product Discovery</h3>
              <p className="mt-1.5 text-xs text-stone-500 leading-relaxed">
                Instant search and category-wise filters for rapid nutrient and pest formulation discovery.
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-stone-200 text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3">
                <Package className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-stone-900">Pack-Size Selection</h3>
              <p className="mt-1.5 text-xs text-stone-500 leading-relaxed">
                Select from manufacturer pack sizes including 100g, 250g, 500g, 1kg, 5kg, and bulk sacks.
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-stone-200 text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-stone-900">Product Information</h3>
              <p className="mt-1.5 text-xs text-stone-500 leading-relaxed">
                Intended use, composition indications, and authentic packaging retainment without fabrication.
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-stone-200 text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3">
                <PhoneCall className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-stone-900">Convenient Ordering</h3>
              <p className="mt-1.5 text-xs text-stone-500 leading-relaxed">
                Online cart checkout or direct WhatsApp enquiries for institutional and dealer quantities.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* WhatsApp Banner Callout (Stage 19) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-emerald-800 text-white rounded-2xl p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-black">
              Need Assistance with Catalogue Products or Bulk Orders?
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100 max-w-xl">
              Connect directly with our sales desk on WhatsApp for price requests, delivery schedules, and dealer quotations.
            </p>
          </div>

          <a
            href={`https://wa.me/919876543210?text=${encodeURIComponent('Hello Emergene & Topgro, I would like more information about your product catalogue.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-white text-emerald-900 hover:bg-emerald-50 font-bold text-sm rounded-xl shadow-xs transition-colors shrink-0"
          >
            <span>Chat on WhatsApp</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>

    </div>
  );
};
