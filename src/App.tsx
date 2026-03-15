import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Banner } from './components/Banner';
import type { Announcement } from './components/Banner';
import { HomePage } from './pages/HomePage';
import { StockPage } from './pages/StockPage';
import { api } from './api/client';
import type { Stock } from './types';

type Page = 'home' | 'stock';

const ANNOUNCEMENTS: Announcement[] = [
  {
    id: '1',
    type: 'NEW',
    message: 'GuessHowMuch is now live! AI-powered stock predictions using Claude + FinBERT.',
  },
  {
    id: '2',
    type: 'INFO',
    message: 'Free tier uses Alpha Vantage (25 requests/day). Add stocks to watchlist for best experience.',
  },
  {
    id: '3',
    type: 'DONATION',
    message: 'Find this useful? Support the project.',
    link: {
      text: 'Buy me a coffee',
      url: 'https://buymeacoffee.com',
    },
  },
];

export default function App() {
  const [page, setPage] = useState<Page>('home');
  const [symbol, setSymbol] = useState<string>('');
  const [watchlist, setWatchlist] = useState<Stock[]>([]);

  useEffect(() => {
    api.getWatchlist()
      .then(stocks => setWatchlist(stocks))
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
      <Banner announcements={ANNOUNCEMENTS} />
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
