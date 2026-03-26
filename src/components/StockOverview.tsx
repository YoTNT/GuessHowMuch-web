// ============================================================
// StockOverview — Company overview display
// Homebrew terminal aesthetic
// ============================================================

import type { StockOverview } from '../types';

interface StockOverviewProps {
  overview: StockOverview;
}

export function StockOverviewCard({ overview }: StockOverviewProps) {
  return (
    <div style={{
      border: '1px solid var(--color-border)',
      backgroundColor: 'var(--color-surface)',
      borderRadius: '4px',
      padding: '16px',
      fontSize: '12px',
    }}>
      {/* Company name + exchange */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '12px',
        paddingBottom: '12px',
        borderBottom: '1px solid var(--color-border)',
      }}>
        <span style={{ color: 'var(--color-text)', fontWeight: 'bold', fontSize: '13px' }}>
          {overview.name}
        </span>
        <span style={{ color: 'var(--color-muted)', fontSize: '11px' }}>
          {overview.exchange} · {overview.country}
        </span>
      </div>

      {/* Sector + Industry */}
      <div style={{
        display: 'flex',
        gap: '24px',
        marginBottom: '12px',
      }}>
        <div>
          <span style={{ color: 'var(--color-muted)' }}>sector</span>
          <span style={{ color: 'var(--color-muted)' }}> </span>
          <span style={{ color: 'var(--color-accent)' }}>{overview.sector.toLowerCase()}</span>
        </div>
        <div>
          <span style={{ color: 'var(--color-muted)' }}>industry</span>
          <span style={{ color: 'var(--color-muted)' }}> </span>
          <span style={{ color: 'var(--color-accent)' }}>{overview.industry.toLowerCase()}</span>
        </div>
      </div>

      {/* Description */}
      <div style={{
        backgroundColor: 'var(--color-bg)',
        border: '1px solid var(--color-border)',
        borderRadius: '2px',
        padding: '12px',
        fontSize: '11px',
        color: 'var(--color-muted)',
        lineHeight: '1.8',
      }}>
        <span style={{ color: 'var(--color-accent)' }}># </span>
        {overview.description}
      </div>
    </div>
  );
}