import React from 'react';
import { Shield, Truck, RotateCcw, FileText } from 'lucide-react';
import fallbackSettings from '../data/settings.json';

export const PrivacyPolicyPage: React.FC = () => (
  <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-6 text-xs text-stone-700 leading-relaxed">
    <div className="border-b border-stone-200 pb-4">
      <h1 className="text-2xl sm:text-3xl font-black text-stone-900">Privacy Policy</h1>
      <p className="text-xs text-stone-500 mt-1">Last Updated: September 2026</p>
    </div>
    <p>
      At Emergene &amp; Topgro, we prioritize farmer and trade customer privacy. This Privacy Policy details how we collect, use, and safeguard personal and farm contact information when you use our web platform.
    </p>
    <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider">Information We Collect</h2>
    <p>
      When placing orders or submitting inquiries, we collect basic transactional information including your name, contact phone number, email address, postal dispatch address, and GSTIN (if provided for commercial invoicing).
    </p>
    <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider">Payment Data Security</h2>
    <p>
      We do not collect or store credit card numbers, debit card PINs, or UPI security credentials on our servers. All digital payments are processed through RBI-authorized payment gateways featuring standard 256-bit encryption.
    </p>
  </div>
);

export const TermsPage: React.FC = () => (
  <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-6 text-xs text-stone-700 leading-relaxed">
    <div className="border-b border-stone-200 pb-4">
      <h1 className="text-2xl sm:text-3xl font-black text-stone-900">Terms of Service</h1>
      <p className="text-xs text-stone-500 mt-1">Effective Date: 2026</p>
    </div>
    <p>
      By accessing the Emergene &amp; Topgro website or ordering products through our catalogue, you agree to comply with standard Indian commercial and agricultural trade terms.
    </p>
    <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider">Catalogue Pricing &amp; Net Invoice Price</h2>
    <p>
      Stated prices represent the Net Invoice Price (inclusive of Goods and Services Tax). In cases where specific pack sizes or products are designated as "Price on Request", quotations are issued based on prevailing regional distribution rates.
    </p>
    <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider">Order Acceptance</h2>
    <p>
      Orders submitted via the online checkout are subject to inventory verification and transport feasibility to the specified pin code. In the event of temporary out-of-stock conditions, customers will be notified immediately.
    </p>
  </div>
);

export const ShippingPage: React.FC = () => (
  <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-6 text-xs text-stone-700 leading-relaxed">
    <div className="border-b border-stone-200 pb-4">
      <h1 className="text-2xl sm:text-3xl font-black text-stone-900">Shipping &amp; Delivery Information</h1>
      <p className="text-xs text-stone-500 mt-1">Dispatches from Hubballi Central Warehouse</p>
    </div>
    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
      <p className="font-bold text-emerald-900">Delivery Charges &amp; Free Shipping Rule:</p>
      <p className="text-emerald-800">
        Orders with value of <strong>₹{fallbackSettings.freeShippingThreshold}</strong> or above qualify for <strong>FREE DELIVERY</strong>. For orders below this threshold, a flat delivery fee of <strong>₹{fallbackSettings.shippingCharge}</strong> applies.
      </p>
    </div>
    <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider">Dispatch Timelines</h2>
    <p>
      Confirmed consignments are packed within 24 to 48 business hours. Standard transit duration spans 3 to 7 working days depending on destination district and road transport accessibility.
    </p>
    <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider">Bulk Fertilizer Sacks (25kg - 50kg)</h2>
    <p>
      Bulk sacks (such as YieldMax 25kg, Remedy Top 50kg, and Ankur Top 50kg) are transported through verified regional parcel logistics services with farm-gate or local transporter godown delivery options.
    </p>
  </div>
);

export const ReturnPolicyPage: React.FC = () => (
  <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-6 text-xs text-stone-700 leading-relaxed">
    <div className="border-b border-stone-200 pb-4">
      <h1 className="text-2xl sm:text-3xl font-black text-stone-900">Return &amp; Replacement Policy</h1>
      <p className="text-xs text-stone-500 mt-1">Agricultural Inputs Integrity Guarantee</p>
    </div>
    <p>
      Due to the biological and chemical integrity requirements of agricultural formulations, items can only be returned if received in a damaged, leaked, or incorrect condition.
    </p>
    <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider">Reporting Damage</h2>
    <p>
      Any transit breakage, seal compromise, or carton damage must be reported within 48 hours of parcel receipt along with photographic evidence to our customer support desk at {fallbackSettings.email} or via WhatsApp at +{fallbackSettings.whatsappNumber}.
    </p>
    <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider">Replacement Process</h2>
    <p>
      Upon review and verification by our warehouse inspection team, a replacement consignment will be dispatched immediately at zero additional expense to the farmer.
    </p>
  </div>
);
