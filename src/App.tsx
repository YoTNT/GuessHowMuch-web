// GuessHowMuch Frontend v1.0.0
import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Banner } from './components/Banner';
import { AuthModal } from './components/AuthModal';
import { Button } from './components/Button';
import type { Announcement } from './components/Banner';
import { HomePage } from './pages/HomePage';
import { StockPage } from './pages/StockPage';
import { VerifyEmailPage } from './pages/VerifyEmailPage';
import { useAuth } from './hooks/useAuth';
import { useHealthCheck } from './hooks/useHealthCheck';
import { api } from './api/client';
import { SettingsPage } from './pages/SettingsPage';

type Page = 'home' | 'stock' | 'settings' | 'verify-email';

export default function App() {
  const { user, loading, isLoggedIn, login, register, logout, updateUser } = useAuth();
  const { status: backendStatus } = useHealthCheck();
  const [page, setPage] = useState<Page>('home');
  const [symbol, setSymbol] = useState<string>('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [verifyToken, setVerifyToken] = useState<string | null>(null);
  const [showCheckEmailModal, setShowCheckEmailModal] = useState(false);
  const [resendNotice, setResendNotice] = useState(false);

  // Check for /verify-email?token=xxx on initial load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (window.location.pathname === '/verify-email' && token) {
      setVerifyToken(token);
      setPage('verify-email');
    }
  }, []);

  useEffect(() => {
    api.getAnnouncements()
      .then(setAnnouncements)
      .catch(() => {});
  }, []);

  const handleSearch = (s: string) => {
    setSymbol(s);
    setPage('stock');
  };

  const handleBack = () => {
    setPage('home');
    setSymbol('');
    window.history.replaceState({}, '', '/');
  };

  const handleLoginClick = () => {
    setAuthError(null);
    setShowAuthModal(true);
  };

  const handleLogin = async (email: string, password: string, rememberMe: boolean) => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      await login(email, password, rememberMe);
      setShowAuthModal(false);
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleRegister = async (email: string, password: string) => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      await register(email, password);
      setShowAuthModal(false);
      setShowCheckEmailModal(true);
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setPage('home');
    setSymbol('');
  };

  const handleSettingsClick = () => {
    if (user && !user.emailVerified) return;
    setPage('settings');
  };

  const handleSymbolClick = (sym: string) => {
    setSymbol(sym);
    setPage('stock');
  };

  const handleVerifyClick = () => {
    api.resendVerification()
      .then(() => setResendNotice(true))
      .catch(() => {});
  };

  const isInWatchlist = (sym: string) => {
    return user?.watchlist?.includes(sym) ?? false;
  };

  const handleAddToWatchlist = async (sym: string) => {
    try {
      const watchlist = await api.addToWatchlist(sym);
      if (user) {
        updateUser({ ...user, watchlist });
      }
      return true;
    } catch {
      return false;
    }
  };

  const handleVerifySuccess = (verifiedUser: any) => {
    updateUser(verifiedUser);
  };

  const watchlistItems = (user?.watchlist ?? []).map(sym => ({ symbol: sym }));

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: 'var(--color-bg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--color-muted)',
        fontFamily: 'var(--font-mono)',
        fontSize: '12px',
      }}>
        loading...
      </div>
    );
  }

  return (
    <div style={{ height: '100vh', backgroundColor: 'var(--color-bg)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      {/* Shell layout — sidebar + main */}
      <div style={{ display: 'flex', flex: 1, minHeight: 0, overflow: 'hidden', alignItems: 'stretch' }}>

        {/* Sidebar */}
        <Sidebar
          user={user}
          isLoggedIn={isLoggedIn}
          watchlist={watchlistItems}
          onLoginClick={handleLoginClick}
          onLogout={handleLogout}
          onSettingsClick={handleSettingsClick}
          onSymbolClick={handleSymbolClick}
          onVerifyClick={handleVerifyClick}
        />

        {/* Main area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <Header
            backendStatus={backendStatus}
            isLoggedIn={isLoggedIn}
            onLoginClick={handleLoginClick}
            onLogoClick={handleBack}
          />

          <Banner announcements={announcements} />

          <main style={{ flex: 1, maxWidth: '960px', width: '100%', margin: '0 auto', padding: '0 24px', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
            {page === 'home' && (
              <HomePage onSearch={handleSearch} />
            )}
            {page === 'stock' && symbol && (
              <StockPage
                symbol={symbol}
                onBack={handleBack}
                isLoggedIn={isLoggedIn}
                isInWatchlist={isInWatchlist(symbol)}
                onAddToWatchlist={() => handleAddToWatchlist(symbol)}
                onLoginClick={handleLoginClick}
                onSettingsClick={handleSettingsClick}
                user={user}
              />
            )}
            {page === 'settings' && user != null && (
              <SettingsPage
                user={user}
                onBack={handleBack}
                onUpdateUser={updateUser}
              />
            )}
            {page === 'verify-email' && (
              <VerifyEmailPage
                token={verifyToken}
                onBack={handleBack}
                onVerifySuccess={handleVerifySuccess}
              />
            )}
          </main>
        </div>
      </div>

      {/* Check email modal — shown after registration */}
      {showCheckEmailModal && (
        <div
          onClick={() => setShowCheckEmailModal(false)}
          style={{
            position: 'fixed', inset: 0,
            backgroundColor: 'rgba(0,0,0,0.7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 100,
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: '4px',
              padding: '32px',
              width: '100%',
              maxWidth: '400px',
              fontFamily: 'var(--font-mono)',
            }}
          >
            <div style={{ color: 'var(--color-accent)', fontSize: '16px', fontWeight: 'bold', marginBottom: '4px' }}>
              $ check your email
            </div>
            <div style={{ color: 'var(--color-muted)', fontSize: '11px', marginBottom: '24px' }}>
              account created successfully
            </div>
            <div style={{
              backgroundColor: 'var(--color-bg)',
              border: '1px solid var(--color-border)',
              borderRadius: '2px',
              padding: '16px',
              marginBottom: '20px',
              fontSize: '12px',
              color: 'var(--color-muted)',
              lineHeight: '1.8',
            }}>
              <div style={{ color: 'var(--color-accent)', marginBottom: '8px' }}># verification email sent</div>
              <div>Click the link in the email to activate your account and unlock all features.</div>
              <div style={{ marginTop: '8px', fontSize: '11px' }}>Link expires in 24 hours.</div>
            </div>
            <Button onClick={() => setShowCheckEmailModal(false)} style={{ width: '100%' }}>
              got it
            </Button>
          </div>
        </div>
      )}

      {/* Resend verification notice */}
      {resendNotice && (
        <div
          onClick={() => setResendNotice(false)}
          style={{
            position: 'fixed', inset: 0,
            backgroundColor: 'rgba(0,0,0,0.7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 100,
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-positive)',
              borderRadius: '4px',
              padding: '32px',
              width: '100%',
              maxWidth: '400px',
              fontFamily: 'var(--font-mono)',
            }}
          >
            <div style={{ color: 'var(--color-positive)', fontSize: '16px', fontWeight: 'bold', marginBottom: '16px' }}>
              ✓ email sent
            </div>
            <div style={{ color: 'var(--color-muted)', fontSize: '12px', marginBottom: '24px', lineHeight: '1.8' }}>
              A new verification link has been sent to your email address. Check your inbox and click the link to activate your account.
            </div>
            <Button onClick={() => setResendNotice(false)} style={{ width: '100%' }}>
              got it
            </Button>
          </div>
        </div>
      )}

      {showAuthModal && (
        <AuthModal
          onLogin={handleLogin}
          onRegister={handleRegister}
          onClose={() => setShowAuthModal(false)}
          error={authError}
          loading={authLoading}
        />
      )}
    </div>
  );
}