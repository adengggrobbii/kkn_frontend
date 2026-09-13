// Helper untuk sinkronisasi komentar publik
// Menjamin komentar LANGSUNG tersimpan dan muncul di HP/Browser sekalipun backend belum di-deploy atau sedang offline

export const DEFAULT_INITIAL_COMMENTS = [
  {
    _id: "6aa5ad57d9e78b038c7608ff",
    nama: "ketua sangar",
    role: "Mahasiswa KKN",
    pesan: "kangen kaliannnnnnnnnnnnn",
    createdAt: "2026-09-12T19:51:51.955Z",
  },
  {
    _id: "init_02",
    nama: "Bapak Peratin (Kepala Pekon)",
    role: "Aparatur Desa",
    pesan: "Terima kasih banyak atas dedikasi dan pengabdian seluruh adik-adik mahasiswa KKN UAP di Pekon Ulok Mukti. Program kerja plang edukasi sampah dan tanaman toga sangat bermanfaat bagi masyarakat kami.",
    createdAt: "2026-09-02T10:30:00.000Z",
  },
  {
    _id: "init_03",
    nama: "Ibu Nurhayati (Kader Posyandu)",
    role: "Warga Desa Ulok Mukti",
    pesan: "Alhamdulillah adik-adik mahasiswa sangat ramah dan aktif membantu kegiatan posyandu balita serta lansia di balai pekon. Sukses selalu studinya!",
    createdAt: "2026-08-25T14:15:00.000Z",
  },
  {
    _id: "init_04",
    nama: "Bapak Solihin (Karang Taruna)",
    role: "Warga Desa Ulok Mukti",
    pesan: "Seru banget momen perayaan 17 Agustus, lomba anak-anak dan malam puncak bareng mahasiswa KKN. Tetap kompak dan jangan lupa mampir lagi ke Ulok Mukti!",
    createdAt: "2026-08-21T20:00:00.000Z",
  },
  {
    _id: "init_05",
    nama: "Ibu Guru SDN 44 Krui",
    role: "DPL / Dosen",
    pesan: "Sosialisasi dan edukasi anti-bullying yang dibawakan adik-adik KKN sangat interaktif dan menyenangkan untuk siswa-siswi kami. Terima kasih banyak!",
    createdAt: "2026-08-14T09:00:00.000Z",
  },
  {
    _id: "init_06",
    nama: "Pak RT Pemangku SP2",
    role: "Aparatur Desa",
    pesan: "Gotong royong jembatan Garuda bareng mahasiswa KKN sangat membantu kelancaran akses harian warga. Sehat dan sukses selalu untuk adik-adik semua!",
    createdAt: "2026-08-08T16:45:00.000Z",
  },
];

const STORAGE_KEY = 'kkn_public_comments_cache_v1';

export const getLocalComments = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_INITIAL_COMMENTS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_INITIAL_COMMENTS;
  } catch (e) {
    console.error('Error reading localStorage comments:', e);
    return DEFAULT_INITIAL_COMMENTS;
  }
};

export const saveLocalComments = (comments) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(comments));
  } catch (e) {
    console.error('Error saving to localStorage:', e);
  }
};

export const addLocalComment = (comment) => {
  const current = getLocalComments();
  // Cegah duplikasi
  const filtered = current.filter(c => c._id !== comment._id);
  const updated = [comment, ...filtered];
  saveLocalComments(updated);
  return updated;
};

export const removeLocalComment = (id) => {
  const current = getLocalComments();
  const updated = current.filter((c) => c._id !== id);
  saveLocalComments(updated);
  return updated;
};
