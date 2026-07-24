import React, { useState } from 'react';
import axios from 'axios';
import { ClipboardCheck, Calendar, Send, CheckCircle2, AlertCircle, Search, ChevronDown, Check } from 'lucide-react';
import { STUDENTS_LIST } from '../data/studentsList';
import { API_BASE_URL } from '../api';

const StudentAttendance = () => {
  const [formData, setFormData] = useState({
    nim: '',
    nama: '',
    kelompok: 'Kelompok Desa Ulok Mukti',
    tanggal: new Date().toISOString().split('T')[0],
    status: 'Hadir',
  });

  const [searchStudent, setSearchStudent] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Filter students based on search input
  const filteredStudents = STUDENTS_LIST.filter(
    (s) =>
      s.nama.toLowerCase().includes(searchStudent.toLowerCase()) ||
      s.nim.includes(searchStudent) ||
      s.prodi.toLowerCase().includes(searchStudent.toLowerCase())
  );

  const handleSelectStudent = (student) => {
    setFormData((prev) => ({
      ...prev,
      nim: student.nim,
      nama: student.nama,
    }));
    setSearchStudent('');
    setIsDropdownOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!formData.nim || !formData.nama) {
      setError('Silakan pilih Nama / NPM Anda terlebih dahulu!');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/attendance`, {
        nim: formData.nim,
        nama: formData.nama,
        kelompok: formData.kelompok,
        tanggal: formData.tanggal,
        status: formData.status,
      });

      if (response.data.success) {
        setSuccess(true);
        setFormData((prev) => ({
          ...prev,
          nim: '',
          nama: '',
          tanggal: new Date().toISOString().split('T')[0],
          status: 'Hadir',
        }));
      } else {
        setError(response.data.message || 'Gagal menyimpan absensi');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menghubungkan ke server. Pastikan server aktif!');
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass =
    'w-full bg-white border border-purple-200 rounded-xl px-4 py-3 text-purple-900 placeholder-purple-300 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300 text-sm';

  return (
    <div className="max-w-lg mx-auto px-4 py-8 sm:py-12 relative">
      {/* Background Decorative Blur */}
      <div className="absolute -top-10 -left-10 w-64 h-64 bg-purple-200/30 rounded-full blur-3xl -z-10"></div>
      <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-violet-200/30 rounded-full blur-3xl -z-10"></div>

      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-purple-600 rounded-2xl shadow-lg shadow-purple-300/40 mb-4">
          <ClipboardCheck className="w-7 h-7 text-white" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-purple-900 tracking-tight">
          Presensi Harian KKN
        </h1>
        <p className="text-purple-400 mt-2 text-xs sm:text-sm">
          Pilih Nama / NPM Anda di bawah untuk melaporkan presensi harian.
        </p>
      </div>

      {/* Success Alert */}
      {success && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-start space-x-3 text-xs sm:text-sm animate-fade-in-up">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-emerald-800">Presensi Berhasil Terkirim!</h4>
            <p className="text-xs mt-0.5 text-emerald-600">Data presensi Anda telah tersimpan dan rekap Excel otomatis diperbarui.</p>
          </div>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 flex items-start space-x-3 text-xs sm:text-sm animate-fade-in-up">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-red-700">Gagal Mengirim</h4>
            <p className="text-xs mt-0.5 text-red-500">{error}</p>
          </div>
        </div>
      )}

      {/* Form Card */}
      <div className="bg-white rounded-3xl shadow-xl shadow-purple-100/70 border border-purple-100 overflow-hidden">
        <div className="h-1.5 bg-gradient-to-r from-purple-500 via-violet-500 to-fuchsia-400"></div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          {/* SEARCHABLE STUDENT SELECTOR DROPDOWN */}
          <div className="relative">
            <label className="block text-xs sm:text-sm font-semibold text-purple-800 mb-1.5">
              Pilih Nama Mahasiswa <span className="text-red-400">*</span>
            </label>

            {/* Selector Box */}
            <div
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`w-full bg-purple-50/60 border ${
                formData.nama ? 'border-purple-400 bg-purple-50/90' : 'border-purple-200'
              } rounded-2xl px-4 py-3.5 text-purple-900 cursor-pointer flex items-center justify-between transition-all hover:border-purple-400 shadow-sm`}
            >
              {formData.nama ? (
                <div>
                  <div className="font-extrabold text-purple-950 text-sm sm:text-base">{formData.nama}</div>
                  <div className="text-[11px] text-purple-600 font-mono font-semibold">NPM: {formData.nim}</div>
                </div>
              ) : (
                <span className="text-purple-400 text-xs sm:text-sm">-- Cari atau pilih Nama / NPM Anda --</span>
              )}
              <ChevronDown className={`w-5 h-5 text-purple-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </div>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute z-30 top-full left-0 right-0 mt-2 bg-white border border-purple-200 rounded-2xl shadow-2xl overflow-hidden p-2 space-y-2 animate-fade-in-up">
                {/* Search Box */}
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-purple-400">
                    <Search className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    placeholder="Cari berdasarkan nama atau NPM..."
                    value={searchStudent}
                    onChange={(e) => setSearchStudent(e.target.value)}
                    className="w-full bg-purple-50 border border-purple-100 rounded-xl pl-9 pr-3 py-2 text-xs text-purple-900 placeholder-purple-300 focus:outline-none focus:border-purple-500"
                    autoFocus
                  />
                </div>

                {/* Options List */}
                <div className="max-h-56 overflow-y-auto space-y-1 divide-y divide-purple-50">
                  {filteredStudents.length === 0 ? (
                    <div className="p-3 text-center text-xs text-purple-400">
                      Nama tidak ditemukan dalam daftar.
                    </div>
                  ) : (
                    filteredStudents.map((student) => (
                      <div
                        key={student.nim}
                        onClick={() => handleSelectStudent(student)}
                        className={`p-3 rounded-xl cursor-pointer transition-colors flex items-center justify-between text-xs ${
                          formData.nim === student.nim ? 'bg-purple-100 text-purple-950 font-bold' : 'hover:bg-purple-50 text-purple-800'
                        }`}
                      >
                        <div>
                          <div className="font-bold text-sm">{student.nama}</div>
                          <div className="text-[10px] text-purple-500 font-mono">
                            NPM: {student.nim} • {student.prodi}
                          </div>
                        </div>
                        {formData.nim === student.nim && <Check className="w-4 h-4 text-purple-600" />}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Tanggal Presensi */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-purple-800 mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-purple-500" />
              Tanggal Presensi <span className="text-red-400">*</span>
            </label>
            <input
              type="date"
              name="tanggal"
              value={formData.tanggal}
              onChange={handleChange}
              onClick={(e) => e.target.showPicker && e.target.showPicker()}
              className={`${inputClass} cursor-pointer`}
              required
            />
          </div>

          {/* Status Kehadiran */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-purple-800 mb-2">
              Status Kehadiran <span className="text-red-400">*</span>
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { val: 'Hadir', active: 'bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-200', idle: 'border-gray-200 text-gray-500 hover:border-emerald-300 hover:text-emerald-600 hover:bg-emerald-50' },
                { val: 'Izin',  active: 'bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-200',   idle: 'border-gray-200 text-gray-500 hover:border-amber-300 hover:text-amber-600 hover:bg-amber-50' },
                { val: 'Sakit', active: 'bg-red-500 text-white border-red-500 shadow-md shadow-red-200',     idle: 'border-gray-200 text-gray-500 hover:border-red-300 hover:text-red-600 hover:bg-red-50' },
              ].map(({ val, active, idle }) => (
                <label
                  key={val}
                  className={`flex items-center justify-center py-3 rounded-2xl border-2 cursor-pointer font-bold text-xs sm:text-sm transition-all duration-300 ${
                    formData.status === val ? active : idle
                  }`}
                >
                  <input
                    type="radio"
                    name="status"
                    value={val}
                    checked={formData.status === val}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  {val}
                </label>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !formData.nim}
            className="w-full mt-2 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white font-extrabold py-3.5 rounded-2xl shadow-lg shadow-purple-300/40 hover:shadow-purple-400/50 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span>Mengirim...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Kirim Presensi</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default StudentAttendance;
