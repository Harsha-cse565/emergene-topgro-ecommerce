export interface PackSize {
  size: string;
  price: number;
  priceAvailable: boolean;
}

export interface Product {
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
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  count: number;
  active: boolean;
}

export interface CartItem {
  productId: string;
  name: string;
  slug: string;
  size: string;
  price: number;
  priceAvailable: boolean;
  quantity: number;
  image: string;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  customer: {
    userId?: string;
    name: string;
    email: string;
    phone: string;
  };
  items: CartItem[];
  shippingAddress: ShippingAddress;
  subtotal: number;
  deliveryCharge: number;
  tax: number;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  trackingNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'admin';
  addresses?: Array<{
    id: string;
    title: string;
    address: string;
    city: string;
    state: string;
    pinCode: string;
  }>;
}

export interface Settings {
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

export interface Enquiry {
  _id: string;
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
  status: 'new' | 'responded';
  createdAt: string;
}
