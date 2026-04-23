// ============================================================
// PredictionHistoryChart
//
// Line chart showing the last 7 days of predictions vs actuals.
// - Predicted line: dashed green (accent color at 55% opacity)
// - Actual line: solid white (text color)
// - Actual points: ring — green border if correct, red if wrong
// - Pending / unverified predictions are not shown
// ============================================================

import { useEffect, useState } from 'react';
import { api } from '../api/client';
import type { Prediction } from '../types';

interface PredictionHistoryChartProps {
  symbol: string;
}

interface VerifiedPoint {
  predictedFor: string;       // YYYY-MM-DD
  predictedPrice: number;
  actualPrice: number;
  wasCorrect: boolean;
}

/** How many recent verified predictions to display. */
const MAX_POINTS = 7;

/** SVG dimensions (viewBox). */
const SVG_W = 560;
const SVG_H = 180;
const PAD_L = 40;   // left padding for Y-axis labels
const PAD_R = 20;   // right padding
const PAD_T = 20;   // top padding
const PAD_B = 30;   // bottom padding for X-axis labels

export function PredictionHistoryChart({ symbol }: PredictionHistoryChartProps) {
  const [points, setPoints] = useState<VerifiedPoint[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(false);

    api.getPredictions(symbol)
      .then((preds: Prediction[]) => {
        if (cancelled) return;

        // Filter to verified only, sort newest first, take MAX_POINTS,
        // then reverse so the chart reads left→right = oldest→newest.
        const verified = preds
          .filter(p => p.verified && p.wasCorrect !== undefined && p.actualPrice !== undefined)
          .sort((a, b) => b.predictedFor.localeCompare(a.predictedFor))
          .slice(0, MAX_POINTS)
          .reverse()
          .map<VerifiedPoint>(p => ({
            predictedFor: p.predictedFor,
            predictedPrice: p.predictedPrice,
            actualPrice: p.actualPrice!,
            wasCorrect: p.wasCorrect!,
          }));

        setPoints(verified);
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setError(true);
        setLoading(false);
      });

    return () => { cancelled = true; };
  }, [symbol]);

  // ── Empty / loading / error states ──────────────────
  if (loading) {
    return (
      <div style={cardStyle}>
        <div style={loadingStyle}>loading prediction history...</div>
      </div>
    );
  }

  if (error || !points || points.length === 0) {
    // No card at all if no data — keeps UI clean
    return null;
  }

  // ── Compute scales ──────────────────────────────────
  // Y-axis range: include both predicted and actual, add small padding
  const allPrices = points.flatMap(p => [p.predictedPrice, p.actualPrice]);
  const rawMin = Math.min(...allPrices);
  const rawMax = Math.max(...allPrices);
  const range = rawMax - rawMin || 1;
  const yMin = rawMin - range * 0.1;
  const yMax = rawMax + range * 0.1;

  const chartW = SVG_W - PAD_L - PAD_R;
  const chartH = SVG_H - PAD_T - PAD_B;

  const xAt = (i: number) => {
    if (points.length === 1) return PAD_L + chartW / 2;
    return PAD_L + (i * chartW) / (points.length - 1);
  };
  const yAt = (price: number) => PAD_T + chartH - ((price - yMin) / (yMax - yMin)) * chartH;

  // ── Stats ───────────────────────────────────────────
  const correctCount = points.filter(p => p.wasCorrect).length;
  const totalCount = points.length;
  const accuracy = (correctCount / totalCount) * 100;

  // Accent color via CSS var; fallback to hard-coded
  const accuracyColor = accuracy >= 60 ? '#00ff88' : accuracy >= 45 ? '#ffaa00' : '#ff4444';

  // ── Subtitle text ───────────────────────────────────
  const subtitleRight = totalCount >= MAX_POINTS
    ? 'most recent right'
    : `${totalCount} day${totalCount > 1 ? 's' : ''} of verified history`;

  // ── Polyline points strings ─────────────────────────
  const predictedPoints = points.map((p, i) => `${xAt(i)},${yAt(p.predictedPrice)}`).join(' ');
  const actualPoints = points.map((p, i) => `${xAt(i)},${yAt(p.actualPrice)}`).join(' ');

  // ── Y-axis tick values (3 intermediate lines + bottom) ─
  const tickCount = 4;
  const ticks = Array.from({ length: tickCount }, (_, i) => {
    const price = yMin + ((yMax - yMin) * (tickCount - 1 - i)) / (tickCount - 1);
    return { price, y: yAt(price) };
  });

  // ── Date formatting ─────────────────────────────────
  const formatDate = (iso: string) => {
    // "2026-04-16" → "apr 16"
    const d = new Date(iso + 'T00:00:00');
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toLowerCase();
  };

  return (
    <div style={cardStyle}>
      {/* Header */}
      <div style={headStyle}>
        <span style={titleStyle}>// prediction history · last 7 days</span>
        <span style={{ ...accStyle, color: accuracyColor }}>
          {correctCount}/{totalCount} · {accuracy.toFixed(1)}%
        </span>
      </div>
      <div style={subStyle}>
        {symbol} · {subtitleRight}
      </div>

      {/* Chart */}
      <svg
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        width="100%"
        style={{ maxWidth: `${SVG_W}px`, display: 'block' }}
        role="img"
        aria-label={`Prediction history for ${symbol}`}
      >
        {/* Gridlines + Y-axis labels */}
        {ticks.map((t, i) => (
          <g key={i}>
            <line
              x1={PAD_L}
              y1={t.y}
              x2={SVG_W - PAD_R}
              y2={t.y}
              stroke="#1f1f1f"
              strokeWidth={1}
            />
            <text
              x={PAD_L - 6}
              y={t.y + 3}
              textAnchor="end"
              fill="#666666"
              fontSize="9"
              fontFamily="inherit"
            >
              {t.price.toFixed(0)}
            </text>
          </g>
        ))}

        {/* Bottom axis */}
        <line
          x1={PAD_L}
          y1={SVG_H - PAD_B}
          x2={SVG_W - PAD_R}
          y2={SVG_H - PAD_B}
          stroke="#2a2a2a"
          strokeWidth={1}
        />

        {/* Predicted line (dashed, muted green) */}
        <polyline
          fill="none"
          stroke="#00ff88"
          strokeWidth={1.3}
          strokeDasharray="4 3"
          opacity={0.55}
          points={predictedPoints}
        />

        {/* Actual line (solid, bright text color) */}
        <polyline
          fill="none"
          stroke="#e0e0e0"
          strokeWidth={1.8}
          points={actualPoints}
        />

        {/* Predicted dots */}
        {points.map((p, i) => (
          <circle
            key={`pred-${i}`}
            cx={xAt(i)}
            cy={yAt(p.predictedPrice)}
            r={2.5}
            fill="#00ff88"
            opacity={0.55}
          />
        ))}

        {/* Actual dots (rings) */}
        {points.map((p, i) => (
          <circle
            key={`act-${i}`}
            cx={xAt(i)}
            cy={yAt(p.actualPrice)}
            r={3.5}
            fill="#1a1a1a"
            stroke={p.wasCorrect ? '#00ff88' : '#ff4444'}
            strokeWidth={p.wasCorrect ? 1.6 : 1.8}
          />
        ))}

        {/* X-axis labels */}
        {points.map((p, i) => (
          <text
            key={`date-${i}`}
            x={xAt(i)}
            y={SVG_H - 10}
            textAnchor="middle"
            fill="#666666"
            fontSize="9"
            fontFamily="inherit"
          >
            {formatDate(p.predictedFor)}
          </text>
        ))}
      </svg>

      {/* Legend */}
      <div style={legendStyle}>
        <span style={legendItemStyle}>
          <span style={{ ...swatchStyle, background: '#00ff88', opacity: 0.55 }} />
          predicted
        </span>
        <span style={legendItemStyle}>
          <span style={{ ...swatchStyle, background: '#e0e0e0' }} />
          actual
        </span>
        <span style={legendItemStyle}>
          <span style={{ ...dotStyle, border: '1.5px solid #00ff88' }} />
          correct
        </span>
        <span style={legendItemStyle}>
          <span style={{ ...dotStyle, border: '1.5px solid #ff4444' }} />
          wrong direction
        </span>
      </div>
    </div>
  );
}

