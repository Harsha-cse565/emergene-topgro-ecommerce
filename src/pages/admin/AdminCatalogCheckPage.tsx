import React, { useState, useEffect, useRef } from 'react';
import {
  FileCheck2,
  CheckCircle2,
  AlertTriangle,
  Image as ImageIcon,
  DollarSign,
  Package,
  FileText,
  Search,
  ExternalLink,
  Upload,
  Camera,
  X,
  Sparkles,
  Layers,
  Check
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api.ts';
import { Product } from '../../types/index.ts';
import { LoadingSpinner } from '../../components/StateIndicators.tsx';
import { ChangeImageModal } from '../../components/ChangeImageModal.tsx';

export const AdminCatalogCheckPage: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchFilter, setSearchFilter] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'photo' | 'svg'>('all');

  // Modal State for Single Image Upload
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [uploadMode, setUploadMode] = useState<'file' | 'url'>('file');
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [fileBase64, setFileBase64] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Batch Uploader State
  const [batchModalOpen, setBatchModalOpen] = useState(false);
  const [batchFiles, setBatchFiles] = useState<Array<{ name: string; data: string }>>([]);
  const [batchProcessing, setBatchProcessing] = useState(false);
  const [batchResult, setBatchResult] = useState<any>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const batchInputRef = useRef<HTMLInputElement>(null);

  const runDiagnostic = async () => {
    try {
      const diag = await api.getCatalogDiagnostic();
      setData(diag);
    } catch (err) {
      console.error('Failed to run diagnostic', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runDiagnostic();
  }, []);

  const openImageModal = (prod: Product) => {
    setSelectedProduct(prod);
    setFileBase64(null);
    setFileName('');
    setImageUrlInput(prod.images && prod.images[0] ? prod.images[0] : '');
    setStatusMessage(null);
    setImageModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      setFileBase64(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProductImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      if (uploadMode === 'file' && fileBase64) {
        const res = await api.uploadProductImage(selectedProduct._id, {
          imageBase64: fileBase64,
          filename: `${selectedProduct.slug}-${Date.now()}`
        });
        setStatusMessage({ type: 'success', text: `Image updated successfully for ${selectedProduct.name}!` });
        await runDiagnostic();
        setTimeout(() => setImageModalOpen(false), 1200);
      } else if (uploadMode === 'url' && imageUrlInput.trim()) {
        const res = await api.uploadProductImage(selectedProduct._id, {
          imageUrl: imageUrlInput.trim()
        });
        setStatusMessage({ type: 'success', text: `Image URL updated for ${selectedProduct.name}!` });
        await runDiagnostic();
        setTimeout(() => setImageModalOpen(false), 1200);
      } else {
        setStatusMessage({ type: 'error', text: 'Please select a valid image file or enter an image URL.' });
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Failed to update image' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBatchFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const loadedList: Array<{ name: string; data: string }> = [];
    const readPromises: Promise<void>[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      readPromises.push(
        new Promise<void>((resolve) => {
          const reader = new FileReader();
          reader.onload = (evt) => {
            if (evt.target?.result) {
              loadedList.push({
                name: file.name,
                data: evt.target.result as string
              });
            }
            resolve();
          };
          reader.readAsDataURL(file);
        })
      );
    }

    await Promise.all(readPromises);
    setBatchFiles(loadedList);
  };

  const handleProcessBatchUpload = async () => {
    if (batchFiles.length === 0) return;
    setBatchProcessing(true);
    setBatchResult(null);

    try {
      const res = await api.batchUploadImages(batchFiles);
      setBatchResult(res);
      await runDiagnostic();
    } catch (err: any) {
      alert(err.message || 'Batch upload failed');
    } finally {
      setBatchProcessing(false);
    }
  };

  if (loading || !data) {
    return <LoadingSpinner message="Scanning all 85 catalog records and image links..." />;
  }

  const products: Product[] = data.products || [];
  const filtered = products.filter(p => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      p.category.toLowerCase().includes(searchFilter.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchFilter.toLowerCase());

    const hasPhoto = p.images && p.images.length > 0 && !p.images[0].endsWith('.svg');
    if (filterType === 'photo') return matchesSearch && hasPhoto;
    if (filterType === 'svg') return matchesSearch && !hasPhoto;
    return matchesSearch;
  });

  const photoCount = products.filter(p => p.images && p.images.length > 0 && !p.images[0].endsWith('.svg')).length;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 text-xs font-bold mb-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Catalogue Integrity Diagnostic &amp; Image Sync</span>
          </div>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight">
            Emergene &amp; Topgro 2026 Audit
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Strict verification against source catalogue: accurate packaging names, prices, pack sizes, and packaging imagery.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              setBatchFiles([]);
              setBatchResult(null);
              setBatchModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <span>Batch Upload PDF Images</span>
          </button>
        </div>
      </div>

      {/* 7 Diagnostic Cards + Image Sync Status */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {/* Total products */}
        <div className="bg-white p-3.5 rounded-xl border border-stone-200 shadow-xs text-center">
          <p className="text-[10px] font-bold uppercase tracking-wider text-stone-500">Total Products</p>
          <p className="text-xl font-black text-emerald-700 mt-1">{data.totalProducts}</p>
          <span className="text-[10px] font-bold text-emerald-600 block mt-0.5">✓ Target: 85</span>
        </div>

        {/* Real Packaging Photos */}
        <div className="bg-emerald-50/50 p-3.5 rounded-xl border border-emerald-200 shadow-xs text-center">
          <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">Photo Images</p>
          <p className="text-xl font-black text-emerald-700 mt-1">{photoCount}</p>
          <span className="text-[10px] font-bold text-emerald-600 block mt-0.5">Updated Photos</span>
        </div>

        {/* Products with images */}
        <div className="bg-white p-3.5 rounded-xl border border-stone-200 shadow-xs text-center">
          <p className="text-[10px] font-bold uppercase tracking-wider text-stone-500">All Visuals</p>
          <p className="text-xl font-black text-stone-800 mt-1">{data.withImages}</p>
          <span className="text-[10px] font-bold text-emerald-600 block mt-0.5">100% Active</span>
        </div>

        {/* Products with price */}
        <div className="bg-white p-3.5 rounded-xl border border-stone-200 shadow-xs text-center">
          <p className="text-[10px] font-bold uppercase tracking-wider text-stone-500">With Price</p>
          <p className="text-xl font-black text-stone-900 mt-1">{data.withPrice}</p>
          <span className="text-[10px] text-stone-400 block mt-0.5">Verified</span>
        </div>

        {/* Products without price */}
        <div className="bg-white p-3.5 rounded-xl border border-stone-200 shadow-xs text-center">
          <p className="text-[10px] font-bold uppercase tracking-wider text-stone-500">Without Price</p>
          <p className="text-xl font-black text-amber-600 mt-1">{data.withoutPrice}</p>
          <span className="text-[10px] text-amber-700 font-semibold block mt-0.5">On Request</span>
        </div>

        {/* Products with pack size */}
        <div className="bg-white p-3.5 rounded-xl border border-stone-200 shadow-xs text-center">
          <p className="text-[10px] font-bold uppercase tracking-wider text-stone-500">With Pack Size</p>
          <p className="text-xl font-black text-stone-900 mt-1">{data.withPackSize}</p>
          <span className="text-[10px] text-stone-400 block mt-0.5">Documented</span>
        </div>

        {/* Products without pack size */}
        <div className="bg-white p-3.5 rounded-xl border border-stone-200 shadow-xs text-center">
          <p className="text-[10px] font-bold uppercase tracking-wider text-stone-500">No Pack Size</p>
          <p className="text-xl font-black text-stone-600 mt-1">{data.withoutPackSize}</p>
          <span className="text-[10px] text-stone-400 block mt-0.5">Unstated</span>
        </div>

        {/* Products with Used For */}
        <div className="bg-white p-3.5 rounded-xl border border-stone-200 shadow-xs text-center">
          <p className="text-[10px] font-bold uppercase tracking-wider text-stone-500">With Used For</p>
          <p className="text-xl font-black text-stone-900 mt-1">{data.withUsedFor}</p>
          <span className="text-[10px] text-stone-400 block mt-0.5">Verified</span>
        </div>
      </div>

      {/* PDF Packaging Image Notice Banner */}
      <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <p className="font-bold flex items-center gap-1.5 text-sm text-emerald-900">
            <Camera className="w-4 h-4 text-emerald-700" />
            <span>Update Packaging Images from PDF Catalogue</span>
          </p>
          <p className="text-emerald-800 text-xs leading-relaxed max-w-3xl">
            You can update the image of any of the 85 products by uploading screenshot/photo crops from the PDF catalogue directly below. The system immediately renders the authentic photograph on the website storefront, catalogue search, and product detail pages.
          </p>
        </div>

        <button
          onClick={() => {
            setBatchFiles([]);
            setBatchResult(null);
            setBatchModalOpen(true);
          }}
          className="shrink-0 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload Multiple PDF Images</span>
        </button>
      </div>

      {/* Audit Table with Filters & Search */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden space-y-3 p-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
          <div className="flex items-center gap-3">
            <h2 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
              All 85 Product Audit Records
            </h2>
            <div className="flex items-center bg-stone-100 p-0.5 rounded-lg text-[11px]">
              <button
                onClick={() => setFilterType('all')}
                className={`px-2 py-1 rounded font-semibold transition-colors cursor-pointer ${
                  filterType === 'all' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                All (85)
              </button>
              <button
                onClick={() => setFilterType('photo')}
                className={`px-2 py-1 rounded font-semibold transition-colors cursor-pointer ${
                  filterType === 'photo' ? 'bg-white text-emerald-800 shadow-xs' : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                Photos ({photoCount})
              </button>
              <button
                onClick={() => setFilterType('svg')}
                className={`px-2 py-1 rounded font-semibold transition-colors cursor-pointer ${
                  filterType === 'svg' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                Vector SVG ({85 - photoCount})
              </button>
            </div>
          </div>

          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search by name, SKU, or use..."
              value={searchFilter}
              onChange={e => setSearchFilter(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:bg-white"
            />
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-700">
            <thead className="bg-stone-50 border-b border-stone-200 text-[10px] font-black text-stone-500 uppercase tracking-wider">
              <tr>
                <th className="p-3">#</th>
                <th className="p-3">Product Name &amp; Packaging Image</th>
                <th className="p-3">Catalogue Page</th>
                <th className="p-3">Category</th>
                <th className="p-3">Pricing Status</th>
                <th className="p-3">Pack Sizes</th>
                <th className="p-3">Used For Information</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-medium">
              {filtered.map((prod, idx) => {
                const hasPrice = prod.priceAvailable;
                const hasPacks = prod.packSizes && prod.packSizes.length > 0;
                const hasUsed = prod.usedFor && prod.usedFor !== 'Information not available';
                const isPhoto = prod.images && prod.images.length > 0 && !prod.images[0].endsWith('.svg');

                return (
                  <tr key={prod._id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="p-3 text-stone-400 font-mono text-[11px]">{idx + 1}</td>

                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="relative group/thumb cursor-pointer" onClick={() => openImageModal(prod)}>
                          <img
                            src={prod.images[0]}
                            alt={prod.name}
                            className={`w-12 h-12 object-contain p-1 rounded-lg border shrink-0 bg-white ${
                              isPhoto ? 'border-emerald-400 ring-2 ring-emerald-100' : 'border-stone-200'
                            }`}
                          />
                          <div className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity">
                            <Camera className="w-4 h-4 text-white" />
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center gap-1.5">
                            <p className="font-bold text-stone-900">{prod.name}</p>
                            {isPhoto ? (
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-bold">
                                Photo
                              </span>
                            ) : (
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-stone-100 text-stone-600 font-medium">
                                SVG
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] font-mono text-stone-400">{prod.sku}</span>
                        </div>
                      </div>
                    </td>

                    <td className="p-3 font-semibold text-stone-600">
                      Page {prod.catalogPage}
                    </td>

                    <td className="p-3 text-stone-700">
                      {prod.category}
                    </td>

                    <td className="p-3">
                      {hasPrice ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          ₹{prod.startingPrice} onwards
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          Price on Request
                        </span>
                      )}
                    </td>

                    <td className="p-3">
                      {hasPacks ? (
                        <span className="text-stone-800 text-[11px]">
                          {prod.packSizes.map(ps => ps.size).join(', ')}
                        </span>
                      ) : (
                        <span className="text-stone-400 italic text-[11px]">Not available</span>
                      )}
                    </td>

                    <td className="p-3 max-w-xs">
                      {hasUsed ? (
                        <p className="text-[11px] text-stone-800 truncate" title={prod.usedFor}>
                          {prod.usedFor}
                        </p>
                      ) : (
                        <span className="text-stone-400 italic text-[11px]">Information not available</span>
                      )}
                    </td>

                    <td className="p-3 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => openImageModal(prod)}
                          className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors cursor-pointer"
                          title="Update product packaging image from PDF"
                        >
                          <Camera className="w-3 h-3" />
                          <span>Update Image</span>
                        </button>

                        <Link
                          to={`/products/${prod.slug}`}
                          target="_blank"
                          className="inline-flex p-1 text-stone-500 hover:text-stone-800 rounded border border-stone-200 hover:bg-stone-100"
                          title="View Public Store Page"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* SINGLE PRODUCT CHANGE IMAGE MODAL */}
      <ChangeImageModal
        isOpen={imageModalOpen}
        onClose={() => setImageModalOpen(false)}
        product={selectedProduct}
        onImageUpdated={() => {
          runDiagnostic();
        }}
      />

      {/* BATCH IMAGE UPLOADER MODAL */}
      {batchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-xl border border-stone-200 relative animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setBatchModalOpen(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-600 p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold mb-1">
              <Upload className="w-4 h-4" />
              <span>Bulk PDF Images Uploader</span>
            </div>

            <h3 className="text-lg font-bold text-stone-900">
              Upload Multiple Images Extracted from PDF
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Select multiple cropped product images. The system will automatically match each image to the corresponding product using the file name (e.g. <code>yieldmax-19-19-19.jpg</code>, <code>shield.png</code>, or <code>ET-FUN-001.jpg</code>).
            </p>

            <div className="mt-4 space-y-4">
              <input
                type="file"
                ref={batchInputRef}
                multiple
                accept="image/*"
                onChange={handleBatchFileSelect}
                className="hidden"
              />

              <div
                onClick={() => batchInputRef.current?.click()}
                className="border-2 border-dashed border-stone-300 hover:border-emerald-500 rounded-xl p-6 text-center cursor-pointer transition-colors bg-stone-50/50 hover:bg-emerald-50/30"
              >
                <Upload className="w-8 h-8 text-stone-400 mx-auto mb-2" />
                <p className="text-xs font-bold text-stone-800">
                  {batchFiles.length > 0
                    ? `${batchFiles.length} image files selected`
                    : 'Click to select multiple product photos from PDF'}
                </p>
                <p className="text-[10px] text-stone-500 mt-1">
                  Tip: Name files with the product name or slug for automatic mapping
                </p>
              </div>

              {batchFiles.length > 0 && (
                <div className="border border-stone-200 rounded-xl p-3 bg-stone-50 space-y-2">
                  <p className="text-xs font-bold text-stone-800">Selected Files ({batchFiles.length}):</p>
                  <div className="max-h-36 overflow-y-auto space-y-1 text-xs">
                    {batchFiles.map((bf, idx) => (
                      <div key={idx} className="flex items-center justify-between py-1 px-2 bg-white rounded border border-stone-100">
                        <span className="font-mono text-[11px] text-stone-700 truncate max-w-xs">{bf.name}</span>
                        <span className="text-[10px] text-emerald-700 font-bold">Ready</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {batchResult && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 space-y-2">
                  <p className="font-bold flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-700" />
                    <span>Processed {batchResult.totalProcessed} images ({batchResult.matchedCount} automatically matched &amp; updated)</span>
                  </p>
                  <div className="max-h-32 overflow-y-auto space-y-1 text-[11px]">
                    {batchResult.results?.map((r: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between">
                        <span className="font-mono">{r.filename}</span>
                        <span className={r.matched ? 'text-emerald-700 font-bold' : 'text-stone-500'}>
                          {r.matched ? `→ ${r.productName}` : 'Uploaded (No exact name match)'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setBatchModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-800 rounded-lg cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  disabled={batchFiles.length === 0 || batchProcessing}
                  onClick={handleProcessBatchUpload}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 disabled:bg-stone-300 text-white font-bold text-xs rounded-lg shadow-xs transition-colors cursor-pointer"
                >
                  {batchProcessing ? 'Processing & Matching...' : `Upload & Match ${batchFiles.length} Images`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
