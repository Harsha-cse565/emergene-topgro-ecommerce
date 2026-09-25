import React, { useState, useEffect } from 'react';
import { Settings, Save, CheckCircle2, MessageCircle, Upload, QrCode } from 'lucide-react';
import { api } from '../../services/api.ts';
import { Settings as SettingsType } from '../../types/index.ts';
import { LoadingSpinner } from '../../components/StateIndicators.tsx';

export const AdminSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<SettingsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      try {
        const data = await api.getSettings();
        setSettings(data);
      } catch (err) {
        console.error('Failed to load settings', err);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const readImageAsDataUrl = (file: File) => new Promise<string>((resolve, reject) => {
    if (!file.type.startsWith('image/')) { reject(new Error('Please select an image file.')); return; }
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Failed to read image.'));
    reader.readAsDataURL(file);
  });

  const handleImageUpload = async (field: 'logo' | 'paymentQr', file?: File) => {
    if (!file || !settings) return;
    try {
      const dataUrl = await readImageAsDataUrl(file);
      setSettings({ ...settings, [field]: dataUrl });
    } catch (err: any) { alert(err.message || 'Failed to load image'); }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    try {
      const updated = await api.updateSettings(settings);
      setSettings(updated);
      setSavedNotice(true);
      setTimeout(() => setSavedNotice(false), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return <LoadingSpinner message="Retrieving configuration..." />;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      
      {/* Title */}
      <div className="flex items-center justify-between pb-4 border-b border-stone-200">
        <div>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight">
            Store &amp; Commercial Settings
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Configure enterprise details, tax identifiers, logistics rules, and WhatsApp enquiry desk.
          </p>
        </div>
      </div>

      {savedNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Store settings successfully updated and saved to database!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        
        {/* Company Identity */}
        <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-xs space-y-4">
          <h2 className="text-xs font-bold text-stone-900 uppercase tracking-wider pb-2 border-b border-stone-100">
            Enterprise Identity &amp; Tax Registration
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Company Name</label>
              <input
                type="text"
                value={settings.companyName}
                onChange={e => setSettings({ ...settings, companyName: e.target.value })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Tagline</label>
              <input
                type="text"
                value={settings.tagline}
                onChange={e => setSettings({ ...settings, tagline: e.target.value })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">GST Registration Number</label>
              <input
                type="text"
                value={settings.gstNumber}
                onChange={e => setSettings({ ...settings, gstNumber: e.target.value })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:bg-white font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Company Logo</label>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-20 h-14 rounded-lg border border-stone-200 bg-stone-50 flex items-center justify-center overflow-hidden">
                  {settings.logo ? <img src={settings.logo} alt="Company logo" className="max-w-full max-h-full object-contain" /> : <span className="text-[10px] text-stone-400">No logo</span>}
                </div>
                <label className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-700 text-white font-bold cursor-pointer hover:bg-emerald-800">
                  <Upload className="w-4 h-4" /> Upload Logo
                  <input type="file" accept="image/*" className="hidden" onChange={e => handleImageUpload('logo', e.target.files?.[0])} />
                </label>
              </div>
              <input type="text" value={settings.logo.startsWith('data:') ? '[Uploaded image]' : settings.logo} readOnly className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg font-mono text-[10px]" />
            </div>
          </div>
        </div>

        {/* Payment QR */}
        <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-xs space-y-4">
          <h2 className="text-xs font-bold text-stone-900 uppercase tracking-wider pb-2 border-b border-stone-100 flex items-center gap-2">
            <QrCode className="w-4 h-4 text-emerald-600" /> Payment QR Code
          </h2>
          <p className="text-[11px] text-stone-500">Upload the QR code customers should use for UPI payment. Customers can view it during checkout but cannot replace it.</p>
          <div className="flex flex-wrap items-center gap-4">
            <div className="w-40 h-40 rounded-xl border border-stone-200 bg-stone-50 flex items-center justify-center overflow-hidden">
              {settings.paymentQr ? <img src={settings.paymentQr} alt="Payment QR code" className="w-full h-full object-contain p-2" /> : <span className="text-xs text-stone-400 text-center px-3">No payment QR uploaded</span>}
            </div>
            <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-700 text-white font-bold cursor-pointer hover:bg-emerald-800">
              <Upload className="w-4 h-4" /> Upload Payment QR
              <input type="file" accept="image/*" className="hidden" onChange={e => handleImageUpload('paymentQr', e.target.files?.[0])} />
            </label>
          </div>
        </div>

        {/* Contact & WhatsApp Desk */}
        <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-xs space-y-4">
          <h2 className="text-xs font-bold text-stone-900 uppercase tracking-wider pb-2 border-b border-stone-100 flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-emerald-600" />
            <span>Customer Communications &amp; WhatsApp Enquiry Desk</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                WhatsApp Enquiry Number (with country code, e.g. 919876543210) *
              </label>
              <input
                type="text"
                required
                value={settings.whatsappNumber}
                onChange={e => setSettings({ ...settings, whatsappNumber: e.target.value })}
                placeholder="919876543210"
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:bg-white font-mono font-bold text-emerald-800"
              />
              <span className="text-[10px] text-stone-400 mt-0.5 block">
                Powers all "Enquire on WhatsApp" product buttons and direct sales chats.
              </span>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Phone Number</label>
              <input
                type="text"
                value={settings.phone}
                onChange={e => setSettings({ ...settings, phone: e.target.value })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Customer Support Email</label>
              <input
                type="email"
                value={settings.email}
                onChange={e => setSettings({ ...settings, email: e.target.value })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:bg-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-stone-700 mb-1">Official Physical Address</label>
              <textarea
                rows={2}
                value={settings.address}
                onChange={e => setSettings({ ...settings, address: e.target.value })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* Shipping & Delivery Rules */}
        <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-xs space-y-4">
          <h2 className="text-xs font-bold text-stone-900 uppercase tracking-wider pb-2 border-b border-stone-100">
            Logistics &amp; Shipping Charges
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Standard Shipping Charge (₹)
              </label>
              <input
                type="number"
                value={settings.shippingCharge}
                onChange={e => setSettings({ ...settings, shippingCharge: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Free Shipping Threshold (₹)
              </label>
              <input
                type="number"
                value={settings.freeShippingThreshold}
                onChange={e => setSettings({ ...settings, freeShippingThreshold: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:bg-white"
              />
              <span className="text-[10px] text-stone-400 mt-0.5 block">
                Orders with subtotal above this value automatically receive zero delivery fee.
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving Configuration...' : 'Save Settings'}</span>
          </button>
        </div>

      </form>

    </div>
  );
};
