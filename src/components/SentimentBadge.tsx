// ============================================================
// SentimentBadge — Inline sentiment label
// ============================================================

interface SentimentBadgeProps {
    sentiment: 'positive' | 'negative' | 'neutral';
    score?: number;
  }
  
  export function SentimentBadge({ sentiment, score }: SentimentBadgeProps) {
    const colorMap = {
      positive: 'var(--color-positive)',
      negative: 'var(--color-negative)',
      neutral: 'var(--color-neutral)',
    };
  
    const labelMap = {
      positive: 'BULLISH',
      negative: 'BEARISH',
      neutral: 'NEUTRAL',
    };
  
    const color = colorMap[sentiment];
  
    return (
      <span
        style={{
          color,
          fontSize: '11px',
          fontFamily: 'var(--font-mono)',
          letterSpacing: '0.05em',
        }}
      >
        [{labelMap[sentiment]}
        {score !== undefined && ` ${score > 0 ? '+' : ''}${score.toFixed(2)}`}]
      </span>
    );
  }