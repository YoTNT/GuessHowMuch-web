import { useState } from 'react';
import type { UserProfile } from '../api/client';

interface WatchlistItem {
  symbol: string;
  price?: number;
  changePercent?: number;
}

interface SidebarProps {
  user: UserProfile | null;
  isLoggedIn: boolean;
  watchlist: WatchlistItem[];
  onLoginClick: () => void;
  onLogout: () => void;
  onSettingsClick: () => void;
  onSymbolClick: (symbol: string) => void;
}

export function Sidebar({
  user: _user,
  isLoggedIn,
  watchlist,
  onLoginClick,
  onLogout,
  onSettingsClick,
  onSymbolClick,
}: SidebarProps) {
  const [open, setOpen] = useState(false);
  const [wlExpanded, setWlExpanded] = useState(true);

  const hasWatchlist = isLoggedIn && watchlist.length > 0;

  const GearIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6" stroke="var(--color-muted)" strokeWidth="1.2"/>
      <circle cx="8" cy="8" r="2.5" stroke="var(--color-muted)" strokeWidth="1.2"/>
      <line x1="8" y1="1" x2="8" y2="3" stroke="var(--color-muted)" strokeWidth="1.2"/>
      <line x1="8" y1="13" x2="8" y2="15" stroke="var(--color-muted)" strokeWidth="1.2"/>
      <line x1="1" y1="8" x2="3" y2="8" stroke="var(--color-muted)" strokeWidth="1.2"/>
      <line x1="13" y1="8" x2="15" y2="8" stroke="var(--color-muted)" strokeWidth="1.2"/>
    </svg>
  );

  const LogoutIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M6 3H3a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h3" stroke="var(--color-negative)" strokeWidth="1.2" strokeLinecap="round"/>
      <path d="M10 5l3 3-3 3" stroke="var(--color-negative)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="13" y1="8" x2="6" y2="8" stroke="var(--color-negative)" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  );

  const LoginIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M10 3H13a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H10" stroke="var(--color-accent)" strokeWidth="1.2" strokeLinecap="round"/>
      <path d="M6 11l3-3-3-3" stroke="var(--color-accent)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="3" y1="8" x2="9" y2="8" stroke="var(--color-accent)" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  );

  const iconBtn = (
    onClick: () => void,
    icon: React.ReactNode,
    label: string,
    color: string,
    tooltipText: string,
  ) => (
    <button
      onClick={e => { e.stopPropagation(); onClick(); }}
      title={tooltipText}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: open ? 'flex-start' : 'center',
        gap: open ? '10px' : '0',
        padding: '10px',
        borderRadius: '4px',
        cursor: 'pointer',
        background: 'transparent',
        border: 'none',
        width: '100%',
      }}
      onMouseOver={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
      onMouseOut={e => (e.currentTarget.style.background = 'transparent')}
    >
      <div style={{
        width: '20px',
        height: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}>
        {icon}
      </div>
      {open && (
        <span style={{
          fontSize: '11px',
          fontFamily: 'var(--font-mono)',
          color,
          whiteSpace: 'nowrap',
        }}>
          {label}
        </span>
      )}
    </button>
  );

  return (
    <div
    onClick={() => { if (!open) setOpen(true); }}
    style={{
        width: open ? '200px' : '48px',
        minWidth: open ? '200px' : '48px',
        background: 'var(--color-surface)',
        borderRight: '1px solid var(--color-border)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.25s ease, min-width 0.25s ease',
        overflow: 'hidden',
        flexShrink: 0,
        cursor: open ? 'default' : 'e-resize',
        height: '100%',
    }}
    >
      {/* Toggle button */}
      <div style={{
        height: '45px',
        padding: '0 12px',
        display: 'flex',
        alignItems: 'center',
        borderBottom: '1px solid var(--color-border)',
        flexShrink: 0,
      }}>
        <button
          onClick={e => { e.stopPropagation(); setOpen(prev => !prev); }}
          title={open ? 'close sidebar' : 'open sidebar'}
          style={{
            background: 'transparent',
            border: 'none',
            cursor: open ? 'w-resize' : 'e-resize',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            padding: '4px',
          }}
          onMouseOver={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
          onMouseOut={e => (e.currentTarget.style.background = 'transparent')}
        >
          <span style={{ display: 'block', width: '16px', height: '1.5px', background: 'var(--color-muted)' }} />
          <span style={{ display: 'block', width: '16px', height: '1.5px', background: 'var(--color-muted)' }} />
          <span style={{ display: 'block', width: '16px', height: '1.5px', background: 'var(--color-muted)' }} />
        </button>
      </div>

      {/* Watchlist content */}
      <div style={{ flex: 1, overflowY: 'auto', background: 'var(--color-surface)' }}>
        {isLoggedIn && (
          <>
            <div
              onClick={e => { e.stopPropagation(); hasWatchlist && setWlExpanded(prev => !prev); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 12px 6px',
                cursor: hasWatchlist ? 'pointer' : 'default',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
              }}
            >
              <span style={{
                fontSize: '10px',
                color: 'var(--color-muted)',
                opacity: open ? 1 : 0,
                transition: 'opacity 0.2s',
              }}>
                // watchlist
              </span>
              {hasWatchlist && open && (
                <span style={{ fontSize: '10px', color: 'var(--color-muted)' }}>
                  {wlExpanded ? '⌃' : '⌄'}
                </span>
              )}
            </div>

            {/* Watchlist items */}
            {hasWatchlist && wlExpanded && (
              <div>
                {watchlist.map(item => (
                  <div
                    key={item.symbol}
                    onClick={e => { e.stopPropagation(); onSymbolClick(item.symbol); }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: open ? '7px 12px' : '0',
                      height: open ? 'auto' : '0',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <span style={{ fontSize: '11px', color: 'var(--color-accent)', fontWeight: 'bold', minWidth: '36px' }}>
                      {item.symbol}
                    </span>
                    {open && (
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {item.price !== undefined && (
                          <span style={{ fontSize: '11px', color: 'var(--color-text)' }}>
                            ${item.price.toFixed(2)}
                          </span>
                        )}
                        {item.changePercent !== undefined && (
                          <span style={{
                            fontSize: '10px',
                            color: item.changePercent >= 0 ? 'var(--color-positive)' : 'var(--color-negative)',
                          }}>
                            {item.changePercent >= 0 ? '+' : ''}{item.changePercent.toFixed(2)}%
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Empty watchlist */}
            {!hasWatchlist && open && (
              <div style={{ padding: '10px 12px' }}>
                <div style={{ fontSize: '10px', color: 'var(--color-muted)', lineHeight: '1.8' }}>
                  // empty<br />add a stock to track
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Bottom buttons */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          padding: '0',
          borderTop: '3px solid #1f1f1f',
          background: 'var(--color-surface)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0',
          flexShrink: 0,
        }}
      >
        {!isLoggedIn
          ? iconBtn(onLoginClick, <LoginIcon />, 'login', 'var(--color-accent)', 'login')
          : <>
              {iconBtn(onSettingsClick, <GearIcon />, 'settings', 'var(--color-muted)', 'settings')}
              {iconBtn(onLogout, <LogoutIcon />, 'logout', 'var(--color-negative)', 'logout')}
            </>
        }
      </div>
    </div>
  );
}