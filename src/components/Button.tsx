// ============================================================
// Button — Unified button component
// Terminal aesthetic with consistent hover and loading states
// ============================================================

import { useState } from 'react';

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  loading?: boolean;
  loadingText?: string;
  style?: React.CSSProperties;
}

export function Button({
  onClick,
  children,
  variant = 'primary',
  disabled = false,
  loading = false,
  loadingText = 'loading...',
  style,
}: ButtonProps) {
  const [hovered, setHovered] = useState(false);

  const isDisabled = disabled || loading;

  const colorMap = {
    primary: 'var(--color-accent)',
    secondary: 'var(--color-muted)',
    danger: 'var(--color-negative)',
  };

  const color = colorMap[variant];

  return (
    <button
      onClick={isDisabled ? undefined : onClick}
      onMouseEnter={() => !isDisabled && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered && !isDisabled ? color : 'transparent',
        border: `1px solid ${isDisabled ? 'var(--color-border)' : color}`,
        color: isDisabled
          ? 'var(--color-muted)'
          : hovered
          ? 'var(--color-bg)'
          : color,
        fontFamily: 'var(--font-mono)',
        fontSize: '12px',
        padding: '4px 12px',
        borderRadius: '2px',
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.15s',
        ...style,
      }}
    >
      {loading ? loadingText : children}
    </button>
  );
}