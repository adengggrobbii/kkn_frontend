import React, { useState } from 'react';
import { Users, GraduationCap, Award, Search } from 'lucide-react';

// ============================================================================
// DATA ANGGOTA KKN DESA ULOK MUKTI
// Anda dapat mengubah, menambah, atau mengganti data & foto secara manual di sini.
// Taruh file foto di folder: frontend/public/members/ (contoh: /members/budi.jpg)
// ============================================================================
const MEMBERS_DATA = [
  {
    id: 1,
    nama: 'ADENG ROBI KURNIA',
    peran: 'Ketua Kelompok',
    prodi: 'S1 REKAYASA PERANGKAT LUNAK',
    angkatan: '2023',
    foto: '/members/ketua.png', // atau URL foto / placeholder
    badgeColor: 'bg-purple-600 text-white',
  },
  {
    id: 2,
    nama: 'ANGGI SAPUTRA',
    peran: 'Wakil Ketua',
    prodi: 'S1 KEPERAWATAN',
    angkatan: '2024',
    foto: '/members/wakil.png',
    badgeColor: 'bg-violet-600 text-white',
  },
  {
    id: 3,
    nama: 'SOFIYANA',
    peran: 'Bendahara',
    prodi: 'S1 KEPERAWATAN',
    angkatan: '2024',
    foto: '/members/bendahara1.png',
    badgeColor: 'bg-fuchsia-600 text-white',
  },
  {
    id: 4,
    nama: 'MARYA TINA',
    peran: 'Bendahara',
    prodi: 'S1 KEPERAWATAN',
    angkatan: '2024',
    foto: '/members/bendahara2.png',
    badgeColor: 'bg-pink-600 text-white',
  },
  {
    id: 5,
    nama: 'NELA ANDANI',
    peran: 'Sekertaris',
    prodi: 'S1 KEPERAWATAN',
    angkatan: '2024',
    foto: '/members/sekertaris1.png',
    badgeColor: 'bg-purple-100 text-purple-700 border border-purple-200',
  },
  {
    id: 6,
    nama: 'SISMIAN TIRTIANA',
    peran: 'Sekertaris',
    prodi: 'S1 GIZI',
    angkatan: '2023',
    foto: '/members/sekertaris2.png',
    badgeColor: 'bg-purple-100 text-purple-700 border border-purple-200',
  },
  {
    id: 7,
    nama: 'MUSTIKA DHIAN NAFIAH',
    peran: 'Sekertaris',
    prodi: 'S1 GIZI',
    angkatan: '2023',
    foto: '/members/sekertaris3.png',
    badgeColor: 'bg-purple-100 text-purple-700 border border-purple-200',
  },
  {
    id: 8,
    nama: 'PUTRI SETIA NINGSIH',
    peran: 'Sekertaris',
    prodi: 'S1 GIZI',
    angkatan: '2023',
    foto: '/members/sekertaris4.png',
    badgeColor: 'bg-purple-100 text-purple-700 border border-purple-200',
  },
  {
    id: 9,
    nama: 'YASINTA PUTRI AYU DINANTI',
    peran: 'Humas',
    prodi: 'S1 KEBIDANAN',
    angkatan: '2023',
    foto: '/members/humas2.png',
    badgeColor: 'bg-purple-100 text-purple-700 border border-purple-200',
  },
  {
    id: 10,
    nama: 'DINDA TRISNA W',
    peran: 'Humas',
    prodi: 'S1 KEPERAWATAN',
    angkatan: '2024',
    foto: '/members/humas1.png',
    badgeColor: 'bg-purple-100 text-purple-700 border border-purple-200',
  },
  {
    id: 11,
    nama: 'INDAH NURAINI',
    peran: 'Humas',
    prodi: 'S1 KEBIDANAN',
    angkatan: '2023',
    foto: '/members/humas3.png',
    badgeColor: 'bg-purple-100 text-purple-700 border border-purple-200',
  },
  {
    id: 12,
    nama: 'FEBY NABILA',
    peran: 'Acara',
    prodi: 'S1 KEPERAWATAN',
    angkatan: '2024',
    foto: '/members/acara1.png',
    badgeColor: 'bg-purple-100 text-purple-700 border border-purple-200',
  },
  {
    id: 13,
    nama: 'WINDHU WINDARI',
    peran: 'Acara',
    prodi: 'S1 KEPERAWATAN',
    angkatan: '2024',
    foto: '/members/acara2.png',
    badgeColor: 'bg-purple-100 text-purple-700 border border-purple-200',
  },
  {
    id: 14,
    nama: 'SHINTIA',
    peran: 'Acara',
    prodi: 'S1 KEPERAWATAN',
    angkatan: '2024',
    foto: '/members/acara3.png',
    badgeColor: 'bg-purple-100 text-purple-700 border border-purple-200',
  },
  {
    id: 15,
    nama: 'IMAYASARI',
    peran: 'Perlengkapan',
    prodi: 'S1 KEPERAWATAN',
    angkatan: '2024',
    foto: '/members/perlengkapan1.png',
    badgeColor: 'bg-purple-100 text-purple-700 border border-purple-200',
  },
  {
    id: 16,
    nama: 'AINA WAL AZIZAH W',
    peran: 'Perlengkapan',
    prodi: 'S1 KEPERAWATAN',
    angkatan: '2024',
    foto: '/members/perlengkapan2.png',
    badgeColor: 'bg-purple-100 text-purple-700 border border-purple-200',
  },
  {
    id: 17,
    nama: 'DEA UNI KURNIASIH',
    peran: 'Perlengkapan',
    prodi: 'S1 KEPERAWATAN',
    angkatan: '2024',
    foto: '/members/perlengkapan3.png',
    badgeColor: 'bg-purple-100 text-purple-700 border border-purple-200',
  },
  {
    id: 18,
    nama: 'LUSIANA FADILAH',
    peran: 'Perlengkapan',
    prodi: 'S1 KEPERAWATAN',
    angkatan: '2024',
    foto: '/members/pdd1.png',
    badgeColor: 'bg-purple-100 text-purple-700 border border-purple-200',
  },
  {
    id: 19,
    nama: 'SUCI RAHMAWATI',
    peran: 'Perlengkapan',
    prodi: 'S1 KEPERAWATAN',
    angkatan: '2024',
    foto: '/members/pdd2.png',
    badgeColor: 'bg-purple-100 text-purple-700 border border-purple-200',
  },
  {
    id: 20,
    nama: 'HELYAN MAYDIA PUSPITA S',
    peran: 'Perlengkapan',
    prodi: 'S1 KEPERAWATAN',
    angkatan: '2024',
    foto: '/members/pdd3.png',
    badgeColor: 'bg-purple-100 text-purple-700 border border-purple-200',
  },
];

