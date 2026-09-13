import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Users, Sparkles, ArrowRight, UserCheck } from 'lucide-react';
import { MEMBERS_DATA } from '../pages/Members';

const MemberHeroCarousel = ({ setCurrentPage }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [touchStartX, setTouchStartX] = useState(null);
  const [touchEndX, setTouchEndX] = useState(null);
  const [mouseStartX, setMouseStartX] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const total = MEMBERS_DATA.length;

  // Deteksi ukuran layar untuk menentukan jumlah kartu yang terlihat (1 di mobile, 2 di tablet/desktop)
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-play / rotasi otomatis setiap 3.2 detik
  useEffect(() => {
    if (isPaused || isDragging) return;

    const timer = setInterval(() => {
      handleNext();
    }, 3200);

    return () => clearInterval(timer);
  }, [currentIndex, isPaused, isDragging]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % total);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  };

  // Navigasi Touch / Swipe untuk HP
  const handleTouchStart = (e) => {
    setTouchStartX(e.targetTouches[0].clientX);
    setIsPaused(true);
  };

  const handleTouchMove = (e) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    setIsPaused(false);
    if (!touchStartX || !touchEndX) return;
    const diff = touchStartX - touchEndX;
    if (diff > 45) {
      handleNext();
    } else if (diff < -45) {
      handlePrev();
    }
    setTouchStartX(null);
    setTouchEndX(null);
  };

  // Navigasi Mouse Drag untuk Desktop
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setMouseStartX(e.clientX);
    setIsPaused(true);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
  };

  const handleMouseUp = (e) => {
    if (!isDragging) return;
    setIsDragging(false);
    setIsPaused(false);
    if (mouseStartX !== null) {
      const diff = mouseStartX - e.clientX;
      if (diff > 45) {
        handleNext();
      } else if (diff < -45) {
        handlePrev();
      }
    }
    setMouseStartX(null);
  };

  // Kartu yang ditampilkan di carousel
  // Jika desktop: tampilkan 2 kartu berjejer (kartu aktif & kartu berikutnya)
  // Jika mobile: tampilkan 1 kartu aktif
  const displayedIndices = isMobile
    ? [currentIndex % total]
    : [currentIndex % total, (currentIndex + 1) % total];

  return (
    <div
      className="relative select-none w-full max-w-xl mx-auto"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => {
        setIsPaused(false);
        setIsDragging(false);
      }}
    >
      {/* ── Top Header Controls ── */}
      <div className="flex items-center justify-between gap-2 mb-3.5 px-1">
        {/* Counter Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white text-xs font-semibold shadow-lg">
          <Users className="w-3.5 h-3.5 text-purple-300" />
          <span>
            Anggota KKN <span className="text-purple-300 font-bold">{currentIndex + 1}</span> / {total}
          </span>
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-0.5" title="Auto-slide aktif" />
        </div>

        {/* Manual Arrow Buttons & Link */}
        <div className="flex items-center gap-1.5">
          {setCurrentPage && (
            <button
              onClick={() => setCurrentPage('members')}
              className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-purple-200 hover:text-white px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 transition-all mr-1"
            >
              <span>Lihat Semua</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}

          <button
            onClick={handlePrev}
            aria-label="Sebelumnya"
            className="w-8 h-8 rounded-xl bg-black/40 hover:bg-purple-600/80 text-white border border-white/20 backdrop-blur-md flex items-center justify-center transition-all duration-200 shadow-md active:scale-90 hover:border-purple-300"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={handleNext}
            aria-label="Selanjutnya"
            className="w-8 h-8 rounded-xl bg-black/40 hover:bg-purple-600/80 text-white border border-white/20 backdrop-blur-md flex items-center justify-center transition-all duration-200 shadow-md active:scale-90 hover:border-purple-300"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Carousel Cards Container (Support Drag & Swipe) ── */}
      <div
        className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2'} gap-3 sm:gap-4 relative cursor-grab active:cursor-grabbing`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        {displayedIndices.map((memberIndex, cardPos) => {
          const member = MEMBERS_DATA[memberIndex];
          if (!member) return null;

          // Kartu kedua sedikit bergeser vertikal untuk estetika stagger seperti semula
          const isOffset = !isMobile && cardPos === 1;

          return (
            <div
              key={`${member.id}-${memberIndex}`}
              onClick={() => setCurrentPage && setCurrentPage('members')}
              className={`group relative rounded-3xl overflow-hidden shadow-2xl border border-white/20 bg-purple-950/70 aspect-[4/5] backdrop-blur-sm transition-all duration-500 hover:border-purple-300 hover:shadow-purple-500/30 ${
                isOffset ? 'translate-y-4 sm:translate-y-6' : ''
              }`}
            >
              {/* Foto Anggota */}
              <img
                src={member.foto}
                alt={member.nama}
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />

              {/* Fallback jika foto gagal dimuat */}
              <div className="hidden absolute inset-0 bg-gradient-to-br from-purple-900 to-violet-950 items-center justify-center p-4 text-center">
                <div>
                  <Users className="w-12 h-12 text-purple-300 mx-auto mb-2 opacity-60" />
                  <span className="text-xs text-purple-200 font-semibold">{member.nama}</span>
                </div>
              </div>

              {/* Top Role Badge */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-1 z-10">
                <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-md backdrop-blur-md ${member.badgeColor || 'bg-purple-600 text-white'}`}>
                  {member.peran}
                </span>

                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-black/50 text-purple-200 border border-white/10 backdrop-blur-md">
                  #{member.id}
                </span>
              </div>

              {/* Gradient Scrim Lapisan Teks Bawah */}
              <div className="absolute inset-0 bg-gradient-to-t from-purple-950/95 via-purple-950/50 to-transparent pointer-events-none" />

              {/* Info Anggota di Bagian Bawah */}
              <div className="absolute bottom-0 inset-x-0 p-3.5 sm:p-4 text-white z-10 space-y-1">
                <p className="text-xs sm:text-sm font-black tracking-tight leading-snug truncate drop-shadow-md group-hover:text-purple-200 transition-colors">
                  {member.nama}
                </p>

                <p className="text-[10px] sm:text-[11px] text-purple-300 font-semibold truncate">
                  {member.jurusan}
                </p>

                {member.prodi && (
                  <p className="text-[10px] text-purple-100/80 line-clamp-2 italic font-normal leading-relaxed pt-0.5">
                    "{member.prodi}"
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Bottom Indicator Bar ── */}
      <div className="flex items-center justify-center gap-1.5 mt-6 sm:mt-8">
        {Array.from({ length: Math.min(10, total) }).map((_, dotIdx) => {
          // Highlight dot terdekat
          const activeDot = Math.floor((currentIndex / total) * 10);
          const isActive = dotIdx === activeDot;

          return (
            <button
              key={dotIdx}
              onClick={() => setCurrentIndex(Math.floor((dotIdx / 10) * total))}
              aria-label={`Ke slide ${dotIdx + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                isActive
                  ? 'w-6 bg-purple-400 shadow-md shadow-purple-400/50'
                  : 'w-1.5 bg-white/30 hover:bg-white/60'
              }`}
            />
          );
        })}
      </div>
    </div>
  );
};

export default MemberHeroCarousel;
