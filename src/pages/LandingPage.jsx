import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Sparkles, ArrowRight } from 'lucide-react';

const LandingPage = ({ onEnter }) => {
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef(null);

  // Fade-in landing on mount
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  // Handle enter transition
  const handleEnter = () => {
    setExiting(true);
    setTimeout(() => onEnter(), 800);
  };

  // Toggle video mute/unmute
  const toggleSound = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: '#1E0B36',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        transition: 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
        opacity: exiting ? 0 : visible ? 1 : 0,
        transform: exiting ? 'scale(1.05)' : 'scale(1)',
      }}
    >
      {/* ── 1. Video Background ── */}
      {!videoError && (
        <video
          ref={videoRef}
          src="/intro.mp4"
          poster="/homepage/kkn.png"
          autoPlay
          loop
          muted={isMuted}
          playsInline
          onLoadedData={() => setVideoLoaded(true)}
          onError={() => setVideoError(true)}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: videoLoaded ? 1 : 0,
            transition: 'opacity 1.2s ease-in-out',
            zIndex: 1,
          }}
        />
      )}

      {/* ── 2. Fallback Background Foto KKN & Animated Gradient ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, #2D0A5E 0%, #4C1D95 35%, #6D28D9 65%, #7C3AED 85%, #5B21B6 100%)',
          zIndex: 0,
        }}
      >
        <img
          src="/homepage/kkn.png"
          alt="Foto Kelompok KKN"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center top',
            opacity: 0.35,
            filter: 'blur(1px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(26, 7, 51, 0.85) 0%, rgba(45, 10, 94, 0.7) 50%, rgba(26, 7, 51, 0.95) 100%)',
          }}
        />
        {/* Animated ambient glowing orbs */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          {[
            { w: 600, h: 600, top: '-150px', left: '-150px', opacity: 0.12, delay: '0s' },
            { w: 450, h: 450, top: '55%', left: '65%', opacity: 0.1, delay: '1s' },
            { w: 320, h: 320, top: '10%', left: '70%', opacity: 0.08, delay: '0.5s' },
            { w: 260, h: 260, top: '75%', left: '8%', opacity: 0.09, delay: '1.5s' },
          ].map((c, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                width: c.w,
                height: c.h,
                top: c.top,
                left: c.left,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(196,181,253,0.8) 0%, rgba(124,58,237,0) 70%)',
                opacity: c.opacity,
                animation: `float ${7 + i * 2}s ease-in-out infinite`,
                animationDelay: c.delay,
              }}
            />
          ))}
        </div>
      </div>

      {/* ── 3. Dark Backdrop & Cinematic Vignette Overlay ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: videoLoaded
            ? 'radial-gradient(circle at center, rgba(15, 5, 29, 0.65) 0%, rgba(15, 5, 29, 0.88) 100%)'
            : 'rgba(15, 5, 29, 0.25)',
          backdropFilter: videoLoaded ? 'blur(2px)' : 'none',
          zIndex: 2,
          transition: 'background 1s ease',
          pointerEvents: 'none',
        }}
      />

      {/* ── 4. Sound Toggle Button (Muncul jika video berhasil dimuat) ── */}
      {videoLoaded && (
        <button
          onClick={toggleSound}
          title={isMuted ? 'Nyalakan Suara' : 'Matikan Suara'}
          style={{
            position: 'absolute',
            top: '24px',
            right: '24px',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255, 255, 255, 0.12)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: 'white',
            padding: '10px 18px',
            borderRadius: '99px',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: 600,
            fontFamily: 'Inter, sans-serif',
            transition: 'all 0.25s ease',
            boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.22)';
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          {isMuted ? (
            <>
              <VolumeX size={16} />
              <span>Suara: Mati</span>
            </>
          ) : (
            <>
              <Volume2 size={16} color="#A78BFA" />
              <span>Suara: Nyala</span>
            </>
          )}
        </button>
      )}

      {/* ── 5. Main Hero Content ── */}
      <div
        style={{
          position: 'relative',
          zIndex: 5,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
          transition: 'opacity 1s ease, transform 1s ease',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(30px)',
          padding: '0 24px',
          textAlign: 'center',
          maxWidth: '560px',
          width: '100%',
        }}
      >
        {/* Logo KKN */}
        <div
          style={{
            transition: 'opacity 1.2s ease, transform 1.2s ease',
            transitionDelay: '0.2s',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.92)',
            filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.5))',
            marginBottom: '8px',
          }}
        >
          <img
            src="/logo-kkn.png"
            alt="Logo KKN Desa Ulok Mukti"
            style={{ width: 'clamp(180px, 40vw, 260px)', height: 'auto' }}
            onError={e => { e.target.style.display = 'none'; }}
          />
        </div>

        {/* Title & Tagline */}
        <div
          style={{
            transition: 'opacity 1s ease, transform 1s ease',
            transitionDelay: '0.4s',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(20px)',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(8px)',
              borderRadius: '99px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#DDD6FE',
              fontSize: 'clamp(10px, 2.2vw, 12px)',
              fontWeight: 700,
              letterSpacing: '2px',
              textTransform: 'uppercase',
              marginBottom: '14px',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            <Sparkles size={13} color="#C4B5FD" />
            Universitas Aisyah Pringsewu — 2026
          </div>

          <h1
            style={{
              color: '#FFFFFF',
              fontSize: 'clamp(28px, 6.5vw, 46px)',
              fontWeight: 900,
              letterSpacing: '2px',
              fontFamily: 'Outfit, sans-serif',
              lineHeight: 1.15,
              textShadow: '0 4px 24px rgba(0,0,0,0.6)',
              margin: '0 0 14px 0',
            }}
          >
            KKN DESA ULOK MUKTI
          </h1>

          <div
            style={{
              width: '70px',
              height: '4px',
              background: 'linear-gradient(90deg, #C4B5FD, #7C3AED)',
              borderRadius: '99px',
              margin: '0 auto 14px auto',
            }}
          />

          <p
            style={{
              color: 'rgba(221, 214, 254, 0.9)',
              fontSize: 'clamp(13px, 2.4vw, 16px)',
              fontWeight: 500,
              fontFamily: 'Inter, sans-serif',
              letterSpacing: '1px',
              margin: 0,
              textShadow: '0 2px 10px rgba(0,0,0,0.5)',
            }}
          >
            ✦ Berdaya Bersama, Maju Bersama ✦
          </p>
        </div>

        {/* Enter Button */}
        <div
          style={{
            marginTop: '32px',
            transition: 'opacity 1s ease, transform 1s ease',
            transitionDelay: '0.6s',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(20px)',
          }}
        >
          <button
            onClick={handleEnter}
            disabled={exiting}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              background: 'linear-gradient(135deg, #A78BFA 0%, #7C3AED 50%, #6D28D9 100%)',
              color: 'white',
              border: '2px solid rgba(255, 255, 255, 0.4)',
              borderRadius: '99px',
              padding: '16px 52px',
              fontSize: 'clamp(14px, 2vw, 16px)',
              fontWeight: 800,
              fontFamily: 'Outfit, sans-serif',
              letterSpacing: '2px',
              cursor: exiting ? 'not-allowed' : 'pointer',
              boxShadow: '0 8px 32px rgba(109, 40, 217, 0.6), 0 0 20px rgba(167, 139, 250, 0.3)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              animation: 'glow-pulse 2.8s ease-in-out infinite',
              textTransform: 'uppercase',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-3px) scale(1.04)';
              e.currentTarget.style.boxShadow = '0 14px 40px rgba(109, 40, 217, 0.8), 0 0 35px rgba(167, 139, 250, 0.5)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(109, 40, 217, 0.6)';
            }}
          >
            <span>{exiting ? 'Memuat Portal...' : 'Masuk ke Portal'}</span>
            <ArrowRight size={18} />
          </button>

          <p
            style={{
              color: 'rgba(216, 180, 254, 0.75)',
              fontSize: '11px',
              marginTop: '12px',
              fontFamily: 'Inter, sans-serif',
              letterSpacing: '0.5px',
            }}
          >
            Klik untuk langsung masuk ke sistem portal KKN
          </p>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-25px) scale(1.04); }
        }
        @keyframes glow-pulse {
          0%, 100% { box-shadow: 0 8px 32px rgba(109,40,217,0.5), 0 0 0 0 rgba(167,139,250,0.0); }
          50% { box-shadow: 0 8px 36px rgba(109,40,217,0.7), 0 0 0 10px rgba(167,139,250,0.15); }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
