import { SearchBar } from '../components/SearchBar';
import { Button } from '../components/Button';

interface HomePageProps {
  onSearch: (symbol: string) => void;
  loading?: boolean;
}

export function HomePage({ onSearch, loading = false }: HomePageProps) {
  return (
    <div>
      {/* Hero */}
      <div style={{ marginBottom: '48px' }}>
        <div style={{ color: 'var(--color-muted)', fontSize: '12px', marginBottom: '8px' }}>
          # AI-powered US stock prediction
        </div>
        <div style={{ color: 'var(--color-text)', fontSize: '20px', fontWeight: 'bold', marginBottom: '4px' }}>
          GuessHowMuch
        </div>
        <div style={{ color: 'var(--color-muted)', fontSize: '12px' }}>
          technical analysis + news sentiment + claude ai
        </div>
      </div>

      {/* Search */}
      <SearchBar onSearch={onSearch} loading={loading} />

      {/* Quick picks */}
      <div>
        <div style={{ color: 'var(--color-muted)', fontSize: '11px', marginBottom: '12px' }}>
          // quick picks
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {['AAPL', 'NVDA', 'TSLA', 'HOOD', 'MSFT', 'GOOGL'].map(symbol => (
            <Button
              key={symbol}
              variant="secondary"
              onClick={() => onSearch(symbol)}
            >
              {symbol}
            </Button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          marginTop: '64px',
          paddingTop: '24px',
          borderTop: '1px solid var(--color-border)',
          color: 'var(--color-muted)',
          fontSize: '11px',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <span>powered by claude ai + finbert + alpha vantage</span>
        <span>not financial advice</span>
      </div>
    </div>
  );
}