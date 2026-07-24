import React from 'react';
import {
  MapPin,
  HeartHandshake,
  GraduationCap,
  ArrowRight,
  Calendar,
  CheckCircle2,
  Building2,
  Camera
} from 'lucide-react';

// ============================================================================
// FOTO HIGHLIGHT KEGIATAN HOMEPAGE
// Taruh file foto di folder: frontend/public/homepage/ (contoh: /homepage/kegiatan1.jpg)
// Anda bisa mengganti URL/path foto di bawah ini secara manual.
// ============================================================================
const HOMEPAGE_PHOTOS = [
  {
    id: 1,
    url: '/homepage/kkn.png',
    judul: 'coming soon',
    sub: 'coming soon',
  },
  {
    id: 2,
    url: '/homepage/kkn.png',
    judul: 'coming soon',
    sub: 'coming soon',
  },
  {
    id: 3,
    url: '/homepage/kkn.png',
    judul: 'coming soon',
    sub: 'coming soon',
  },
];

const HomePage = ({ setCurrentPage }) => {
  return (
    <div className="min-h-screen text-purple-950">
      {/* ── HERO SECTION ────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-purple-900 via-purple-800 to-purple-950 text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl -z-0"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl -z-0"></div>

        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Text Content */}
          <div className="text-center lg:text-left space-y-6">
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

            <p className="text-purple-200/90 text-sm sm:text-base leading-relaxed max-w-xl mx-auto lg:mx-0">
              Wadah informasi kegiatan, presensi harian mahasiswa, dokumentasi linimasa pengabdian, dan profil Desa Ulok Mukti. Berdaya bersama, maju bersama!
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={() => setCurrentPage('student')}
                className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-400 hover:to-violet-400 text-white font-extrabold px-6 py-3.5 rounded-2xl shadow-lg shadow-purple-900/50 hover:shadow-purple-700/50 transition-all duration-300 text-xs sm:text-sm"
              >
                <span>Presensi Kehadiran</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setCurrentPage('documentation')}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold px-6 py-3.5 rounded-2xl border border-white/20 backdrop-blur-md transition-all duration-300 text-xs sm:text-sm"
              >
                <Camera className="w-4 h-4" />
                <span>Lihat Dokumentasi</span>
              </button>
            </div>
          </div>

          {/* Right Hero Image Card Slider / Grid */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 relative">
            {HOMEPAGE_PHOTOS.slice(0, 2).map((photo, index) => (
              <div
                key={photo.id}
                className={`relative rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-purple-900/60 aspect-[4/5] group ${index === 1 ? 'translate-y-6 sm:translate-y-8' : ''
                  }`}
              >
                <img
                  src={photo.url}
                  alt={photo.judul}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="hidden absolute inset-0 bg-gradient-to-br from-purple-800 to-violet-950 items-center justify-center p-4 text-center">
                  <div>
                    <Camera className="w-10 h-10 text-purple-300 mx-auto mb-2 opacity-60" />
                    <span className="text-xs text-purple-200 font-semibold">{photo.judul}</span>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-purple-950/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <p className="text-xs font-bold truncate">{photo.judul}</p>
                  <p className="text-[10px] text-purple-300">{photo.sub}</p>
                </div>
              </div>
            ))}
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

      {/* ── CALL TO ACTION PRESENSI ─────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-gradient-to-r from-purple-900 via-purple-800 to-violet-900 rounded-3xl p-8 sm:p-12 text-white text-center shadow-xl relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-4 relative z-10">
            <h2 className="text-2xl sm:text-4xl font-extrabold">
              Sudahkah Anda Presensi Hari Ini?
            </h2>
            <p className="text-purple-200 text-xs sm:text-sm">
              Pastikan seluruh mahasiswa KKN Desa Ulok Mukti mengisi form presensi harian sebelum batas waktu yang ditentukan.
            </p>
            <button
              onClick={() => setCurrentPage('student')}
              className="inline-flex items-center gap-2 bg-white text-purple-950 font-black px-8 py-3.5 rounded-2xl shadow-lg hover:bg-purple-50 transition-all text-xs sm:text-sm"
            >
              <span>Isi Presensi Sekarang</span>
              <ArrowRight className="w-4 h-4 text-purple-700" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
