import React, { useState, useEffect, useRef } from 'react';
import {
  Camera,
  Upload,
  Link as LinkIcon,
  X,
  Check,
  AlertCircle,
  Image as ImageIcon,
  Sparkles,
  ArrowRight,
  RefreshCw,
  FolderOpen
} from 'lucide-react';
import { Product } from '../types/index.ts';
import { api } from '../services/api.ts';

interface ChangeImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onImageUpdated?: (updatedProduct: Product) => void;
}

const PRESET_GALLERY_IMAGES = [
  { label: 'YieldMax 19:19:19 (Sack)', url: '/images/products/yieldmax-19-19-19.jpg' },
  { label: 'Shield Fungicide (Pouch)', url: '/images/products/shield.jpg' },
  { label: 'Shield Plant Guard (Pouch)', url: '/images/products/shield-plant-guard.jpg' },
  { label: 'Almighty Insecticide (Can)', url: '/images/products/almighty.jpg' },
  { label: 'Sengen Granules (Pouch)', url: '/images/products/sengen-granules.jpg' },
  { label: 'Grovel Bio-Stimulant (Bottle)', url: '/images/products/grovel.jpg' },
  { label: 'KartapGard (Box)', url: '/images/products/kartapgard.jpg' },
  { label: 'Dinogard (Box)', url: '/images/products/dinogard.jpg' },
  { label: 'Delite Harvest (Bucket)', url: '/images/products/delite.jpg' },
  { label: 'Calciwin Nutrients (Bottle)', url: '/images/products/calciwin.jpg' },
  { label: 'revive Plant Tonic (Bottle)', url: '/images/products/revive-bottle.jpg' },
  { label: 'Titus Gold (Box)', url: '/images/products/titus-gold.jpg' },
  { label: 'Veera Fighter (Jar)', url: '/images/products/veera-bottle.jpg' },
  { label: 'Quantum Power (Foil)', url: '/images/products/quantum-power.jpg' },
  { label: 'JUDO Insecticide (Canister)', url: '/images/products/judo.jpg' },
  { label: 'GLUFOSTAR Herbicide (Bottle)', url: '/images/products/glufostar.jpg' },
  { label: 'RNR Sona Paddy Seeds (Sack)', url: '/images/products/rnr-sona.jpg' }
];

