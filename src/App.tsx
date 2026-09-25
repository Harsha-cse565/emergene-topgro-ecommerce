import React from 'react';
import { BrowserRouter, Routes, Route, ScrollRestoration } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.tsx';
import { CartProvider } from './context/CartContext.tsx';
import { RootLayout } from './layouts/RootLayout.tsx';
import { AdminLayout } from './layouts/AdminLayout.tsx';

// Storefront Pages
import { HomePage } from './pages/HomePage.tsx';
import { ProductsPage } from './pages/ProductsPage.tsx';
import { ProductDetailPage } from './pages/ProductDetailPage.tsx';
import { CartPage } from './pages/CartPage.tsx';
import { CheckoutPage } from './pages/CheckoutPage.tsx';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage.tsx';
import { CustomerAccountPage } from './pages/CustomerAccountPage.tsx';
import { LoginPage } from './pages/LoginPage.tsx';
import { RegisterPage } from './pages/RegisterPage.tsx';
import { AboutPage } from './pages/AboutPage.tsx';
import { ContactPage } from './pages/ContactPage.tsx';
import { AgroNoticePage } from './pages/AgroNoticePage.tsx';
import { PrivacyPolicyPage, TermsPage, ShippingPage, ReturnPolicyPage } from './pages/LegalPages.tsx';
import { NotFoundPage } from './pages/NotFoundPage.tsx';

// Admin Pages
import { AdminLoginPage } from './pages/AdminLoginPage.tsx';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage.tsx';
import { AdminProductsPage } from './pages/admin/AdminProductsPage.tsx';
import { AdminCategoriesPage } from './pages/admin/AdminCategoriesPage.tsx';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage.tsx';
import { AdminInventoryPage } from './pages/admin/AdminInventoryPage.tsx';
import { AdminEnquiriesPage } from './pages/admin/AdminEnquiriesPage.tsx';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage.tsx';
import { AdminCatalogCheckPage } from './pages/admin/AdminCatalogCheckPage.tsx';

function ScrollToTop() {
  const { pathname } = React.useMemo(() => window.location, []);
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            {/* Public Storefront Routes */}
            <Route path="/" element={<RootLayout />}>
              <Route index element={<HomePage />} />
              <Route path="products" element={<ProductsPage />} />
              <Route path="products/:slug" element={<ProductDetailPage />} />
              <Route path="cart" element={<CartPage />} />
              <Route path="checkout" element={<CheckoutPage />} />
              <Route path="order-confirmation/:orderNumber" element={<OrderConfirmationPage />} />
              <Route path="account" element={<CustomerAccountPage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="contact" element={<ContactPage />} />
              <Route path="agricultural-product-notice" element={<AgroNoticePage />} />
              <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
              <Route path="terms" element={<TermsPage />} />
              <Route path="shipping" element={<ShippingPage />} />
              <Route path="return-policy" element={<ReturnPolicyPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>

            {/* Admin Login Route */}
            <Route path="/admin/login" element={<AdminLoginPage />} />

            {/* Protected Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboardPage />} />
              <Route path="products" element={<AdminProductsPage />} />
              <Route path="categories" element={<AdminCategoriesPage />} />
              <Route path="orders" element={<AdminOrdersPage />} />
              <Route path="inventory" element={<AdminInventoryPage />} />
              <Route path="enquiries" element={<AdminEnquiriesPage />} />
              <Route path="settings" element={<AdminSettingsPage />} />
              <Route path="catalog-check" element={<AdminCatalogCheckPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}
