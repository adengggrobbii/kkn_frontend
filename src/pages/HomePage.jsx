import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../api';
import { getLocalComments, saveLocalComments, filterOutDeleted } from '../utils/commentStorage';
import {
  MapPin,
  HeartHandshake,
  GraduationCap,
  ArrowRight,
  Calendar,
  CheckCircle2,
  Building2,
  Camera,
  MessageSquare,
  Sparkles,
  Quote,
  Film,
} from 'lucide-react';
import MemberHeroCarousel from '../components/MemberHeroCarousel';

// Helper format tanggal singkat
const formatTanggalSingkat = (dateStr) => {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
};

// Helper warna avatar
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

// ============================================================================
// 📸 PENGATURAN FOTO BACKGROUND HALAMAN UTAMA (HERO SECTION)
// ============================================================================
// Cara mengganti foto background ini dengan foto Anda sendiri:
// 1. Masukkan file foto Anda ke folder: frontend/public/homepage/
//    (Contoh: frontend/public/homepage/bg-utama.png atau bg-utama.jpg)
// 2. Jika nama filenya berbeda, ubah nilai path di bawah ini.
// ============================================================================
export const BACKGROUND_HALAMAN_UTAMA = '/homepage/bg.jpg';

const HOMEPAGE_PHOTOS = [
  {
    id: 1,
    url: '/homepage/k4.jpg',
    judul: 'Sosialisasi dan Edukasi',
    sub: 'Sosialisasi dan edukasi di SMPN 11 Ngambur',
  },
  {
    id: 2,
    url: '/homepage/k2.jpg',
    judul: 'Proker Plang Edukasi Sampah',
    sub: 'Pemasangan Plang Edukasi Sampah di Pekon Ulok Mukti',
  },
  {
    id: 3,
    url: '/homepage/k3.jpg',
    judul: 'Sosialisasi di SD 44 Krui',
    sub: 'Sosialisasi dan edukasi di SD 44 Krui',
  },
  {
    id: 4,
    url: '/homepage/k5.jpg',
    judul: 'Kegiatan Bersama di TPA',
    sub: 'TPA Hudatunnajiyah Pekon Ulok Mukti',
  },
];

