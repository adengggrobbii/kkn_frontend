import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, UserCheck, UserMinus, CalendarDays, Search, Download, Trash2, RefreshCw, Eye, AlertCircle, Image as ImageIcon, Plus, CheckCircle2, MessageSquare } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { API_BASE_URL } from '../api';
import { formatPhotoUrl } from './KKNDocumentation';
import { getLocalComments, saveLocalComments, removeLocalComment, filterOutDeleted } from '../utils/commentStorage';

const AdminDashboard = ({ token }) => {
  const [activeTab, setActiveTab] = useState('comments');

  // Comment moderation states
  const [commentsList, setCommentsList] = useState(getLocalComments());
  const [loadingCommentsAdmin, setLoadingCommentsAdmin] = useState(false);
  const [commentSearch, setCommentSearch] = useState('');

  // Attendance states
  const [logs, setLogs] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [errorLogs, setErrorLogs] = useState('');
  const [filters, setFilters] = useState({ search: '', status: '', startDate: '', endDate: '' });
  const [stats, setStats] = useState({ total: 0, hadir: 0, izin: 0, sakit: 0 });
  const [activePhoto, setActivePhoto] = useState(null);

  // Documentation states
  const [docs, setDocs] = useState([]);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const [docForm, setDocForm] = useState({ hariKe: '', tanggal: new Date().toISOString().split('T')[0], judul: '', deskripsi: '' });
  const [docFile, setDocFile] = useState(null);
  const [docPreview, setDocPreview] = useState('');
  const [docSubmitting, setDocSubmitting] = useState(false);
  const [docSuccess, setDocSuccess] = useState('');
  const [docError, setDocError] = useState('');

  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  // ── Fetch attendance ────────────────────────────────────
  const fetchLogs = async () => {
    setLoadingLogs(true); setErrorLogs('');
    try {
      const q = new URLSearchParams();
      if (filters.search) q.append('search', filters.search);
      if (filters.status) q.append('status', filters.status);
      if (filters.startDate) q.append('startDate', filters.startDate);
      if (filters.endDate) q.append('endDate', filters.endDate);
      q.append('kelompok', 'Kelompok Desa Ulok Mukti');
      const { data } = await axios.get(`${API_BASE_URL}/api/attendance?${q}`, authHeader);
      if (data.success) {
        setLogs(data.data);
        const d = data.data;
        setStats({ total: d.length, hadir: d.filter(x => x.status==='Hadir').length, izin: d.filter(x => x.status==='Izin').length, sakit: d.filter(x => x.status==='Sakit').length });
      }
    } catch { setErrorLogs('Gagal memuat data absensi.'); }
    finally { setLoadingLogs(false); }
  };

  // ── Fetch docs ──────────────────────────────────────────
  const fetchDocs = async () => {
    setLoadingDocs(true);
    try {
      const { data } = await axios.get(`${API_BASE_URL}/api/documentation`);
      if (data.success) setDocs(data.data);
    } catch {}
    finally { setLoadingDocs(false); }
  };

  // ── Fetch comments ──────────────────────────────────────
  const fetchCommentsAdmin = async () => {
    setLoadingCommentsAdmin(true);
    try {
      const { data } = await axios.get(`${API_BASE_URL}/api/comments`, { timeout: 4000 });
      if (data && data.success && Array.isArray(data.data)) {
        setCommentsList(data.data);
        saveLocalComments(data.data);
      } else {
        setCommentsList(getLocalComments());
      }
    } catch {
      setCommentsList(getLocalComments());
    } finally {
      setLoadingCommentsAdmin(false);
    }
  };

  const handleDeleteCommentAdmin = async (id) => {
    if (!window.confirm('Yakin ingin menghapus komentar publik ini?')) return;
    setCommentsList((prev) => prev.filter((c) => String(c._id) !== String(id)));
    removeLocalComment(id);
    try {
      await axios.delete(`${API_BASE_URL}/api/comments/${id}`, authHeader);
      fetchCommentsAdmin();
    } catch (err) {
      console.warn('Gagal menghapus komentar di backend:', err);
    }
  };

  useEffect(() => {
    if (activeTab === 'comments') fetchCommentsAdmin();
    else if (activeTab === 'attendance') fetchLogs();
    else fetchDocs();
  }, [activeTab, filters]);

  const handleDeleteLog = async (id) => {
    if (!window.confirm('Hapus data absensi ini?')) return;
    try { await axios.delete(`${API_BASE_URL}/api/attendance/${id}`, authHeader); fetchLogs(); } catch { alert('Gagal menghapus.'); }
  };

  const handleExport = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/attendance/export`, { ...authHeader, responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement('a'); a.href = url;
      a.setAttribute('download', `rekap_absen_ulok_mukti_${new Date().toISOString().split('T')[0]}.xlsx`);
      document.body.appendChild(a); a.click(); a.remove();
    } catch { alert('Gagal mengunduh Excel.'); }
  };

  const handleDocSubmit = async (e) => {
    e.preventDefault(); setDocError(''); setDocSuccess('');
    if (!docFile) { setDocError('Foto wajib diunggah!'); return; }
    setDocSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries(docForm).forEach(([k, v]) => fd.append(k, v));
      fd.append('foto', docFile);
      const { data } = await axios.post(`${API_BASE_URL}/api/documentation`, fd, { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } });
      if (data.success) { setDocSuccess('Dokumentasi berhasil diunggah!'); setDocForm({ hariKe: '', tanggal: new Date().toISOString().split('T')[0], judul: '', deskripsi: '' }); setDocFile(null); setDocPreview(''); fetchDocs(); }
    } catch (err) { setDocError(err.response?.data?.message || 'Gagal mengunggah.'); }
    finally { setDocSubmitting(false); }
  };

  const handleDeleteDoc = async (id) => {
    if (!window.confirm('Hapus dokumentasi ini?')) return;
    try { await axios.delete(`${API_BASE_URL}/api/documentation/${id}`, authHeader); fetchDocs(); } catch { alert('Gagal menghapus.'); }
  };

  // Chart data
  const pieData = [
    { name: 'Hadir', value: stats.hadir, color: '#10B981' },
    { name: 'Izin',  value: stats.izin,  color: '#F59E0B' },
    { name: 'Sakit', value: stats.sakit, color: '#EF4444' },
  ].filter(x => x.value > 0);

  const trendData = (() => {
    const map = {};
    [...logs].sort((a,b) => new Date(a.tanggal)-new Date(b.tanggal)).forEach(x => {
      const k = new Date(x.tanggal).toLocaleDateString('id-ID', { day:'2-digit', month:'short' });
      if (!map[k]) map[k] = { date: k, Hadir: 0, Izin: 0, Sakit: 0 };
      map[k][x.status]++;
    });
    return Object.values(map).slice(-7);
  })();

  const inputClass = "w-full bg-purple-50 border border-purple-200 rounded-xl px-3 py-2 text-sm text-purple-900 placeholder-purple-300 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-200";

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-purple-900">Panel Kontrol Admin KKN</h1>
        <p className="text-purple-400 text-sm mt-1">Kelola absensi dan dokumentasi kegiatan Kelompok Desa Ulok Mukti.</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b-2 border-purple-100 mb-8 gap-1">
        {[{ id: 'comments', label: 'Moderasi Komentar', icon: <MessageSquare className="w-4 h-4" /> },
          { id: 'documentation', label: 'Dokumentasi Kegiatan', icon: <ImageIcon className="w-4 h-4" /> },
          { id: 'attendance', label: 'Arsip Presensi', icon: <UserCheck className="w-4 h-4" /> }
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-2 -mb-0.5 transition-all duration-200 ${
              activeTab === tab.id ? 'border-purple-600 text-purple-700' : 'border-transparent text-purple-400 hover:text-purple-600'
            }`}>
            {tab.icon}{tab.label}
          </button>
        ))}
      </div>

      {/* ── TAB: ATTENDANCE ─────────────────────────────── */}
      {activeTab === 'attendance' && (
        <>
          {/* Action bar */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-purple-800 flex items-center gap-2"><Users className="w-4 h-4 text-purple-500" />Kehadiran Kelompok Desa Ulok Mukti</h2>
            <button onClick={handleExport} disabled={logs.length === 0}
              className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md shadow-emerald-200/50 transition-all disabled:opacity-40">
              <Download className="w-4 h-4" /> Unduh Excel
            </button>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Laporan', val: stats.total,  icon: <CalendarDays className="w-5 h-5" />, bg: 'bg-purple-50',  iconBg: 'bg-purple-100 text-purple-600',  text: 'text-purple-700' },
              { label: 'Hadir',         val: stats.hadir,  icon: <UserCheck className="w-5 h-5" />,   bg: 'bg-emerald-50', iconBg: 'bg-emerald-100 text-emerald-600', text: 'text-emerald-700' },
              { label: 'Izin',          val: stats.izin,   icon: <Users className="w-5 h-5" />,       bg: 'bg-amber-50',   iconBg: 'bg-amber-100 text-amber-600',     text: 'text-amber-700' },
              { label: 'Sakit',         val: stats.sakit,  icon: <UserMinus className="w-5 h-5" />,   bg: 'bg-red-50',     iconBg: 'bg-red-100 text-red-500',          text: 'text-red-600' },
            ].map((s, i) => (
              <div key={i} className={`${s.bg} rounded-2xl p-5 border border-white shadow-sm flex items-center justify-between`}>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{s.label}</p>
                  <p className={`text-3xl font-extrabold ${s.text} mt-1`}>{s.val}</p>
                </div>
                <div className={`p-3 rounded-xl ${s.iconBg}`}>{s.icon}</div>
              </div>
            ))}
          </div>

          {/* Charts */}
          {logs.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-2xl border border-purple-100 shadow-sm p-5 lg:col-span-2">
                <p className="text-xs font-bold text-purple-700 uppercase tracking-wider mb-4">Tren Kehadiran (7 Hari Terakhir)</p>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F3F0FF" />
                      <XAxis dataKey="date" stroke="#A78BFA" fontSize={11} />
                      <YAxis stroke="#A78BFA" fontSize={11} allowDecimals={false} />
                      <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #EDE9FE', fontSize: 12 }} />
                      <Legend />
                      <Bar dataKey="Hadir" fill="#10B981" radius={[4,4,0,0]} />
                      <Bar dataKey="Izin"  fill="#F59E0B" radius={[4,4,0,0]} />
                      <Bar dataKey="Sakit" fill="#EF4444" radius={[4,4,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-purple-100 shadow-sm p-5 flex flex-col">
                <p className="text-xs font-bold text-purple-700 uppercase tracking-wider mb-2">Proporsi Kehadiran</p>
                {pieData.length > 0 ? (
                  <>
                    <div className="h-40 flex-1">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={4} dataKey="value">
                            {pieData.map((e,i) => <Cell key={i} fill={e.color} />)}
                          </Pie>
                          <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex flex-wrap gap-3 justify-center text-[10px] mt-2">
                      {pieData.map((x,i) => (
                        <div key={i} className="flex items-center gap-1 font-semibold text-gray-500">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: x.color }}></div>
                          {x.name} ({((x.value/stats.total)*100).toFixed(0)}%)
                        </div>
                      ))}
                    </div>
                  </>
                ) : <div className="flex-1 flex items-center justify-center text-purple-300 text-xs">Belum ada data</div>}
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="bg-white rounded-2xl border border-purple-100 shadow-sm p-5 mb-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold text-purple-700 uppercase tracking-wider flex items-center gap-1.5"><Search className="w-3.5 h-3.5" />Filter</p>
              <button onClick={() => setFilters({ search:'', status:'', startDate:'', endDate:'' })} className="text-[10px] text-purple-400 hover:text-purple-600 font-bold flex items-center gap-1"><RefreshCw className="w-3 h-3" />Reset</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <input placeholder="Cari Nama / NPM..." value={filters.search} onChange={e => setFilters(p=>({...p,search:e.target.value}))} className={inputClass} />
              <select value={filters.status} onChange={e => setFilters(p=>({...p,status:e.target.value}))} className={inputClass}>
                <option value="">Semua Status</option>
                <option>Hadir</option><option>Izin</option><option>Sakit</option>
              </select>
              <input type="date" value={filters.startDate} onChange={e => setFilters(p=>({...p,startDate:e.target.value}))} className={inputClass} />
              <input type="date" value={filters.endDate} onChange={e => setFilters(p=>({...p,endDate:e.target.value}))} className={inputClass} />
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-purple-100 shadow-sm overflow-hidden">
            {loadingLogs ? (
              <div className="py-16 flex flex-col items-center gap-3 text-purple-400">
                <div className="animate-spin h-6 w-6 border-2 border-purple-400 border-t-transparent rounded-full"></div>
                <span className="text-xs">Memuat data...</span>
              </div>
            ) : errorLogs ? (
              <div className="py-12 text-center text-red-400 text-xs flex flex-col items-center gap-2"><AlertCircle className="w-7 h-7" />{errorLogs}</div>
            ) : logs.length === 0 ? (
              <div className="py-14 text-center text-purple-300 text-sm">Tidak ada data absensi.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-purple-50 border-b border-purple-100 text-purple-600 font-bold uppercase tracking-wider">
                      <th className="py-3 px-4 text-center w-10">No</th>
                      <th className="py-3 px-4">NPM</th>
                      <th className="py-3 px-4">Nama</th>
                      <th className="py-3 px-4 text-center">Tanggal</th>
                      <th className="py-3 px-4 text-center">Status</th>
                      <th className="py-3 px-4 text-center">Foto</th>
                      <th className="py-3 px-4 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-purple-50 text-purple-800">
                    {logs.map((log, i) => (
                      <tr key={log._id} className="hover:bg-purple-50/50 transition-colors">
                        <td className="py-3 px-4 text-center text-purple-300 font-medium">{i+1}</td>
                        <td className="py-3 px-4 font-mono text-purple-600">{log.nim}</td>
                        <td className="py-3 px-4 font-semibold">{log.nama}</td>
                        <td className="py-3 px-4 text-center text-purple-500">
                          {new Date(log.tanggal).toLocaleDateString('id-ID',{day:'2-digit',month:'2-digit',year:'numeric'})}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            log.status==='Hadir' ? 'bg-emerald-100 text-emerald-700' :
                            log.status==='Izin'  ? 'bg-amber-100 text-amber-700' :
                            'bg-red-100 text-red-600'}`}>{log.status}</span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          {log.foto ? (
                            <button onClick={() => setActivePhoto(log.foto)} className="p-1.5 bg-purple-100 text-purple-600 hover:bg-purple-200 rounded-lg transition-colors">
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                          ) : <span className="text-purple-200">—</span>}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button onClick={() => handleDeleteLog(log._id)} className="p-1.5 bg-red-50 text-red-400 hover:bg-red-100 rounded-lg transition-colors">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {/* ── TAB: DOCUMENTATION ──────────────────────────── */}
      {activeTab === 'documentation' && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-purple-100 shadow-sm p-6 sticky top-24">
              <h2 className="font-bold text-purple-800 mb-5 flex items-center gap-2 text-sm"><Plus className="w-4 h-4 text-purple-500" />Tambah Dokumentasi</h2>
              {docSuccess && <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-xs flex items-center gap-2"><CheckCircle2 className="w-4 h-4 shrink-0" />{docSuccess}</div>}
              {docError   && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs flex items-center gap-2"><AlertCircle className="w-4 h-4 shrink-0" />{docError}</div>}
              <form onSubmit={handleDocSubmit} className="space-y-4 text-xs">
                {[
                  { label:'Hari Ke-', name:'hariKe', type:'number', placeholder:'1' },
                  { label:'Tanggal', name:'tanggal', type:'date' },
                  { label:'Judul Kegiatan', name:'judul', type:'text', placeholder:'Sosialisasi Program Kerja' },
                ].map(f => (
                  <div key={f.name}>
                    <label className="block font-semibold text-purple-700 mb-1">{f.label} <span className="text-red-400">*</span></label>
                    <input type={f.type} name={f.name} value={docForm[f.name]} onChange={e => setDocForm(p=>({...p,[f.name]:e.target.value}))} placeholder={f.placeholder} className={inputClass} required />
                  </div>
                ))}
                <div>
                  <label className="block font-semibold text-purple-700 mb-1">Deskripsi <span className="text-red-400">*</span></label>
                  <textarea name="deskripsi" rows="3" value={docForm.deskripsi} onChange={e => setDocForm(p=>({...p,deskripsi:e.target.value}))} placeholder="Ringkasan kegiatan..." className={`${inputClass} resize-none`} required />
                </div>
                <div>
                  <label className="block font-semibold text-purple-700 mb-1">Foto <span className="text-red-400">*</span></label>
                  {!docPreview ? (
                    <div className="border-2 border-dashed border-purple-200 hover:border-purple-400 rounded-xl p-4 text-center relative cursor-pointer transition-colors">
                      <input type="file" accept="image/*" onChange={e => { const f=e.target.files[0]; if(f){setDocFile(f);setDocPreview(URL.createObjectURL(f));} }} className="absolute inset-0 opacity-0 cursor-pointer" />
                      <ImageIcon className="w-5 h-5 mx-auto text-purple-300 mb-1" />
                      <p className="text-purple-400">Pilih foto kegiatan</p>
                    </div>
                  ) : (
                    <div className="relative rounded-xl overflow-hidden border border-purple-200 h-28">
                      <img src={docPreview} alt="Preview" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => {setDocFile(null);setDocPreview('');}} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
                <button type="submit" disabled={docSubmitting} className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50">
                  {docSubmitting ? 'Mengunggah...' : <><Plus className="w-4 h-4" />Unggah Dokumentasi</>}
                </button>
              </form>
            </div>
          </div>

          {/* List */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl border border-purple-100 shadow-sm p-6">
              <h2 className="font-bold text-purple-800 mb-5 flex items-center gap-2 text-sm"><ImageIcon className="w-4 h-4 text-purple-500" />Dokumentasi Terdaftar ({docs.length})</h2>
              {loadingDocs ? (
                <div className="py-12 flex items-center justify-center gap-2 text-purple-400 text-xs">
                  <div className="animate-spin h-5 w-5 border-2 border-purple-400 border-t-transparent rounded-full"></div> Memuat...
                </div>
              ) : docs.length === 0 ? (
                <div className="py-12 text-center text-purple-300 text-xs">Belum ada dokumentasi.</div>
              ) : (
                <div className="space-y-3">
                  {docs.map(doc => (
                    <div key={doc._id} className="flex gap-4 p-3 rounded-xl bg-purple-50/50 border border-purple-100 hover:border-purple-300 transition-colors group relative text-xs">
                      <div className="w-16 h-16 rounded-lg overflow-hidden border border-purple-200 shrink-0 bg-purple-100">
                        <img 
                          src={formatPhotoUrl(doc.foto)} 
                          alt="" 
                          className="w-full h-full object-cover" 
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/homepage/k1.jpg';
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0 pr-8">
                        <span className="bg-purple-100 text-purple-600 font-black text-[10px] px-2 py-0.5 rounded-full mr-2">Hari {doc.hariKe}</span>
                        <span className="text-purple-400 text-[10px]">{new Date(doc.tanggal).toLocaleDateString('id-ID',{day:'2-digit',month:'short'})}</span>
                        <p className="font-bold text-purple-800 mt-1 truncate">{doc.judul}</p>
                        <p className="text-purple-400 mt-0.5 line-clamp-2">{doc.deskripsi}</p>
                      </div>
                      <button onClick={() => handleDeleteDoc(doc._id)} className="absolute right-3 top-3 p-1.5 bg-red-50 text-red-400 hover:bg-red-100 rounded-lg opacity-0 group-hover:opacity-100 transition-all">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── TAB: COMMENTS MODERATION ───────────────────── */}
      {activeTab === 'comments' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-purple-100 shadow-sm">
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-purple-900">
                Moderasi Komentar & Buku Tamu Publik
              </h2>
              <p className="text-xs text-purple-400 mt-0.5">
                Total {commentsList.length} pesan masuk dari pengunjung & warga. Anda dapat menghapus pesan yang tidak pantas.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-purple-400" />
                <input
                  type="text"
                  placeholder="Cari komentar..."
                  value={commentSearch}
                  onChange={e => setCommentSearch(e.target.value)}
                  className="pl-8 pr-3 py-2 text-xs border border-purple-200 rounded-xl bg-purple-50/50 focus:outline-none focus:border-purple-500 w-44 sm:w-60"
                />
              </div>
              <button
                onClick={fetchCommentsAdmin}
                disabled={loadingCommentsAdmin}
                className="p-2 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl border border-purple-200 transition-colors"
                title="Segarkan data"
              >
                <RefreshCw className={`w-4 h-4 ${loadingCommentsAdmin ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {loadingCommentsAdmin && commentsList.length === 0 ? (
            <div className="py-16 text-center text-purple-400 text-xs">Memuat komentar...</div>
          ) : commentsList.length === 0 ? (
            <div className="py-16 text-center text-purple-300 text-xs bg-white rounded-2xl border border-purple-100">
              Belum ada komentar dari publik.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {commentsList
                .filter(c =>
                  !commentSearch ||
                  c.nama.toLowerCase().includes(commentSearch.toLowerCase()) ||
                  c.pesan.toLowerCase().includes(commentSearch.toLowerCase())
                )
                .map(item => (
                  <div
                    key={item._id}
                    className="bg-white p-5 rounded-2xl border border-purple-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-3 relative"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 pr-8">
                        <div>
                          <h4 className="font-extrabold text-purple-950 text-sm">{item.nama}</h4>
                          <span className="inline-block mt-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 border border-purple-200">
                            {item.role || 'Umum'}
                          </span>
                        </div>
                        <span className="text-[11px] text-purple-400 whitespace-nowrap">
                          {new Date(item.createdAt).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <p className="text-xs text-purple-900/90 mt-3 whitespace-pre-wrap leading-relaxed bg-purple-50/40 p-3 rounded-xl border border-purple-50">
                        {item.pesan}
                      </p>
                    </div>
                    <div className="flex justify-end pt-2 border-t border-purple-50">
                      <button
                        onClick={() => handleDeleteCommentAdmin(item._id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 rounded-xl text-xs font-semibold transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Hapus Komentar</span>
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}

      {/* Photo Lightbox */}
      {activePhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/70 backdrop-blur-sm">
          <div className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-3xl w-full flex flex-col items-center">
            <button onClick={() => setActivePhoto(null)} className="absolute top-4 right-4 bg-purple-100 hover:bg-purple-200 text-purple-700 p-2 rounded-full transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <p className="text-xs font-bold text-purple-400 mb-3">Foto Bukti Kehadiran</p>
            <img src={activePhoto} alt="" className="max-w-full max-h-[65vh] object-contain rounded-xl border border-purple-100" />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
