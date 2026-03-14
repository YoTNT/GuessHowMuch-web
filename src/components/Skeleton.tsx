// ============================================================
// Skeleton — Loading placeholder
// Terminal aesthetic with blinking cursor effect
// ============================================================

interface SkeletonProps {
    width?: string;
    height?: string;
    style?: React.CSSProperties;
  }
  
  function SkeletonBlock({ width = '100%', height = '14px', style }: SkeletonProps) {
    return (
      <div
        style={{
          width,
          height,
          backgroundColor: 'var(--color-surface)',
          borderRadius: '2px',
          position: 'relative',
          overflow: 'hidden',
          ...style,
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(90deg, transparent 0%, var(--color-border) 50%, transparent 100%)',
            animation: 'shimmer 1.5s infinite',
          }}
        />
      </div>
    );
  }
  
  export function QuoteCardSkeleton() {
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
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
          <SkeletonBlock width="60px" height="18px" />
          <SkeletonBlock width="140px" height="24px" />
        </div>
        {[...Array(6)].map((_, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid var(--color-border)' }}>
            <SkeletonBlock width="80px" />
            <SkeletonBlock width="80px" />
          </div>
        ))}
      </div>
    );
  }
  
  export function IndicatorsCardSkeleton() {
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
        <SkeletonBlock width="120px" style={{ marginBottom: '12px' }} />
        {[...Array(8)].map((_, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid var(--color-border)' }}>
            <SkeletonBlock width="80px" />
            <SkeletonBlock width="60px" />
          </div>
        ))}
      </div>
    );
  }
  
  export function NewsCardSkeleton() {
    return (
      <div
        style={{
          border: '1px solid var(--color-border)',
          backgroundColor: 'var(--color-surface)',
          borderRadius: '4px',
          overflow: 'hidden',
        }}
      >
        <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--color-border)' }}>
          <SkeletonBlock width="80px" />
        </div>
        {[...Array(5)].map((_, i) => (
          <div key={i} style={{ padding: '12px 16px', borderBottom: i < 4 ? '1px solid var(--color-border)' : 'none' }}>
            <SkeletonBlock width="90%" style={{ marginBottom: '8px' }} />
            <SkeletonBlock width="120px" height="11px" />
          </div>
        ))}
      </div>
    );
  }