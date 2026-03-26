// GuessHowMuch Frontend v1.0.0
import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Banner } from './components/Banner';
import { AuthModal } from './components/AuthModal';
import type { Announcement } from './components/Banner';
import { HomePage } from './pages/HomePage';
import { StockPage } from './pages/StockPage';
import { useAuth } from './hooks/useAuth';
import { useHealthCheck } from './hooks/useHealthCheck';
import { api } from './api/client';
import { SettingsPage } from './pages/SettingsPage';

type Page = 'home' | 'stock' | 'settings';

export default function App() {
  const { user, loading, isLoggedIn, login, register, logout, updateUser } = useAuth();
  const { status: backendStatus } = useHealthCheck();
  const [page, setPage] = useState<Page>('home');
  const [symbol, setSymbol] = useState<string>('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

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
    setPage('settings');
  };

  const handleSymbolClick = (sym: string) => {
    setSymbol(sym);
    setPage('stock');
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

  // Build watchlist items for sidebar (symbol only, no price data yet)
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
          </main>
        </div>
      </div>

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