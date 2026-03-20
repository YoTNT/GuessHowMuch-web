// GuessHowMuch Frontend v1.0.0
import { useState } from 'react';
import { Header } from './components/Header';
import { Banner } from './components/Banner';
import { AuthModal } from './components/AuthModal';
import type { Announcement } from './components/Banner';
import { HomePage } from './pages/HomePage';
import { StockPage } from './pages/StockPage';
import { useAuth } from './hooks/useAuth';
import { api } from './api/client';
import { SettingsPage } from './pages/SettingsPage';
import { useHealthCheck } from './hooks/useHealthCheck';

type Page = 'home' | 'stock' | 'settings';

const ANNOUNCEMENTS: Announcement[] = [
  {
    id: '1',
    type: 'NEW',
    message: 'GuessHowMuch is now live! AI-powered stock predictions using Claude + FinBERT.',
  },
  {
    id: '2',
    type: 'INFO',
    message: 'Login and add your API keys to unlock AI predictions.',
  },
];

export default function App() {
  const { user, loading, isLoggedIn, login, register, logout, updateUser } = useAuth();
  const { status: backendStatus } = useHealthCheck();
  const [page, setPage] = useState<Page>('home');
  const [symbol, setSymbol] = useState<string>('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

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
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg)' }}>
      <Header
        user={user}
        backendStatus={backendStatus}
        onLoginClick={handleLoginClick}
        onLogout={handleLogout}
        onSettingsClick={handleSettingsClick}
      />
      <Banner announcements={ANNOUNCEMENTS} />

      <main style={{ maxWidth: '960px', margin: '0 auto', padding: '32px 24px' }}>
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