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
];

const STORAGE_KEY = 'kkn_public_comments_cache_v2';

export const getLocalComments = () => {
  try {
    // Bersihkan cache versi lama jika ada
    if (localStorage.getItem('kkn_public_comments_cache_v1')) {
      localStorage.removeItem('kkn_public_comments_cache_v1');
    }
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_INITIAL_COMMENTS;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      // Hapus komentar mock/dummy (yang berawalan init_)
      const clean = parsed.filter(c => !String(c._id).startsWith('init_'));
      return clean.length > 0 ? clean : DEFAULT_INITIAL_COMMENTS;
    }
    return DEFAULT_INITIAL_COMMENTS;
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
