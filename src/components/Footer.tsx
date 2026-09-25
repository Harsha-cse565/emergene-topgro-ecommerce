import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, Phone, Mail, MapPin, ShieldCheck, FileText, ArrowUpRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { api } from '../services/api.ts';
import { Settings } from '../types/index.ts';
import fallbackSettings from '../data/settings.json';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const [settings, setSettings] = useState<Settings | null>(null);
  useEffect(() => { api.getSettings().then(setSettings).catch(() => {}); }, []);

  const categories = [
    'Fertilizers & Plant Nutrition',
    'Micronutrients',
    'Fungicides',
    'Insecticides',
    'Herbicides',
    'Plant Growth Regulators',
    'Organic / Biological Products',
    'Seeds'
  ];

  return (
    <footer className="bg-stone-900 text-stone-300 pt-12 pb-8 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b border-stone-800">
          
          {/* Col 1: Brand & Identity */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center overflow-hidden">
                {settings?.logo ? <img src={settings.logo} alt="Company logo" className="w-full h-full object-contain p-1" /> : <Sprout className="w-5 h-5 text-emerald-600" />}
              </div>
              <span className="text-lg font-black text-white tracking-tight">
                {settings?.companyName || 'EMERGENE & TOPGRO'}
              </span>
            </div>
            
            <p className="text-xs text-stone-400 leading-relaxed max-w-sm">
              Authentic agricultural e-commerce storefront presenting crop protection, plant nutrition, water-soluble fertilizers, biostimulants, and certified seeds directly catalogued for farmer convenience.
            </p>

            <div className="space-y-2 pt-1 text-xs text-stone-300">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{settings?.address || fallbackSettings.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{settings?.phone || fallbackSettings.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{settings?.email || fallbackSettings.email}</span>
              </div>
              <div className="flex items-center gap-2 text-stone-400 text-[11px]">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>GST: {settings?.gstNumber || fallbackSettings.gstNumber}</span>
              </div>
            </div>
          </div>

          {/* Col 2: Categories */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Categories
            </h4>
            <ul className="space-y-2 text-xs">
              {categories.map(cat => (
                <li key={cat}>
                  <Link
                    to={`/products?category=${encodeURIComponent(cat)}`}
                    className="hover:text-emerald-400 transition-colors block"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Navigation & Services */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="hover:text-emerald-400 transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-emerald-400 transition-colors">All 85 Products</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-emerald-400 transition-colors">About Company</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-emerald-400 transition-colors">Customer Enquiry</Link>
              </li>
              <li>
                <Link to="/account" className="hover:text-emerald-400 transition-colors">Track Order</Link>
              </li>
              <li>
                <Link to="/admin/catalog-check" className="hover:text-amber-400 transition-colors flex items-center gap-1 text-stone-400">
                  <span>Diagnostic Check</span>
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Legal & Compliance */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Policy &amp; Legal
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <Link to="/agricultural-product-notice" className="hover:text-emerald-400 transition-colors flex items-center gap-1">
                  <FileText className="w-3 h-3" />
                  Agro Notice
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="hover:text-emerald-400 transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-emerald-400 transition-colors">Terms of Service</Link>
              </li>
              <li>
                <Link to="/shipping" className="hover:text-emerald-400 transition-colors">Shipping Information</Link>
              </li>
              <li>
                <Link to="/return-policy" className="hover:text-emerald-400 transition-colors">Return Policy</Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar & Disclaimer */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-[11px] text-stone-500">
          <p>
            &copy; {currentYear} Emergene &amp; Topgro. All rights reserved. Sourced from the Updated Product Catalogue 2026.
          </p>
          <p className="max-w-md">
            Agricultural solutions are subject to local agronomic conditions. Always verify product label instructions before application.
          </p>
        </div>
      </div>
    </footer>
  );
};
