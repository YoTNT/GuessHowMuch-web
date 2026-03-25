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

// Get next trading day in ET timezone as YYYY-MM-DD string
function getNextTradingDayET(): string {
  const now = new Date();
  const etNow = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));

  const next = new Date(etNow);
  next.setDate(next.getDate() + 1);
  if (next.getDay() === 6) next.setDate(next.getDate() + 2); // Saturday → Monday
  if (next.getDay() === 0) next.setDate(next.getDate() + 1); // Sunday → Monday

  return next.toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
}

// Filter predictions to only show the one for the next trading day
function filterTodayPrediction(predictions: Prediction[]): Prediction[] {
  const nextTradingDay = getNextTradingDayET();
  return predictions.filter(p => p.predictedFor === nextTradingDay);
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

      // Predictions — only show next trading day's prediction
      predictions: predictionsResult.status === 'fulfilled'
        ? filterTodayPrediction(predictionsResult.value)
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
        // Replace predictions with the new one (only show next trading day)
        predictions: filterTodayPrediction([prediction, ...prev.predictions]),
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