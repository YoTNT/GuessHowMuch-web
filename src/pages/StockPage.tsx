import { useEffect, useState } from 'react';
import { useStock } from '../hooks/useStock';
import { QuoteCard } from '../components/QuoteCard';
import { PredictionCard } from '../components/PredictionCard';
import { NewsCard } from '../components/NewsCard';
import { IndicatorsCard } from '../components/IndicatorsCard';
import { QuoteCardSkeleton, IndicatorsCardSkeleton, NewsCardSkeleton } from '../components/Skeleton';
import { Button } from '../components/Button';

interface StockPageProps {
  symbol: string;
  onBack: () => void;
}

export function StockPage({ symbol, onBack }: StockPageProps) {
  const { snapshot, news, predictions, loading, error, fetchStock, generatePrediction } = useStock();
  const [generating, setGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [generateSuccess, setGenerateSuccess] = useState(false);

  useEffect(() => {
    fetchStock(symbol);
  }, [symbol, fetchStock]);

  const handleGeneratePrediction = async () => {
    setGenerating(true);
    setGenerateError(null);
    setGenerateSuccess(false);

    try {
      await generatePrediction(symbol);
      setGenerateSuccess(true);
      // Clear success message after 3 seconds
      setTimeout(() => setGenerateSuccess(false), 3000);
    } catch (err) {
      setGenerateError(
        err instanceof Error ? err.message : 'Failed to generate prediction'
      );
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div>
      {/* Back button */}
      <div style={{ marginBottom: '24px' }}>
        <Button variant="secondary" onClick={onBack}>
          &lt; back
        </Button>
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
          <Button onClick={() => fetchStock(symbol)} variant="primary">
            retry
          </Button>
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
              <Button
                onClick={handleGeneratePrediction}
                disabled={loading}
                loading={generating}
                loadingText="generating..."
              >
                + generate
              </Button>
            </div>

            {/* Generate error */}
            {generateError && (
              <div
                style={{
                  border: '1px solid var(--color-negative)',
                  backgroundColor: 'rgba(255, 68, 68, 0.05)',
                  padding: '10px 12px',
                  borderRadius: '4px',
                  marginBottom: '12px',
                  fontSize: '12px',
                  color: 'var(--color-negative)',
                }}
              >
                [ERROR] {generateError}
              </div>
            )}

            {/* Generate success */}
            {generateSuccess && (
              <div
                style={{
                  border: '1px solid var(--color-positive)',
                  backgroundColor: 'rgba(0, 255, 136, 0.05)',
                  padding: '10px 12px',
                  borderRadius: '4px',
                  marginBottom: '12px',
                  fontSize: '12px',
                  color: 'var(--color-positive)',
                }}
              >
                [OK] Prediction generated successfully
              </div>
            )}

            {!loading && !generating && predictions.length === 0 && (
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