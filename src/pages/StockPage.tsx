import { useEffect, useState } from 'react';
import { useStock } from '../hooks/useStock';
import { QuoteCard } from '../components/QuoteCard';
import { PredictionCard } from '../components/PredictionCard';
import { NewsCard } from '../components/NewsCard';
import { IndicatorsCard } from '../components/IndicatorsCard';
import { QuoteCardSkeleton, IndicatorsCardSkeleton, NewsCardSkeleton } from '../components/Skeleton';
import { Button } from '../components/Button';
import type { UserProfile } from '../api/client';
import { isDemoSymbol } from '../utils/demo';

interface StockPageProps {
  symbol: string;
  onBack: () => void;
  isLoggedIn: boolean;
  isInWatchlist: boolean;
  onAddToWatchlist: () => Promise<boolean>;
  onLoginClick: () => void;
  onSettingsClick: () => void;
  user: UserProfile | null;
}

export function StockPage({
  symbol,
  onBack,
  isLoggedIn,
  isInWatchlist,
  onAddToWatchlist,
  onLoginClick,
  onSettingsClick,
  user,
}: StockPageProps) {
  const {
    snapshot, news, predictions,
    snapshotLoading, newsLoading,
    snapshotError, newsError,
    retrySnapshot, retryNews,
    generatePrediction,
    fetchStock,
  } = useStock();

  const [generating, setGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [generateSuccess, setGenerateSuccess] = useState(false);
  const [addingToWatchlist, setAddingToWatchlist] = useState(false);
  const [watchlistError, setWatchlistError] = useState<string | null>(null);
  const [inWatchlist, setInWatchlist] = useState(isInWatchlist);

  const isDemo = isDemoSymbol(symbol);

  useEffect(() => {
    fetchStock(symbol);
  }, [symbol, fetchStock]);

  useEffect(() => {
    setInWatchlist(isInWatchlist);
  }, [isInWatchlist]);

  const hasAlphaVantageKey = !!user?.apiKeys?.alphaVantage;
  const hasAnthropicKey = !!user?.apiKeys?.anthropic;
  const hasNewsApiKey = !!user?.apiKeys?.newsApi;

  const handleAddToWatchlist = async () => {
    setAddingToWatchlist(true);
    setWatchlistError(null);
    try {
      const success = await onAddToWatchlist();
      if (success) setInWatchlist(true);
      else setWatchlistError('Failed to add to watchlist');
    } catch {
      setWatchlistError('Failed to add to watchlist');
    } finally {
      setAddingToWatchlist(false);
    }
  };

  const handleGeneratePrediction = async () => {
    setGenerating(true);
    setGenerateError(null);
    setGenerateSuccess(false);
    try {
      await generatePrediction(symbol);
      setGenerateSuccess(true);
      setTimeout(() => setGenerateSuccess(false), 3000);
    } catch (err) {
      setGenerateError(err instanceof Error ? err.message : 'Failed to generate prediction');
    } finally {
      setGenerating(false);
    }
  };

  // ── Inline error block ────────────────────────────────────
  const renderError = (message: string, onRetry: () => void) => (
    <div style={{
      border: '1px solid var(--color-negative)',
      backgroundColor: 'rgba(255, 68, 68, 0.05)',
      padding: '12px',
      borderRadius: '4px',
      marginBottom: '12px',
    }}>
      <div style={{ color: 'var(--color-negative)', fontSize: '12px', marginBottom: '8px' }}>
        {message.includes('rate limit')
          ? '[ERROR] rate limit reached — please wait a moment'
          : `[ERROR] ${message}`}
      </div>
      {message.includes('rate limit') && (
        <div style={{ color: 'var(--color-muted)', fontSize: '11px', marginBottom: '8px' }}>
          Alpha Vantage free tier allows 5 requests per minute.
        </div>
      )}
      <Button onClick={onRetry}>retry</Button>
    </div>
  );

  // ── Prediction panel ──────────────────────────────────────
  const renderPredictionPanel = () => {
    // Demo symbols — all users can generate predictions using system keys
    if (isDemo) {
      return (
        <>
          {generateError && (
            <div style={{ border: '1px solid var(--color-negative)', backgroundColor: 'rgba(255, 68, 68, 0.05)', padding: '10px 12px', borderRadius: '4px', marginBottom: '12px', fontSize: '12px', color: 'var(--color-negative)' }}>
              [ERROR] {generateError}
            </div>
          )}
          {generateSuccess && (
            <div style={{ border: '1px solid var(--color-positive)', backgroundColor: 'rgba(0, 255, 136, 0.05)', padding: '10px 12px', borderRadius: '4px', marginBottom: '12px', fontSize: '12px', color: 'var(--color-positive)' }}>
              [OK] Prediction generated successfully
            </div>
          )}
          {!snapshotLoading && predictions.length === 0 && (
            <div style={{
              border: '1px solid var(--color-border)',
              borderRadius: '4px',
              padding: '16px',
              fontSize: '12px',
              marginBottom: '12px',
            }}>
              <div style={{ color: 'var(--color-muted)', marginBottom: '8px' }}>
                # free demo — AI prediction for {symbol} is available at no cost
              </div>
              <div style={{ color: 'var(--color-muted)', fontSize: '11px' }}>
                click generate to see tomorrow's price prediction
              </div>
            </div>
          )}
          {predictions.map(prediction => (
            <PredictionCard key={prediction.id} prediction={prediction} />
          ))}
        </>
      );
    }

    // Non-demo symbols — original BYOK logic
    if (!isLoggedIn) {
      return (
        <div style={{ border: '1px solid var(--color-border)', borderRadius: '4px', padding: '16px', fontSize: '12px' }}>
          <div style={{ color: 'var(--color-muted)', marginBottom: '12px' }}>
            # Login and provide your API keys to generate AI predictions
          </div>
          <Button onClick={onLoginClick}>login</Button>
        </div>
      );
    }

    if (!hasAnthropicKey) {
      return (
        <div style={{ border: '1px solid var(--color-border)', borderRadius: '4px', padding: '16px', fontSize: '12px' }}>
          <div style={{ color: 'var(--color-muted)', marginBottom: '12px' }}>
            # Add your Anthropic API key to unlock AI predictions
          </div>
          <Button variant="secondary" onClick={onSettingsClick}>
            go to settings →
          </Button>
        </div>
      );
    }

    if (!inWatchlist) {
      return (
        <div style={{ border: '1px solid var(--color-border)', borderRadius: '4px', padding: '16px', fontSize: '12px' }}>
          <div style={{ color: 'var(--color-muted)', marginBottom: '12px' }}>
            # Add {symbol} to your watchlist to generate predictions
          </div>
          <Button onClick={handleAddToWatchlist} loading={addingToWatchlist} loadingText="adding">
            + add to watchlist
          </Button>
        </div>
      );
    }

    return (
      <>
        {generateError && (
          <div style={{ border: '1px solid var(--color-negative)', backgroundColor: 'rgba(255, 68, 68, 0.05)', padding: '10px 12px', borderRadius: '4px', marginBottom: '12px', fontSize: '12px', color: 'var(--color-negative)' }}>
            [ERROR] {generateError}
          </div>
        )}
        {generateSuccess && (
          <div style={{ border: '1px solid var(--color-positive)', backgroundColor: 'rgba(0, 255, 136, 0.05)', padding: '10px 12px', borderRadius: '4px', marginBottom: '12px', fontSize: '12px', color: 'var(--color-positive)' }}>
            [OK] Prediction generated successfully
          </div>
        )}
        {!snapshotLoading && predictions.length === 0 && (
          <div style={{ color: 'var(--color-muted)', fontSize: '12px', marginBottom: '12px' }}>
            no predictions yet — click generate
          </div>
        )}
        {predictions.map(prediction => (
          <PredictionCard key={prediction.id} prediction={prediction} />
        ))}
      </>
    );
  };

  return (
    <div>
      {/* Back */}
      <div style={{ marginBottom: '24px' }}>
        <Button variant="secondary" onClick={onBack}>&lt; back</Button>
      </div>

      {/* Header */}
      <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <span style={{ color: 'var(--color-accent)', fontSize: '24px', fontWeight: 'bold' }}>
          $ analyze {symbol}
        </span>
        {isLoggedIn && !inWatchlist && !isDemo && (
          <Button variant="primary" onClick={handleAddToWatchlist} loading={addingToWatchlist} loadingText="adding">
            + add to watchlist
          </Button>
        )}
        {isLoggedIn && inWatchlist && (
          <span style={{ color: 'var(--color-muted)', fontSize: '11px' }}>[in watchlist]</span>
        )}
        {isDemo && (
          <span style={{ color: 'var(--color-muted)', fontSize: '11px' }}>[demo]</span>
        )}
      </div>

      {/* Watchlist error */}
      {watchlistError && (
        <div style={{ color: 'var(--color-negative)', fontSize: '12px', marginBottom: '12px' }}>
          [ERROR] {watchlistError}
        </div>
      )}

      {/* Alpha Vantage key missing banner — not shown for demo symbols */}
      {isLoggedIn && !hasAlphaVantageKey && !snapshotError && !isDemo && (
        <div style={{ border: '1px solid var(--color-border)', backgroundColor: 'rgba(255, 255, 255, 0.02)', padding: '10px 12px', borderRadius: '4px', marginBottom: '16px', fontSize: '11px', color: 'var(--color-muted)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>[INFO] using shared API quota — add your Alpha Vantage key in Settings for better rate limits</span>
          <button
            onClick={onSettingsClick}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-accent)', fontSize: '11px', fontFamily: 'var(--font-mono)', padding: '0', marginLeft: '12px', whiteSpace: 'nowrap' }}
          >
            settings →
          </button>
        </div>
      )}

      {/* Content */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>

        {/* Left column — quote, indicators, news */}
        <div>
          {/* Quote */}
          <div style={{ color: 'var(--color-muted)', fontSize: '11px', marginBottom: '8px' }}>// quote</div>
          {snapshotLoading
            ? <QuoteCardSkeleton />
            : snapshotError
              ? renderError(
                  snapshotError.includes('API key required') && !isLoggedIn
                    ? 'Stock data temporarily unavailable. Login with your own API key for better access.'
                    : snapshotError,
                  () => retrySnapshot(symbol)
                )
              : snapshot && <QuoteCard quote={snapshot.quote} />
          }

          {/* Indicators */}
          {!snapshotError && (
            <>
              <div style={{ color: 'var(--color-muted)', fontSize: '11px', marginBottom: '8px', marginTop: '16px' }}>// indicators</div>
              {snapshotLoading
                ? <IndicatorsCardSkeleton />
                : snapshot?.indicators && <IndicatorsCard indicators={snapshot.indicators} />
              }
            </>
          )}

          {/* News — not shown for demo symbols without NewsAPI key */}
          <div style={{ color: 'var(--color-muted)', fontSize: '11px', marginBottom: '8px', marginTop: '16px' }}>// news sentiment</div>
          {newsLoading ? (
            <NewsCardSkeleton />
          ) : newsError ? (
            renderError(newsError, () => retryNews(symbol))
          ) : isLoggedIn && !hasNewsApiKey && !isDemo ? (
            <div style={{ border: '1px solid var(--color-border)', borderRadius: '4px', padding: '16px', fontSize: '11px' }}>
              <div style={{ color: 'var(--color-muted)', marginBottom: '10px' }}>
                [INFO] add your NewsAPI key to unlock news sentiment analysis
              </div>
              <button
                onClick={onSettingsClick}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-accent)', fontSize: '11px', fontFamily: 'var(--font-mono)', padding: '0' }}
              >
                settings →
              </button>
            </div>
          ) : (
            <NewsCard articles={news} />
          )}
        </div>

        {/* Right column — predictions */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ color: 'var(--color-muted)', fontSize: '11px' }}>// predictions</span>
            {/* Demo symbols — always show generate button */}
            {isDemo && (
              <Button onClick={handleGeneratePrediction} disabled={snapshotLoading} loading={generating} loadingText="generating">
                + generate
              </Button>
            )}
            {/* Non-demo symbols — only show for logged in users with watchlist + Anthropic key */}
            {!isDemo && isLoggedIn && inWatchlist && hasAnthropicKey && (
              <Button onClick={handleGeneratePrediction} disabled={snapshotLoading} loading={generating} loadingText="generating">
                + generate
              </Button>
            )}
          </div>
          {renderPredictionPanel()}
        </div>
      </div>
    </div>
  );
}