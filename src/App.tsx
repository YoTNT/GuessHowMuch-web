import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HomePage } from './pages/HomePage';
import { StockPage } from './pages/StockPage';
import { api } from './api/client';
import type { Stock } from './types';

type Page = 'home' | 'stock';

export default function App() {
  const [page, setPage] = useState<Page>('home');
  const [symbol, setSymbol] = useState<string>('');
  const [watchlist, setWatchlist] = useState<Stock[]>([]);

  // Load watchlist on startup
  useEffect(() => {
    api.getWatchlist()
      .then(stocks => setWatchlist(stocks))
      .catch(() => {}); // Silently fail if backend is not running
  }, []);

  const handleSearch = (s: string) => {
    setSymbol(s);
    setPage('stock');
  };

  const handleBack = () => {
    setPage('home');
    setSymbol('');
  };

  const handleAddToWatchlist = async (stock: Stock) => {
    try {
      const added = await api.addStock(
        stock.symbol,
        stock.name,
        stock.sector,
        stock.exchange
      );
      setWatchlist(prev => [...prev, added]);
      return true;
    } catch {
      return false;
    }
  };

  const isInWatchlist = (sym: string) =>
    watchlist.some(s => s.symbol === sym);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg)' }}>
      <Header />
      <main style={{ maxWidth: '960px', margin: '0 auto', padding: '32px 24px' }}>
        {page === 'home' && (
          <HomePage onSearch={handleSearch} />
        )}
        {page === 'stock' && symbol && (
          <StockPage
            symbol={symbol}
            onBack={handleBack}
            isInWatchlist={isInWatchlist(symbol)}
            onAddToWatchlist={() => handleAddToWatchlist({
              symbol,
              name: symbol,
              sector: 'Unknown',
              exchange: 'NASDAQ',
              addedAt: new Date().toISOString(),
              isActive: true,
            })}
          />
        )}
      </main>
    </div>
  );
}