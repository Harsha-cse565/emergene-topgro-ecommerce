import React, { useState, useEffect } from 'react';
import { FolderTree, Plus, Edit2, Trash2, X, Check, Sprout } from 'lucide-react';
import { api } from '../../services/api.ts';
import { Category } from '../../types/index.ts';
import { LoadingSpinner } from '../../components/StateIndicators.tsx';

export const AdminCategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    icon: 'Sprout',
    active: true
  });

  const loadCategories = async () => {
    setLoading(true);
    try {
      const list = await api.getCategories();
      setCategories(list);
    } catch (err) {
      console.error('Failed to load categories', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const openAddModal = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      slug: '',
      description: '',
      icon: 'Sprout',
      active: true
    });
    setModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      icon: cat.icon || 'Sprout',
      active: cat.active
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: Partial<Category> = {
        name: formData.name,
        slug: formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: formData.description,
        icon: formData.icon,
        active: formData.active
      };

      if (editingCategory) {
        await api.updateCategory(editingCategory.id, payload);
      } else {
        await api.createCategory(payload);
      }

      setModalOpen(false);
      await loadCategories();
    } catch (err: any) {
      alert(err.message || 'Failed to save category');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete category "${name}"?`)) {
      try {
        await api.deleteCategory(id);
        await loadCategories();
      } catch (err: any) {
        alert(err.message || 'Failed to delete category');
      }
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight">
            Agricultural Categories ({categories.length})
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Classifications stored in database and fully editable by Admin.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {loading ? (
        <LoadingSpinner message="Loading agricultural categories..." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map(cat => (
            <div
              key={cat.id}
              className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                    <FolderTree className="w-4 h-4" />
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    cat.active ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-500'
                  }`}>
                    {cat.active ? 'Active' : 'Disabled'}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-stone-900">{cat.name}</h3>
                <p className="text-xs text-stone-500 mt-1 leading-relaxed">{cat.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                <span className="font-semibold text-emerald-800">
                  {cat.count || 0} Linked Products
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(cat)}
                    className="p-1.5 text-stone-600 hover:text-amber-700 hover:bg-stone-100 rounded"
                    title="Edit Category"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id, cat.name)}
                    className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded"
                    title="Delete Category"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-stone-200 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h2 className="text-base font-black text-stone-900">
                {editingCategory ? 'Edit Category' : 'Create Category'}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">URL Slug</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={e => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="e.g. bio-stimulants"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:bg-white"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="catActive"
                  checked={formData.active}
                  onChange={e => setFormData({ ...formData, active: e.target.checked })}
                  className="text-emerald-700 rounded"
                />
                <label htmlFor="catActive" className="font-semibold text-stone-800 cursor-pointer">
                  Category is Active in Store
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-stone-300 text-stone-700 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-700 text-white font-bold rounded-lg hover:bg-emerald-800 cursor-pointer"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
