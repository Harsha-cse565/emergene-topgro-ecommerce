import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar.tsx';
import { Footer } from '../components/Footer.tsx';
import { StickyBottomCart } from '../components/StickyBottomCart.tsx';

export const RootLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 font-sans selection:bg-emerald-200 selection:text-emerald-900">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <StickyBottomCart />
      <Footer />
    </div>
  );
};
