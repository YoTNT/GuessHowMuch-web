// ============================================================
// GuessHowMuch Web - API Client
// Centralized API calls to the backend
// ============================================================

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
  
  // ── Stocks ────────────────────────────────────────────────
  export const api = {
    // Get all watchlist stocks
    getWatchlist: () =>
      request<Stock[]>('/stocks'),
  
    // Add stock to watchlist
    addStock: (symbol: string, name: string, sector: string, exchange: string) =>
      request<Stock>('/stocks', {
        method: 'POST',
        body: JSON.stringify({ symbol, name, sector, exchange }),
      }),
  
    // Get stock snapshot (quote + indicators + bars)
    getSnapshot: (symbol: string) =>
      request<StockSnapshot>(`/stocks/${symbol}/snapshot`),
  
    // Get stock news
    getNews: (symbol: string) =>
      request<NewsArticle[]>(`/stocks/${symbol}/news`),
  
    // ── Predictions ─────────────────────────────────────────
    // Generate prediction
    generatePrediction: (symbol: string) =>
      request<Prediction>(`/predictions/${symbol}`, { method: 'POST' }),
  
    // Get prediction history
    getPredictions: (symbol: string) =>
      request<Prediction[]>(`/predictions/${symbol}`),
  };