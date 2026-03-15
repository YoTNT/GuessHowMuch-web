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

// Deduplicate predictions by date, keep latest per day, sort newest first
function deduplicatePredictions(predictions: Prediction[]): Prediction[] {
  const byDate = predictions.reduce((acc, pred) => {
    const existing = acc[pred.predictedFor];
    if (!existing || pred.createdAt > existing.createdAt) {
      acc[pred.predictedFor] = pred;
    }
    return acc;
  }, {} as Record<string, Prediction>);

  return Object.values(byDate).sort((a, b) =>
    b.predictedFor.localeCompare(a.predictedFor)
  );
}

export function useStock() {
  const [state, setState] = useState<StockState>(initialState);

  const fetchStock = useCallback(async (symbol: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const [snapshot, news, rawPredictions] = await Promise.all([
        api.getSnapshot(symbol),
        api.getNews(symbol),
        api.getPredictions(symbol),
      ]);

      setState({
        snapshot,
        news,
        predictions: deduplicatePredictions(rawPredictions),
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
        predictions: deduplicatePredictions([prediction, ...prev.predictions]),
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