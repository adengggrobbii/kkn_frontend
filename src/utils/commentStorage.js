// Helper untuk sinkronisasi komentar publik
// Menjamin komentar LANGSUNG tersimpan dan muncul di HP/Browser sekalipun backend belum di-deploy atau sedang offline

export const DEFAULT_INITIAL_COMMENTS = [];

const STORAGE_KEY = 'kkn_public_comments_cache_v2';
const DELETED_KEY = 'kkn_deleted_comment_ids_v1';

// Daftar ID komentar yang pernah dihapus agar tidak pernah muncul lagi
export const getDeletedCommentIds = () => {
  try {
    const raw = localStorage.getItem(DELETED_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const addDeletedCommentId = (id) => {
  try {
    if (!id) return;
    const deleted = getDeletedCommentIds();
    if (!deleted.includes(String(id))) {
      deleted.push(String(id));
      localStorage.setItem(DELETED_KEY, JSON.stringify(deleted));
    }
  } catch (e) {
    console.error('Error recording deleted comment id:', e);
  }
};

export const filterOutDeleted = (comments = []) => {
  if (!Array.isArray(comments)) return [];
  const deleted = getDeletedCommentIds();
  const deletedSet = new Set(deleted.map(String));
  return comments.filter((c) => {
    if (!c) return false;
    const idStr = String(c._id || '');
    if (idStr.startsWith('init_')) return false;
    if (deletedSet.has(idStr)) return false;
    return true;
  });
};

export const getLocalComments = () => {
  try {
    // Bersihkan cache versi lama jika ada
    if (localStorage.getItem('kkn_public_comments_cache_v1')) {
      localStorage.removeItem('kkn_public_comments_cache_v1');
    }
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return filterOutDeleted(parsed);
    }
    return [];
  } catch (e) {
    console.error('Error reading localStorage comments:', e);
    return [];
  }
};

export const saveLocalComments = (comments) => {
  try {
    const cleaned = filterOutDeleted(comments);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cleaned));
  } catch (e) {
    console.error('Error saving to localStorage:', e);
  }
};

export const addLocalComment = (comment) => {
  const current = getLocalComments();
  // Cegah duplikasi
  const filtered = current.filter((c) => String(c._id) !== String(comment._id));
  const updated = [comment, ...filtered];
  saveLocalComments(updated);
  return updated;
};

export const removeLocalComment = (id) => {
  addDeletedCommentId(id);
  const current = getLocalComments();
  const updated = current.filter((c) => String(c._id) !== String(id));
  saveLocalComments(updated);
  return updated;
};
