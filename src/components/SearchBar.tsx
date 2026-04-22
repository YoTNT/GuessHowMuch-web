// ============================================================
// SearchBar
//
// Stock symbol input with autocomplete dropdown.
//
// Two paths for the user:
//   1. Autocomplete: type ≥2 chars → dropdown → click / Enter to pick
//   2. Direct: type ticker → press Enter or click "analyze" button
//
// Path 2 covers single-letter tickers (T=AT&T, F=Ford, V=Visa)
// that autocomplete can't show due to MIN_QUERY_LENGTH.
// ============================================================

import { useState, useRef, useEffect, type KeyboardEvent } from 'react';
import { Button } from './Button';
import { useSymbolSearch } from '../hooks/useSymbolSearch';

interface SearchBarProps {
  onSearch: (symbol: string) => void;
  loading?: boolean;
}

export function SearchBar({ onSearch, loading = false }: SearchBarProps) {
  const { query, setQuery, results, loading: searchLoading, tooShort, noResults, reset } = useSymbolSearch();

  const [isOpen, setIsOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  const shouldShowDropdown =
    isOpen && (searchLoading || tooShort || noResults || results.length > 0);

  // Reset highlight when results change
  useEffect(() => {
    setActiveIdx(-1);
  }, [results]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ── Handlers ──────────────────────────────────────────

  /** Called when user picks a result from dropdown or types a direct ticker + Enter/analyze. */
  const select = (symbol: string) => {
    reset();
    setIsOpen(false);
    onSearch(symbol);
  };

  /** Direct-analyze button: takes whatever's in the input as-is. */
  const handleDirectAnalyze = () => {
    const symbol = query.trim().toUpperCase();
    if (symbol) select(symbol);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    // Enter: if dropdown has a highlighted result, pick it; otherwise fall through to direct analyze
    if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIdx >= 0 && activeIdx < results.length) {
        select(results[activeIdx].symbol);
      } else if (results.length === 1) {
        // Only one result and no highlight — pick it for convenience
        select(results[0].symbol);
      } else {
        // No highlight, no single result — user probably wants direct path (e.g. "T")
        handleDirectAnalyze();
      }
      return;
    }

    if (!shouldShowDropdown || results.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx(prev => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx(prev => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  // ── Render ────────────────────────────────────────────

  return (
    <div ref={containerRef} style={{ marginBottom: '32px', position: 'relative' }}>
      <div style={{ color: 'var(--color-muted)', fontSize: '12px', marginBottom: '8px' }}>
        search stock symbol or company name
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
        <span style={{ color: 'var(--color-accent)', userSelect: 'none' }}>&gt;</span>

        <input
          type="text"
          value={query}
          onChange={e => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="AAPL or Apple"
          disabled={loading}
          autoComplete="off"
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
          onClick={handleDirectAnalyze}
          disabled={!query.trim() || loading}
          loading={loading}
          loadingText="loading..."
        >
          analyze
        </Button>
      </div>

      {/* ── Dropdown ──────────────────────────────────── */}
      {shouldShowDropdown && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            right: 0,
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: '4px',
            maxHeight: '320px',
            overflowY: 'auto',
            zIndex: 10,
          }}
        >
          {searchLoading && <div style={statusStyle}>searching...</div>}

          {!searchLoading && tooShort && (
            <div style={statusStyle}>
              type at least 2 characters
              <div style={hintSubStyle}>
                for single-letter tickers (T, F, V), type it and press analyze
              </div>
            </div>
          )}

          {!searchLoading && noResults && (
            <div style={statusStyle}>no matching symbols found</div>
          )}

          {!searchLoading && results.length > 0 && (
            <>
              {results.map((r, i) => (
                <div
                  key={r.symbol}
                  onClick={() => select(r.symbol)}
                  onMouseEnter={() => setActiveIdx(i)}
                  style={{
                    display: 'flex',
                    gap: '16px',
                    padding: '8px 16px',
                    cursor: 'pointer',
                    borderBottom: i < results.length - 1 ? '1px solid var(--color-border)' : 'none',
                    backgroundColor: i === activeIdx ? 'var(--color-surface-hover, #22262c)' : 'transparent',
                  }}
                >
                  <span
                    style={{
                      color: i === activeIdx ? 'var(--color-warning, #b8bb26)' : 'var(--color-accent)',
                      minWidth: '70px',
                      fontWeight: 500,
                    }}
                  >
                    {r.symbol}
                  </span>
                  <span style={{ color: 'var(--color-text)', fontSize: '13px' }}>
                    {r.name}
                  </span>
                </div>
              ))}
              <div style={keyHintStyle}>
                <span>↑↓ navigate</span>
                <span>enter select</span>
                <span>esc close</span>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ── Inline style constants ─────────────────────────────────
const statusStyle: React.CSSProperties = {
  padding: '10px 16px',
  color: 'var(--color-muted)',
  fontSize: '12px',
  fontStyle: 'italic',
};

const hintSubStyle: React.CSSProperties = {
  marginTop: '4px',
  fontSize: '11px',
  fontStyle: 'normal',
  opacity: 0.7,
};

const keyHintStyle: React.CSSProperties = {
  display: 'flex',
  gap: '16px',
  padding: '6px 16px',
  color: 'var(--color-muted)',
  fontSize: '11px',
  borderTop: '1px solid var(--color-border)',
  opacity: 0.6,
};