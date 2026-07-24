import React, { useState } from 'react';
import axios from 'axios';
import { ShieldCheck, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { API_BASE_URL } from '../api';

const AdminLogin = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({ emailOrUsername: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!formData.emailOrUsername || !formData.password) {
      setError('Username/Email dan Password wajib diisi!');
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        emailOrUsername: formData.emailOrUsername,
        password: formData.password,
      });
      if (response.data.success) {
        const { token, username, email, role } = response.data.data;
        onLoginSuccess(token, { username, email, role });
      } else {
        setError(response.data.message || 'Login gagal');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal terhubung ke server.');
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = "w-full bg-purple-50/60 border border-purple-200 rounded-xl pl-10 pr-4 py-3 text-purple-900 placeholder-purple-300 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300 text-sm";

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 relative">
      <div className="absolute top-1/4 left-1/3 w-72 h-72 bg-purple-200/30 rounded-full blur-3xl -z-10 animate-pulse-slow"></div>
      <div className="absolute bottom-1/4 right-1/3 w-72 h-72 bg-violet-200/20 rounded-full blur-3xl -z-10 animate-pulse-slow" style={{ animationDelay: '3s' }}></div>

      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl shadow-purple-100/80 border border-purple-100 overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-purple-500 via-violet-500 to-fuchsia-400"></div>

          <div className="p-8">
            {/* Header */}
            <div className="flex flex-col items-center mb-8">
              <div className="bg-purple-600 p-3.5 rounded-2xl shadow-lg shadow-purple-300/40 mb-4">
                <ShieldCheck className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-extrabold text-purple-900 tracking-tight">Login Portal Admin</h2>
              <p className="text-purple-400 text-xs mt-1 text-center">
                Khusus untuk Dosen Pembimbing Lapangan (DPL) atau Admin KKN
              </p>
            </div>

            {error && (
              <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 flex items-center space-x-2 text-xs">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email/Username */}
              <div>
                <label className="block text-xs font-bold text-purple-700 mb-1.5 uppercase tracking-wider">
                  Username / Email
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-purple-400">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    name="emailOrUsername"
                    value={formData.emailOrUsername}
                    onChange={handleChange}
                    placeholder="admin@kkn.ac.id"
                    className={inputClass}
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-purple-700 mb-1.5 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-purple-400">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`${inputClass} pr-10`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-purple-400 hover:text-purple-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-purple-300/40 hover:shadow-purple-400/50 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <span>Mengecek kredensial...</span>
                  </>
                ) : (
                  <span>Masuk Sekarang</span>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
