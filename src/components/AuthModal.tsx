import { useState } from 'react';
import { Button } from './Button';

interface AuthModalProps {
  onLogin: (email: string, password: string, rememberMe: boolean) => Promise<void>;
  onRegister: (email: string, password: string) => Promise<void>;
  onClose: () => void;
  error: string | null;
  loading: boolean;
}

type AuthMode = 'login' | 'register' | 'check_email';

export function AuthModal({ onLogin, onRegister, onClose, error, loading }: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [createOneHovered, setCreateOneHovered] = useState(false);
  const [signInHovered, setSignInHovered] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');

  const handleSubmit = async () => {
    if (!email || !password) return;
    if (mode === 'login') {
      await onLogin(email, password, rememberMe);
    } else {
      await onRegister(email, password);
      // Switch to check_email state on successful registration
      setRegisteredEmail(email);
      setMode('check_email');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit();
  };

  const inputStyle = {
    width: '100%',
    background: 'var(--color-bg)',
    border: '1px solid var(--color-border)',
    borderRadius: '2px',
    padding: '8px 12px',
    color: 'var(--color-text)',
    fontFamily: 'var(--font-mono)',
    fontSize: '13px',
    outline: 'none',
    boxSizing: 'border-box' as const,
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: '4px',
          padding: '32px',
          width: '100%',
          maxWidth: '400px',
          fontFamily: 'var(--font-mono)',
        }}
      >
        {/* ── Check email state ─────────────────────────── */}
        {mode === 'check_email' ? (
          <>
            <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ color: 'var(--color-accent)', fontSize: '16px', fontWeight: 'bold', marginBottom: '4px' }}>
                  $ check your email
                </div>
                <div style={{ color: 'var(--color-muted)', fontSize: '11px' }}>
                  account created successfully
                </div>
              </div>
              <Button variant="danger" onClick={onClose} style={{ padding: '4px 8px', minWidth: 'unset' }}>
                [x]
              </Button>
            </div>

            <div style={{
              backgroundColor: 'var(--color-bg)',
              border: '1px solid var(--color-border)',
              borderRadius: '2px',
              padding: '16px',
              marginBottom: '20px',
              fontSize: '12px',
              color: 'var(--color-muted)',
              lineHeight: '1.8',
            }}>
              <div style={{ color: 'var(--color-accent)', marginBottom: '8px' }}>
                # verification email sent
              </div>
              <div>
                We sent a verification link to:
              </div>
              <div style={{ color: 'var(--color-text)', margin: '4px 0' }}>
                {registeredEmail}
              </div>
              <div style={{ marginTop: '8px' }}>
                Click the link in the email to activate your account and unlock all features.
              </div>
              <div style={{ marginTop: '8px', color: 'var(--color-muted)', fontSize: '11px' }}>
                Link expires in 24 hours.
              </div>
            </div>

            <Button onClick={onClose} style={{ width: '100%' }}>
              got it
            </Button>
          </>
        ) : (
          <>
            {/* ── Login / Register state ───────────────── */}
            <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ color: 'var(--color-accent)', fontSize: '16px', fontWeight: 'bold', marginBottom: '4px' }}>
                  $ {mode === 'login' ? 'login' : 'create account'}
                </div>
                <div style={{ color: 'var(--color-muted)', fontSize: '11px' }}>
                  {mode === 'login'
                    ? 'Sign in to generate AI predictions'
                    : 'Create an account to get started'}
                </div>
              </div>
              <Button variant="danger" onClick={onClose} style={{ padding: '4px 8px', minWidth: 'unset' }}>
                [x]
              </Button>
            </div>

            {/* Email */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ color: 'var(--color-muted)', fontSize: '11px', marginBottom: '6px' }}>email</div>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="your@email.com"
                style={inputStyle}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ color: 'var(--color-muted)', fontSize: '11px', marginBottom: '6px' }}>
                password {mode === 'register' && (
                  <span style={{ color: 'var(--color-muted)' }}>(min 8 characters)</span>
                )}
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder=""
                  style={{ ...inputStyle, paddingRight: '36px' }}
                />
                <button
                  onClick={() => setShowPassword(prev => !prev)}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--color-muted)',
                    fontSize: '12px',
                    fontFamily: 'var(--font-mono)',
                    padding: 0,
                  }}
                >
                  {showPassword ? 'hide' : 'show'}
                </button>
              </div>
            </div>

            {/* Remember me (login only) */}
            {mode === 'login' && (
              <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  style={{ cursor: 'pointer', accentColor: 'var(--color-accent)', flexShrink: 0 }}
                />
                <span style={{ color: 'var(--color-muted)', fontSize: '11px' }}>
                  remember me (stay logged in for 30 days)
                </span>
              </div>
            )}

            {/* Error */}
            {error && (
              <div style={{
                color: 'var(--color-negative)',
                fontSize: '12px',
                marginBottom: '16px',
                border: '1px solid var(--color-negative)',
                padding: '8px 12px',
                borderRadius: '2px',
                backgroundColor: 'rgba(255, 68, 68, 0.05)',
              }}>
                [ERROR] {error}
              </div>
            )}

            {/* Submit */}
            <div style={{ marginBottom: '16px' }}>
              <Button
                onClick={handleSubmit}
                loading={loading}
                loadingText={mode === 'login' ? 'signing in' : 'creating account'}
                disabled={!email || !password}
                style={{ width: '100%' }}
              >
                {mode === 'login' ? 'sign in' : 'create account'}
              </Button>
            </div>

            {/* Switch mode */}
            <div style={{ textAlign: 'center', fontSize: '11px', color: 'var(--color-muted)' }}>
              {mode === 'login' ? (
                <>
                  no account?{' '}
                  <span
                    onClick={() => setMode('register')}
                    onMouseEnter={() => setCreateOneHovered(true)}
                    onMouseLeave={() => setCreateOneHovered(false)}
                    style={{
                      color: createOneHovered ? 'var(--color-text)' : 'var(--color-accent)',
                      cursor: 'pointer',
                      textDecoration: 'underline',
                    }}
                  >
                    create one
                  </span>
                </>
              ) : (
                <>
                  already have an account?{' '}
                  <span
                    onClick={() => setMode('login')}
                    onMouseEnter={() => setSignInHovered(true)}
                    onMouseLeave={() => setSignInHovered(false)}
                    style={{
                      color: signInHovered ? 'var(--color-text)' : 'var(--color-accent)',
                      cursor: 'pointer',
                      textDecoration: 'underline',
                    }}
                  >
                    sign in
                  </span>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}