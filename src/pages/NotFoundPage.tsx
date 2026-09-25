import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, ArrowLeft, Search } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
        <Sprout className="w-8 h-8" />
      </div>
      <h1 className="text-4xl sm:text-6xl font-black text-stone-900 tracking-tight">404</h1>
      <h2 className="text-lg font-bold text-stone-800 mt-2">Catalogue Page Not Found</h2>
      <p className="text-xs text-stone-500 mt-1 max-w-sm">
        The agricultural product or page you are searching for might have moved or is not listed.
      </p>

      <div className="mt-6 flex flex-wrap gap-3 justify-center">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-emerald-700 text-white font-bold text-xs rounded-xl hover:bg-emerald-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Homepage</span>
        </Link>
        <Link
          to="/products"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 border border-stone-300 text-stone-700 font-bold text-xs rounded-xl hover:bg-stone-50 transition-colors"
        >
          <Search className="w-4 h-4" />
          <span>Search 85 Products</span>
        </Link>
      </div>
    </div>
  );
};
