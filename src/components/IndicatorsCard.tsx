// ============================================================
// IndicatorsCard — Technical indicators display
// ============================================================

import type { TechnicalIndicators } from '../types';

interface IndicatorsCardProps {
  indicators: TechnicalIndicators;
}

function Row({
  label,
  value,
  signal,
}: {
  label: string;
  value: string;
  signal?: 'bullish' | 'bearish' | 'neutral';
}) {
  const signalColor = {
    bullish: 'var(--color-positive)',
    bearish: 'var(--color-negative)',
    neutral: 'var(--color-neutral)',
  }[signal ?? 'neutral'];

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '4px 0',
        borderBottom: '1px solid var(--color-border)',
      }}
    >
      <span style={{ color: 'var(--color-muted)', fontSize: '12px' }}>{label}</span>
      <span style={{ color: signal ? signalColor : 'var(--color-text)', fontSize: '12px' }}>
        {value}
      </span>
    </div>
  );
}

function getRsiSignal(rsi: number): 'bullish' | 'bearish' | 'neutral' {
  if (rsi < 30) return 'bullish';  // oversold — potential reversal up
  if (rsi > 70) return 'bearish';  // overbought — potential reversal down
  return 'neutral';
}

function getMacdSignal(macd: number): 'bullish' | 'bearish' | 'neutral' {
  if (macd > 0) return 'bullish';
  if (macd < 0) return 'bearish';
  return 'neutral';
}

function getSmaSignal(price: number, sma: number): 'bullish' | 'bearish' | 'neutral' {
  if (price > sma) return 'bullish';
  if (price < sma) return 'bearish';
  return 'neutral';
}

function getBollingerSignal(
  price: number,
  upper: number,
  lower: number
): 'bullish' | 'bearish' | 'neutral' {
  if (price <= lower) return 'bullish';  // near lower band — oversold
  if (price >= upper) return 'bearish';  // near upper band — overbought
  return 'neutral';
}

export function IndicatorsCard({ indicators }: IndicatorsCardProps) {
  // We need the current price to calculate signals
  // Use SMA20 middle as reference if price not available
  const price = indicators.bollingerMiddle;

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
          color: 'var(--color-muted)',
          fontSize: '11px',
          marginBottom: '12px',
          paddingBottom: '8px',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        technical indicators
      </div>

      {/* Momentum */}
      <div style={{ marginBottom: '12px' }}>
        <div style={{ color: 'var(--color-muted)', fontSize: '10px', marginBottom: '4px', letterSpacing: '0.1em' }}>
          MOMENTUM
        </div>
        <Row
          label="RSI (14)"
          value={indicators.rsi14.toFixed(2)}
          signal={getRsiSignal(indicators.rsi14)}
        />
        <Row
          label="MACD"
          value={indicators.macd.toFixed(4)}
          signal={getMacdSignal(indicators.macd)}
        />
      </div>

      {/* Trend */}
      <div style={{ marginBottom: '12px' }}>
        <div style={{ color: 'var(--color-muted)', fontSize: '10px', marginBottom: '4px', letterSpacing: '0.1em' }}>
          TREND
        </div>
        <Row
          label="SMA 20"
          value={`$${indicators.sma20.toFixed(2)}`}
          signal={getSmaSignal(price, indicators.sma20)}
        />
        <Row
          label="SMA 50"
          value={`$${indicators.sma50.toFixed(2)}`}
          signal={getSmaSignal(price, indicators.sma50)}
        />
        <Row
          label="EMA 12"
          value={`$${indicators.ema12.toFixed(2)}`}
          signal={getSmaSignal(price, indicators.ema12)}
        />
        <Row
          label="EMA 26"
          value={`$${indicators.ema26.toFixed(2)}`}
          signal={getSmaSignal(price, indicators.ema26)}
        />
      </div>

      {/* Volatility */}
      <div>
        <div style={{ color: 'var(--color-muted)', fontSize: '10px', marginBottom: '4px', letterSpacing: '0.1em' }}>
          VOLATILITY
        </div>
        <Row
          label="BB Upper"
          value={`$${indicators.bollingerUpper.toFixed(2)}`}
        />
        <Row
          label="BB Middle"
          value={`$${indicators.bollingerMiddle.toFixed(2)}`}
        />
        <Row
          label="BB Lower"
          value={`$${indicators.bollingerLower.toFixed(2)}`}
          signal={getBollingerSignal(price, indicators.bollingerUpper, indicators.bollingerLower)}
        />
        <Row
          label="Volume Ratio"
          value={indicators.volumeRatio.toFixed(2)}
          signal={indicators.volumeRatio > 1.2 ? 'bullish' : indicators.volumeRatio < 0.8 ? 'bearish' : 'neutral'}
        />
      </div>
    </div>
  );
}