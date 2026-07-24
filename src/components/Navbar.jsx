import React, { useState } from 'react';
import { GraduationCap, Lock, LogOut, LayoutDashboard, ClipboardCheck, Camera, Users, Home, Menu, X } from 'lucide-react';

const Navbar = ({ currentPage, setCurrentPage, isAdmin, adminUser, onLogout }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (page) => {
    setCurrentPage(page);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-purple-100 shadow-sm shadow-purple-100/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
        {/* Brand Logo */}
        <div
          className="flex items-center space-x-2.5 cursor-pointer group"
          onClick={() => handleNavClick('home')}
        >
          <div className="w-10 h-10 rounded-xl overflow-hidden shadow-md shadow-purple-300/40 flex-shrink-0 bg-purple-600 flex items-center justify-center group-hover:opacity-90 transition-all duration-300">
            <img
              src="/logo.png"
              alt="Logo KKN"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
            <GraduationCap className="w-5 h-5 text-white hidden" />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2">
            <span className="font-extrabold text-base sm:text-lg tracking-tight bg-gradient-to-r from-purple-800 to-violet-600 bg-clip-text text-transparent">
              KKN Desa Ulok Mukti
            </span>
            <span className="text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 border border-purple-200 w-max">
              2026
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center space-x-1.5">
          {isAdmin ? (
            <>
              <button
                onClick={() => handleNavClick('admin')}
                className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${currentPage === 'admin'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-300/40'
                  : 'text-purple-700 hover:bg-purple-50 border border-purple-200'
                  }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard Admin</span>
              </button>

              <div className="flex items-center space-x-2 pl-3 border-l border-purple-100">
                <div className="flex flex-col text-right mr-1">
                  <span className="text-[10px] text-purple-400">Admin</span>
                  <span className="text-xs font-bold text-purple-800">{adminUser?.username || 'DPL'}</span>
                </div>
                <button
                  onClick={onLogout}
                  className="flex items-center space-x-1.5 px-3 py-2 bg-red-50 text-red-500 hover:bg-red-100 border border-red-200 rounded-xl text-xs sm:text-sm font-semibold transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Keluar</span>
                </button>
              </div>
            </>
          ) : (
            <>
              <button
                onClick={() => handleNavClick('home')}
                className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${currentPage === 'home'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-300/40'
                  : 'text-purple-700 hover:bg-purple-50 border border-purple-200'
                  }`}
              >
                <Home className="w-4 h-4" />
                <span>Beranda</span>
              </button>

              <button
                onClick={() => handleNavClick('student')}
                className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${currentPage === 'student'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-300/40'
                  : 'text-purple-700 hover:bg-purple-50 border border-purple-200'
                  }`}
              >
                <ClipboardCheck className="w-4 h-4" />
                <span>Presensi</span>
              </button>

              <button
                onClick={() => handleNavClick('members')}
                className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${currentPage === 'members'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-300/40'
                  : 'text-purple-700 hover:bg-purple-50 border border-purple-200'
                  }`}
              >
                <Users className="w-4 h-4" />
                <span>Anggota</span>
              </button>

              <button
                onClick={() => handleNavClick('documentation')}
                className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${currentPage === 'documentation'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-300/40'
                  : 'text-purple-700 hover:bg-purple-50 border border-purple-200'
                  }`}
              >
                <Camera className="w-4 h-4" />
                <span>Dokumentasi</span>
              </button>

              <button
                onClick={() => handleNavClick('login')}
                className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all border ${currentPage === 'login'
                  ? 'bg-purple-600 text-white border-purple-600 shadow-md'
                  : 'text-purple-600 border-purple-200 hover:bg-purple-50'
                  }`}
              >
                <Lock className="w-4 h-4" />
                <span>Login Admin</span>
              </button>
            </>
          )}
        </div>

        {/* Mobile Toggle Button */}
        <div className="flex md:hidden items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-purple-700 hover:bg-purple-50 border border-purple-200 rounded-xl transition-all"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-purple-100 bg-white/95 px-4 pt-3 pb-4 space-y-2 shadow-lg animate-fade-in-up">
          {isAdmin ? (
            <>
              <button
                onClick={() => handleNavClick('admin')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${currentPage === 'admin'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-purple-800 hover:bg-purple-50'
                  }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard Admin</span>
              </button>

              <button
                onClick={onLogout}
                className="w-full flex items-center space-x-3 px-4 py-3 bg-red-50 text-red-600 rounded-xl text-sm font-bold transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span>Keluar ({adminUser?.username || 'Admin'})</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => handleNavClick('home')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${currentPage === 'home'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-purple-800 hover:bg-purple-50'
                  }`}
              >
                <Home className="w-4 h-4" />
                <span>Beranda</span>
              </button>

              <button
                onClick={() => handleNavClick('student')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${currentPage === 'student'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-purple-800 hover:bg-purple-50'
                  }`}
              >
                <ClipboardCheck className="w-4 h-4" />
                <span>Presensi Harian</span>
              </button>

              <button
                onClick={() => handleNavClick('members')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${currentPage === 'members'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-purple-800 hover:bg-purple-50'
                  }`}
              >
                <Users className="w-4 h-4" />
                <span>Anggota KKN</span>
              </button>

              <button
                onClick={() => handleNavClick('documentation')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${currentPage === 'documentation'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-purple-800 hover:bg-purple-50'
                  }`}
              >
                <Camera className="w-4 h-4" />
                <span>Dokumentasi Kegiatan</span>
              </button>

              <button
                onClick={() => handleNavClick('login')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-bold border transition-all ${currentPage === 'login'
                  ? 'bg-purple-600 text-white border-purple-600'
                  : 'text-purple-700 border-purple-200 hover:bg-purple-50'
                  }`}
              >
                <Lock className="w-4 h-4" />
                <span>Login Admin</span>
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
