import { useState } from 'react';

export type BannerType = 'INFO' | 'WARNING' | 'NEW' | 'DONATION';

export interface Announcement {
  id: string;
  type: BannerType;
  message: string;
  link?: {
    text: string;
    url: string;
  };
}

interface BannerProps {
  announcements: Announcement[];
}

const typeConfig: Record<BannerType, { color: string; prefix: string }> = {
  INFO:     { color: 'var(--color-muted)',   prefix: '[INFO]'    },
  WARNING:  { color: 'var(--color-warning)', prefix: '[WARNING]' },
  NEW:      { color: 'var(--color-accent)',  prefix: '[NEW]'     },
  DONATION: { color: 'var(--color-accent)',  prefix: '[DONATE]'  },
};

export function Banner({ announcements }: BannerProps) {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const visible = announcements.filter(a => !dismissed.has(a.id));
  if (visible.length === 0) return null;

  return (
    <div>
      {visible.map(announcement => {
        const cfg = typeConfig[announcement.type];
        return (
          <div
            key={announcement.id}
            style={{
              borderBottom: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-surface)',
              padding: '8px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
              <span style={{ color: cfg.color, fontWeight: 'bold' }}>{cfg.prefix}</span>
              <span style={{ color: 'var(--color-text)' }}>{announcement.message}</span>
              {announcement.link && (
                
                <a
                  href={announcement.link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: cfg.color, textDecoration: 'underline', fontSize: '12px' }}
                >
                  {announcement.link.text}
                </a>
              )}
            </div>
            <button
              onClick={() => setDismissed(prev => new Set([...prev, announcement.id]))}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--color-muted)',
                cursor: 'pointer',
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                padding: '0',
                flexShrink: 0,
              }}
            >
              [x]
            </button>
          </div>
        );
      })}
    </div>
  );
}
