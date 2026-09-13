import React, { useState, useEffect } from 'react';
import LandingPage from './pages/LandingPage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import PublicComments from './pages/PublicComments';
import Members from './pages/Members';
import KKNDocumentation from './pages/KKNDocumentation';
import AfterMovie from './pages/AfterMovie';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

const App = () => {
  const [showLanding, setShowLanding] = useState(true);
  const [currentPage, setCurrentPage] = useState('home');
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [adminUser, setAdminUser] = useState(null);

  const isAdmin = !!token;

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser  = localStorage.getItem('adminUser');
    if (savedToken && savedUser) {
      setToken(savedToken);
      try { setAdminUser(JSON.parse(savedUser)); } catch {}
    }
  }, []);

  const handleLoginSuccess = (newToken, user) => {
    setToken(newToken);
    setAdminUser(user);
    localStorage.setItem('token', newToken);
    localStorage.setItem('adminUser', JSON.stringify(user));
    setCurrentPage('admin');
  };

  const handleLogout = () => {
    setToken('');
    setAdminUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('adminUser');
    setCurrentPage('home');
  };

  return (
    <>
      {/* ── 1. Landing Page Overlay ── */}
      {showLanding && (
        <LandingPage onEnter={() => setShowLanding(false)} />
      )}

      {/* ── 2. Portal Utama Web ── */}
      <div style={{
        opacity: showLanding ? 0 : 1,
        transition: 'opacity 0.6s ease',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}>
        <div>
          <Navbar
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            isAdmin={isAdmin}
            adminUser={adminUser}
            onLogout={handleLogout}
          />
          <main>
            {currentPage === 'home'          && <HomePage setCurrentPage={setCurrentPage} />}
            {(currentPage === 'comments' || currentPage === 'student') && (
              <PublicComments isAdmin={isAdmin} token={token} />
            )}
            {currentPage === 'members'       && <Members />}
            {currentPage === 'documentation' && <KKNDocumentation />}
            {currentPage === 'aftermovie'    && <AfterMovie setCurrentPage={setCurrentPage} />}
            {currentPage === 'login'         && (isAdmin ? <AdminDashboard token={token} /> : <AdminLogin onLoginSuccess={handleLoginSuccess} />)}
            {currentPage === 'admin'         && (isAdmin ? <AdminDashboard token={token} /> : <AdminLogin onLoginSuccess={handleLoginSuccess} />)}
          </main>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default App;
