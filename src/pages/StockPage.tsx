import { useEffect, useState } from 'react';
import { useStock } from '../hooks/useStock';
import { QuoteCard } from '../components/QuoteCard';
import { PredictionCard } from '../components/PredictionCard';
import { NewsCard } from '../components/NewsCard';
import { IndicatorsCard } from '../components/IndicatorsCard';
import { QuoteCardSkeleton, IndicatorsCardSkeleton, NewsCardSkeleton } from '../components/Skeleton';
import { Button } from '../components/Button';
import type { UserProfile } from '../api/client';

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
  const { snapshot, news, predictions, loading, error, fetchStock, generatePrediction } = useStock();
  const [generating, setGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [generateSuccess, setGenerateSuccess] = useState(false);
  const [addingToWatchlist, setAddingToWatchlist] = useState(false);
  const [watchlistError, setWatchlistError] = useState<string | null>(null);
  const [inWatchlist, setInWatchlist] = useState(isInWatchlist);

  useEffect(() => {
    fetchStock(symbol);
  }, [symbol, fetchStock]);

  useEffect(() => {
    setInWatchlist(isInWatchlist);
  }, [isInWatchlist]);

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

  const hasAnthropicKey = !!user?.apiKeys?.anthropic;

  // ── Prediction panel content ──────────────────────────────
  const renderPredictionPanel = () => {
    // Not logged in
    if (!isLoggedIn) {
      return (
        <div style={{
          border: '1px solid var(--color-border)',
          borderRadius: '4px',
          padding: '16px',
          fontSize: '12px',
        }}>
          <div style={{ color: 'var(--color-muted)', marginBottom: '12px' }}>
            # Login and provide your API keys to generate AI predictions
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button onClick={onLoginClick}>login</Button>
          </div>
        </div>
      );
    }

    // Logged in but no Anthropic key
    if (!hasAnthropicKey) {
      return (
        <div style={{
          border: '1px solid var(--color-border)',
          borderRadius: '4px',
          padding: '16px',
          fontSize: '12px',
        }}>
          <div style={{ color: 'var(--color-muted)', marginBottom: '12px' }}>
            # Add your Anthropic API key to unlock AI predictions
          </div>
          <Button variant="secondary" onClick={onSettingsClick}>
            go to settings →
          </Button>
        </div>
      );
    }

    // Logged in, has key, not in watchlist
    if (!inWatchlist) {
      return (
        <div style={{
          border: '1px solid var(--color-border)',
          borderRadius: '4px',
          padding: '16px',
          fontSize: '12px',
        }}>
          <div style={{ color: 'var(--color-muted)', marginBottom: '12px' }}>
            # Add {symbol} to your watchlist to generate predictions
          </div>
          <Button onClick={handleAddToWatchlist} loading={addingToWatchlist} loadingText="adding">
            + add to watchlist
          </Button>
        </div>
      );
    }

    // Full access
    return (
      <>
        {generateError && (
          <div style={{
            border: '1px solid var(--color-negative)',
            backgroundColor: 'rgba(255, 68, 68, 0.05)',
            padding: '10px 12px',
            borderRadius: '4px',
            marginBottom: '12px',
            fontSize: '12px',
            color: 'var(--color-negative)',
          }}>
            [ERROR] {generateError}
          </div>
        )}
        {generateSuccess && (
          <div style={{
            border: '1px solid var(--color-positive)',
            backgroundColor: 'rgba(0, 255, 136, 0.05)',
            padding: '10px 12px',
            borderRadius: '4px',
            marginBottom: '12px',
            fontSize: '12px',
            color: 'var(--color-positive)',
          }}>
            [OK] Prediction generated successfully
          </div>
        )}
        {!loading && predictions.length === 0 && (
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
        <Button variant="secondary" onClick={onBack}>
          &lt; back
        </Button>
      </div>

      {/* Header */}
      <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <span style={{ color: 'var(--color-accent)', fontSize: '24px', fontWeight: 'bold' }}>
          $ analyze {symbol}
        </span>
        {isLoggedIn && !inWatchlist && (
          <Button
            variant="primary"
            onClick={handleAddToWatchlist}
            loading={addingToWatchlist}
            loadingText="adding"
          >
            + add to watchlist
          </Button>
        )}
        {isLoggedIn && inWatchlist && (
          <span style={{ color: 'var(--color-muted)', fontSize: '11px' }}>
            [in watchlist]
          </span>
        )}
      </div>

      {/* Watchlist error */}
      {watchlistError && (
        <div style={{ color: 'var(--color-negative)', fontSize: '12px', marginBottom: '12px' }}>
          [ERROR] {watchlistError}
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{
          border: '1px solid var(--color-negative)',
          backgroundColor: 'rgba(255, 68, 68, 0.05)',
          padding: '16px',
          borderRadius: '4px',
          marginBottom: '16px',
        }}>
          <div style={{ color: 'var(--color-negative)', fontSize: '12px', marginBottom: '8px' }}>
            [ERROR] {error}
          </div>
          <div style={{ color: 'var(--color-muted)', fontSize: '11px', marginBottom: '12px' }}>
            {error.includes('rate limit')
              ? 'Alpha Vantage free tier allows 5 requests per minute. Please wait a moment and try again.'
              : 'Something went wrong. Please try again.'}
          </div>
          <Button onClick={() => fetchStock(symbol)}>retry</Button>
        </div>
      )}

      {/* Content */}
      {!error && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {/* Left */}
          <div>
            <div style={{ color: 'var(--color-muted)', fontSize: '11px', marginBottom: '8px' }}>
              // quote
            </div>
            {loading ? <QuoteCardSkeleton /> : snapshot && <QuoteCard quote={snapshot.quote} />}

            <div style={{ color: 'var(--color-muted)', fontSize: '11px', marginBottom: '8px', marginTop: '16px' }}>
              // indicators
            </div>
            {loading ? <IndicatorsCardSkeleton /> : snapshot?.indicators && <IndicatorsCard indicators={snapshot.indicators} />}

            <div style={{ color: 'var(--color-muted)', fontSize: '11px', marginBottom: '8px', marginTop: '16px' }}>
              // news sentiment
            </div>
            {loading ? <NewsCardSkeleton /> : <NewsCard articles={news} />}
          </div>

          {/* Right */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ color: 'var(--color-muted)', fontSize: '11px' }}>
                // predictions
              </span>
              {isLoggedIn && inWatchlist && hasAnthropicKey && (
                <Button
                  onClick={handleGeneratePrediction}
                  disabled={loading}
                  loading={generating}
                  loadingText="generating"
                >
                  + generate
                </Button>
              )}
            </div>
            {renderPredictionPanel()}
          </div>
        </div>
      )}
    </div>
  );
}