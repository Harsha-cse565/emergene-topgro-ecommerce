import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  CheckCircle2,
  Send,
  AlertCircle,
  ShieldCheck
} from 'lucide-react';
import { api } from '../services/api.ts';
import fallbackSettings from '../data/settings.json';

interface ContactFormData {
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
}

export const ContactPage: React.FC = () => {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ContactFormData>();

  const onSubmit = async (data: ContactFormData) => {
    setSubmitting(true);
    setError(null);
    try {
      await api.submitEnquiry(data);
      setSuccess(true);
      reset();
    } catch (err: any) {
      setError(err.message || 'Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
          Direct Customer Support
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
          Contact Emergene &amp; Topgro
        </h1>
        <p className="text-xs sm:text-sm text-stone-600">
          Get in touch for catalogue queries, bulk product requests, dealership terms, or dispatch schedules.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* Contact Information & WhatsApp */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-xs space-y-6">
            <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider pb-3 border-b border-stone-100">
              Trade Desk Information
            </h2>

            <div className="space-y-4 text-xs text-stone-700">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-stone-900">Registered Office &amp; Warehouse</p>
                  <p className="text-stone-500 mt-0.5 leading-relaxed">{fallbackSettings.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-stone-900">Telephone</p>
                  <p className="text-stone-500 mt-0.5">{fallbackSettings.phone}</p>
                  <p className="text-[10px] text-stone-400">Monday - Saturday (9:00 AM - 6:30 PM IST)</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-stone-900">Email Correspondence</p>
                  <p className="text-stone-500 mt-0.5">{fallbackSettings.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-stone-900">GST Registration</p>
                  <p className="text-stone-500 mt-0.5 font-mono">{fallbackSettings.gstNumber}</p>
                </div>
              </div>
            </div>

            {/* WhatsApp Box */}
            <div className="pt-2">
              <a
                href={`https://wa.me/${fallbackSettings.whatsappNumber}?text=${encodeURIComponent('Hello Emergene & Topgro, I have an inquiry about your agricultural catalogue.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 p-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Instant WhatsApp Enquiry Desk</span>
              </a>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="lg:col-span-7">
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-xs space-y-6">
            <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider pb-3 border-b border-stone-100">
              Submit an Enquiry
            </h2>

            {success && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <p className="font-bold">Message sent successfully!</p>
                  <p className="text-[11px] text-emerald-700 mt-0.5">
                    Our sales desk has received your request and will contact you via phone or email shortly.
                  </p>
                </div>
              </div>
            )}

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Your Name / Farmer Name *
                  </label>
                  <input
                    type="text"
                    {...register('name', { required: 'Name is required' })}
                    placeholder="e.g. Ramesh Patil"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:bg-white focus:ring-1 focus:ring-emerald-600"
                  />
                  {errors.name && (
                    <span className="text-[10px] text-red-600 mt-0.5 block">{errors.name.message}</span>
                  )}
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Mobile Phone Number *
                  </label>
                  <input
                    type="tel"
                    {...register('phone', { required: 'Phone number is required' })}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:bg-white focus:ring-1 focus:ring-emerald-600"
                  />
                  {errors.phone && (
                    <span className="text-[10px] text-red-600 mt-0.5 block">{errors.phone.message}</span>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-stone-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    {...register('email')}
                    placeholder="farmer@example.com"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:bg-white focus:ring-1 focus:ring-emerald-600"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-stone-700 mb-1">
                    Subject / Product Reference *
                  </label>
                  <input
                    type="text"
                    {...register('subject', { required: 'Subject is required' })}
                    placeholder="e.g. Bulk quote for YieldMax 19:19:19 & Delite"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:bg-white focus:ring-1 focus:ring-emerald-600"
                  />
                  {errors.subject && (
                    <span className="text-[10px] text-red-600 mt-0.5 block">{errors.subject.message}</span>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-stone-700 mb-1">
                    Your Message / Requirements *
                  </label>
                  <textarea
                    rows={4}
                    {...register('message', { required: 'Message is required' })}
                    placeholder="Please specify product name, quantity needed, delivery pin code, or general questions..."
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:bg-white focus:ring-1 focus:ring-emerald-600"
                  />
                  {errors.message && (
                    <span className="text-[10px] text-red-600 mt-0.5 block">{errors.message.message}</span>
                  )}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className={`w-full sm:w-auto px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                    submitting ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? 'Sending Enquiry...' : 'Submit Message'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>

      </div>

    </div>
  );
};
