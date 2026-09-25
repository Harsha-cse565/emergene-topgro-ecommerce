import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Eye, CheckCircle2, AlertCircle } from 'lucide-react';
import { Product } from '../types/index.ts';
import { useCart } from '../context/CartContext.tsx';

interface ProductCardProps {
  product: Product;
  onProductUpdated?: (updatedProduct: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onProductUpdated }) => {
  const { addToCart } = useCart();
  const [currentProduct, setCurrentProduct] = useState<Product>(product);

  React.useEffect(() => {
    setCurrentProduct(product);
  }, [product]);

  const primaryImage = currentProduct.images && currentProduct.images.length > 0
    ? currentProduct.images[0]
    : '/images/products/placeholder.svg';
  const hasPrices = currentProduct.priceAvailable && currentProduct.packSizes && currentProduct.packSizes.length > 0;
  const isOutOfStock = currentProduct.stock <= 0;

  const packSizesLabel = currentProduct.packSizes && currentProduct.packSizes.length > 0
    ? currentProduct.packSizes.map(ps => ps.size).join(', ')
    : 'Information not available';

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isOutOfStock) {
      addToCart(currentProduct);
    }
  };

  return (
    <>
      <div className="group bg-white rounded-xl border border-stone-200 overflow-hidden hover:shadow-md transition-all duration-200 flex flex-col h-full relative">
        {/* Product Image Container */}
        <div className="relative block aspect-[4/3] bg-stone-50 overflow-hidden">
          <Link to={`/products/${currentProduct.slug}`} className="block w-full h-full">
            <img
              src={primaryImage}
              alt={`${currentProduct.name} agricultural product`}
              loading="lazy"
              className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-300"
            />
          </Link>

          {/* Category pill */}
          <span className="absolute top-2.5 left-2.5 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-800/80 text-white backdrop-blur-xs">
            {currentProduct.category}
          </span>
          {currentProduct.featured && (
            <span className="absolute top-2.5 right-2.5 text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500 text-white shadow-xs">
              Featured
            </span>
          )}

        </div>

        {/* Card Content */}
        <div className="p-3.5 sm:p-4 flex flex-col flex-grow">
          {/* Brand */}
          <p className="text-[11px] font-semibold tracking-wider text-emerald-700 uppercase">
            {currentProduct.brand}
          </p>

          {/* Product Name */}
          <Link to={`/products/${currentProduct.slug}`} className="mt-0.5">
            <h3 className="text-sm sm:text-base font-bold text-stone-900 line-clamp-1 group-hover:text-emerald-700 transition-colors">
              {currentProduct.name}
            </h3>
          </Link>

          {/* Used For */}
          <div className="mt-1 min-h-[34px]">
            <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
              <span className="font-medium text-stone-600">Used For: </span>
              {currentProduct.usedFor || 'Information not available'}
            </p>
          </div>

          {/* Pack Size */}
          <div className="mt-2 text-xs text-stone-600 bg-stone-50 px-2 py-1 rounded border border-stone-100 flex items-center justify-between">
            <span className="text-[11px] font-medium text-stone-500">Pack:</span>
            <span className="font-semibold text-stone-800 text-[11px] truncate max-w-[150px]" title={packSizesLabel}>
              {packSizesLabel}
            </span>
          </div>

          {/* Price & Stock status */}
          <div className="mt-3 pt-2 border-t border-stone-100 flex items-baseline justify-between gap-1">
            <div>
              <span className="text-[10px] uppercase text-stone-400 font-semibold block">Price</span>
              {hasPrices ? (
                <div className="flex items-baseline gap-1">
                  <span className="text-base sm:text-lg font-black text-stone-900">
                    ₹{currentProduct.startingPrice.toLocaleString('en-IN')}
                  </span>
                  {currentProduct.packSizes.length > 1 && (
                    <span className="text-[10px] text-stone-500 font-medium">onwards</span>
                  )}
                </div>
              ) : (
                <span className="text-xs sm:text-sm font-bold text-amber-700">
                  Price on Request
                </span>
              )}
            </div>

            <div className="text-right">
              {isOutOfStock ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-red-700">
                  <AlertCircle className="w-3 h-3" />
                  Out of Stock
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700">
                  <CheckCircle2 className="w-3 h-3" />
                  In Stock
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-4 pt-1 grid grid-cols-2 gap-2">
            <Link
              to={`/products/${currentProduct.slug}`}
              className="w-full inline-flex items-center justify-center gap-1 px-2.5 py-2 text-xs font-semibold rounded-lg border border-stone-300 text-stone-700 bg-white hover:bg-stone-50 hover:border-stone-400 transition-colors"
            >
              <Eye className="w-3.5 h-3.5 text-stone-500" />
              <span>Details</span>
            </Link>

            <button
              onClick={handleQuickAdd}
              disabled={isOutOfStock}
              className={`w-full inline-flex items-center justify-center gap-1 px-2.5 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                isOutOfStock
                  ? 'bg-stone-100 text-stone-400 cursor-not-allowed border border-stone-200'
                  : 'bg-emerald-700 text-white hover:bg-emerald-800 shadow-xs'
              }`}
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>
        </div>
      </div>

    </>
  );
};
