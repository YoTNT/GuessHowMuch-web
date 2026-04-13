// ============================================================
// GuessHowMuch Web - Type Definitions
// Mirror of backend models/types.ts
// ============================================================

export interface Stock {
    symbol: string;
    name: string;
    sector: string;
    exchange: string;
    addedAt: string;
    isActive: boolean;
  }
  
  export interface StockQuote {
    symbol: string;
    price: number;
    open: number;
    high: number;
    low: number;
    close: number;
    previousClose: number;
    change: number;
    changePercent: number;
    volume: number;
    timestamp: string;
  }
  
  export interface TechnicalIndicators {
    symbol: string;
    date: string;
    sma20: number;
    sma50: number;
    ema12: number;
    ema26: number;
    macd: number;
    rsi14: number;
    bollingerUpper: number;
    bollingerMiddle: number;
    bollingerLower: number;
    volumeRatio: number;
  }
  
  export interface OHLCVBar {
    symbol: string;
    date: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
  }
  
  export interface NewsArticle {
    id: string;
    title: string;
    summary: string;
    url: string;
    source: { id: string | null; name: string } | string;
    publishedAt: string;
    sentiment: 'positive' | 'negative' | 'neutral';
    sentimentScore: number;
  }
  
  export type PredictionDirection = 'UP' | 'DOWN' | 'NEUTRAL';
  
  export interface Prediction {
    id: string;
    symbol: string;
    predictedFor: string;
    createdAt: string;
    direction: PredictionDirection;
    basePrice: number;
    predictedPrice: number;
    predictedChangePercent: number;
    confidence: number;
    reasoning: string;
    promptVersion?: string;
    confidenceLevel?: 'high' | 'medium' | 'low';
    verified: boolean;
    actualPrice?: number;
    actualDirection?: PredictionDirection;
    wasCorrect?: boolean;
  }
  
  export interface StockSnapshot {
    quote: StockQuote;
    indicators: TechnicalIndicators | null;
    bars: OHLCVBar[];
  }
  
  export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
  }

  export interface StockOverview {
    symbol: string;
    name: string;
    exchange: string;
    sector: string;
    industry: string;
    description: string;
    country: string;
    updatedAt: string;
    expiresAt: number;
  }

  export interface AccuracyEntry {
    symbol: string;
    accuracy: number;
    totalPredictions: number;
    correctPredictions: number;
    consecutiveWrong: number;
    avgPriceDeviationPct: number;
    lastUpdated: string;
  }
  
  export interface AccuracySummary {
    overallAccuracy: number;
    totalPredictions: number;
    totalCorrect: number;
    symbolCount: number;
    bestSymbol: string | null;
    worstSymbol: string | null;
    abTesting: Record<string, { total: number; correct: number; accuracy: number }>;
  }