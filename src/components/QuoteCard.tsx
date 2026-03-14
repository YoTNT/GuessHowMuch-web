// ============================================================
// QuoteCard — Real-time stock quote display
// ============================================================

import type { StockQuote } from '../types';

interface QuoteCardProps {
  quote: StockQuote;
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '4px 0',
        borderBottom: '1px solid var(--color-border)',
      }}
    >
      <span style={{ color: 'var(--color-muted)' }}>{label}</span>
      <span style={{ color: 'var(--color-text)' }}>{value}</span>
    </div>
  );
}

export function QuoteCard({ quote }: QuoteCardProps) {
  const isPositive = quote.change >= 0;
  const changeColor = isPositive ? 'var(--color-positive)' : 'var(--color-negative)';
  const changeSign = isPositive ? '+' : '';

  return (
    <div
      style={{
        border: '1px solid var(--color-border)',
        backgroundColor: 'var(--color-surface)',
        padding: '16px',
        borderRadius: '4px',
        marginBottom: '16px',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          marginBottom: '16px',
        }}
      >
        <span style={{ color: 'var(--color-accent)', fontSize: '16px', fontWeight: 'bold' }}>
          {quote.symbol}
        </span>
        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--color-text)' }}>
            ${quote.price.toFixed(2)}
          </span>
          <span style={{ marginLeft: '12px', color: changeColor, fontSize: '14px' }}>
            {changeSign}{quote.change.toFixed(2)} ({changeSign}{quote.changePercent.toFixed(2)}%)
          </span>
        </div>
      </div>

      {/* Details */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <Row label="open"    value={`$${quote.open.toFixed(2)}`} />
        <Row label="high"    value={`$${quote.high.toFixed(2)}`} />
        <Row label="low"     value={`$${quote.low.toFixed(2)}`} />
        <Row label="prev close" value={`$${quote.previousClose.toFixed(2)}`} />
        <Row label="volume"  value={quote.volume.toLocaleString()} />
        <Row label="updated" value={new Date(quote.timestamp).toLocaleTimeString()} />
      </div>
    </div>
  );
}