// ── Styles ────────────────────────────────────────────
const cardStyle: React.CSSProperties = {
  background: 'var(--color-surface)',
  border: '1px solid var(--color-border)',
  borderRadius: '4px',
  padding: '14px 16px',
  marginTop: '16px',
  fontFamily: 'var(--font-mono)',
};

const headStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'baseline',
  marginBottom: '2px',
};

const titleStyle: React.CSSProperties = {
  color: 'var(--color-accent)',
  fontSize: '12px',
  fontWeight: 500,
};

const accStyle: React.CSSProperties = {
  fontSize: '11px',
};

const subStyle: React.CSSProperties = {
  color: 'var(--color-muted)',
  fontSize: '10px',
  marginBottom: '14px',
};

const loadingStyle: React.CSSProperties = {
  color: 'var(--color-muted)',
  fontSize: '11px',
  fontStyle: 'italic',
  textAlign: 'center',
  padding: '20px 0',
};

const legendStyle: React.CSSProperties = {
  display: 'flex',
  gap: '16px',
  marginTop: '10px',
  fontSize: '10px',
  color: 'var(--color-muted)',
  flexWrap: 'wrap',
};

const legendItemStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
};

const swatchStyle: React.CSSProperties = {
  display: 'inline-block',
  width: '12px',
  height: '2px',
  marginRight: '5px',
};

const dotStyle: React.CSSProperties = {
  display: 'inline-block',
  width: '7px',
  height: '7px',
  borderRadius: '50%',
  background: 'var(--color-surface)',
  marginRight: '5px',
};