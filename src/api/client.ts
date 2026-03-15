import type {
  ApiResponse,
  Stock,
  StockSnapshot,
  NewsArticle,
  Prediction,
} from '../types';

const BASE_URL = '/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  const json: ApiResponse<T> = await res.json();

  if (!json.success || !json.data) {
    throw new Error(json.error || 'Unknown error');
  }

  return json.data;
}

export const api = {
  // ── Stocks ──────────────────────────────────────────────
  getWatchlist: () =>
    request<Stock[]>('/stocks'),

  addStock: (symbol: string, name: string, sector: string, exchange: string) =>
    request<Stock>('/stocks', {
      method: 'POST',
      body: JSON.stringify({ symbol, name, sector, exchange }),
    }),

  getSnapshot: (symbol: string) =>
    request<StockSnapshot>(`/stocks/${symbol}/snapshot`),

  getNews: (symbol: string) =>
    request<NewsArticle[]>(`/stocks/${symbol}/news`),

  // ── Predictions ─────────────────────────────────────────
  generatePrediction: (symbol: string) =>
    request<Prediction>(`/predictions/${symbol}`, { method: 'POST' }),

  getPredictions: (symbol: string) =>
    request<Prediction[]>(`/predictions/${symbol}`),
};