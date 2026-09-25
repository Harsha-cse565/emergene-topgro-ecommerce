import React, { useState, useEffect } from 'react';
import { MessageSquare, Phone, Mail, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { api } from '../../services/api.ts';
import { Enquiry } from '../../types/index.ts';
import { LoadingSpinner } from '../../components/StateIndicators.tsx';

export const AdminEnquiriesPage: React.FC = () => {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);

  const loadEnquiries = async () => {
    setLoading(true);
    try {
      const list = await api.getEnquiries();
      setEnquiries(list);
    } catch (err) {
      console.error('Failed to load enquiries', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEnquiries();
  }, []);

  const handleToggleStatus = async (id: string, currentStatus: 'new' | 'responded') => {
    const nextStatus = currentStatus === 'new' ? 'responded' : 'new';
    try {
      const updated = await api.updateEnquiryStatus(id, nextStatus);
      setEnquiries(prev => prev.map(e => e._id === id ? updated : e));
    } catch (err: any) {
      alert(err.message || 'Failed to update enquiry status');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex items-center justify-between pb-4 border-b border-stone-200">
        <div>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight">
            Customer Inquiries &amp; Quotation Requests
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Farmer messages received via public contact page or bulk rate requests.
          </p>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner message="Fetching customer inquiries..." />
      ) : enquiries.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-xl border border-stone-200">
          <MessageSquare className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-stone-800">No enquiries submitted yet</h3>
          <p className="text-xs text-stone-500 mt-1">
            New contact submissions will be displayed here for sales team follow-up.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {enquiries.map(enq => (
            <div
              key={enq._id}
              className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-stone-100 text-xs">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-sm text-stone-900">{enq.name}</span>
                  <span className="text-stone-500 flex items-center gap-1 font-medium">
                    <Phone className="w-3 h-3 text-emerald-700" />
                    {enq.phone}
                  </span>
                  {enq.email && (
                    <span className="text-stone-500 flex items-center gap-1 font-medium">
                      <Mail className="w-3 h-3 text-emerald-700" />
                      {enq.email}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-stone-400 text-[11px]">
                    {new Date(enq.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </span>

                  <button
                    onClick={() => handleToggleStatus(enq._id, enq.status)}
                    className={`px-2.5 py-1 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                      enq.status === 'responded'
                        ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                        : 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                    }`}
                  >
                    {enq.status === 'responded' ? '✓ Responded' : '● New Inquiry'}
                  </button>
                </div>
              </div>

              <div>
                <p className="text-xs font-bold text-stone-800 mb-1">Subject: {enq.subject}</p>
                <p className="text-xs text-stone-600 bg-stone-50 p-3 rounded-lg border border-stone-100 leading-relaxed">
                  {enq.message}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
