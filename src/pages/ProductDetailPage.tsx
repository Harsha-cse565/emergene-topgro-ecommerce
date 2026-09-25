import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ShoppingCart,
  Zap,
  CheckCircle2,
  AlertCircle,
  Package,
  ShieldCheck,
  Tag,
  Share2,
  Sprout,
  Check,
} from 'lucide-react';
import { api } from '../services/api.ts';
import { Product, PackSize } from '../types/index.ts';
import { useCart } from '../context/CartContext.tsx';
import { WhatsAppButton } from '../components/WhatsAppButton.tsx';
import { LoadingSpinner, ErrorMessage } from '../components/StateIndicators.tsx';
import { ProductCard } from '../components/ProductCard.tsx';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedPackSize, setSelectedPackSize] = useState<PackSize | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [addedNotice, setAddedNotice] = useState<boolean>(false);

  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);

  useEffect(() => {
    async function loadProduct() {
      if (!slug) return;
      setLoading(true);
      setError(null);
      try {
        const prod = await api.getProductBySlug(slug);
        setProduct(prod);

        // Update document title for SEO (Stage 22)
        document.title = `${prod.name} — ${prod.category} | Emergene & Topgro`;

        // Select first pack size if available
        if (prod.packSizes && prod.packSizes.length > 0) {
          setSelectedPackSize(prod.packSizes[0]);
        } else {
          setSelectedPackSize(null);
        }

        // Fetch related products in the same category
        const relatedRes = await api.getProducts({ category: prod.category, limit: 5 });
        setRelatedProducts(relatedRes.products.filter(p => p._id !== prod._id).slice(0, 4));
      } catch (err: any) {
        setError(err.message || 'Product not found.');
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [slug]);

  if (loading) {
    return <LoadingSpinner message="Retrieving product specifications..." />;
  }

  if (error || !product) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4">
        <ErrorMessage message={error || 'Product not found.'} />
        <div className="text-center mt-4">
          <Link
            to="/products"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-700 text-white font-bold text-xs rounded-lg hover:bg-emerald-800"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Products</span>
          </Link>
        </div>
      </div>
    );
  }

  const imagesList = product.images && product.images.length > 0 ? product.images : ['/images/products/placeholder.svg'];
  const primaryImage = imagesList[selectedImageIndex] || imagesList[0];
  const hasPackSizes = product.packSizes && product.packSizes.length > 0;
  const isOutOfStock = product.stock <= 0;

  // Active price based on selected pack size
  const activePrice = selectedPackSize && selectedPackSize.priceAvailable
    ? selectedPackSize.price
    : (product.priceAvailable ? product.startingPrice : null);

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, selectedPackSize || undefined, quantity);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2500);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addToCart(product, selectedPackSize || undefined, quantity);
    navigate('/cart');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-stone-500">
        <Link to="/" className="hover:text-emerald-700">Home</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-emerald-700">Products</Link>
        <span>/</span>
        <Link
          to={`/products?category=${encodeURIComponent(product.category)}`}
          className="hover:text-emerald-700"
        >
          {product.category}
        </Link>
        <span>/</span>
        <span className="font-semibold text-stone-800 truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Layout (Stage 7) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* LEFT: Large Product Image */}
        <div className="lg:col-span-6">
          <div className="bg-stone-50 rounded-2xl border border-stone-200 p-6 sm:p-10 flex items-center justify-center relative overflow-hidden shadow-xs group/imgcontainer">
            <div className="w-full max-w-md aspect-square flex items-center justify-center">
              <img
                src={primaryImage}
                alt={`${product.name} agricultural product`}
                loading="eager"
                className="max-h-[420px] w-auto object-contain filter drop-shadow-lg"
              />
            </div>

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-1.5">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-md bg-emerald-800 text-white uppercase tracking-wider">
                <Sprout className="w-3 h-3" />
                {product.brand}
              </span>
              <span className="inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded bg-stone-200 text-stone-700">
                Cat. Page {product.catalogPage}
              </span>
            </div>

          </div>

        </div>

        {/* RIGHT: Product Information & Controls (Stage 7) */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Header & Category */}
          <div>
            <div className="flex items-center justify-between gap-2">
              <Link
                to={`/products?category=${encodeURIComponent(product.category)}`}
                className="text-xs font-bold text-emerald-700 uppercase tracking-wider hover:underline"
              >
                {product.category}
              </Link>
              <span className="text-xs text-stone-400 font-mono">SKU: {product.sku}</span>
            </div>

            <h1 className="mt-1 text-2xl sm:text-4xl font-black text-stone-900 tracking-tight">
              {product.name}
            </h1>
          </div>

          {/* Used For (Stage 7) */}
          <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl">
            <h2 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">
              Used For / Intended Purpose
            </h2>
            <p className="text-sm text-stone-800 font-medium leading-relaxed">
              {product.usedFor || 'Information not available'}
            </p>
          </div>

          {/* Pack Size Selector (Stage 7) */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2.5">
              Available Pack Size
            </label>
            {hasPackSizes ? (
              <div className="flex flex-wrap gap-2.5">
                {product.packSizes.map((ps, idx) => {
                  const isSelected = selectedPackSize?.size === ps.size;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedPackSize(ps)}
                      className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                        isSelected
                          ? 'border-emerald-700 bg-emerald-700 text-white shadow-xs'
                          : 'border-stone-300 bg-white text-stone-800 hover:border-emerald-500 hover:bg-emerald-50/50'
                      }`}
                    >
                      <span>{ps.size}</span>
                      {ps.priceAvailable && (
                        <span className="ml-2 opacity-90">₹{ps.price}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-stone-500 italic">
                Pack size information not available in supplied price list.
              </p>
            )}
          </div>

          {/* Price & Stock Display (Stage 7) */}
          <div className="p-4 bg-stone-100/70 border border-stone-200 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
                Net Price (incl. GST)
              </span>
              {activePrice !== null ? (
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-stone-900">
                    ₹{activePrice.toLocaleString('en-IN')}
                  </span>
                  {selectedPackSize && (
                    <span className="text-xs text-stone-500 font-medium">
                      per {selectedPackSize.size}
                    </span>
                  )}
                </div>
              ) : (
                <div className="mt-1">
                  <span className="text-xl font-bold text-amber-700">Price on Request</span>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    Contact sales desk for verified dealer &amp; farm gate quotation.
                  </p>
                </div>
              )}
            </div>

            <div className="text-right">
              {isOutOfStock ? (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-bold">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Out of Stock
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  In Stock ({product.stock} units)
                </span>
              )}
            </div>
          </div>

          {/* Quantity Selector & Action Buttons (Stage 7) */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-stone-300 rounded-lg bg-white overflow-hidden">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 text-stone-600 hover:bg-stone-100 font-bold text-sm cursor-pointer"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  max={product.stock || 100}
                  value={quantity}
                  onChange={e => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
                  className="w-12 text-center text-sm font-bold text-stone-900 focus:outline-none border-none"
                />
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 text-stone-600 hover:bg-stone-100 font-bold text-sm cursor-pointer"
                >
                  +
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`flex-1 inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                  isOutOfStock
                    ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                    : 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-md hover:shadow-lg'
                }`}
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>

              {/* Buy Now Button */}
              <button
                type="button"
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className={`flex-1 inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                  isOutOfStock
                    ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                    : 'bg-stone-900 hover:bg-black text-white shadow-md hover:shadow-lg'
                }`}
              >
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Buy Now</span>
              </button>
            </div>

            {/* Added to cart toast */}
            {addedNotice && (
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs font-semibold flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600" />
                  Added {quantity} × {product.name} ({selectedPackSize ? selectedPackSize.size : 'Standard'}) to cart!
                </span>
                <Link to="/cart" className="underline font-bold hover:text-emerald-950">
                  View Cart
                </Link>
              </div>
            )}

            {/* Enquire on WhatsApp (Stage 19) */}
            <div className="pt-2">
              <WhatsAppButton
                productName={product.name}
                packSize={selectedPackSize ? selectedPackSize.size : 'Standard Pack'}
                className="w-full py-3 text-sm"
              />
            </div>
          </div>

          {/* Product Description Details */}
          <div className="pt-6 border-t border-stone-200 space-y-2 text-xs text-stone-600 leading-relaxed">
            <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
              Product Overview
            </h3>
            <p>{product.description}</p>
          </div>

        </div>

      </div>

      {/* Related Products from same category */}
      {relatedProducts.length > 0 && (
        <section className="pt-10 border-t border-stone-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-stone-900">
              More in {product.category}
            </h2>
            <Link
              to={`/products?category=${encodeURIComponent(product.category)}`}
              className="text-xs font-bold text-emerald-700 hover:underline"
            >
              View Category
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map(rel => (
              <ProductCard key={rel._id} product={rel} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
};
