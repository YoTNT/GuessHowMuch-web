// ============================================================
// VerifyEmailPage — Email verification landing page
// Handles: success, expired token, invalid token states
// ============================================================

import { useEffect, useState } from 'react';
import { api } from '../api/client';
import type { UserProfile } from '../api/client';
import { Button } from '../components/Button';

interface VerifyEmailPageProps {
  token: string | null;
  onBack: () => void;
  onVerifySuccess: (user: UserProfile) => void;
}

type VerifyState = 'loading' | 'success' | 'expired' | 'invalid';

export function VerifyEmailPage({ token, onBack, onVerifySuccess }: VerifyEmailPageProps) {
  const [state, setState] = useState<VerifyState>('loading');
  const [resendLoading, setResendLoading] = useState(false);
  const [resendDone, setResendDone] = useState(false);

  useEffect(() => {
    if (!token) {
      setState('invalid');
      return;
    }

    api.verifyEmail(token)
      .then(data => {
        onVerifySuccess(data.user);
        setState('success');
      })
      .catch(err => {
        const msg = err instanceof Error ? err.message : '';
        if (msg.includes('INVALID_OR_EXPIRED')) {
          setState('expired');
        } else {
          setState('invalid');
        }
      });
  }, [token]);

  const handleResend = async () => {
    setResendLoading(true);
    try {
      await api.resendVerification();
      setResendDone(true);
    } catch {
      // silently fail — user may not be logged in
    } finally {
      setResendLoading(false);
    }
  };

  const containerStyle = {
    paddingTop: '60px',
    maxWidth: '480px',
    margin: '0 auto',
    fontFamily: 'var(--font-mono)',
  };

  const boxStyle = {
    border: '1px solid var(--color-border)',
    borderRadius: '4px',
    padding: '32px',
    backgroundColor: 'var(--color-surface)',
  };

  // ── Loading ───────────────────────────────────────────────
  if (state === 'loading') {
    return (
      <div style={containerStyle}>
        <div style={boxStyle}>
          <div style={{ color: 'var(--color-muted)', fontSize: '12px' }}>
            verifying...
          </div>
        </div>
      </div>
    );
  }

  // ── Success ───────────────────────────────────────────────
  if (state === 'success') {
    return (
      <div style={containerStyle}>
        <div style={{ ...boxStyle, borderColor: 'var(--color-positive)' }}>
          <div style={{ color: 'var(--color-accent)', fontSize: '16px', fontWeight: 'bold', marginBottom: '4px' }}>
            $ GuessHowMuch
          </div>
          <div style={{ color: 'var(--color-positive)', fontSize: '20px', fontWeight: 'bold', margin: '24px 0 8px' }}>
            ✓ email verified
          </div>
          <div style={{
            backgroundColor: 'var(--color-bg)',
            border: '1px solid var(--color-border)',
            borderRadius: '2px',
            padding: '16px',
            marginBottom: '24px',
            fontSize: '12px',
            color: 'var(--color-muted)',
            lineHeight: '1.8',
          }}>
            <div style={{ color: 'var(--color-accent)', marginBottom: '8px' }}># welcome to GuessHowMuch</div>
            <div>Your account is now active. You can now:</div>
            <div style={{ marginTop: '8px' }}>
              <div>→ add stocks to your watchlist</div>
              <div>→ add your API keys in settings</div>
              <div>→ generate AI predictions</div>
            </div>
          </div>
          <Button onClick={onBack} style={{ width: '100%' }}>
            start exploring
          </Button>
        </div>
      </div>
    );
  }

  // ── Expired ───────────────────────────────────────────────
  if (state === 'expired') {
    return (
      <div style={containerStyle}>
        <div style={boxStyle}>
          <div style={{ color: 'var(--color-accent)', fontSize: '16px', fontWeight: 'bold', marginBottom: '24px' }}>
            $ GuessHowMuch
          </div>
          <div style={{ color: '#cc8800', fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }}>
            ⚠ link expired
          </div>
          <div style={{
            backgroundColor: 'var(--color-bg)',
            border: '1px solid var(--color-border)',
            borderRadius: '2px',
            padding: '16px',
            marginBottom: '24px',
            fontSize: '12px',
            color: 'var(--color-muted)',
            lineHeight: '1.8',
          }}>
            <div>This verification link has expired.</div>
            <div style={{ marginTop: '8px' }}>Verification links are valid for 24 hours.</div>
          </div>

          {resendDone ? (
            <div style={{
              fontSize: '12px',
              color: 'var(--color-positive)',
              padding: '10px',
              border: '1px solid var(--color-positive)',
              borderRadius: '2px',
              marginBottom: '16px',
            }}>
              ✓ new verification email sent — check your inbox
            </div>
          ) : (
            <Button
              onClick={handleResend}
              loading={resendLoading}
              loadingText="sending..."
              style={{ width: '100%', marginBottom: '12px' }}
            >
              resend verification email
            </Button>
          )}

          <Button onClick={onBack} style={{ width: '100%' }}>
            back to home
          </Button>
        </div>
      </div>
    );
  }

  // ── Invalid ───────────────────────────────────────────────
  return (
    <div style={containerStyle}>
      <div style={boxStyle}>
        <div style={{ color: 'var(--color-accent)', fontSize: '16px', fontWeight: 'bold', marginBottom: '24px' }}>
          $ GuessHowMuch
        </div>
        <div style={{ color: 'var(--color-negative)', fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }}>
          [ERROR] invalid link
        </div>
        <div style={{
          backgroundColor: 'var(--color-bg)',
          border: '1px solid var(--color-border)',
          borderRadius: '2px',
          padding: '16px',
          marginBottom: '24px',
          fontSize: '12px',
          color: 'var(--color-muted)',
          lineHeight: '1.8',
        }}>
          <div>This verification link is invalid or has already been used.</div>
        </div>
        <Button onClick={onBack} style={{ width: '100%' }}>
          back to home
        </Button>
      </div>
    </div>
  );
}