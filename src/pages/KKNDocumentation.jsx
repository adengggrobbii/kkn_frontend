import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, Image as ImageIcon, ExternalLink, RefreshCw, HelpCircle } from 'lucide-react';
import { API_BASE_URL } from '../api';
import { INITIAL_DOCUMENTATION } from '../data/kknDocumentationData';

export const formatPhotoUrl = (url) => {
  if (!url) return '/homepage/k1.jpg';
  // Jika URL mengarah ke localhost:5000/uploads atau link uploads lainnya, ubah menjadi relative path /uploads/
  if (url.includes('/uploads/')) {
    const filename = url.split('/uploads/').pop();
    return `/uploads/${filename}`;
  }
  return url;
};

const KKNDocumentation = () => {
  // Inisialisasi awal dengan data dokumentasi lokal agar langsung muncul di HP tanpa delay/blank
  const [docs, setDocs] = useState(INITIAL_DOCUMENTATION);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activePhoto, setActivePhoto] = useState(null);

  const fetchDocs = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`${API_BASE_URL}/api/documentation`);
      if (response.data.success && Array.isArray(response.data.data) && response.data.data.length > 0) {
        setDocs(response.data.data);
      } else if (INITIAL_DOCUMENTATION.length > 0) {
        setDocs(INITIAL_DOCUMENTATION);
      }
    } catch (err) {
      console.warn('API backend tidak dapat diakses dari perangkat ini, menggunakan data lokal:', err);
      if (INITIAL_DOCUMENTATION.length > 0) {
        setDocs(INITIAL_DOCUMENTATION);
      } else {
        setError('Gagal memuat dokumentasi. Pastikan server aktif!');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDocs(); }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 relative">
      <div className="absolute -top-10 -right-10 w-72 h-72 bg-purple-200/20 rounded-full blur-3xl -z-10"></div>
      <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-violet-200/20 rounded-full blur-3xl -z-10"></div>

      {/* Header */}
      <div className="text-center mb-14">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-purple-600 rounded-2xl shadow-lg shadow-purple-300/40 mb-4">
          <ImageIcon className="w-7 h-7 text-white" />
        </div>
        <h1 className="text-3xl font-extrabold text-purple-900 tracking-tight">
          Dokumentasi Kegiatan KKN
        </h1>
        <p className="text-purple-400 mt-2 text-sm max-w-lg mx-auto">
          Perjalanan Kelompok KKN Desa Ulok Mukti dari Hari Pertama hingga Hari Terakhir.
        </p>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center gap-3">
          <div className="animate-spin h-8 w-8 border-3 border-purple-500 border-t-transparent rounded-full"></div>
          <span className="text-purple-400 text-sm">Memuat linimasa KKN...</span>
        </div>
      ) : error ? (
        <div className="py-16 text-center bg-white rounded-2xl shadow border border-red-100 p-8">
          <HelpCircle className="w-10 h-10 mx-auto text-red-400 mb-2" />
          <p className="text-red-500 text-sm">{error}</p>
          <button onClick={fetchDocs} className="mt-4 text-xs text-purple-500 hover:text-purple-700 font-semibold flex items-center gap-1 mx-auto">
            <RefreshCw className="w-3.5 h-3.5" /> Coba Lagi
          </button>
        </div>
      ) : docs.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-2xl shadow border border-purple-100 p-8">
          <ImageIcon className="w-12 h-12 mx-auto text-purple-200 mb-3" />
          <p className="font-semibold text-purple-400">Belum Ada Dokumentasi</p>
          <p className="text-xs text-purple-300 mt-1">Dokumentasi akan segera diunggah oleh admin.</p>
        </div>
      ) : (
        /* Timeline */
        <div className="relative border-l-2 border-purple-200 ml-4 md:ml-32 pl-8 space-y-10">
          {docs.map((doc) => {
            const formattedDate = new Date(doc.tanggal).toLocaleDateString('id-ID', {
              weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
            });

            return (
              <div key={doc._id} className="relative group">
                {/* Dot */}
                <div className="absolute -left-[37px] top-2 w-4 h-4 rounded-full bg-white border-2 border-purple-500 group-hover:bg-purple-500 transition-all duration-300 shadow-sm shadow-purple-300/30"></div>

                {/* Day badge (desktop) */}
                <div className="hidden md:block absolute -left-[145px] top-0 w-28 text-right pr-6">
                  <div className="text-[10px] text-purple-400 font-bold uppercase tracking-wider">Hari Ke</div>
                  <div className="text-3xl font-black text-purple-600">{doc.hariKe}</div>
                </div>

                {/* Card */}
                <div className="bg-white rounded-2xl shadow-md shadow-purple-100/60 border border-purple-100 group-hover:border-purple-300 group-hover:shadow-purple-200/60 transition-all duration-300 overflow-hidden">
                  <div className="h-1 bg-gradient-to-r from-purple-400 to-violet-400"></div>
                  <div className="p-5">
                    {/* Mobile day badge */}
                    <div className="flex items-center justify-between md:hidden mb-3">
                      <span className="text-xs font-black text-purple-600 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-full">Hari Ke-{doc.hariKe}</span>
                      <span className="text-xs text-purple-400">{formattedDate}</span>
                    </div>

                    <h3 className="text-lg font-bold text-purple-900 group-hover:text-purple-700 transition-colors">{doc.judul}</h3>
                    <div className="hidden md:flex items-center gap-1.5 text-xs text-purple-400 mt-1 mb-4">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{formattedDate}</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-5 gap-5 mt-3">
                      <p className="md:col-span-3 text-purple-600 text-sm leading-relaxed whitespace-pre-line">
                        {doc.deskripsi}
                      </p>
                      <div
                        className="md:col-span-2 rounded-xl overflow-hidden border border-purple-100 h-40 bg-purple-50 cursor-zoom-in group/img relative"
                        onClick={() => setActivePhoto(formatPhotoUrl(doc.foto))}
                      >
                        <img 
                          src={formatPhotoUrl(doc.foto)} 
                          alt={doc.judul} 
                          className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500" 
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/homepage/k1.jpg';
                          }}
                        />
                        <div className="absolute inset-0 bg-purple-900/30 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="text-white text-xs font-semibold flex items-center gap-1">
                            <ImageIcon className="w-4 h-4" /> Perbesar
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Lightbox */}
      {activePhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/80 backdrop-blur-sm">
          <div className="relative max-w-3xl w-full bg-white rounded-2xl shadow-2xl p-6 flex flex-col items-center">
            <button
              onClick={() => setActivePhoto(null)}
              className="absolute top-4 right-4 bg-purple-100 hover:bg-purple-200 text-purple-700 p-2 rounded-full transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <p className="text-xs font-bold text-purple-400 mb-3">Foto Dokumentasi KKN</p>
            <img 
              src={formatPhotoUrl(activePhoto)} 
              alt="Dokumentasi" 
              className="max-w-full max-h-[65vh] object-contain rounded-xl border border-purple-100" 
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/homepage/k1.jpg';
              }}
            />
            <a href={formatPhotoUrl(activePhoto)} target="_blank" rel="noopener noreferrer"
              className="mt-3 text-xs text-purple-500 hover:text-purple-700 font-semibold flex items-center gap-1">
              Buka di tab baru <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default KKNDocumentation;
