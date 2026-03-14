// ============================================================
// Header — Top navigation bar
// Terminal / Homebrew aesthetic
// ============================================================

export function Header() {
    return (
      <header
        style={{
          borderBottom: '1px solid var(--color-border)',
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ color: 'var(--color-accent)', fontSize: '18px', fontWeight: 'bold' }}>
            $
          </span>
          <span style={{ color: 'var(--color-text)', fontSize: '16px', fontWeight: 'bold' }}>
            GuessHowMuch
          </span>
          <span style={{ color: 'var(--color-muted)', fontSize: '12px' }}>
            v1.0.0
          </span>
        </div>
  
        {/* Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-accent)',
              display: 'inline-block',
            }}
          />
          <span style={{ color: 'var(--color-muted)', fontSize: '12px' }}>
            live
          </span>
        </div>
      </header>
    );
  }