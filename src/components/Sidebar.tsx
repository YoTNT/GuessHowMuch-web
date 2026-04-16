import { useState } from 'react';
import type { UserProfile } from '../api/client';
import type { AccuracyEntry, AccuracySummary } from '../types'
import { api } from '../api/client';

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
  onVerifyClick: () => void;
}

export function Sidebar({
  user,
  isLoggedIn,
  watchlist,
  onLoginClick,
  onLogout,
  onSettingsClick,
  onSymbolClick,
  onVerifyClick,
}: SidebarProps) {
  const [open, setOpen] = useState(false);
  const [wlExpanded, setWlExpanded] = useState(true);
  const [tooltip, setTooltip] = useState<{ text: string; y: number } | null>(null);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState<AccuracyEntry[] | null>(null);
  const [summaryData, setSummaryData] = useState<AccuracySummary | null>(null);
  const [leaderboardLoading, setLeaderboardLoading] = useState(false);

  const hasWatchlist = isLoggedIn && watchlist.length > 0;
  const needsVerification = isLoggedIn && user && !user.emailVerified;
  const gearColor = needsVerification ? '#cc8800' : 'var(--color-muted)';

  const handleOpenLeaderboard = async () => {
    setShowLeaderboard(true);
    setTooltip(null);
    if (leaderboardData) return; // already loaded
    setLeaderboardLoading(true);
    try {
      const [summary, entries] = await Promise.all([
        api.getAccuracySummary(),
        api.getAccuracyLeaderboard(),
      ]);
      setSummaryData(summary);
      setLeaderboardData(entries);
    } catch {
      setLeaderboardData([]);
    } finally {
      setLeaderboardLoading(false);
    }
  };

  const AccuracyIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <polyline points="2,11 6,7 9,10 14,4" stroke="var(--color-positive)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="14" cy="4" r="1.5" fill="var(--color-positive)"/>
    </svg>
  );

  const GearIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6" stroke={gearColor} strokeWidth="1.2"/>
      <circle cx="8" cy="8" r="2.5" stroke={gearColor} strokeWidth="1.2"/>
      <line x1="8" y1="1" x2="8" y2="3" stroke={gearColor} strokeWidth="1.2"/>
      <line x1="8" y1="13" x2="8" y2="15" stroke={gearColor} strokeWidth="1.2"/>
      <line x1="1" y1="8" x2="3" y2="8" stroke={gearColor} strokeWidth="1.2"/>
      <line x1="13" y1="8" x2="15" y2="8" stroke={gearColor} strokeWidth="1.2"/>
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

  const VerifyIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 2L14 13H2L8 2Z" stroke="#cc8800" strokeWidth="1.2" strokeLinejoin="round"/>
      <line x1="8" y1="7" x2="8" y2="10" stroke="#cc8800" strokeWidth="1.2" strokeLinecap="round"/>
      <circle cx="8" cy="12" r="0.5" fill="#cc8800" stroke="#cc8800" strokeWidth="0.5"/>
    </svg>
  );

  const iconBtn = (
    onClick: () => void,
    icon: React.ReactNode,
    label: string,
    color: string,
    tooltipText: string,
  ) => (
    <div
      style={{ position: 'relative' }}
      onMouseEnter={e => {
        if (!open) {
          const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
          setTooltip({ text: tooltipText, y: rect.top + rect.height / 2 });
        }
      }}
      onMouseLeave={() => setTooltip(null)}
    >
      <button
        onClick={e => { e.stopPropagation(); onClick(); }}
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
    </div>
  );

  const accuracyColor = (acc: number) =>
    acc >= 0.6 ? 'var(--color-positive)' : acc >= 0.5 ? '#cc8800' : 'var(--color-negative)';

  return (
    <>
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
              {needsVerification && open && (
                <div style={{
                  margin: '10px 12px',
                  padding: '8px 10px',
                  border: '1px solid #cc8800',
                  borderRadius: '2px',
                  fontSize: '10px',
                  color: '#cc8800',
                  lineHeight: '1.8',
                }}>
                  <div style={{ marginBottom: '4px' }}>⚠ email not verified</div>
                  <div style={{ color: 'var(--color-muted)' }}>
                    verify to unlock watchlist, settings, and predictions.
                  </div>
                </div>
              )}

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

              {!hasWatchlist && open && (
                <div style={{ padding: '10px 12px' }}>
                  <div style={{ fontSize: '10px', color: 'var(--color-muted)', lineHeight: '1.8' }}>
                    {needsVerification
                      ? '// verify email to\nuse watchlist'
                      : '// empty\nadd a stock to track'}
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
          {/* Accuracy leaderboard — always first, always green */}
          {iconBtn(
            handleOpenLeaderboard,
            <AccuracyIcon />,
            'accuracy',
            'var(--color-positive)',
            'prediction accuracy leaderboard',
          )}

          {!isLoggedIn
            ? iconBtn(onLoginClick, <LoginIcon />, 'login', 'var(--color-accent)', 'login')
            : <>
                {needsVerification && iconBtn(
                  onVerifyClick,
                  <VerifyIcon />,
                  'verify email',
                  '#cc8800',
                  'verify your email to unlock all features',
                )}
                {iconBtn(
                  onSettingsClick,
                  <GearIcon />,
                  'settings',
                  gearColor,
                  needsVerification ? 'verify email to access settings' : 'settings',
                )}
                {iconBtn(onLogout, <LogoutIcon />, 'logout', 'var(--color-negative)', 'logout')}
              </>
          }
        </div>

        {/* Tooltip */}
        {tooltip && !open && (
          <div style={{
            position: 'fixed',
            left: '56px',
            top: tooltip.y,
            transform: 'translateY(-50%)',
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: '2px',
            padding: '4px 10px',
            fontSize: '11px',
            fontFamily: 'var(--font-mono)',
            color: 'var(--color-muted)',
            whiteSpace: 'nowrap',
            zIndex: 200,
            pointerEvents: 'none',
          }}>
            {tooltip.text}
          </div>
        )}
      </div>

      {/* Accuracy Leaderboard Modal */}
      {showLeaderboard && (
        <div
          onClick={() => setShowLeaderboard(false)}
          style={{
            position: 'fixed', inset: 0,
            backgroundColor: 'rgba(0,0,0,0.7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 100,
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: '4px',
              padding: '24px',
              width: '100%',
              maxWidth: '360px',
              fontFamily: 'var(--font-mono)',
            }}
          >
            {/* Header */}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
              marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid var(--color-border)',
            }}>
              <div>
                <div style={{ color: 'var(--color-positive)', fontSize: '14px', fontWeight: 'bold', marginBottom: '2px' }}>
                  $ accuracy leaderboard
                </div>
                <div style={{ color: 'var(--color-muted)', fontSize: '10px' }}>
                  prediction accuracy by symbol
                </div>
              </div>
              <button
                onClick={() => setShowLeaderboard(false)}
                style={{
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  color: 'var(--color-muted)', fontFamily: 'var(--font-mono)',
                  fontSize: '11px', padding: '2px 6px',
                }}
              >
                [x]
              </button>
            </div>

            {leaderboardLoading ? (
              <div style={{ color: 'var(--color-muted)', fontSize: '12px', textAlign: 'center', padding: '24px 0' }}>
                loading...
              </div>
            ) : (
              <>
                {/* Summary cards */}
                {summaryData && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '20px' }}>
                    <div style={{
                      backgroundColor: 'var(--color-bg)',
                      border: '1px solid var(--color-border)',
                      borderRadius: '2px', padding: '10px', textAlign: 'center',
                    }}>
                      <div style={{ color: 'var(--color-muted)', fontSize: '9px', marginBottom: '4px' }}>overall accuracy</div>
                      <div style={{ color: 'var(--color-positive)', fontSize: '18px', fontWeight: 'bold' }}>
                        {(summaryData.overallAccuracy * 100).toFixed(1)}%
                      </div>
                    </div>
                    <div style={{
                      backgroundColor: 'var(--color-bg)',
                      border: '1px solid var(--color-border)',
                      borderRadius: '2px', padding: '10px', textAlign: 'center',
                    }}>
                      <div style={{ color: 'var(--color-muted)', fontSize: '9px', marginBottom: '4px' }}>best symbol</div>
                      <div style={{ color: 'var(--color-positive)', fontSize: '14px', fontWeight: 'bold' }}>
                        {summaryData.bestSymbol ?? '—'}
                      </div>
                      {summaryData.bestSymbol && leaderboardData && (
                        <div style={{ color: 'var(--color-muted)', fontSize: '9px' }}>
                          {((leaderboardData.find(e => e.symbol === summaryData.bestSymbol)?.accuracy ?? 0) * 100).toFixed(1)}%
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Table header */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '24px 56px 1fr 56px',
                  padding: '5px 8px',
                  borderBottom: '1px solid var(--color-border)',
                }}>
                  <span style={{ color: 'var(--color-muted)', fontSize: '9px' }}>#</span>
                  <span style={{ color: 'var(--color-muted)', fontSize: '9px' }}>symbol</span>
                  <span></span>
                  <span style={{ color: 'var(--color-muted)', fontSize: '9px', textAlign: 'right' }}>accuracy</span>
                </div>

                {/* Rows */}
                {(() => {
                  const qualified = (leaderboardData ?? []).filter(item => item.totalPredictions >= 5);
                  if (qualified.length === 0) {
                    return (
                      <div style={{
                        padding: '16px 8px',
                        color: 'var(--color-muted)',
                        fontSize: '10px',
                        textAlign: 'center',
                        lineHeight: '1.8',
                      }}>
                        // no symbols qualify yet<br />
                        need at least 5 predictions per symbol
                      </div>
                    );
                  }
                  return qualified.map((item, i) => {
                    const color = accuracyColor(item.accuracy);
                    const bg = i % 2 === 0 ? 'var(--color-bg)' : 'var(--color-surface)';
                    return (
                      <div
                        key={item.symbol}
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '24px 56px 1fr 56px',
                          alignItems: 'center',
                          padding: '7px 8px',
                          backgroundColor: bg,
                        }}
                      >
                        <span style={{ color: 'var(--color-muted)', fontSize: '10px' }}>{i + 1}</span>
                        <span style={{ color: 'var(--color-accent)', fontSize: '11px', fontWeight: 'bold' }}>{item.symbol}</span>
                        <div style={{ height: '3px', background: 'var(--color-border)', borderRadius: '1px', overflow: 'hidden', margin: '0 8px' }}>
                          <div style={{ width: `${item.accuracy * 100}%`, height: '100%', background: color, borderRadius: '1px' }} />
                        </div>
                        <span style={{ color, fontSize: '11px', textAlign: 'right' }}>
                          {(item.accuracy * 100).toFixed(1)}%
                        </span>
                      </div>
                    );
                  });
                })()}

                {/* By prompt version */}
                {summaryData && Object.keys(summaryData.abTesting).length > 0 && (
                  <div style={{ marginTop: '20px' }}>
                    <div style={{
                      color: 'var(--color-muted)',
                      fontSize: '9px',
                      padding: '0 8px 6px',
                      borderBottom: '1px solid var(--color-border)',
                    }}>
                      // by prompt version
                    </div>

                    {Object.entries(summaryData.abTesting)
                      .sort(([, a], [, b]) => b.accuracy - a.accuracy)
                      .map(([version, stats], i) => {
                        const color = accuracyColor(stats.accuracy);
                        const bg = i % 2 === 0 ? 'var(--color-bg)' : 'var(--color-surface)';
                        const conf = stats.confidence;
                        const confColor =
                          conf === 'high' ? 'var(--color-positive)'
                          : conf === 'medium' ? '#cc8800'
                          : 'var(--color-negative)';
                        const confLabel =
                          conf === 'high' ? 'high confidence'
                          : conf === 'medium' ? 'medium confidence'
                          : 'low confidence · sample too small';

                        return (
                          <div
                            key={version}
                            style={{
                              padding: '7px 8px',
                              backgroundColor: bg,
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '3px',
                            }}
                          >
                            <div style={{
                              display: 'grid',
                              gridTemplateColumns: '1fr auto 56px',
                              alignItems: 'center',
                              gap: '8px',
                            }}>
                              <span style={{ color: 'var(--color-accent)', fontSize: '11px', fontWeight: 'bold' }}>
                                {version}
                              </span>
                              <span style={{ color: 'var(--color-muted)', fontSize: '10px' }}>
                                {stats.correct}/{stats.total}
                              </span>
                              <span style={{ color, fontSize: '11px', textAlign: 'right' }}>
                                {(stats.accuracy * 100).toFixed(1)}%
                              </span>
                            </div>
                            <div style={{
                              fontSize: '9px',
                              color: confColor,
                              paddingLeft: '2px',
                            }}>
                              {conf === 'low' ? '⚠ ' : '· '}{confLabel}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}

                {/* Footer */}
                <div style={{
                  marginTop: '16px', paddingTop: '12px',
                  borderTop: '1px solid var(--color-border)',
                  fontSize: '10px', color: 'var(--color-muted)', textAlign: 'center',
                  lineHeight: '1.8',
                }}>
                  <div>min. 5 predictions to qualify</div>
                  <div>updated daily · not financial advice</div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}