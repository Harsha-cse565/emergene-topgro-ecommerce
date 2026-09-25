import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, ShieldCheck, Layers, ArrowRight, CheckCircle2 } from 'lucide-react';
import fallbackSettings from '../data/settings.json';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      
      {/* Header */}
      <div className="max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
          <Sprout className="w-3.5 h-3.5 text-emerald-700" />
          <span>About Emergene &amp; Topgro</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-stone-900 tracking-tight">
          Agricultural Solutions for Crop Protection &amp; Nutrition
        </h1>
        <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
          Emergene &amp; Topgro provides verified agricultural inputs spanning water-soluble fertilizers, micronutrients, insecticides, fungicides, herbicides, plant growth regulators, and research seed varieties.
        </p>
      </div>

      {/* Core Pillars (Factual - no fake claims) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <Layers className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-stone-900">Our Products</h2>
          <p className="text-xs text-stone-500 leading-relaxed">
            The Emergene &amp; Topgro 2026 catalogue contains 85 commercial formulations. Products are provided in manufacturer packaging ranging from 100 gram foliar packs to 50 kilogram soil application sacks.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <Sprout className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-stone-900">Agricultural Solutions</h2>
          <p className="text-xs text-stone-500 leading-relaxed">
            Targeted solutions address specific field crop requirements including balanced NPK ratios, zinc deficiency correction, iron chlorosis prevention, pre-emergence weed control, and pest mitigation.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-stone-900">Quality &amp; Transparency</h2>
          <p className="text-xs text-stone-500 leading-relaxed">
            Every product entry displays authentic packaging names and specifications directly derived from the official 2026 catalogue. Unverified claims or arbitrary dosages are not published.
          </p>
        </div>

      </div>

      {/* Catalogue Transparency Notice (Stage 20) */}
      <div className="bg-stone-50 p-6 sm:p-8 rounded-2xl border border-stone-200 space-y-4">
        <h2 className="text-lg font-bold text-stone-900">Product Lineup Scope</h2>
        <p className="text-xs text-stone-600 leading-relaxed">
          The 2026 product catalogue comprises key agricultural lines:
        </p>
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs text-stone-700 font-medium">
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Water Soluble NPK &amp; Single Nutrients</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Chelated Micronutrient Blends</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Crop Protection Insecticides &amp; Fungicides</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Plant Growth Stimulants &amp; Regulators</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Humic &amp; Seaweed Granular Biostimulants</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Certified Paddy &amp; Hybrid Maize Seed Lines</span>
          </li>
        </ul>
      </div>

      {/* Contact Callout */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-emerald-800 text-white rounded-2xl">
        <div>
          <h3 className="text-base font-bold">Have questions or need assistance?</h3>
          <p className="text-xs text-emerald-100 mt-0.5">
            Reach our agricultural trade desk via online enquiry or telephone.
          </p>
        </div>
        <Link
          to="/contact"
          className="px-5 py-2.5 bg-white text-emerald-900 hover:bg-emerald-50 font-bold text-xs rounded-xl shadow-xs transition-colors shrink-0"
        >
          Contact Trade Desk
        </Link>
      </div>

    </div>
  );
};
