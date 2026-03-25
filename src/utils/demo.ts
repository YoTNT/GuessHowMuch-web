// ============================================================
// Demo mode — symbols accessible to all users without API keys
// Keep in sync with backend src/utils/demo.ts
// ============================================================

export const DEMO_SYMBOLS = [
    'AAPL',
    'MSFT',
    'NVDA',
    'GOOGL',
    'AMZN',
    'META',
    'TSLA',
  ] as const;
  
  export function isDemoSymbol(symbol: string): boolean {
    return DEMO_SYMBOLS.includes(symbol.toUpperCase() as typeof DEMO_SYMBOLS[number]);
  }