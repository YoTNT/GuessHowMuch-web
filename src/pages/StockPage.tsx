import { useEffect } from 'react';
import { useStock } from '../hooks/useStock';
import { QuoteCard } from '../components/QuoteCard';
import { PredictionCard } from '../components/PredictionCard';
import { NewsCard } from '../components/NewsCard';
import { IndicatorsCard } from '../components/IndicatorsCard';
import { QuoteCardSkeleton, IndicatorsCardSkeleton, NewsCardSkeleton } from '../components/Skeleton';

interface StockPageProps {
  symbol: string;
  onBack: () => void;
}

export function StockPage({ symbol, onBack }: StockPageProps) {
  const { snapshot, news, predictions, loading, error, fetchStock, generatePrediction } = useStock();

  useEffect(() => {
    fetchStock(symbol);
  }, [symbol, fetchStock]);

  const handleGeneratePrediction = async () => {
    try {
      await generatePrediction(symbol);
    } catch (err) {
      console.error('Failed to generate prediction:', err);
    }
  };

  return (
    <div>
      {/* Back button */}
      <div style={{ marginBottom: '24px' }}>
        <button
          onClick={onBack}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--color-muted)',
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            cursor: 'pointer',
            padding: '0',
          }}
        >
          &lt; back
        </button>
      </div>

      {/* Symbol header */}
      <div style={{ marginBottom: '24px' }}>
        <span style={{ color: 'var(--color-accent)', fontSize: '24px', fontWeight: 'bold' }}>
          $ analyze {symbol}
        </span>
      </div>

      {/* Error */}
      {error && (
        <div
          style={{
            border: '1px solid var(--color-negative)',
            backgroundColor: 'rgba(255, 68, 68, 0.05)',
            padding: '16px',
            borderRadius: '4px',
            marginBottom: '16px',
          }}
        >
          <div style={{ color: 'var(--color-negative)', fontSize: '12px', marginBottom: '8px' }}>
            [ERROR] {error}
          </div>
          <div style={{ color: 'var(--color-muted)', fontSize: '11px', marginBottom: '12px' }}>
            {error.includes('rate limit')
              ? 'Alpha Vantage free tier allows 5 requests per minute. Please wait a moment and try again.'
              : 'Something went wrong. Please try again.'}
          </div>
          <button
            onClick={() => fetchStock(symbol)}
            style={{
              background: 'transparent',
              border: '1px solid var(--color-border)',
              color: 'var(--color-accent)',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              padding: '4px 12px',
              borderRadius: '2px',
              cursor: 'pointer',
            }}
          >
            retry
          </button>
        </div>
      )}

      {/* Content — only show when no error */}
      {!error && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {/* Left column */}
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

          {/* Right column */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ color: 'var(--color-muted)', fontSize: '11px' }}>
                // predictions
              </span>
              <button
                onClick={handleGeneratePrediction}
                disabled={loading}
                style={{
                  background: 'transparent',
                  border: '1px solid var(--color-border)',
                  color: loading ? 'var(--color-muted)' : 'var(--color-accent)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  padding: '4px 10px',
                  borderRadius: '2px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                }}
              >
                + generate
              </button>
            </div>

            {!loading && predictions.length === 0 && (
              <div style={{ color: 'var(--color-muted)', fontSize: '12px' }}>
                no predictions yet — click generate
              </div>
            )}

            {predictions.map(prediction => (
              <PredictionCard key={prediction.id} prediction={prediction} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}