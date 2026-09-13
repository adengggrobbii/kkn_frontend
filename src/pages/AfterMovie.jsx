import React, { useState, useRef, useEffect } from 'react';
import {
  Film,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  RotateCcw,
  Download,
  Share2,
  Heart,
  MessageSquare,
  Sparkles,
  MapPin,
  Calendar,
  Users,
  CheckCircle,
  GraduationCap,
  ArrowLeft,
} from 'lucide-react';
import { MEMBERS_DATA } from './Members';
// ============================================================================
// 🎬 PENGATURAN VIDEO AFTER MOVIE
// ============================================================================
// Anda bisa menambahkan video After Movie Anda sendiri dengan 2 cara mudah:
//
// CARA 1 (File Video Lokal MP4):
// 1. Salin file video Anda ke folder: frontend/public/
//    (Contoh: frontend/public/aftermovie.mp4)
// 2. Ubah nilai di bawah menjadi: '/aftermovie.mp4' (atau timpa langsung file /intro.mp4)
//
// CARA 2 (Link Video YouTube):
// Jika video Anda diunggah ke YouTube, cukup tempel link videonya di bawah:
// Contoh: 'https://www.youtube.com/watch?v=abcdef12345' atau 'https://youtu.be/abcdef12345'
// ============================================================================
export const AFTERMOVIE_VIDEO_SRC = '/aftermovie.mp4'
export const AFTERMOVIE_POSTER_SRC = '/homepage/bg.jpg';

// Helper deteksi URL YouTube
const getYouTubeEmbedUrl = (url) => {
  if (!url) return null;
  const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11
    ? `https://www.youtube.com/embed/${match[2]}?autoplay=1&rel=0`
    : null;
};

