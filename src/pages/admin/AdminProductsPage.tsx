import React, { useState, useEffect } from 'react';
import {
  Package,
  Plus,
  Search,
  Edit2,
  Trash2,
  Check,
  X,
  Eye,
  AlertCircle,
  ExternalLink,
  Layers,
  Camera,
  Upload
} from 'lucide-react';
import { api } from '../../services/api.ts';
import { Product, PackSize } from '../../types/index.ts';
import { LoadingSpinner } from '../../components/StateIndicators.tsx';
import { ChangeImageModal } from '../../components/ChangeImageModal.tsx';

export const AdminProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Change Image Modal state
  const [selectedProductForImage, setSelectedProductForImage] = useState<Product | null>(null);
  const [changeImageModalOpen, setChangeImageModalOpen] = useState(false);

  // Edit / Add Modal state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isNewProduct, setIsNewProduct] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  // Form Fields
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    category: 'Fertilizers & Plant Nutrition',
    brand: 'EMERGENE',
    description: '',
    usedFor: '',
    stock: 50,
    lowStockThreshold: 10,
    sku: '',
    featured: false,
    active: true,
    packSizesText: '', // format: "1 kg:158, 25 kg:3413"
    imageUrl: '',
    imageBase64: ''
  });

  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await api.getProducts({ limit: 100 });
      setProducts(res.products);
    } catch (err) {
      console.error('Failed to load products', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const openAddModal = () => {
    setIsNewProduct(true);
    setEditingProduct(null);
    setFormData({
      name: '',
      slug: '',
      category: 'Fertilizers & Plant Nutrition',
      brand: 'EMERGENE',
      description: '',
      usedFor: '',
      stock: 50,
      lowStockThreshold: 10,
      sku: `ET-NEW-${Date.now().toString().slice(-4)}`,
      featured: false,
      active: true,
      packSizesText: '',
      imageUrl: '',
      imageBase64: ''
    });
    setModalOpen(true);
  };

  const openEditModal = (prod: Product) => {
    setIsNewProduct(false);
    setEditingProduct(prod);

    const packSizesString = (prod.packSizes || [])
      .map(ps => (ps.priceAvailable ? `${ps.size}:${ps.price}` : ps.size))
      .join(', ');

    setFormData({
      name: prod.name,
      slug: prod.slug,
      category: prod.category,
      brand: prod.brand,
      description: prod.description,
      usedFor: prod.usedFor,
      stock: prod.stock,
      lowStockThreshold: prod.lowStockThreshold || 10,
      sku: prod.sku,
      featured: prod.featured,
      active: prod.active,
      packSizesText: packSizesString,
      imageUrl: prod.images && prod.images[0] ? prod.images[0] : '',
      imageBase64: ''
    });
    setModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Parse pack sizes text
      const parsedPackSizes: PackSize[] = [];
      if (formData.packSizesText.trim()) {
        const parts = formData.packSizesText.split(',');
        for (const part of parts) {
          const trimmed = part.trim();
          if (trimmed.includes(':')) {
            const [size, priceStr] = trimmed.split(':');
            parsedPackSizes.push({
              size: size.trim(),
              price: parseFloat(priceStr.trim()) || 0,
              priceAvailable: true
            });
          } else if (trimmed) {
            parsedPackSizes.push({
              size: trimmed,
              price: 0,
              priceAvailable: false
            });
          }
        }
      }

      const payload: Partial<Product> = {
        name: formData.name,
        slug: formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        category: formData.category,
        brand: formData.brand,
        description: formData.description,
        usedFor: formData.usedFor,
        stock: Number(formData.stock),
        lowStockThreshold: Number(formData.lowStockThreshold),
        sku: formData.sku,
        featured: formData.featured,
        active: formData.active,
        packSizes: parsedPackSizes
      };

      if (formData.imageUrl) {
        payload.images = [formData.imageUrl, ...(editingProduct?.images || []).filter(img => img !== formData.imageUrl)];
      }

      let saved: Product;
      if (isNewProduct) {
        saved = await api.createProduct(payload);
      } else if (editingProduct) {
        saved = await api.updateProduct(editingProduct._id, payload);
      }

      if (formData.imageBase64 && saved!) {
        await api.uploadProductImage(saved._id, {
          imageBase64: formData.imageBase64,
          filename: `${saved.slug}-${Date.now()}`
        });
      }

      setModalOpen(false);
      await loadProducts();
    } catch (err: any) {
      alert(err.message || 'Error saving product');
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        await api.deleteProduct(id);
        await loadProducts();
      } catch (err: any) {
        alert(err.message || 'Error deleting product');
      }
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.usedFor && p.usedFor.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = categoryFilter === 'All' || p.category.toLowerCase() === categoryFilter.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const categories = [
    'All',
    'Fertilizers & Plant Nutrition',
    'Micronutrients',
    'Fungicides',
    'Insecticides',
    'Herbicides',
    'Plant Growth Regulators',
    'Organic / Biological Products',
    'Seeds',
    'Specialty Agricultural Products'
  ];

  return (
    <div className="space-y-6">
      
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight">
            Product Management ({products.length} Products)
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Full control over packaging names, pack sizes, pricing, and catalogue specifications.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search by product name, SKU, or crop use..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <select
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
          className="px-3 py-2 text-xs font-semibold bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 text-stone-800"
        >
          {categories.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Product Table (Stage 14) */}
      {loading ? (
        <LoadingSpinner message="Loading products table..." />
      ) : (
        <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-700">
              <thead className="bg-stone-50 border-b border-stone-200 uppercase text-[10px] font-black text-stone-500 tracking-wider">
                <tr>
                  <th className="p-3.5">Product</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Pack Sizes &amp; Price</th>
                  <th className="p-3.5">Stock</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-medium">
                {filteredProducts.map(prod => {
                  const hasPrices = prod.priceAvailable;
                  return (
                    <tr key={prod._id} className="hover:bg-stone-50/70 transition-colors">
                      <td className="p-3.5">
                        <div className="flex items-center gap-3">
                          <div
                            onClick={() => {
                              setSelectedProductForImage(prod);
                              setChangeImageModalOpen(true);
                            }}
                            className="relative group/thumb cursor-pointer shrink-0"
                            title="Click to change product packaging image"
                          >
                            <img
                              src={prod.images[0] || '/images/products/placeholder.svg'}
                              alt={prod.name}
                              className="w-10 h-10 object-contain p-1 bg-white rounded border border-stone-200 group-hover/thumb:border-emerald-500 shadow-2xs"
                            />
                            <div className="absolute inset-0 bg-emerald-950/60 rounded flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity">
                              <Camera className="w-4 h-4 text-white" />
                            </div>
                          </div>
                          <div>
                            <p className="font-bold text-stone-900">{prod.name}</p>
                            <span className="text-[10px] font-mono text-stone-400">{prod.sku}</span>
                          </div>
                        </div>
                      </td>

                      <td className="p-3.5">
                        <span className="font-semibold text-stone-800">{prod.category}</span>
                        <p className="text-[10px] text-stone-400">{prod.brand}</p>
                      </td>

                      <td className="p-3.5">
                        {prod.packSizes && prod.packSizes.length > 0 ? (
                          <div className="space-y-0.5">
                            {prod.packSizes.slice(0, 3).map((ps, i) => (
                              <div key={i} className="text-[11px]">
                                <span className="font-semibold">{ps.size}</span>
                                {ps.priceAvailable ? (
                                  <span className="text-emerald-700 ml-1.5">₹{ps.price}</span>
                                ) : (
                                  <span className="text-amber-600 ml-1.5 text-[10px]">On Request</span>
                                )}
                              </div>
                            ))}
                            {prod.packSizes.length > 3 && (
                              <span className="text-[10px] text-stone-400">+{prod.packSizes.length - 3} more</span>
                            )}
                          </div>
                        ) : (
                          <span className="text-stone-400 text-[11px] italic">Not available</span>
                        )}
                      </td>

                      <td className="p-3.5">
                        <span className={`font-bold ${
                          prod.stock <= 0 ? 'text-red-600' : prod.stock < 10 ? 'text-amber-600' : 'text-stone-900'
                        }`}>
                          {prod.stock} units
                        </span>
                      </td>

                      <td className="p-3.5">
                        <div className="flex flex-col gap-1">
                          <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold w-max ${
                            prod.active ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'
                          }`}>
                            {prod.active ? 'Active' : 'Disabled'}
                          </span>
                          {prod.featured && (
                            <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 w-max">
                              Featured
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="p-3.5 text-right space-x-1.5 whitespace-nowrap">
                        <button
                          onClick={() => {
                            setSelectedProductForImage(prod);
                            setChangeImageModalOpen(true);
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors cursor-pointer"
                          title="Change Product Image"
                        >
                          <Camera className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Change Image</span>
                        </button>

                        <button
                          onClick={() => openEditModal(prod)}
                          className="p-1.5 text-stone-600 hover:text-amber-700 hover:bg-stone-100 rounded cursor-pointer"
                          title="Edit Product Details"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(prod._id, prod.name)}
                          className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded cursor-pointer"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit / Add Product Modal (Stage 14) */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-stone-200 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h2 className="text-base font-black text-stone-900">
                {isNewProduct ? 'Add Agricultural Product' : `Edit Product: ${formData.name}`}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    Packaging Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    URL Slug *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={e => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:bg-white"
                  >
                    {categories.filter(c => c !== 'All').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    Brand *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.brand}
                    onChange={e => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    SKU Code
                  </label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={e => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    Stock Inventory Quantity
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={e => setFormData({ ...formData, stock: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:bg-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-stone-700 mb-1">
                    Used For (Crop purpose / formulation indication)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.usedFor}
                    onChange={e => setFormData({ ...formData, usedFor: e.target.value })}
                    placeholder="e.g. Balanced NPK nutrition. (Do not invent claims if unknown)"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:bg-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-stone-700 mb-1">
                    Pack Sizes &amp; Prices (Format: "100 g:63, 250 g:131, 1 kg:436" or just "100 g, 500 g" for Price on Request)
                  </label>
                  <input
                    type="text"
                    value={formData.packSizesText}
                    onChange={e => setFormData({ ...formData, packSizesText: e.target.value })}
                    placeholder="1 kg:158, 25 kg:3413"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:bg-white font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-stone-700 mb-1">
                    Full Description
                  </label>
                  <textarea
                    rows={2}
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:bg-white"
                  />
                </div>

                {/* Packaging Image from PDF or File */}
                <div className="sm:col-span-2 bg-stone-50 border border-stone-200 rounded-xl p-3.5 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-stone-900 flex items-center gap-1.5 text-xs">
                      <Camera className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Packaging Image (PDF Screenshot / Photo)</span>
                    </label>
                    <span className="text-[10px] text-stone-500">JPG, PNG, WEBP, or SVG</span>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-lg bg-white border border-stone-200 p-1 flex items-center justify-center shrink-0">
                      <img
                        src={formData.imageBase64 || formData.imageUrl || '/images/products/placeholder.svg'}
                        alt="Preview"
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>

                    <div className="flex-1 space-y-2">
                      <div className="flex gap-2">
                        <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-lg shadow-xs transition-colors">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload File / PDF Crop</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = (evt) => {
                                  setFormData(prev => ({
                                    ...prev,
                                    imageBase64: evt.target?.result as string
                                  }));
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                        </label>
                        {formData.imageBase64 && (
                          <span className="text-[11px] text-emerald-700 font-bold self-center">✓ New file ready</span>
                        )}
                      </div>

                      <div>
                        <input
                          type="text"
                          value={formData.imageUrl}
                          onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                          placeholder="Or enter Image URL (e.g. /images/products/...)"
                          className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg text-xs focus:outline-none focus:border-emerald-600"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6 sm:col-span-2 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer font-semibold text-stone-800">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={e => setFormData({ ...formData, featured: e.target.checked })}
                      className="text-amber-600 rounded"
                    />
                    <span>Mark as Featured Product</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer font-semibold text-stone-800">
                    <input
                      type="checkbox"
                      checked={formData.active}
                      onChange={e => setFormData({ ...formData, active: e.target.checked })}
                      className="text-emerald-700 rounded"
                    />
                    <span>Active in Storefront</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-stone-300 text-stone-700 font-semibold rounded-lg hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-700 hover:bg-amber-800 text-white font-bold rounded-lg cursor-pointer"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Direct Change Product Image Modal */}
      <ChangeImageModal
        isOpen={changeImageModalOpen}
        onClose={() => setChangeImageModalOpen(false)}
        product={selectedProductForImage}
        onImageUpdated={(updated) => {
          setProducts(prev => prev.map(p => p._id === updated._id ? updated : p));
        }}
      />
    </div>
  );
};
