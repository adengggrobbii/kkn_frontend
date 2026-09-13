import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  MessageSquare,
  MessageSquarePlus,
  Send,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Search,
  Trash2,
  Sparkles,
  User,
  Heart,
  Clock,
} from 'lucide-react';
import { API_BASE_URL } from '../api';
import {
  getLocalComments,
  saveLocalComments,
  addLocalComment,
  removeLocalComment,
  filterOutDeleted,
} from '../utils/commentStorage';

const ROLE_OPTIONS = [
  'Warga Desa Ulok Mukti',
  'Mahasiswa KKN',
  'DPL / Dosen',
  'Aparatur Desa',
  'Pengunjung / Umum',
];

// Helper untuk format tanggal Indonesia
const formatTanggalWaktu = (dateStr) => {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }) + ' WIB';
  } catch {
    return dateStr;
  }
};

// Helper warna avatar berdasarkan nama
const getAvatarGradient = (name = '') => {
  const gradients = [
    'from-purple-500 to-indigo-600',
    'from-violet-500 to-purple-700',
    'from-fuchsia-500 to-pink-600',
    'from-purple-600 to-violet-800',
    'from-indigo-500 to-purple-600',
    'from-pink-500 to-rose-600',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % gradients.length;
  return gradients[index];
};

const getRoleBadgeStyle = (role = '') => {
  const r = role.toLowerCase();
  if (r.includes('warga') || r.includes('desa')) {
    return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  }
  if (r.includes('mahasiswa') || r.includes('kkn')) {
    return 'bg-purple-50 text-purple-700 border-purple-200';
  }
  if (r.includes('dosen') || r.includes('dpl')) {
    return 'bg-blue-50 text-blue-700 border-blue-200';
  }
  if (r.includes('aparatur')) {
    return 'bg-amber-50 text-amber-700 border-amber-200';
  }
  return 'bg-gray-50 text-gray-600 border-gray-200';
};

const PublicComments = ({ isAdmin = false, token = '' }) => {
  // Inisialisasi awal langsung dari storage lokal agar tidak menunggu dan tidak blank
  const [comments, setComments] = useState(getLocalComments());
  const [loadingComments, setLoadingComments] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Form State
  const [nama, setNama] = useState('');
  const [role, setRole] = useState('Warga Desa Ulok Mukti');
  const [pesan, setPesan] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Fetch comments
  const fetchComments = async () => {
    setLoadingComments(true);
    try {
      const local = getLocalComments();
      const res = await axios.get(`${API_BASE_URL}/api/comments`, { timeout: 3500 });
      if (res.data && res.data.success && Array.isArray(res.data.data)) {
        // Gabungkan data backend dengan komentar lokal yang baru dibuat
        const backendIds = new Set(res.data.data.map(c => c._id || (c.nama + c.pesan)));
        const localOnly = local.filter(c => !backendIds.has(c._id) && !backendIds.has(c.nama + c.pesan));
        const merged = filterOutDeleted([...localOnly, ...res.data.data]);
        setComments(merged);
        saveLocalComments(merged);
      } else {
        setComments(filterOutDeleted(local));
      }
    } catch (err) {
      console.warn('API backend komentar belum aktif atau tidak dapat dijangkau dari HP, menggunakan data lokal:', err);
      setComments(filterOutDeleted(getLocalComments()));
    } finally {
      setLoadingComments(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  // Handle submit comment
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    if (!nama.trim() || !pesan.trim()) {
      setErrorMsg('Mohon lengkapi nama dan isi pesan Anda.');
      return;
    }

    setSubmitting(true);

    // Buat objek komentar baru secara instan
    const newComment = {
      _id: 'cmt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
      nama: nama.trim(),
      role: role.trim() || 'Pengunjung / Umum',
      pesan: pesan.trim(),
      createdAt: new Date().toISOString(),
    };

    // LANGSUNG simpan dan tampilkan ke layar (Optimistic UI)
    const updated = addLocalComment(newComment);
    setComments(updated);
    setSuccessMsg('Terima kasih! Komentar Anda berhasil dikirim dan langsung ditampilkan.');
    setNama('');
    setPesan('');

    // Coba kirimkan ke backend jika server tersedia
    try {
      const res = await axios.post(`${API_BASE_URL}/api/comments`, {
        nama: newComment.nama,
        role: newComment.role,
        pesan: newComment.pesan,
      }, { timeout: 4000 });
      if (res.data?.success && res.data?.data?._id) {
        const serverComment = res.data.data;
        const current = getLocalComments();
        const replaced = current.map(c => c._id === newComment._id ? serverComment : c);
        saveLocalComments(replaced);
        setComments(filterOutDeleted(replaced));
      }
    } catch (err) {
      console.warn('Backend offline/belum terhubung, komentar disimpan di browser lokal:', err);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle delete comment (Admin only)
  const handleDeleteComment = async (id) => {
    if (!window.confirm('Yakin ingin menghapus komentar ini?')) return;
    const updated = removeLocalComment(id);
    setComments(updated);
    try {
      await axios.delete(`${API_BASE_URL}/api/comments/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      console.warn('Gagal menghapus komentar di backend:', err);
    }
  };

  // Filtered comments
  const filteredComments = comments.filter((c) => {
    const q = searchQuery.toLowerCase();
    return (
      (c.nama && c.nama.toLowerCase().includes(q)) ||
      (c.pesan && c.pesan.toLowerCase().includes(q)) ||
      (c.role && c.role.toLowerCase().includes(q))
    );
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 relative">
      {/* Background Decorative Glow */}
      <div className="absolute -top-12 -left-12 w-80 h-80 bg-purple-200/40 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute top-1/2 -right-12 w-80 h-80 bg-violet-200/40 rounded-full blur-3xl -z-10 pointer-events-none" />

      {/* Header Section */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-tr from-purple-600 to-violet-600 rounded-2xl shadow-lg shadow-purple-300/40 mb-4 text-white">
          <MessageSquarePlus className="w-7 h-7" />
        </div>
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-purple-100/80 border border-purple-200 text-purple-700 text-xs font-bold mb-3 mx-auto">
          <Sparkles className="w-3.5 h-3.5 text-purple-600" />
          <span>Buku Tamu & Aspirasi Publik</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-purple-950 tracking-tight">
          Kolom Komentar & Pesan KKN
        </h1>
        <p className="text-purple-600/80 mt-2 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
          Tinggalkan pesan, ucapan semangat, saran, ataupun kesan Anda untuk tim KKN Universitas Aisyah Pringsewu di Desa Ulok Mukti 2026.
        </p>
      </div>

      {/* ── SECTION 1: FORMULIR TULIS KOMENTAR ── */}
      <div className="bg-white rounded-3xl shadow-xl shadow-purple-100/70 border border-purple-100 overflow-hidden mb-12">
        <div className="h-1.5 bg-gradient-to-r from-purple-500 via-violet-500 to-fuchsia-400" />

        <div className="p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-6 text-purple-900 font-bold text-base sm:text-lg">
            <MessageSquare className="w-5 h-5 text-purple-600" />
            <h2>Tulis Komentar / Kesan Pesan Baru</h2>
          </div>

          {/* Success Notification */}
          {successMsg && (
            <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-start gap-3 text-xs sm:text-sm animate-fade-in-up">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold">Komentar Berhasil Terkirim!</h4>
                <p className="text-xs mt-0.5 text-emerald-600">{successMsg}</p>
              </div>
            </div>
          )}

          {/* Error Notification */}
          {errorMsg && (
            <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 flex items-start gap-3 text-xs sm:text-sm animate-fade-in-up">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold">Gagal Mengirim</h4>
                <p className="text-xs mt-0.5 text-red-500">{errorMsg}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Nama */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-purple-900 mb-1.5">
                Nama Lengkap / Panggilan <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-purple-400">
                  <User className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  placeholder="Contoh: Pak Budi / Rina / Mahasiswa KKN"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  maxLength={80}
                  className="w-full bg-purple-50/40 border border-purple-200 rounded-xl pl-10 pr-4 py-3 text-purple-950 placeholder-purple-300 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all text-xs sm:text-sm"
                  required
                />
              </div>
            </div>

            {/* Identitas / Sebagai */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-purple-900 mb-2">
                Sebagai / Identitas Pengirim
              </label>
              <div className="flex flex-wrap gap-2">
                {ROLE_OPTIONS.map((opt) => (
                  <button
                    type="button"
                    key={opt}
                    onClick={() => setRole(opt)}
                    className={`text-xs px-3.5 py-1.5 rounded-full border transition-all duration-200 font-medium ${
                      role === opt
                        ? 'bg-purple-600 text-white border-purple-600 shadow-sm shadow-purple-300'
                        : 'bg-purple-50/50 text-purple-700 border-purple-200 hover:bg-purple-100/70'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Isi Pesan */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs sm:text-sm font-semibold text-purple-900">
                  Isi Pesan / Komentar <span className="text-red-400">*</span>
                </label>
                <span className="text-[11px] text-purple-400">
                  {pesan.length}/1000 karakter
                </span>
              </div>
              <textarea
                rows={4}
                placeholder="Tuliskan ucapan semangat, masukan, tanggapan kegiatan, atau pesan Anda untuk KKN Desa Ulok Mukti..."
                value={pesan}
                onChange={(e) => setPesan(e.target.value)}
                maxLength={1000}
                className="w-full bg-purple-50/40 border border-purple-200 rounded-2xl px-4 py-3 text-purple-950 placeholder-purple-300 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all text-xs sm:text-sm resize-y leading-relaxed"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting || !nama.trim() || !pesan.trim()}
              className="w-full bg-gradient-to-r from-purple-600 via-violet-600 to-purple-700 hover:from-purple-500 hover:to-violet-500 text-white font-extrabold py-3.5 rounded-2xl shadow-lg shadow-purple-300/50 hover:shadow-purple-400/60 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
            >
              {submitting ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <span>Mengirimkan Komentar...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Kirim Komentar Sekarang</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* ── SECTION 2: DAFTAR KOMENTAR PUBLIK YANG DITAMPILKAN ── */}
      <div className="space-y-6">
        {/* Feed Header & Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-purple-100">
          <div>
            <div className="flex items-center gap-2.5">
              <h3 className="text-lg sm:text-xl font-extrabold text-purple-950">
                Pesan & Komentar Masuk
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700 font-bold text-xs">
                {comments.length}
              </span>
            </div>
            <p className="text-xs text-purple-400 mt-0.5">
              Semua orang dapat membaca pesan yang telah dikirimkan secara terbuka.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Search Input */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-purple-400">
                <Search className="w-3.5 h-3.5" />
              </span>
              <input
                type="text"
                placeholder="Cari pesan / nama..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white border border-purple-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-purple-900 placeholder-purple-300 focus:outline-none focus:border-purple-500 w-44 sm:w-56 transition-all"
              />
            </div>

            {/* Refresh Button */}
            <button
              onClick={fetchComments}
              disabled={loadingComments}
              title="Segarkan komentar"
              className="p-2 bg-white border border-purple-200 hover:bg-purple-50 text-purple-600 rounded-xl transition-all shadow-sm flex items-center justify-center"
            >
              <RefreshCw className={`w-4 h-4 ${loadingComments ? 'animate-spin text-purple-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* Comments List */}
        {loadingComments && comments.length === 0 ? (
          <div className="py-16 text-center text-purple-400 space-y-3">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-purple-400" />
            <p className="text-sm font-medium">Memuat komentar publik...</p>
          </div>
        ) : filteredComments.length === 0 ? (
          <div className="text-center py-16 px-4 bg-white rounded-3xl border border-purple-100 shadow-sm">
            <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-3 text-purple-400">
              <Heart className="w-8 h-8 opacity-60" />
            </div>
            <h4 className="text-base font-bold text-purple-900">
              {searchQuery ? 'Tidak ada komentar yang cocok' : 'Belum ada komentar'}
            </h4>
            <p className="text-xs text-purple-400 mt-1 max-w-sm mx-auto">
              {searchQuery
                ? 'Coba gunakan kata kunci pencarian yang lain.'
                : 'Jadilah orang pertama yang mengirimkan ucapan atau pesan semangat di atas!'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredComments.map((item) => {
              const initial = item.nama ? item.nama.trim().charAt(0).toUpperCase() : '?';
              const gradientClass = getAvatarGradient(item.nama);
              const roleBadgeClass = getRoleBadgeStyle(item.role);

              return (
                <div
                  key={item._id}
                  className="bg-white rounded-2xl p-5 sm:p-6 border border-purple-100 shadow-md shadow-purple-100/40 hover:shadow-lg hover:shadow-purple-100/60 transition-all duration-200 group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {/* Avatar with initial */}
                      <div
                        className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${gradientClass} text-white font-extrabold flex items-center justify-center text-sm shadow-sm shrink-0`}
                      >
                        {initial}
                      </div>

                      {/* Name & Role */}
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-extrabold text-purple-950 text-sm sm:text-base">
                            {item.nama}
                          </h4>
                          {item.role && (
                            <span
                              className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${roleBadgeClass}`}
                            >
                              {item.role}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-purple-400 mt-0.5">
                          <Clock className="w-3 h-3" />
                          <span>{formatTanggalWaktu(item.createdAt)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Admin Delete Button */}
                    {isAdmin && (
                      <button
                        onClick={() => handleDeleteComment(item._id)}
                        title="Hapus komentar ini (Admin)"
                        className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Comment Message Body */}
                  <div className="mt-3.5 pt-3 border-t border-purple-50 text-purple-900/90 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words font-normal">
                    {item.pesan}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicComments;
