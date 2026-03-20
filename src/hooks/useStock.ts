// ============================================================
// GuessHowMuch Web - useStock Hook
// Manages stock data fetching with independent error states
// ============================================================

import { useState, useCallback } from 'react';
import { api } from '../api/client';
import type { StockSnapshot, NewsArticle, Prediction } from '../types';

interface StockState {
  snapshot: StockSnapshot | null;
  news: NewsArticle[];
  predictions: Prediction[];

  // Independent loading states
  snapshotLoading: boolean;
  newsLoading: boolean;
  predictionsLoading: boolean;

  // Independent error states
  snapshotError: string | null;
  newsError: string | null;
  predictionsError: string | null;
}

const initialState: StockState = {
  snapshot: null,
  news: [],
  predictions: [],
  snapshotLoading: false,
  newsLoading: false,
  predictionsLoading: false,
  snapshotError: null,
  newsError: null,
  predictionsError: null,
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
    // Reset all state and start all loaders
    setState({
      ...initialState,
      snapshotLoading: true,
      newsLoading: true,
      predictionsLoading: true,
    });

    // Fire all three requests independently — failures are isolated
    const [snapshotResult, newsResult, predictionsResult] = await Promise.allSettled([
      api.getSnapshot(symbol),
      api.getNews(symbol),
      api.getPredictions(symbol),
    ]);

    setState(prev => ({
      ...prev,

      // Snapshot
      snapshot: snapshotResult.status === 'fulfilled' ? snapshotResult.value : null,
      snapshotLoading: false,
      snapshotError: snapshotResult.status === 'rejected'
        ? (snapshotResult.reason instanceof Error ? snapshotResult.reason.message : 'Failed to load stock data')
        : null,

      // News
      news: newsResult.status === 'fulfilled' ? newsResult.value : [],
      newsLoading: false,
      newsError: newsResult.status === 'rejected'
        ? (newsResult.reason instanceof Error ? newsResult.reason.message : 'Failed to load news')
        : null,

      // Predictions
      predictions: predictionsResult.status === 'fulfilled'
        ? deduplicatePredictions(predictionsResult.value)
        : [],
      predictionsLoading: false,
      predictionsError: predictionsResult.status === 'rejected'
        ? (predictionsResult.reason instanceof Error ? predictionsResult.reason.message : 'Failed to load predictions')
        : null,
    }));
  }, []);

  // Retry individual sections
  const retrySnapshot = useCallback(async (symbol: string) => {
    setState(prev => ({ ...prev, snapshotLoading: true, snapshotError: null }));
    try {
      const snapshot = await api.getSnapshot(symbol);
      setState(prev => ({ ...prev, snapshot, snapshotLoading: false }));
    } catch (err) {
      setState(prev => ({
        ...prev,
        snapshotLoading: false,
        snapshotError: err instanceof Error ? err.message : 'Failed to load stock data',
      }));
    }
  }, []);

  const retryNews = useCallback(async (symbol: string) => {
    setState(prev => ({ ...prev, newsLoading: true, newsError: null }));
    try {
      const news = await api.getNews(symbol);
      setState(prev => ({ ...prev, news, newsLoading: false }));
    } catch (err) {
      setState(prev => ({
        ...prev,
        newsLoading: false,
        newsError: err instanceof Error ? err.message : 'Failed to load news',
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

  // Derived: overall loading (any section still loading)
  const loading = state.snapshotLoading || state.newsLoading || state.predictionsLoading;

  // Legacy error: snapshotError (StockPage uses this for the main error banner)
  const error = state.snapshotError;

  return {
    ...state,
    loading,
    error,
    fetchStock,
    retrySnapshot,
    retryNews,
    generatePrediction,
    reset,
  };
}