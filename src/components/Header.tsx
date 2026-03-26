import type { BackendStatus } from '../hooks/useHealthCheck';

interface HeaderProps {
  backendStatus: BackendStatus;
  isLoggedIn: boolean;
  onLoginClick: () => void;
  onLogoClick: () => void;
}

const statusConfig: Record<BackendStatus, { color: string; label: string; tooltip: string }> = {
  checking: {
    color: 'var(--color-muted)',
    label: 'checking',
    tooltip: 'connecting to backend...',
  },
  online: {
    color: 'var(--color-accent)',
    label: 'live',
    tooltip: 'all systems operational',
  },
  degraded: {
    color: 'var(--color-warning)',
    label: 'degraded',
    tooltip: 'database disconnected',
  },
  offline: {
    color: 'var(--color-negative)',
    label: 'offline',
    tooltip: 'backend unreachable',
  },
};

export function Header({ backendStatus, isLoggedIn, onLoginClick, onLogoClick }: HeaderProps) {
  const cfg = statusConfig[backendStatus];

  return (
    <header style={{
      borderBottom: '1px solid var(--color-border)',
      backgroundColor: 'var(--color-surface)',
      padding: '0 24px',
      height: '45px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexShrink: 0,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span
          onClick={onLogoClick}
          style={{
            color: 'var(--color-accent)',
            fontWeight: 'bold',
            fontSize: '14px',
            cursor: 'pointer',
          }}
        >
          $ GuessHowMuch
        </span>
        <span style={{ color: 'var(--color-muted)', fontSize: '11px' }}>
          v1.0.0
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Backend status indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: cfg.color,
            animation: 'pulse 1.5s ease-in-out infinite',
          }} />
          <span style={{ color: cfg.color, fontSize: '11px' }}>
            {cfg.label}
          </span>
        </div>

        {/* Login button — only shown when not logged in */}
        {!isLoggedIn && (
          <button
            onClick={onLoginClick}
            style={{
              background: 'transparent',
              border: '1px solid var(--color-accent)',
              color: 'var(--color-accent)',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              padding: '4px 10px',
              borderRadius: '2px',
              cursor: 'pointer',
            }}
          >
            login
          </button>
        )}
      </div>
    </header>
  );
}