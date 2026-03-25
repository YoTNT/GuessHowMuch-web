import { SearchBar } from '../components/SearchBar';
import { Button } from '../components/Button';
import { DEMO_SYMBOLS } from '../utils/demo';

interface HomePageProps {
  onSearch: (symbol: string) => void;
  loading?: boolean;
}

export function HomePage({ onSearch, loading = false }: HomePageProps) {
  return (
    <div style={{
      minHeight: '100%',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Center content */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '32px 0',
      }}>
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
          <div style={{ color: 'var(--color-muted)', fontSize: '11px', marginBottom: '4px' }}>
            // quick picks
          </div>
          <div style={{ color: 'var(--color-muted)', fontSize: '10px', marginBottom: '12px' }}>
            # free demo — full access including AI predictions, no login required
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {DEMO_SYMBOLS.map(symbol => (
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
      </div>

      {/* Footer — pinned to bottom */}
      <div style={{
        paddingTop: '16px',
        paddingBottom: '16px',
        borderTop: '1px solid var(--color-border)',
        color: 'var(--color-muted)',
        fontSize: '11px',
        display: 'flex',
        justifyContent: 'space-between',
      }}>
        <span>powered by claude ai + finbert + alpha vantage</span>
        <span>not financial advice</span>
      </div>
    </div>
  );
}