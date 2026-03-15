import { useState, type KeyboardEvent } from 'react';
import { Button } from './Button';

interface SearchBarProps {
  onSearch: (symbol: string) => void;
  loading?: boolean;
}

export function SearchBar({ onSearch, loading = false }: SearchBarProps) {
  const [value, setValue] = useState('');

  const handleSearch = () => {
    const symbol = value.trim().toUpperCase();
    if (symbol) {
      onSearch(symbol);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <div style={{ marginBottom: '32px' }}>
      <div style={{ color: 'var(--color-muted)', fontSize: '12px', marginBottom: '8px' }}>
        enter stock symbol to analyze
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          border: '1px solid var(--color-border)',
          backgroundColor: 'var(--color-surface)',
          padding: '10px 16px',
          borderRadius: '4px',
        }}
      >
        <span style={{ color: 'var(--color-accent)', userSelect: 'none' }}>
          &gt;
        </span>

        <input
          type="text"
          value={value}
          onChange={e => setValue(e.target.value.toUpperCase())}
          onKeyDown={handleKeyDown}
          placeholder="AAPL"
          disabled={loading}
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: 'var(--color-text)',
            fontFamily: 'var(--font-mono)',
            fontSize: '14px',
            letterSpacing: '0.05em',
          }}
        />

        <Button
          onClick={handleSearch}
          disabled={!value.trim()}
          loading={loading}
          loadingText="loading..."
        >
          analyze
        </Button>
      </div>
    </div>
  );
}