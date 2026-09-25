import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Lock, Mail, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';

export const AdminLoginPage: React.FC = () => {
  const { adminLogin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await adminLogin(email, password);
      navigate('/admin');
    } catch (err: any) {
      setError(err.message || 'Access denied: Invalid administrator credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-stone-100">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-stone-200 shadow-md space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-amber-600 text-white flex items-center justify-center mx-auto shadow-sm">
            <Shield className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight">
            Admin Portal Access
          </h1>
          <p className="text-xs text-stone-500">
            Authorized management area for product catalogue, orders, inventory and settings.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Admin Email
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@emergene.com"
                className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:bg-white focus:ring-2 focus:ring-amber-600"
              />
              <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Admin Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:bg-white focus:ring-2 focus:ring-amber-600"
              />
              <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2.5 bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {loading ? <span>Verifying credentials...</span> : <span>Access Admin Console</span>}
          </button>
        </form>

        <div className="p-3 bg-amber-50/70 border border-amber-200/60 rounded-xl text-[11px] text-amber-900 space-y-1">
          <p className="font-bold">Authorized Default Credentials:</p>
          <p>Email: <code className="font-mono font-bold text-amber-950">admin@emergene.com</code></p>
          <p>Password: <code className="font-mono font-bold text-amber-950">admin123</code></p>
        </div>

        <div className="text-center pt-2">
          <Link
            to="/"
            className="text-xs font-semibold text-stone-500 hover:text-stone-800 inline-flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Public Store</span>
          </Link>
        </div>

      </div>
    </div>
  );
};
