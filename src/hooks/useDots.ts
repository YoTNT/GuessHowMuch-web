import { useState, useEffect } from 'react';

export function useDots(active: boolean, interval = 400): string {
  const [dots, setDots] = useState(1);

  useEffect(() => {
    if (!active) {
      setDots(1);
      return;
    }
    const timer = setInterval(() => {
      setDots(prev => prev >= 3 ? 1 : prev + 1);
    }, interval);
    return () => clearInterval(timer);
  }, [active, interval]);

  return '.'.repeat(dots);
}