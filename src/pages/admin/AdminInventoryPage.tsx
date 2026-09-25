import React, { useState, useEffect } from 'react';
import { Boxes, Search, CheckCircle2, AlertTriangle, XCircle, Save } from 'lucide-react';
import { api } from '../../services/api.ts';
import { Product } from '../../types/index.ts';
import { LoadingSpinner } from '../../components/StateIndicators.tsx';

export const AdminInventoryPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'in-stock' | 'low-stock' | 'out-of-stock'>('All');
  const [editingStock, setEditingStock] = useState<Record<string, number>>({});
  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await api.getProducts({ limit: 100 });
      setProducts(res.products);
      const stockMap: Record<string, number> = {};
      res.products.forEach(p => {
        stockMap[p._id] = p.stock;
      });
      setEditingStock(stockMap);
    } catch (err) {
      console.error('Failed to load inventory', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleStockChange = (id: string, val: number) => {
    setEditingStock(prev => ({ ...prev, [id]: Math.max(0, val) }));
  };

  const handleSaveStock = async (id: string) => {
    const newStock = editingStock[id];
    try {
      await api.updateProduct(id, { stock: newStock });
      setSavedNotice(`Stock updated for ${id}`);
      setTimeout(() => setSavedNotice(null), 2000);
      setProducts(prev => prev.map(p => p._id === id ? { ...p, stock: newStock } : p));
    } catch (err: any) {
      alert(err.message || 'Failed to update stock');
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());

    const isOut = p.stock <= 0;
    const isLow = p.stock > 0 && p.stock <= (p.lowStockThreshold || 10);
    const isIn = p.stock > (p.lowStockThreshold || 10);

    let matchesStatus = true;
    if (statusFilter === 'out-of-stock') matchesStatus = isOut;
    if (statusFilter === 'low-stock') matchesStatus = isLow;
    if (statusFilter === 'in-stock') matchesStatus = isIn;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight">
            Inventory &amp; Stock Control
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Monitor real-time warehouse counts, minimum safety buffers, and depletion warnings.
          </p>
        </div>
      </div>

      {savedNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{savedNotice}</span>
        </div>
      )}

      {/* Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search inventory by product, category, or SKU..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <div className="flex gap-2">
          {[
            { id: 'All', label: 'All Inventory' },
            { id: 'in-stock', label: 'In Stock' },
            { id: 'low-stock', label: 'Low Stock' },
            { id: 'out-of-stock', label: 'Out of Stock' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id as any)}
              className={`px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                statusFilter === tab.id
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-white border border-stone-300 text-stone-700 hover:bg-stone-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory Table (Stage 16) */}
      {loading ? (
        <LoadingSpinner message="Loading warehouse inventory balances..." />
      ) : (
        <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-700">
              <thead className="bg-stone-50 border-b border-stone-200 uppercase text-[10px] font-black text-stone-500 tracking-wider">
                <tr>
                  <th className="p-3.5">Product</th>
                  <th className="p-3.5">Pack Size(s)</th>
                  <th className="p-3.5">Stock Level</th>
                  <th className="p-3.5">Minimum Stock</th>
                  <th className="p-3.5">Inventory Status</th>
                  <th className="p-3.5 text-right">Update</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-medium">
                {filteredProducts.map(prod => {
                  const currentStock = editingStock[prod._id] ?? prod.stock;
                  const isOut = currentStock <= 0;
                  const isLow = currentStock > 0 && currentStock <= (prod.lowStockThreshold || 10);

                  return (
                    <tr key={prod._id} className="hover:bg-stone-50/70 transition-colors">
                      <td className="p-3.5">
                        <div className="flex items-center gap-3">
                          <img
                            src={prod.images[0] || '/images/products/placeholder.svg'}
                            alt={prod.name}
                            className="w-10 h-10 object-contain p-1 bg-stone-50 rounded border border-stone-200 shrink-0"
                          />
                          <div>
                            <p className="font-bold text-stone-900">{prod.name}</p>
                            <span className="text-[10px] text-stone-400 font-mono">{prod.sku}</span>
                          </div>
                        </div>
                      </td>

                      <td className="p-3.5">
                        {prod.packSizes && prod.packSizes.length > 0 ? (
                          <span className="text-stone-800">
                            {prod.packSizes.map(ps => ps.size).join(', ')}
                          </span>
                        ) : (
                          <span className="text-stone-400 italic">Information not available</span>
                        )}
                      </td>

                      <td className="p-3.5">
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="0"
                            value={currentStock}
                            onChange={e => handleStockChange(prod._id, parseInt(e.target.value, 10) || 0)}
                            className="w-20 px-2 py-1 bg-stone-50 border border-stone-300 rounded font-bold text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-600"
                          />
                          <span className="text-stone-400 text-[11px]">units</span>
                        </div>
                      </td>

                      <td className="p-3.5 text-stone-500 font-semibold">
                        {prod.lowStockThreshold || 10} units
                      </td>

                      <td className="p-3.5">
                        {isOut ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-100 text-red-800 border border-red-200">
                            <XCircle className="w-3 h-3 text-red-600" />
                            RED: Out of Stock
                          </span>
                        ) : isLow ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                            <AlertTriangle className="w-3 h-3 text-amber-600" />
                            YELLOW: Low Stock
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            GREEN: In Stock
                          </span>
                        )}
                      </td>

                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => handleSaveStock(prod._id)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-stone-900 hover:bg-black text-white text-[11px] font-bold rounded-lg transition-colors cursor-pointer"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>Save</span>
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

    </div>
  );
};
