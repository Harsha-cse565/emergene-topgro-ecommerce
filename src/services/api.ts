import { Product, Category, Order, User, Settings, Enquiry } from '../types/index.ts';
import fallbackProducts from '../data/products.json';
import fallbackCategories from '../data/categories.json';
import fallbackSettings from '../data/settings.json';

const API_BASE = '/api';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('et_auth_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const api = {
  // Products
  async getProducts(params?: {
    search?: string;
    category?: string;
    packSize?: string;
    inStock?: boolean;
    featured?: boolean;
    sortBy?: string;
    page?: number;
    limit?: number;
  }): Promise<{ products: Product[]; total: number; page: number; totalPages: number }> {
    try {
      const query = new URLSearchParams();
      if (params?.search) query.set('search', params.search);
      if (params?.category) query.set('category', params.category);
      if (params?.packSize) query.set('packSize', params.packSize);
      if (params?.inStock) query.set('inStock', 'true');
      if (params?.featured) query.set('featured', 'true');
      if (params?.sortBy) query.set('sortBy', params.sortBy);
      if (params?.page) query.set('page', String(params.page));
      if (params?.limit) query.set('limit', String(params.limit));

      const res = await fetch(`${API_BASE}/products?${query.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch products');
      return await res.json();
    } catch (err) {
      console.warn('Using client-side products fallback:', err);
      let list = [...(fallbackProducts as unknown as Product[])];
      if (params?.search) {
        const q = params.search.toLowerCase();
        list = list.filter(p => 
          p.name.toLowerCase().includes(q) || 
          p.category.toLowerCase().includes(q) || 
          p.usedFor.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q)
        );
      }
      if (params?.category && params.category !== 'All') {
        list = list.filter(p => p.category.toLowerCase() === params.category!.toLowerCase());
      }
      if (params?.featured) {
        list = list.filter(p => p.featured);
      }
      if (params?.inStock) {
        list = list.filter(p => p.stock > 0);
      }
      return {
        products: list,
        total: list.length,
        page: 1,
        totalPages: 1
      };
    }
  },

  async getProductBySlug(slug: string): Promise<Product> {
    try {
      const res = await fetch(`${API_BASE}/products/${slug}`);
      if (!res.ok) throw new Error('Product not found');
      return await res.json();
    } catch (err) {
      const found = (fallbackProducts as unknown as Product[]).find(p => p.slug === slug || p._id === slug);
      if (found) return found;
      throw err;
    }
  },

  async getCatalogDiagnostic(): Promise<any> {
    const res = await fetch(`${API_BASE}/products/diagnostic`);
    if (!res.ok) throw new Error('Failed to fetch catalog diagnostic');
    return await res.json();
  },

  async createProduct(data: Partial<Product>): Promise<Product> {
    const res = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to create product');
    }
    return await res.json();
  },

  async updateProduct(id: string, data: Partial<Product>): Promise<Product> {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to update product');
    }
    return await res.json();
  },

  async uploadProductImage(
    id: string,
    payload: { imageBase64?: string; imageUrl?: string; filename?: string }
  ): Promise<{ success: boolean; imageUrl: string; product: Product }> {
    const res = await fetch(`${API_BASE}/products/${id}/upload-image`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to upload product image');
    }
    return await res.json();
  },

  async batchUploadImages(
    images: Array<{ name: string; data: string }>
  ): Promise<{ success: boolean; totalProcessed: number; matchedCount: number; results: any[] }> {
    const res = await fetch(`${API_BASE}/products/batch-upload-images`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ images })
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to batch upload images');
    }
    return await res.json();
  },

  async deleteProduct(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() }
    });
    if (!res.ok) throw new Error('Failed to delete product');
  },

  // Categories
  async getCategories(): Promise<Category[]> {
    try {
      const res = await fetch(`${API_BASE}/categories`);
      if (!res.ok) throw new Error('Failed to fetch categories');
      return await res.json();
    } catch {
      return fallbackCategories as Category[];
    }
  },

  async createCategory(data: Partial<Category>): Promise<Category> {
    const res = await fetch(`${API_BASE}/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create category');
    return await res.json();
  },

  async updateCategory(id: string, data: Partial<Category>): Promise<Category> {
    const res = await fetch(`${API_BASE}/categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update category');
    return await res.json();
  },

  async deleteCategory(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/categories/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() }
    });
    if (!res.ok) throw new Error('Failed to delete category');
  },

  // Orders
  async getOrders(): Promise<Order[]> {
    const res = await fetch(`${API_BASE}/orders`, {
      headers: { ...getAuthHeader() }
    });
    if (!res.ok) throw new Error('Failed to fetch orders');
    return await res.json();
  },

  async getMyOrders(): Promise<Order[]> {
    const res = await fetch(`${API_BASE}/orders/my-orders`, {
      headers: { ...getAuthHeader() }
    });
    if (!res.ok) throw new Error('Failed to fetch user orders');
    return await res.json();
  },

  async trackOrder(identifier: string): Promise<Order> {
    const res = await fetch(`${API_BASE}/orders/lookup/${encodeURIComponent(identifier)}`);
    if (!res.ok) throw new Error('Order not found');
    return await res.json();
  },

  async createOrder(data: any): Promise<Order> {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to place order');
    }
    return await res.json();
  },

  async updateOrderStatus(id: string, status: string, notes?: string): Promise<Order> {
    const res = await fetch(`${API_BASE}/orders/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ status, notes })
    });
    if (!res.ok) throw new Error('Failed to update order status');
    return await res.json();
  },

  // Auth
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || 'Login failed');
    }
    return await res.json();
  },

  async register(name: string, email: string, password: string, phone?: string): Promise<{ user: User; token: string }> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, phone })
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || 'Registration failed');
    }
    return await res.json();
  },

  async adminLogin(email: string, password: string): Promise<{ user: User; token: string }> {
    const res = await fetch(`${API_BASE}/auth/admin-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || 'Admin login failed');
    }
    return await res.json();
  },

  async getCurrentUser(): Promise<User> {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: { ...getAuthHeader() }
    });
    if (!res.ok) throw new Error('Not authenticated');
    return await res.json();
  },

  // Enquiries
  async getEnquiries(): Promise<Enquiry[]> {
    const res = await fetch(`${API_BASE}/enquiries`, {
      headers: { ...getAuthHeader() }
    });
    if (!res.ok) throw new Error('Failed to fetch enquiries');
    return await res.json();
  },

  async submitEnquiry(data: { name: string; phone: string; email?: string; subject?: string; message: string }): Promise<Enquiry> {
    const res = await fetch(`${API_BASE}/enquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to submit enquiry');
    }
    return await res.json();
  },

  async updateEnquiryStatus(id: string, status: 'new' | 'responded'): Promise<Enquiry> {
    const res = await fetch(`${API_BASE}/enquiries/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ status })
    });
    if (!res.ok) throw new Error('Failed to update enquiry status');
    return await res.json();
  },

  // Settings
  async getSettings(): Promise<Settings> {
    try {
      const res = await fetch(`${API_BASE}/settings`);
      if (!res.ok) throw new Error('Failed to fetch settings');
      return await res.json();
    } catch {
      return fallbackSettings as unknown as Settings;
    }
  },

  async updateSettings(data: Partial<Settings>): Promise<Settings> {
    const res = await fetch(`${API_BASE}/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update settings');
    return await res.json();
  }
};
