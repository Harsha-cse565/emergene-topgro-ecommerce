import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../data');

// Ensure data dir exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function readJSON<T>(fileName: string, defaultValue: T): T {
  const filePath = path.join(DATA_DIR, fileName);
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error(`Error reading ${fileName}:`, err);
  }
  return defaultValue;
}

function writeJSON<T>(fileName: string, data: T): void {
  const filePath = path.join(DATA_DIR, fileName);
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    // Also sync to frontend src/data for development consistency
    const srcFilePath = path.resolve(__dirname, '../../src/data', fileName);
    if (fs.existsSync(path.dirname(srcFilePath))) {
      fs.writeFileSync(srcFilePath, JSON.stringify(data, null, 2), 'utf8');
    }
  } catch (err) {
    console.error(`Error writing ${fileName}:`, err);
  }
}

export interface PackSize {
  size: string;
  price: number;
  priceAvailable: boolean;
}

export interface ProductDocument {
  _id: string;
  name: string;
  slug: string;
  category: string;
  images: string[];
  brand: string;
  description: string;
  usedFor: string;
  packSizes: PackSize[];
  priceAvailable: boolean;
  startingPrice: number;
  stock: number;
  lowStockThreshold: number;
  sku: string;
  featured: boolean;
  active: boolean;
  catalogPage: number;
  itemOnPage: number;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface CategoryDocument {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  count: number;
  active: boolean;
}

export interface OrderDocument {
  _id: string;
  orderNumber: string;
  customer: {
    userId?: string;
    name: string;
    email: string;
    phone: string;
  };
  items: Array<{
    productId: string;
    name: string;
    slug: string;
    size: string;
    price: number;
    priceAvailable: boolean;
    quantity: number;
    image: string;
  }>;
  shippingAddress: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pinCode: string;
  };
  subtotal: number;
  deliveryCharge: number;
  tax: number;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  trackingNotes?: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface UserDocument {
  _id: string;
  name: string;
  email: string;
  passwordHash: string;
  phone: string;
  role: 'customer' | 'admin';
  addresses: any[];
  createdAt: string | Date;
}

export interface EnquiryDocument {
  _id: string;
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
  status: 'new' | 'responded';
  createdAt: string | Date;
}

export interface SettingsDocument {
  companyName: string;
  tagline: string;
  logo: string;
  paymentQr: string;
  phone: string;
  email: string;
  address: string;
  whatsappNumber: string;
  gstNumber: string;
  shippingCharge: number;
  freeShippingThreshold: number;
  currency: string;
  currencySymbol: string;
  socialLinks: {
    facebook: string;
    twitter: string;
    instagram: string;
    linkedin: string;
  };
}

export const db = {
  products: {
    getAll(): ProductDocument[] {
      return readJSON<ProductDocument[]>('products.json', []);
    },
    getBySlug(slug: string): ProductDocument | undefined {
      const all = readJSON<ProductDocument[]>('products.json', []);
      return all.find(p => p.slug.toLowerCase() === slug.toLowerCase() || p._id === slug);
    },
    getById(id: string): ProductDocument | undefined {
      const all = readJSON<ProductDocument[]>('products.json', []);
      return all.find(p => p._id === id);
    },
    create(data: Partial<ProductDocument>): ProductDocument {
      const all = readJSON<ProductDocument[]>('products.json', []);
      const newId = `prod_${String(all.length + 1).padStart(3, '0')}`;
      const newProduct: ProductDocument = {
        _id: newId,
        name: data.name || 'Untitled Product',
        slug: data.slug || `prod-${Date.now()}`,
        category: data.category || 'Specialty Agricultural Products',
        images: data.images && data.images.length > 0 ? data.images : ['/images/products/placeholder.svg'],
        brand: data.brand || 'EMERGENE',
        description: data.description || 'Information not available',
        usedFor: data.usedFor || 'Information not available',
        packSizes: data.packSizes || [],
        priceAvailable: Boolean(data.packSizes && data.packSizes.length > 0 && data.packSizes.some(ps => ps.priceAvailable)),
        startingPrice: data.packSizes && data.packSizes.length > 0 ? Math.min(...data.packSizes.map(ps => ps.price)) : 0,
        stock: data.stock !== undefined ? data.stock : 50,
        lowStockThreshold: data.lowStockThreshold || 10,
        sku: data.sku || `ET-GEN-${all.length + 1}`,
        featured: Boolean(data.featured),
        active: data.active !== undefined ? data.active : true,
        catalogPage: data.catalogPage || 1,
        itemOnPage: data.itemOnPage || 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      all.push(newProduct);
      writeJSON('products.json', all);
      return newProduct;
    },
    update(id: string, updates: Partial<ProductDocument>): ProductDocument | null {
      const all = readJSON<ProductDocument[]>('products.json', []);
      const index = all.findIndex(p => p._id === id || p.slug === id);
      if (index === -1) return null;

      const current = all[index];
      const hasPrices = updates.packSizes ? updates.packSizes.length > 0 && updates.packSizes.some(p => p.priceAvailable) : current.priceAvailable;
      const startingPrice = updates.packSizes && updates.packSizes.length > 0 
        ? Math.min(...updates.packSizes.filter(p => p.priceAvailable).map(p => p.price)) 
        : current.startingPrice;

      const updated = {
        ...current,
        ...updates,
        priceAvailable: hasPrices,
        startingPrice: startingPrice || 0,
        updatedAt: new Date().toISOString()
      };

      all[index] = updated;
      writeJSON('products.json', all);
      return updated;
    },
    delete(id: string): boolean {
      const all = readJSON<ProductDocument[]>('products.json', []);
      const index = all.findIndex(p => p._id === id || p.slug === id);
      if (index === -1) return false;
      all.splice(index, 1);
      writeJSON('products.json', all);
      return true;
    }
  },

  categories: {
    getAll(): CategoryDocument[] {
      return readJSON<CategoryDocument[]>('categories.json', []);
    },
    create(data: Partial<CategoryDocument>): CategoryDocument {
      const all = readJSON<CategoryDocument[]>('categories.json', []);
      const newCategory: CategoryDocument = {
        id: `cat_${all.length + 1}`,
        name: data.name || 'New Category',
        slug: data.slug || `cat-${Date.now()}`,
        description: data.description || '',
        icon: data.icon || 'Sprout',
        count: 0,
        active: data.active !== undefined ? data.active : true
      };
      all.push(newCategory);
      writeJSON('categories.json', all);
      return newCategory;
    },
    update(id: string, updates: Partial<CategoryDocument>): CategoryDocument | null {
      const all = readJSON<CategoryDocument[]>('categories.json', []);
      const index = all.findIndex(c => c.id === id || c.slug === id);
      if (index === -1) return null;
      all[index] = { ...all[index], ...updates };
      writeJSON('categories.json', all);
      return all[index];
    },
    delete(id: string): boolean {
      const all = readJSON<CategoryDocument[]>('categories.json', []);
      const index = all.findIndex(c => c.id === id || c.slug === id);
      if (index === -1) return false;
      all.splice(index, 1);
      writeJSON('categories.json', all);
      return true;
    }
  },

  orders: {
    getAll(): OrderDocument[] {
      return readJSON<OrderDocument[]>('orders.json', []);
    },
    getById(id: string): OrderDocument | undefined {
      const all = readJSON<OrderDocument[]>('orders.json', []);
      return all.find(o => o._id === id || o.orderNumber.toLowerCase() === id.toLowerCase());
    },
    create(data: Partial<OrderDocument>): OrderDocument {
      const all = readJSON<OrderDocument[]>('orders.json', []);
      const randNum = Math.floor(1000 + Math.random() * 9000);
      const newOrder: OrderDocument = {
        _id: `ord_${Date.now()}`,
        orderNumber: `ET-${new Date().getFullYear()}-${randNum}`,
        customer: data.customer || { name: 'Guest', email: '', phone: '' },
        items: data.items || [],
        shippingAddress: data.shippingAddress || {
          fullName: '',
          phone: '',
          address: '',
          city: '',
          state: '',
          pinCode: ''
        },
        subtotal: data.subtotal || 0,
        deliveryCharge: data.deliveryCharge || 0,
        tax: data.tax || 0,
        total: data.total || 0,
        paymentMethod: data.paymentMethod || 'Cash on Delivery',
        paymentStatus: data.paymentStatus || 'Pending',
        orderStatus: data.orderStatus || 'Order Placed',
        trackingNotes: 'Order received. Processing at central depot.',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      all.unshift(newOrder);
      writeJSON('orders.json', all);
      return newOrder;
    },
    updateStatus(id: string, orderStatus: string, notes?: string): OrderDocument | null {
      const all = readJSON<OrderDocument[]>('orders.json', []);
      const index = all.findIndex(o => o._id === id || o.orderNumber === id);
      if (index === -1) return null;
      all[index].orderStatus = orderStatus;
      if (notes) all[index].trackingNotes = notes;
      all[index].updatedAt = new Date().toISOString();
      writeJSON('orders.json', all);
      return all[index];
    }
  },

  users: {
    getAll(): UserDocument[] {
      return readJSON<UserDocument[]>('users.json', []);
    },
    findByEmail(email: string): UserDocument | undefined {
      const all = readJSON<UserDocument[]>('users.json', []);
      return all.find(u => u.email.toLowerCase() === email.toLowerCase());
    },
    findById(id: string): UserDocument | undefined {
      const all = readJSON<UserDocument[]>('users.json', []);
      return all.find(u => u._id === id);
    },
    create(data: Partial<UserDocument>): UserDocument {
      const all = readJSON<UserDocument[]>('users.json', []);
      const newUser: UserDocument = {
        _id: `user_${Date.now()}`,
        name: data.name || '',
        email: data.email || '',
        passwordHash: data.passwordHash || '',
        phone: data.phone || '',
        role: data.role || 'customer',
        addresses: data.addresses || [],
        createdAt: new Date().toISOString()
      };
      all.push(newUser);
      writeJSON('users.json', all);
      return newUser;
    },
    updateAddresses(userId: string, addresses: any[]): UserDocument | null {
      const all = readJSON<UserDocument[]>('users.json', []);
      const index = all.findIndex(u => u._id === userId);
      if (index === -1) return null;
      all[index].addresses = addresses;
      writeJSON('users.json', all);
      return all[index];
    }
  },

  enquiries: {
    getAll(): EnquiryDocument[] {
      return readJSON<EnquiryDocument[]>('enquiries.json', []);
    },
    create(data: Partial<EnquiryDocument>): EnquiryDocument {
      const all = readJSON<EnquiryDocument[]>('enquiries.json', []);
      const newEnq: EnquiryDocument = {
        _id: `enq_${Date.now()}`,
        name: data.name || '',
        phone: data.phone || '',
        email: data.email || '',
        subject: data.subject || '',
        message: data.message || '',
        status: 'new',
        createdAt: new Date().toISOString()
      };
      all.unshift(newEnq);
      writeJSON('enquiries.json', all);
      return newEnq;
    },
    updateStatus(id: string, status: 'new' | 'responded'): EnquiryDocument | null {
      const all = readJSON<EnquiryDocument[]>('enquiries.json', []);
      const index = all.findIndex(e => e._id === id);
      if (index === -1) return null;
      all[index].status = status;
      writeJSON('enquiries.json', all);
      return all[index];
    }
  },

  settings: {
    get(): SettingsDocument {
      return readJSON<SettingsDocument>('settings.json', {
        companyName: 'Emergene & Topgro Agricultural Solutions',
        tagline: 'Quality Agricultural Products for Better Farming',
        logo: '/images/logo.svg',
        paymentQr: '',
        phone: '+91 98765 43210',
        email: 'info@emergene-topgro.com',
        address: 'Agricultural Trade Hub, Warehouse Plot 42, Hubballi, Karnataka',
        whatsappNumber: '919876543210',
        gstNumber: '29AABCE1234F1Z9',
        shippingCharge: 80,
        freeShippingThreshold: 1500,
        currency: 'INR',
        currencySymbol: '₹',
        socialLinks: {
          facebook: 'https://facebook.com',
          twitter: 'https://twitter.com',
          instagram: 'https://instagram.com',
          linkedin: 'https://linkedin.com'
        }
      });
    },
    update(updates: Partial<SettingsDocument>): SettingsDocument {
      const current = this.get();
      const merged: SettingsDocument = {
        ...current,
        ...updates,
        socialLinks: {
          ...current.socialLinks,
          ...(updates.socialLinks || {})
        }
      };
      writeJSON('settings.json', merged);
      return merged;
    }
  }
};
