import React from 'react';
import { GraduationCap } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="w-full border-t border-purple-100 bg-white/80 py-6 mt-12 text-center text-sm text-purple-400">
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-left">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-purple-600" />
            <span className="font-extrabold text-purple-800">KKN Desa Ulok Mukti 2026</span>
          </div>
          <p className="text-xs text-purple-400 mt-0.5">
            Portal Informasi, Dokumentasi & Kolom Komentar KKN Universitas Aisyah Pringsewu
          </p>
        </div>
        <div className="text-xs text-purple-400 font-medium">
          © {new Date().getFullYear()} Kelompok KKN Desa Ulok Mukti. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