const Members = () => {
  const [search, setSearch] = useState('');
  const [selectedMember, setSelectedMember] = useState(null);

  const filteredMembers = MEMBERS_DATA.filter((m) =>
    m.nama.toLowerCase().includes(search.toLowerCase()) ||
    m.peran.toLowerCase().includes(search.toLowerCase()) ||
    m.prodi.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative">
      {/* Background Decorative Blur */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-4xl h-72 bg-purple-200/30 rounded-full blur-3xl -z-10 pointer-events-none"></div>

      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-purple-600 rounded-2xl shadow-lg shadow-purple-300/40 mb-4">
          <Users className="w-7 h-7 text-white" />
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-purple-900 tracking-tight">
          Anggota KKN Desa Ulok Mukti
        </h1>
        <p className="text-purple-500 mt-2 text-xs sm:text-sm font-medium">
          Daftar Mahasiswa Universitas Aisyah Pringsewu yang Mengabdi di Desa Ulok Mukti Tahun 2026
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-md mx-auto mb-8 sm:mb-12">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-purple-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Cari berdasarkan nama, divisi, atau prodi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-purple-200 rounded-2xl pl-10 pr-4 py-3 text-xs sm:text-sm text-purple-900 placeholder-purple-300 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 shadow-sm transition-all duration-300"
          />
        </div>
      </div>

      {/* Members Grid */}
      {filteredMembers.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-purple-100 shadow-sm p-8 max-w-md mx-auto">
          <Users className="w-12 h-12 text-purple-200 mx-auto mb-3" />
          <p className="font-bold text-purple-800 text-sm">Anggota Tidak Ditemukan</p>
          <p className="text-xs text-purple-400 mt-1">Coba kata kunci pencarian yang lain.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredMembers.map((member) => (
            <div
              key={member.id}
              onClick={() => setSelectedMember(member)}
              className="bg-white rounded-3xl border border-purple-100 hover:border-purple-300 shadow-sm hover:shadow-xl hover:shadow-purple-100/70 transition-all duration-300 overflow-hidden group cursor-pointer flex flex-col justify-between"
            >
              <div>
                {/* Photo & Role Badge Overlay */}
                <div className="relative aspect-[4/5] bg-purple-100 overflow-hidden">
                  <img
                    src={member.foto}
                    alt={member.nama}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      // Fallback UI generator with avatar initials if photo doesn't exist yet
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="hidden absolute inset-0 bg-gradient-to-br from-purple-500 to-violet-700 items-center justify-center text-white font-extrabold text-3xl sm:text-4xl shadow-inner">
                    {member.nama
                      .split(' ')
                      .filter(Boolean)
                      .slice(0, 2)
                      .map((n) => n[0])
                      .join('')}
                  </div>

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-purple-950/70 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity"></div>

                  {/* Role Badge */}
                  <span
                    className={`absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold tracking-wide shadow-md ${member.badgeColor}`}
                  >
                    {member.peran}
                  </span>
                </div>

                {/* Body Content */}
                <div className="p-4 sm:p-5">
                  <h3 className="font-extrabold text-base sm:text-lg text-purple-950 group-hover:text-purple-700 transition-colors line-clamp-1">
                    {member.nama}
                  </h3>
                  <div className="flex items-center gap-1.5 text-purple-500 text-xs mt-1 font-semibold">
                    <GraduationCap className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    <span className="truncate">{member.prodi}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Member Detail Modal */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/60 backdrop-blur-sm animate-fade-in-up">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-purple-100 relative">
            <button
              onClick={() => setSelectedMember(null)}
              className="absolute top-3 right-3 z-10 bg-white/80 hover:bg-white text-purple-800 p-2 rounded-full shadow-md transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="relative aspect-video bg-purple-600 overflow-hidden">
              <img
                src={selectedMember.foto}
                alt={selectedMember.nama}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="hidden absolute inset-0 bg-gradient-to-br from-purple-600 to-violet-800 items-center justify-center text-white font-extrabold text-5xl">
                {selectedMember.nama
                  .split(' ')
                  .filter(Boolean)
                  .slice(0, 2)
                  .map((n) => n[0])
                  .join('')}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-purple-950 via-purple-950/30 to-transparent"></div>
              <div className="absolute bottom-4 left-5 right-5 text-white">
                <span className={`inline-block px-3 py-0.5 rounded-full text-[10px] font-bold mb-1.5 ${selectedMember.badgeColor}`}>
                  {selectedMember.peran}
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold leading-tight">{selectedMember.nama}</h2>
              </div>
            </div>

            <div className="p-6 space-y-4 text-xs sm:text-sm text-purple-900">
              <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-2xl border border-purple-100">
                <GraduationCap className="w-5 h-5 text-purple-600 shrink-0" />
                <div>
                  <div className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">Program Studi</div>
                  <div className="font-bold text-purple-900">{selectedMember.prodi}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-2xl border border-purple-100">
                <Award className="w-5 h-5 text-purple-600 shrink-0" />
                <div>
                  <div className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">Angkatan</div>
                  <div className="font-bold text-purple-900">Tahun {selectedMember.angkatan}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Members;
