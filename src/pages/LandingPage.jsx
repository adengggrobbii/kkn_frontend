import React, { useState, useEffect } from 'react';

const LandingPage = ({ onEnter }) => {
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);

  // Trigger fade-in on mount
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  // Animate out then call onEnter
  const handleEnter = () => {
    setExiting(true);
    setTimeout(() => onEnter(), 800);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'linear-gradient(135deg, #2D0A5E 0%, #4C1D95 30%, #6D28D9 60%, #7C3AED 80%, #5B21B6 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        transition: 'opacity 0.8s ease, transform 0.8s ease',
        opacity: exiting ? 0 : visible ? 1 : 0,
        transform: exiting ? 'scale(1.06)' : 'scale(1)',
      }}
    >
      {/* Animated background circles */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        {[
          { w: 600, h: 600, top: '-200px', left: '-200px', opacity: 0.08, delay: '0s' },
          { w: 400, h: 400, top: '60%', left: '70%', opacity: 0.06, delay: '1s' },
          { w: 300, h: 300, top: '10%', left: '65%', opacity: 0.07, delay: '0.5s' },
          { w: 250, h: 250, top: '70%', left: '5%', opacity: 0.07, delay: '1.5s' },
          { w: 180, h: 180, top: '40%', left: '80%', opacity: 0.05, delay: '2s' },
        ].map((c, i) => (
          <div key={i} style={{
            position: 'absolute',
            width: c.w, height: c.h,
            top: c.top, left: c.left,
            borderRadius: '50%',
            background: 'white',
            opacity: c.opacity,
            animation: `float ${6 + i}s ease-in-out infinite`,
            animationDelay: c.delay,
          }} />
        ))}
      </div>

      {/* Sparkle dots */}
      {Array.from({ length: 18 }).map((_, i) => (
        <div key={i} style={{
          position: 'absolute',
          width: `${4 + Math.random() * 6}px`,
          height: `${4 + Math.random() * 6}px`,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.6)',
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          animation: `twinkle ${2 + Math.random() * 3}s ease-in-out infinite`,
          animationDelay: `${Math.random() * 3}s`,
          pointerEvents: 'none',
        }} />
      ))}

      {/* Main content */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0px',
        transition: 'opacity 1s ease, transform 1s ease',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(40px)',
        padding: '0 24px',
        textAlign: 'center',
        maxWidth: '480px',
        width: '100%',
      }}>

        {/* Logo */}
        <div style={{
          transition: 'opacity 1.2s ease, transform 1.2s ease',
          transitionDelay: '0.2s',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.9)',
          filter: 'drop-shadow(0 8px 32px rgba(0,0,0,0.4))',
          marginBottom: '12px',
        }}>
          <img
            src="/logo-kkn.png"
            alt="Logo KKN Desa Ulok Mukti"
            style={{ width: 'clamp(200px, 45vw, 280px)', height: 'auto' }}
            onError={e => { e.target.style.display = 'none'; }}
          />
        </div>

        {/* Title */}
        <div style={{
          transition: 'opacity 1s ease, transform 1s ease',
          transitionDelay: '0.5s',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(20px)',
        }}>
          <p style={{ color: 'rgba(221,214,254,0.85)', fontSize: 'clamp(11px,2.5vw,14px)', fontWeight: 700, letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '6px', fontFamily: 'Inter, sans-serif' }}>
            Universitas Aisyah Pringsewu — 2026
          </p>
          <h1 style={{
            color: '#FFFFFF',
            fontSize: 'clamp(26px, 7vw, 48px)',
            fontWeight: 900,
            letterSpacing: '2px',
            fontFamily: 'Outfit, sans-serif',
            lineHeight: 1.1,
            textShadow: '0 4px 20px rgba(0,0,0,0.4)',
            margin: 0,
          }}>
            KKN DESA ULOK MUKTI
          </h1>
          <div style={{
            width: '80px',
            height: '4px',
            background: 'linear-gradient(90deg, #C4B5FD, #7C3AED)',
            borderRadius: '99px',
            margin: '16px auto',
          }} />
          <p style={{ color: 'rgba(221,214,254,0.8)', fontSize: 'clamp(13px,2.5vw,16px)', fontWeight: 500, fontFamily: 'Inter, sans-serif', letterSpacing: '1px', margin: 0 }}>
            ✦ Berdaya Bersama, Maju Bersama ✦
          </p>
        </div>

        {/* Enter Button */}
        <div style={{
          marginTop: '40px',
          transition: 'opacity 1s ease, transform 1s ease',
          transitionDelay: '0.8s',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(20px)',
        }}>
          <button
            onClick={handleEnter}
            disabled={exiting}
            style={{
              background: 'linear-gradient(135deg, #A78BFA, #7C3AED, #6D28D9)',
              color: 'white',
              border: '2px solid rgba(196,181,253,0.5)',
              borderRadius: '99px',
              padding: '16px 56px',
              fontSize: 'clamp(14px,2vw,17px)',
              fontWeight: 800,
              fontFamily: 'Outfit, sans-serif',
              letterSpacing: '2px',
              cursor: exiting ? 'not-allowed' : 'pointer',
              boxShadow: '0 8px 32px rgba(109,40,217,0.5), 0 0 0 0 rgba(167,139,250,0.4)',
              transition: 'all 0.3s ease',
              animation: 'glow-pulse 2.5s ease-in-out infinite',
              textTransform: 'uppercase',
            }}
            onMouseEnter={e => {
              e.target.style.transform = 'translateY(-3px) scale(1.04)';
              e.target.style.boxShadow = '0 14px 40px rgba(109,40,217,0.7), 0 0 30px rgba(167,139,250,0.3)';
            }}
            onMouseLeave={e => {
              e.target.style.transform = 'translateY(0) scale(1)';
              e.target.style.boxShadow = '0 8px 32px rgba(109,40,217,0.5)';
            }}
          >
            {exiting ? 'Memuat...' : '✦ Masuk ✦'}
          </button>
          <p style={{ color: 'rgba(167,139,250,0.6)', fontSize: '11px', marginTop: '12px', fontFamily: 'Inter, sans-serif' }}>
            Klik untuk masuk ke portal KKN
          </p>
        </div>
      </div>

      {/* CSS Keyframes injected inline */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-30px) scale(1.05); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(0.8); }
          50% { opacity: 0.9; transform: scale(1.3); }
        }
        @keyframes glow-pulse {
          0%, 100% { box-shadow: 0 8px 32px rgba(109,40,217,0.5), 0 0 0 0 rgba(167,139,250,0.0); }
          50% { box-shadow: 0 8px 32px rgba(109,40,217,0.6), 0 0 0 12px rgba(167,139,250,0.12); }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
