// ============================================================
// GuessHowMuch Web - useStock Hook
// Manages stock data fetching and state
// ============================================================

import { useState, useCallback } from 'react';
import { api } from '../api/client';
import type { StockSnapshot, NewsArticle, Prediction } from '../types';

interface StockState {
  snapshot: StockSnapshot | null;
  news: NewsArticle[];
  predictions: Prediction[];
  loading: boolean;
  error: string | null;
}

const initialState: StockState = {
  snapshot: null,
  news: [],
  predictions: [],
  loading: false,
  error: null,
};

export function useStock() {
  const [state, setState] = useState<StockState>(initialState);

  const fetchStock = useCallback(async (symbol: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      // Fetch snapshot, news and predictions in parallel
      const [snapshot, news, predictions] = await Promise.all([
        api.getSnapshot(symbol),
        api.getNews(symbol),
        api.getPredictions(symbol),
      ]);

      setState({
        snapshot,
        news,
        predictions,
        loading: false,
        error: null,
      });

    } catch (err) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : 'Failed to fetch stock data',
      }));
    }
  }, []);

  const generatePrediction = useCallback(async (symbol: string) => {
    try {
      const prediction = await api.generatePrediction(symbol);
      setState(prev => ({
        ...prev,
        predictions: [prediction, ...prev.predictions],
      }));
      return prediction;
    } catch (err) {
      throw err;
    }
  }, []);

  const reset = useCallback(() => {
    setState(initialState);
  }, []);

  return {
    ...state,
    fetchStock,
    generatePrediction,
    reset,
  };
}