const AfterMovie = ({ setCurrentPage }) => {
  const videoRef = useRef(null);
  const isYouTube = !!getYouTubeEmbedUrl(AFTERMOVIE_VIDEO_SRC);
  const youtubeEmbedUrl = getYouTubeEmbedUrl(AFTERMOVIE_VIDEO_SRC);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [duration, setDuration] = useState('0:00');
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(false);
  const [theaterMode, setTheaterMode] = useState(false);

  // Format detik ke menit:detik
  const formatTime = (timeInSeconds) => {
    if (isNaN(timeInSeconds)) return '0:00';
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleRestart = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = 0;
    videoRef.current.play();
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const curr = videoRef.current.currentTime;
    const dur = videoRef.current.duration;
    if (dur > 0) {
      setProgress((curr / dur) * 100);
      setCurrentTime(formatTime(curr));
      setDuration(formatTime(dur));
    }
  };

  const handleSeek = (e) => {
    if (!videoRef.current) return;
    const newProgress = parseFloat(e.target.value);
    const dur = videoRef.current.duration;
    if (dur > 0) {
      videoRef.current.currentTime = (newProgress / 100) * dur;
      setProgress(newProgress);
    }
  };

  const handleFullscreen = () => {
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    } else if (videoRef.current.webkitRequestFullscreen) {
      videoRef.current.webkitRequestFullscreen();
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-20 selection:bg-purple-600 selection:text-white">
      {/* ── Background Glow Effects ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-10 left-1/4 w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-violet-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
        {/* ── Navigation Breadcrumb & Back Button ── */}
        <div className="flex items-center justify-between gap-4 mb-6 sm:mb-8">
          <button
            onClick={() => setCurrentPage && setCurrentPage('home')}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-purple-200 hover:text-white border border-white/10 text-xs sm:text-sm font-semibold transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-300 text-xs font-bold">
            <Film className="w-3.5 h-3.5 text-purple-400" />
            <span>Sinema KKN Pekon Ulok Mukti</span>
          </div>
        </div>

        {/* ── Header Title ── */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10 space-y-3">
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight bg-gradient-to-r from-white via-purple-100 to-purple-300 bg-clip-text text-transparent">
            After Movie KKN UAP 2026
          </h1>
          <p className="text-xs sm:text-base text-purple-200/80 leading-relaxed max-w-2xl mx-auto">
            Kilas balik momen hangat, tawa, dan suka cita pengabdian mahasiswa Universitas Aisyah Pringsewu bersama seluruh masyarakat Pekon Ulok Mukti, Kec. Ngambur, Kab. Pesisir Barat.
          </p>
        </div>

        {/* ── Theater Video Player Card ── */}
        <div
          className={`mx-auto transition-all duration-500 ${theaterMode ? 'max-w-6xl' : 'max-w-4xl'
            }`}
        >
          <div className="relative rounded-3xl overflow-hidden bg-black border border-white/20 shadow-2xl shadow-purple-950/80 group">
            {/* Video Element (Bisa MP4 Lokal ataupun Embed YouTube) */}
            {isYouTube ? (
              <div className="relative aspect-video w-full bg-black overflow-hidden">
                <iframe
                  src={youtubeEmbedUrl}
                  title="After Movie KKN Pekon Ulok Mukti"
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden">
                <video
                  ref={videoRef}
                  src={AFTERMOVIE_VIDEO_SRC}
                  poster={AFTERMOVIE_POSTER_SRC}
                  playsInline
                  onTimeUpdate={handleTimeUpdate}
                  onEnded={() => setIsPlaying(false)}
                  onClick={togglePlay}
                  className="w-full h-full object-contain cursor-pointer"
                />

                {/* Big Center Play/Pause Overlay Icon when paused */}
                {!isPlaying && (
                  <button
                    onClick={togglePlay}
                    aria-label="Putar Video"
                    className="absolute inset-0 m-auto w-20 h-20 rounded-full bg-purple-600/90 hover:bg-purple-500 text-white flex items-center justify-center shadow-2xl shadow-purple-900/80 backdrop-blur-md border border-white/30 transform hover:scale-110 active:scale-95 transition-all duration-300 z-20"
                  >
                    <Play className="w-8 h-8 fill-current translate-x-0.5" />
                  </button>
                )}
              </div>
            )}

            {/* Custom Video Control Bar (Ditampilkan jika video MP4 lokal) */}
            <div className="p-4 sm:p-5 bg-gradient-to-t from-black via-slate-950/90 to-slate-950/70 border-t border-white/10 space-y-3">
              {!isYouTube && (
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-bold text-purple-300 w-10 text-right">
                    {currentTime}
                  </span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="0.1"
                    value={progress}
                    onChange={handleSeek}
                    aria-label="Durasi video"
                    className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-purple-500 hover:accent-purple-400 transition-all"
                  />
                  <span className="text-[11px] font-bold text-purple-300 w-10">
                    {duration}
                  </span>
                </div>
              )}

              {/* Bottom Control Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <div className="flex items-center gap-2 sm:gap-3">
                  {!isYouTube && (
                    <>
                      {/* Play/Pause Button */}
                      <button
                        onClick={togglePlay}
                        className="p-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition-all shadow-md active:scale-90"
                        title={isPlaying ? 'Jeda' : 'Putar'}
                      >
                        {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                      </button>

                      {/* Restart Button */}
                      <button
                        onClick={handleRestart}
                        className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all active:scale-90"
                        title="Ulangi dari Awal"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>

                      {/* Sound Toggle */}
                      <button
                        onClick={toggleMute}
                        className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all active:scale-90"
                        title={isMuted ? 'Nyalakan Suara' : 'Bisukan Suara'}
                      >
                        {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-purple-300" />}
                      </button>
                    </>
                  )}

                  <span className="text-xs font-semibold text-purple-200 hidden sm:inline-block ml-1">
                    Official After Movie Pekon Ulok Mukti
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Like Button */}
                  <button
                    onClick={() => setLiked(!liked)}
                    className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${liked
                      ? 'bg-pink-600 text-white shadow-lg shadow-pink-900/50'
                      : 'bg-white/10 hover:bg-white/20 text-white'
                      }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${liked ? 'fill-current' : ''}`} />
                    <span>{liked ? 'Disukai' : 'Suka'}</span>
                  </button>

                  {/* Share Link Button */}
                  <button
                    onClick={handleShare}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all"
                  >
                    {copied ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Tersalin!' : 'Bagikan'}</span>
                  </button>

                  {/* Direct Download Button (Hanya jika file video lokal MP4) */}
                  {!isYouTube && (
                    <a
                      href={AFTERMOVIE_VIDEO_SRC}
                      download="After-Movie-KKN-Ulok-Mukti-2026.mp4"
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all"
                      title="Unduh File Video HD"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Unduh HD</span>
                    </a>
                  )}

                  {/* Theater Mode Toggle */}
                  <button
                    onClick={() => setTheaterMode(!theaterMode)}
                    className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all hidden md:flex items-center justify-center"
                    title={theaterMode ? 'Mode Normal' : 'Mode Bioskop'}
                  >
                    <Film className="w-4 h-4 text-purple-300" />
                  </button>

                  {/* Fullscreen Button */}
                  {!isYouTube && (
                    <button
                      onClick={handleFullscreen}
                      className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all active:scale-90"
                      title="Layar Penuh"
                    >
                      <Maximize className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Metadata & Video Information ── */}
        <div className="max-w-4xl mx-auto mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-600/30 border border-purple-400/30 flex items-center justify-center shrink-0">
              <MapPin className="w-6 h-6 text-purple-300" />
            </div>
            <div>
              <p className="text-[11px] text-purple-400 font-bold uppercase tracking-wider">Lokasi Syuting</p>
              <h4 className="text-sm font-extrabold text-white">Pekon Ulok Mukti</h4>
              <p className="text-[11px] text-purple-300/80">Kec. Ngambur, Pesisir Barat</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-violet-600/30 border border-violet-400/30 flex items-center justify-center shrink-0">
              <GraduationCap className="w-6 h-6 text-violet-300" />
            </div>
            <div>
              <p className="text-[11px] text-purple-400 font-bold uppercase tracking-wider">Penyelenggara</p>
              <h4 className="text-sm font-extrabold text-white">KKN UAP 2026</h4>
              <p className="text-[11px] text-purple-300/80">Univ. Aisyah Pringsewu</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-fuchsia-600/30 border border-fuchsia-400/30 flex items-center justify-center shrink-0">
              <Users className="w-6 h-6 text-fuchsia-300" />
            </div>
            <div>
              <p className="text-[11px] text-purple-400 font-bold uppercase tracking-wider">Keluarga Besar</p>
              <h4 className="text-sm font-extrabold text-white">20 Mahasiswa KKN</h4>
              <p className="text-[11px] text-purple-300/80">& Seluruh Warga Ulok Mukti</p>
            </div>
          </div>
        </div>

        {/* ── Cast & Anggota yang Tampil ── */}
        <div className="max-w-4xl mx-auto mt-12 bg-white/5 rounded-3xl border border-white/10 p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <span>Pemeran & Anggota KKN yang Tampil</span>
              </h3>
              <p className="text-xs text-purple-300/80 mt-0.5">
                Semua 20 anggota KKN Universitas Aisyah Pringsewu di Pekon Ulok Mukti
              </p>
            </div>

            <button
              onClick={() => setCurrentPage && setCurrentPage('members')}
              className="text-xs font-bold text-purple-300 hover:text-white px-3.5 py-1.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-400/30 transition-all self-start sm:self-auto"
            >
              Lihat Profil Lengkap Anggota →
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
            {MEMBERS_DATA.map((member) => (
              <div
                key={member.id}
                onClick={() => setCurrentPage && setCurrentPage('members')}
                className="group cursor-pointer p-2.5 rounded-2xl bg-white/5 hover:bg-purple-900/30 border border-white/5 hover:border-purple-400/40 transition-all duration-200 text-center"
              >
                <div className="w-14 h-14 mx-auto rounded-full overflow-hidden border-2 border-purple-400/30 group-hover:border-purple-300 group-hover:scale-105 transition-all mb-2 bg-purple-950">
                  <img
                    src={member.foto}
                    alt={member.nama}
                    className="w-full h-full object-cover object-top"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
                <p className="text-xs font-extrabold text-white truncate group-hover:text-purple-300">
                  {member.nama}
                </p>
                <p className="text-[10px] text-purple-300 font-semibold truncate mt-0.5">
                  {member.peran}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Call To Action Kirim Komentar ── */}
        <div className="max-w-4xl mx-auto mt-10 p-8 rounded-3xl bg-gradient-to-r from-purple-900/60 via-purple-800/40 to-violet-900/60 border border-purple-500/30 text-center space-y-4 shadow-xl">
          <h3 className="text-xl sm:text-2xl font-black text-white">
            Suka Dengan Video Ini?
          </h3>
          <p className="text-xs sm:text-sm text-purple-200/90 max-w-xl mx-auto">
            Tinggalkan pesan, komentar, atau ucapan hangat Anda untuk seluruh tim KKN Pekon Ulok Mukti di buku tamu publik.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setCurrentPage && setCurrentPage('comments')}
              className="inline-flex items-center gap-2 bg-white text-purple-950 font-black px-6 py-3 rounded-2xl shadow-lg hover:bg-purple-50 transition-all text-xs sm:text-sm active:scale-95"
            >
              <MessageSquare className="w-4 h-4 text-purple-700" />
              <span>Tulis Kesan & Komentar</span>
            </button>

            <button
              onClick={() => setCurrentPage && setCurrentPage('documentation')}
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold px-6 py-3 rounded-2xl border border-white/20 transition-all text-xs sm:text-sm active:scale-95"
            >
              <Film className="w-4 h-4 text-purple-300" />
              <span>Lihat Foto Dokumentasi</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AfterMovie;