const HomePage = ({ setCurrentPage }) => {
  const [recentComments, setRecentComments] = useState(() => getLocalComments().slice(0, 6));
  const [loadingComments, setLoadingComments] = useState(false);

  useEffect(() => {
    const fetchRecentComments = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/comments`, { timeout: 4000 });
        if (res.data && res.data.success && Array.isArray(res.data.data)) {
          setRecentComments(res.data.data.slice(0, 6));
          saveLocalComments(res.data.data);
        } else {
          setRecentComments(getLocalComments().slice(0, 6));
        }
      } catch (err) {
        setRecentComments(getLocalComments().slice(0, 6));
      } finally {
        setLoadingComments(false);
      }
    };
    fetchRecentComments();

    // Auto-refresh setiap 8 detik
    const interval = setInterval(fetchRecentComments, 8000);
    const handleFocus = () => fetchRecentComments();
    window.addEventListener('focus', handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);
  return (
    <div className="min-h-screen text-purple-950">
      {/* ── HERO SECTION ────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-purple-950 text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        {/* Foto Background Halaman Utama (Foto asli tanpa gradient / vignette) */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src={BACKGROUND_HALAMAN_UTAMA}
            alt="Foto Background Halaman Utama"
            className="w-full h-full object-cover object-center"
            onError={(e) => {
              // Fallback otomatis jika file belum ditemukan
              e.target.onerror = null;
              e.target.src = '/homepage/kkn.png';
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">
          {/* Left Text Content */}
          <div className="text-center lg:text-left space-y-6 bg-black/40 lg:bg-black/30 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-white/15 shadow-2xl max-w-xl mx-auto lg:mx-0">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs sm:text-sm font-semibold tracking-wide backdrop-blur-md">
              <GraduationCap className="w-4 h-4 text-purple-300" />
              <span>Universitas Aisyah Pringsewu 2026</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Selamat Datang Di Website <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-purple-200 via-violet-300 to-fuchsia-200 bg-clip-text text-transparent">
                KKN Desa Ulok Mukti
              </span>
            </h1>

            <p className="text-purple-200/95 text-sm sm:text-base leading-relaxed max-w-xl mx-auto lg:mx-0 font-medium">
              Wadah informasi kegiatan, dokumentasi linimasa pengabdian, profil Desa Ulok Mukti, serta kolom komentar publik. Berdaya bersama, maju bersama!
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
              <button
                onClick={() => setCurrentPage('comments')}
                className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-400 hover:to-violet-400 text-white font-extrabold px-5 py-3 rounded-2xl shadow-lg shadow-purple-900/50 hover:shadow-purple-700/50 transition-all duration-300 text-xs sm:text-sm active:scale-95"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Kirim Pesan</span>
              </button>

              <button
                onClick={() => setCurrentPage('aftermovie')}
                className="flex items-center gap-2 bg-purple-600/70 hover:bg-purple-600 text-white font-extrabold px-5 py-3 rounded-2xl border border-purple-400/40 backdrop-blur-md transition-all duration-300 text-xs sm:text-sm active:scale-95 shadow-lg shadow-purple-950/50"
              >
                <Film className="w-4 h-4 text-purple-200" />
                <span>Nonton After Movie</span>
              </button>

              <button
                onClick={() => setCurrentPage('documentation')}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold px-5 py-3 rounded-2xl border border-white/20 backdrop-blur-md transition-all duration-300 text-xs sm:text-sm active:scale-95"
              >
                <Camera className="w-4 h-4" />
                <span>Dokumentasi</span>
              </button>
            </div>
          </div>

          {/* Right Hero Image Card Carousel with All KKN Members */}
          <div className="w-full flex justify-center lg:justify-end">
            <MemberHeroCarousel setCurrentPage={setCurrentPage} />
          </div>
        </div>
      </section>

      {/* ── STATISTIK SEKILAS ───────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="bg-white rounded-3xl shadow-xl shadow-purple-100/70 border border-purple-100 p-6 sm:p-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { angka: '2026', label: 'Tahun Angkatan', icon: <Calendar className="w-5 h-5 text-purple-600" /> },
            { angka: 'Desa Ulok Mukti', label: 'Lokasi Pengabdian', icon: <MapPin className="w-5 h-5 text-purple-600" /> },
            { angka: '100%', label: 'Semangat Mengabdi', icon: <HeartHandshake className="w-5 h-5 text-purple-600" /> },
            { angka: 'Aktif', label: 'Status Absensi Online', icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" /> },
          ].map((s, i) => (
            <div key={i} className="space-y-1">
              <div className="inline-flex items-center justify-center p-2.5 rounded-2xl bg-purple-50 mb-1">
                {s.icon}
              </div>
              <div className="text-xl sm:text-2xl font-black text-purple-950">{s.angka}</div>
              <div className="text-xs text-purple-400 font-medium">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PROFIL DESA ULOK MUKTI ──────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Text Profil */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-700 font-bold text-xs">
              <Building2 className="w-3.5 h-3.5" />
              <span>Mengenal Lokasi KKN</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-purple-950 tracking-tight leading-tight">
              Profil Desa Ulok Mukti
            </h2>

            <p className="text-sm sm:text-base text-purple-800/90 leading-relaxed">
              Desa Ulok Mukti merupakan salah satu desa yang berkembang di kawasan yang kaya akan keasrian alam dan kearifan lokal masyarakatnya. Warga Desa Ulok Mukti dikenal ramah, gotong-royong, serta memiliki mata pencaharian utama di bidang pertanian, perkebunan, dan usaha mikro kecil.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-purple-50/80 border border-purple-100 space-y-1">
                <h4 className="font-extrabold text-purple-900 text-sm">🌾 Potensi Pertanian & Perkebunan</h4>
                <p className="text-xs text-purple-600 leading-relaxed">
                  Lahan subur dengan hasil bumi komoditas lokal yang menopang perekonomian warga desa.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-purple-50/80 border border-purple-100 space-y-1">
                <h4 className="font-extrabold text-purple-900 text-sm">🤝 Kebersamaan Masyarakat</h4>
                <p className="text-xs text-purple-600 leading-relaxed">
                  Budaya kerja bakti dan kekeluargaan yang erat antara aparat desa dan warga.
                </p>
              </div>
            </div>
          </div>

          {/* Visual Profile Card */}
          <div className="lg:col-span-5">
            <div className="bg-gradient-to-br from-purple-900 to-violet-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/20 rounded-full blur-2xl"></div>

              <div className="relative z-10 space-y-6">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-white/10 rounded-2xl border border-white/20">
                    <MapPin className="w-6 h-6 text-purple-300" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Peta & Wilayah Desa</h3>
                    <p className="text-xs text-purple-200">Desa Ulok Mukti</p>
                  </div>
                </div>

                <div className="space-y-3 text-xs text-purple-200">
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="font-semibold text-white">Status Desa</span>
                    <span>Desa Binaan KKN 2026</span>
                  </div>
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="font-semibold text-white">Perguruan Tinggi</span>
                    <span>Universitas Aisyah Pringsewu</span>
                  </div>
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="font-semibold text-white">Fokus Pengabdian</span>
                    <span>Kesehatan, Pendidikan, Ekonomi</span>
                  </div>
                </div>

                {/* Button to Maps */}
                <a
                  href="https://maps.google.com/?q=Desa+Ulok+Mukti"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-white text-purple-950 font-extrabold py-3 rounded-2xl shadow-md hover:bg-purple-50 transition-all text-xs"
                >
                  <MapPin className="w-4 h-4 text-purple-600" />
                  <span>Buka Petunjuk Lokasi di Google Maps</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SPOTLIGHT BANNER AFTER MOVIE ────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-10">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-purple-950 via-slate-950 to-purple-950 border border-purple-500/30 shadow-2xl p-6 sm:p-10 text-white">
          <div className="absolute inset-0 z-0">
            <img
              src="/homepage/bg.jpg"
              alt="After Movie Backdrop"
              className="w-full h-full object-cover opacity-20 filter blur-[2px]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-purple-950/95 via-purple-950/80 to-purple-950/95" />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2.5 text-center md:text-left max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-300 text-xs font-bold">
                <Film className="w-3.5 h-3.5" />
                <span>Sinema KKN Pekon Ulok Mukti 2026</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white">
                Tonton Video After Movie Resmi
              </h3>
              <p className="text-xs sm:text-sm text-purple-200/90 leading-relaxed">
                Abadikan setiap kenangan, tawa, dan cerita perjuangan pengabdian di Pekon Ulok Mukti dalam video sinematik beresolusi tinggi.
              </p>
            </div>

            <button
              onClick={() => setCurrentPage('aftermovie')}
              className="inline-flex items-center gap-2.5 bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-400 hover:to-violet-400 text-white font-extrabold px-7 py-3.5 rounded-2xl shadow-xl shadow-purple-900/60 hover:shadow-purple-700/60 transition-all duration-300 text-xs sm:text-sm active:scale-95 shrink-0"
            >
              <Film className="w-4 h-4" />
              <span>Buka Menu After Movie</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ── GALERI HIGHLIGHT FOTO KEGIATAN ──────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 bg-purple-50/50 rounded-3xl border border-purple-100 my-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-purple-950">
              Galeri Kegiatan KKN
            </h2>
            <p className="text-purple-400 text-xs sm:text-sm mt-1">
              Dokumentasi singkat momen berharga bersama warga Desa Ulok Mukti
            </p>
          </div>
          <button
            onClick={() => setCurrentPage('documentation')}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-purple-600 hover:text-purple-800 bg-white hover:bg-purple-100 px-4 py-2.5 rounded-xl border border-purple-200 transition-all shadow-sm"
          >
            <span>Selengkapnya di Linimasa</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Photo Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {HOMEPAGE_PHOTOS.map((photo) => (
            <div
              key={photo.id}
              className="bg-white rounded-3xl overflow-hidden border border-purple-100 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="aspect-video bg-purple-100 overflow-hidden relative">
                <img
                  src={photo.url}
                  alt={photo.judul}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="hidden absolute inset-0 bg-purple-100 items-center justify-center text-purple-300">
                  <Camera className="w-8 h-8 opacity-50" />
                </div>
              </div>
              <div className="p-4">
                <h4 className="font-bold text-purple-900 text-sm truncate">{photo.judul}</h4>
                <p className="text-xs text-purple-400 mt-0.5">{photo.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── KOMENTAR & BUKU TAMU TERBARU DI BERANDA ────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-bold mb-2.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span>Aspirasi & Pesan Hangat</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-purple-950 tracking-tight">
              Apa Kata Mereka Tentang KKN Ini?
            </h2>
            <p className="text-purple-500 text-xs sm:text-sm mt-1">
              Pesan, doa, dan kesan yang disampaikan secara terbuka oleh masyarakat, mahasiswa, dan pengunjung
            </p>
          </div>
          <button
            onClick={() => setCurrentPage('comments')}
            className="flex items-center gap-2 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 px-5 py-2.5 rounded-xl shadow-md shadow-purple-300/40 hover:shadow-purple-400/50 transition-all shrink-0"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Lihat Semua & Tulis Komentar</span>
          </button>
        </div>

        {loadingComments ? (
          <div className="py-12 text-center text-purple-400 text-xs sm:text-sm">
            Memuat komentar terbaru...
          </div>
        ) : recentComments.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-purple-100 shadow-sm max-w-md mx-auto">
            <MessageSquare className="w-8 h-8 text-purple-300 mx-auto mb-2" />
            <p className="text-xs sm:text-sm font-bold text-purple-900">Belum ada komentar yang ditampilkan.</p>
            <button
              onClick={() => setCurrentPage('comments')}
              className="mt-3 text-xs font-bold text-purple-600 hover:underline"
            >
              Jadilah orang pertama yang menulis komentar!
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {recentComments.map((item) => {
              const initial = item.nama ? item.nama.trim().charAt(0).toUpperCase() : '?';
              const gradientClass = getAvatarGradient(item.nama);
              const roleBadgeClass = getRoleBadgeStyle(item.role);

              return (
                <div
                  key={item._id}
                  className="bg-white rounded-3xl p-5 sm:p-6 border border-purple-100 shadow-md shadow-purple-100/40 hover:shadow-xl hover:shadow-purple-200/50 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    {/* Header: Avatar, Name, Role */}
                    <div className="flex items-center gap-3 mb-3.5">
                      <div
                        className={`w-10 h-10 rounded-2xl bg-gradient-to-tr ${gradientClass} text-white font-extrabold flex items-center justify-center text-sm shadow-sm shrink-0`}
                      >
                        {initial}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-extrabold text-purple-950 text-sm truncate">
                          {item.nama}
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${roleBadgeClass}`}>
                            {item.role || 'Pengunjung'}
                          </span>
                          <span className="text-[10px] text-purple-400">
                            {formatTanggalSingkat(item.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Message Content */}
                    <div className="relative bg-purple-50/40 rounded-2xl p-4 border border-purple-50">
                      <Quote className="w-5 h-5 text-purple-300/40 absolute top-2 right-2 rotate-180" />
                      <p className="text-xs sm:text-sm text-purple-900/90 leading-relaxed line-clamp-3 whitespace-pre-wrap break-words">
                        {item.pesan}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ── CALL TO ACTION KOMENTAR & PESAN ──────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-gradient-to-r from-purple-900 via-purple-800 to-violet-900 rounded-3xl p-8 sm:p-12 text-white text-center shadow-xl relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-4 relative z-10">
            <h2 className="text-2xl sm:text-4xl font-extrabold">
              Punya Pesan atau Tanggapan untuk Kami?
            </h2>
            <p className="text-purple-200 text-xs sm:text-sm">
              Sampaikan ucapan semangat, masukan, aspirasi, atau kesan Anda untuk tim KKN Universitas Aisyah Pringsewu di Desa Ulok Mukti 2026.
            </p>
            <button
              onClick={() => setCurrentPage('comments')}
              className="inline-flex items-center gap-2 bg-white text-purple-950 font-black px-8 py-3.5 rounded-2xl shadow-lg hover:bg-purple-50 transition-all text-xs sm:text-sm"
            >
              <span>Tulis Komentar Sekarang</span>
              <ArrowRight className="w-4 h-4 text-purple-700" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