export const ChangeImageModal: React.FC<ChangeImageModalProps> = ({
  isOpen,
  onClose,
  product,
  onImageUpdated
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'url' | 'presets'>('upload');
  const [fileBase64, setFileBase64] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [imageUrlInput, setImageUrlInput] = useState<string>('');
  const [selectedPreset, setSelectedPreset] = useState<string>('');
  const [setPrimaryOnly, setSetPrimaryOnly] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && product) {
      setFileBase64(null);
      setFileName('');
      setImageUrlInput(product.images && product.images[0] ? product.images[0] : '');
      setSelectedPreset('');
      setStatus(null);
      setIsSubmitting(false);
    }
  }, [isOpen, product]);

  // Support paste screenshot (Ctrl+V) from clipboard
  useEffect(() => {
    if (!isOpen) return;

    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            handleProcessFile(file);
            setActiveTab('upload');
            break;
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [isOpen]);

  if (!isOpen || !product) return null;

  const currentImage = product.images && product.images[0] ? product.images[0] : '/images/products/placeholder.svg';

  const previewImage =
    activeTab === 'upload'
      ? fileBase64 || currentImage
      : activeTab === 'url'
      ? imageUrlInput || currentImage
      : selectedPreset || currentImage;

  const handleProcessFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setStatus({ type: 'error', message: 'Selected file is not an image.' });
      return;
    }
    setFileName(file.name);
    setStatus(null);

    const reader = new FileReader();
    reader.onload = (evt) => {
      setFileBase64(evt.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleProcessFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleProcessFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    setIsSubmitting(true);
    setStatus(null);

    try {
      let payload: { imageBase64?: string; imageUrl?: string; filename?: string; setPrimaryOnly?: boolean } = {
        setPrimaryOnly
      };

      if (activeTab === 'upload') {
        if (!fileBase64) {
          throw new Error('Please select an image file or drop a screenshot first.');
        }
        payload.imageBase64 = fileBase64;
        payload.filename = `${product.slug}-${Date.now()}`;
      } else if (activeTab === 'url') {
        if (!imageUrlInput.trim()) {
          throw new Error('Please enter a valid image URL.');
        }
        payload.imageUrl = imageUrlInput.trim();
      } else if (activeTab === 'presets') {
        if (!selectedPreset) {
          throw new Error('Please select a preset packaging image from the list.');
        }
        payload.imageUrl = selectedPreset;
      }

      const res = await api.uploadProductImage(product._id, payload);

      setStatus({
        type: 'success',
        message: `Product image for "${product.name}" updated successfully!`
      });

      if (onImageUpdated && res.product) {
        onImageUpdated(res.product);
      }

      setTimeout(() => {
        onClose();
      }, 1100);
    } catch (err: any) {
      setStatus({
        type: 'error',
        message: err.message || 'Failed to update product image.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasNewSelection =
    (activeTab === 'upload' && fileBase64) ||
    (activeTab === 'url' && imageUrlInput.trim() && imageUrlInput !== currentImage) ||
    (activeTab === 'presets' && selectedPreset && selectedPreset !== currentImage);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-xs">
      <div
        className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-150"
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-stone-100 flex items-center justify-between bg-stone-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <span>Change Product Image</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  Page {product.catalogPage}
                </span>
              </h2>
              <p className="text-xs text-stone-500 font-medium">
                {product.name} ({product.sku})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/50 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* Status Message */}
          {status && (
            <div
              className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                status.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {status.type === 'success' ? (
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              )}
              <span>{status.message}</span>
            </div>
          )}

          {/* Source Tabs */}
          <div>
            <div className="flex rounded-xl bg-stone-100 p-1 text-xs font-bold text-stone-600">
              <button
                type="button"
                onClick={() => setActiveTab('upload')}
                className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'upload'
                    ? 'bg-white text-emerald-800 shadow-xs'
                    : 'hover:text-stone-900'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload File / PDF Crop</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('url')}
                className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'url'
                    ? 'bg-white text-emerald-800 shadow-xs'
                    : 'hover:text-stone-900'
                }`}
              >
                <LinkIcon className="w-3.5 h-3.5" />
                <span>Image URL</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('presets')}
                className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'presets'
                    ? 'bg-white text-emerald-800 shadow-xs'
                    : 'hover:text-stone-900'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Catalogue Library</span>
              </button>
            </div>
          </div>

          {/* TAB 1: File Upload / Crop */}
          {activeTab === 'upload' && (
            <div className="space-y-3">
              <input
                type="file"
                ref={fileInputRef}
                accept="image/png, image/jpeg, image/webp, image/svg+xml"
                onChange={handleFileChange}
                className="hidden"
              />

              <div
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                  isDragging
                    ? 'border-emerald-600 bg-emerald-50 scale-[1.01]'
                    : fileBase64
                    ? 'border-emerald-400 bg-emerald-50/30'
                    : 'border-stone-300 hover:border-emerald-500 bg-stone-50/60 hover:bg-stone-50'
                }`}
              >
                <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
                  <Upload className="w-6 h-6" />
                </div>
                <p className="text-xs font-bold text-stone-800">
                  {fileName ? (
                    <span className="text-emerald-800 font-mono">✓ {fileName}</span>
                  ) : (
                    'Click to browse or drop an image file here'
                  )}
                </p>
                <p className="text-[11px] text-stone-500 mt-1">
                  Supports JPG, PNG, WEBP, or SVG screenshot from catalogue PDF
                </p>
                <div className="mt-2.5 inline-flex items-center gap-1 px-2.5 py-1 bg-stone-200/70 text-stone-700 rounded text-[10px] font-medium">
                  <span>💡 Tip: You can also copy any screenshot and press <strong>Ctrl+V</strong> right now!</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Image URL */}
          {activeTab === 'url' && (
            <div className="space-y-2">
              <label className="block text-xs font-bold text-stone-700">
                Image Web Address or Local Path
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  placeholder="https://example.com/packaging.jpg or /images/products/..."
                  className="w-full pl-9 pr-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none focus:border-emerald-600 bg-stone-50/50 focus:bg-white"
                />
                <LinkIcon className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
              <p className="text-[11px] text-stone-500">
                Enter any public image URL or website asset link.
              </p>
            </div>
          )}

          {/* TAB 3: Catalogue Library Presets */}
          {activeTab === 'presets' && (
            <div className="space-y-2">
              <label className="block text-xs font-bold text-stone-700">
                Select from High-Quality 2026 Catalogue Assets
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-1 border border-stone-200 rounded-xl bg-stone-50/50">
                {PRESET_GALLERY_IMAGES.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedPreset(preset.url)}
                    className={`flex items-center gap-2 p-1.5 rounded-lg border text-left transition-all cursor-pointer bg-white ${
                      selectedPreset === preset.url
                        ? 'border-emerald-600 ring-2 ring-emerald-200 bg-emerald-50/40'
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <img
                      src={preset.url}
                      alt={preset.label}
                      className="w-9 h-9 object-contain shrink-0 rounded bg-stone-50 p-0.5"
                    />
                    <div className="overflow-hidden">
                      <p className="text-[11px] font-bold text-stone-900 truncate">{preset.label}</p>
                      <span className="text-[9px] text-stone-400">Available</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Side-by-Side Comparison Preview */}
          <div className="border border-stone-200 rounded-xl p-3 bg-stone-50/60">
            <p className="text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-2">
              Storefront Preview Comparison
            </p>

            <div className="grid grid-cols-2 gap-3 items-center">
              {/* Current */}
              <div className="bg-white rounded-lg p-2.5 border border-stone-200 text-center">
                <span className="text-[10px] font-bold text-stone-400 block mb-1">Current Image</span>
                <div className="w-20 h-20 mx-auto bg-stone-50 rounded border border-stone-100 flex items-center justify-center p-1">
                  <img
                    src={currentImage}
                    alt="Current product"
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <span className="text-[9px] text-stone-500 truncate block mt-1">
                  {currentImage.split('/').pop()}
                </span>
              </div>

              {/* New Preview */}
              <div className={`bg-white rounded-lg p-2.5 border text-center transition-all ${
                hasNewSelection ? 'border-emerald-500 ring-2 ring-emerald-100' : 'border-stone-200'
              }`}>
                <span className="text-[10px] font-bold text-emerald-700 block mb-1">
                  {hasNewSelection ? 'New Image Ready' : 'Current (No change)'}
                </span>
                <div className="w-20 h-20 mx-auto bg-stone-50 rounded border border-stone-100 flex items-center justify-center p-1">
                  <img
                    src={previewImage}
                    alt="New preview"
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <span className="text-[9px] font-mono text-emerald-700 truncate block mt-1">
                  {activeTab === 'upload' && fileBase64
                    ? fileName || 'New file uploaded'
                    : previewImage.split('/').pop()}
                </span>
              </div>
            </div>
          </div>

          {/* Options */}
          <div className="pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-stone-700">
              <input
                type="checkbox"
                checked={setPrimaryOnly}
                onChange={(e) => setSetPrimaryOnly(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-700 focus:ring-emerald-600 border-stone-300"
              />
              <span>Set as only image (remove secondary illustrations)</span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 rounded-xl hover:bg-stone-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting || !hasNewSelection}
              className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:bg-stone-300 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Applying Image...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Save &amp; Apply Image</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
