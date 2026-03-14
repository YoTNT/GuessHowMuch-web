import { useState } from 'react';
import { Header } from './components/Header';
import { HomePage } from './pages/HomePage';
import { StockPage } from './pages/StockPage';

type Page = 'home' | 'stock';

export default function App() {
  const [page, setPage] = useState<Page>('home');
  const [symbol, setSymbol] = useState<string>('');

  const handleSearch = (s: string) => {
    setSymbol(s);
    setPage('stock');
  };

  const handleBack = () => {
    setPage('home');
    setSymbol('');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--color-bg)',
      }}
    >
      <Header />
      <main
        style={{
          maxWidth: '960px',
          margin: '0 auto',
          padding: '32px 24px',
        }}
      >
        {page === 'home' && (
          <HomePage onSearch={handleSearch} />
        )}
        {page === 'stock' && symbol && (
          <StockPage symbol={symbol} onBack={handleBack} />
        )}
      </main>
    </div>
  );
}