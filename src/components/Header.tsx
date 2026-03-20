import { useState } from 'react';
import type { UserProfile } from '../api/client';
import type { BackendStatus } from '../hooks/useHealthCheck';
import { Button } from './Button';

interface HeaderProps {
  user: UserProfile | null;
  backendStatus: BackendStatus;
  onLoginClick: () => void;
  onLogout: () => void;
  onSettingsClick: () => void;
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

export function Header({ user, backendStatus, onLoginClick, onLogout, onSettingsClick }: HeaderProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const cfg = statusConfig[backendStatus];

  return (
    <header style={{
      borderBottom: '1px solid var(--color-border)',
      backgroundColor: 'var(--color-surface)',
      padding: '12px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ color: 'var(--color-accent)', fontWeight: 'bold', fontSize: '14px' }}>
          $ GuessHowMuch
        </span>
        <span style={{ color: 'var(--color-muted)', fontSize: '11px' }}>
          v1.0.0
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>

        {/* Backend status indicator */}
        <div
          style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'default' }}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
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

          {/* Tooltip */}
          {showTooltip && (
            <div style={{
              position: 'absolute',
              top: '20px',
              right: '0',
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-muted)',
              fontSize: '11px',
              padding: '4px 8px',
              whiteSpace: 'nowrap',
              zIndex: 100,
              fontFamily: 'var(--font-mono)',
            }}>
              {cfg.tooltip}
            </div>
          )}
        </div>

        {user ? (
          <>
            <span style={{ color: 'var(--color-muted)', fontSize: '11px' }}>
              {user.email}
            </span>
            <Button variant="secondary" onClick={onSettingsClick}>settings</Button>
            <Button variant="secondary" onClick={onLogout}>logout</Button>
          </>
        ) : (
          <Button variant="primary" onClick={onLoginClick}>login</Button>
        )}
      </div>
    </header>
  );
}