// ============================================================
// PredictionCard — AI prediction display
// ============================================================

import type { Prediction } from '../types';

interface PredictionCardProps {
  prediction: Prediction;
}

export function PredictionCard({ prediction }: PredictionCardProps) {
  const directionColor = {
    UP: 'var(--color-positive)',
    DOWN: 'var(--color-negative)',
    NEUTRAL: 'var(--color-neutral)',
  }[prediction.direction];

  const directionSymbol = {
    UP: '↑',
    DOWN: '↓',
    NEUTRAL: '—',
  }[prediction.direction];

  const changeSign = prediction.predictedChangePercent >= 0 ? '+' : '';

  return (
    <div
      style={{
        border: '1px solid var(--color-border)',
        backgroundColor: 'var(--color-surface)',
        padding: '16px',
        borderRadius: '4px',
        marginBottom: '16px',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px',
          paddingBottom: '12px',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <span style={{ color: 'var(--color-muted)', fontSize: '12px' }}>
          prediction for tomorrow · {new Date(prediction.predictedFor + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </span>
        {prediction.verified && (
          <span
            style={{
              fontSize: '11px',
              color: prediction.wasCorrect ? 'var(--color-positive)' : 'var(--color-negative)',
            }}
          >
            [{prediction.wasCorrect ? 'CORRECT' : 'INCORRECT'}]
          </span>
        )}
      </div>

      {/* Direction + Price */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          marginBottom: '16px',
        }}
      >
        <span
          style={{
            color: directionColor,
            fontSize: '28px',
            fontWeight: 'bold',
            lineHeight: 1,
          }}
        >
          {directionSymbol}
        </span>
        <div>
          <div style={{ color: directionColor, fontSize: '18px', fontWeight: 'bold' }}>
            {prediction.direction}
          </div>
          <div style={{ color: 'var(--color-muted)', fontSize: '12px' }}>
            ${prediction.predictedPrice.toFixed(2)} ({changeSign}{prediction.predictedChangePercent.toFixed(2)}%)
          </div>
        </div>
        <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
          <div style={{ color: 'var(--color-muted)', fontSize: '11px' }}>confidence</div>
          <div style={{ color: 'var(--color-text)', fontSize: '16px' }}>
            {(prediction.confidence * 100).toFixed(0)}%
          </div>
        </div>
      </div>

      {/* Reasoning */}
      <div
        style={{
          backgroundColor: 'var(--color-bg)',
          border: '1px solid var(--color-border)',
          padding: '12px',
          borderRadius: '2px',
          fontSize: '12px',
          color: 'var(--color-muted)',
          lineHeight: '1.8',
        }}
      >
        <span style={{ color: 'var(--color-accent)' }}># </span>
        {prediction.reasoning}
      </div>

      {/* Footer */}
      <div
        style={{
          marginTop: '12px',
          fontSize: '11px',
          color: 'var(--color-muted)',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <span>base price: ${prediction.basePrice?.toFixed(2) ?? 'N/A'}</span>
        <span>generated today at {new Date(prediction.createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}</span>
      </div>
    </div>
  );
}