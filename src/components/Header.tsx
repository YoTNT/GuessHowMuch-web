import type { UserProfile } from '../api/client';
import { Button } from './Button';

interface HeaderProps {
  user: UserProfile | null;
  onLoginClick: () => void;
  onLogout: () => void;
  onSettingsClick: () => void;
}

export function Header({ user, onLoginClick, onLogout, onSettingsClick }: HeaderProps) {
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-accent)',
          }} />
          <span style={{ color: 'var(--color-muted)', fontSize: '11px' }}>live</span>
        </div>
        {user ? (
          <>
            <span style={{ color: 'var(--color-muted)', fontSize: '11px' }}>
              {user.email}
            </span>
            <Button variant="secondary" onClick={onSettingsClick}>
              settings
            </Button>
            <Button variant="secondary" onClick={onLogout}>
              logout
            </Button>
          </>
        ) : (
          <Button variant="primary" onClick={onLoginClick}>
            login
          </Button>
        )}
      </div>
    </header>
  );
}
