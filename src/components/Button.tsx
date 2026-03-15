import { useState } from 'react';
import { useDots } from '../hooks/useDots';

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
  loadingText = 'loading',
  style,
}: ButtonProps) {
  const [hovered, setHovered] = useState(false);
  const dots = useDots(loading);

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
        minWidth: '80px', // prevent button width from jumping
        ...style,
      }}
    >
      {loading ? `${loadingText}${dots}` : children}
    </button>
  );
}