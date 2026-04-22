// ============================================================
// useSymbolSearch
//
// Encapsulates symbol search state and debounced API calls.
// The component using this hook only needs to pass the user's
// query string and render results — all timing, fetching, and
// error handling happens here.
// ============================================================

import { useState, useEffect, useRef } from 'react';
import { api } from '../api/client';
import type { SymbolSearchResult } from '../types';

/**
 * Minimum characters before we hit the API.
 *
 * Currently 2 to reduce Alpha Vantage free-tier quota pressure
 * (25 req/day shared with prediction + accuracy workers). Lower
 * to 1 once AV is upgraded to paid tier — that will enable
 * single-letter tickers like T (AT&T), F (Ford), V (Visa).
 */
const MIN_QUERY_LENGTH = 2;

/** How long to wait after last keystroke before calling API. */
const DEBOUNCE_MS = 300;

interface UseSymbolSearchResult {
  query: string;
  setQuery: (q: string) => void;
  results: SymbolSearchResult[];
  loading: boolean;
  /** True when query is non-empty but below MIN_QUERY_LENGTH. */
  tooShort: boolean;
  /** True when API returned no matches for a valid query. */
  noResults: boolean;
  /** Clear everything (input + results). */
  reset: () => void;
}

export function useSymbolSearch(): UseSymbolSearchResult {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SymbolSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Track the latest request so stale responses don't overwrite newer ones.
  // (User types "App", 1s later types "Apple" — we only want "Apple" result.)
  const requestIdRef = useRef(0);

  useEffect(() => {
    const trimmed = query.trim();

    // ── Empty query — reset to pristine state ─────────
    if (trimmed.length === 0) {
      setResults([]);
      setLoading(false);
      setHasSearched(false);
      return;
    }

    // ── Below minimum — don't call API ────────────────
    if (trimmed.length < MIN_QUERY_LENGTH) {
      setResults([]);
      setLoading(false);
      setHasSearched(false);
      return;
    }

    // ── Debounce + fetch ──────────────────────────────
    setLoading(true);
    const currentRequestId = ++requestIdRef.current;

    const timer = setTimeout(async () => {
      try {
        const data = await api.searchSymbols(trimmed);
        // Guard against stale response arriving after a newer request
        if (currentRequestId !== requestIdRef.current) return;
        setResults(data);
        setHasSearched(true);
      } catch {
        // Search failures are non-fatal — show empty results, don't bother user
        if (currentRequestId !== requestIdRef.current) return;
        setResults([]);
        setHasSearched(true);
      } finally {
        if (currentRequestId === requestIdRef.current) {
          setLoading(false);
        }
      }
    }, DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [query]);

  const reset = () => {
    setQuery('');
    setResults([]);
    setLoading(false);
    setHasSearched(false);
  };

  const trimmed = query.trim();
  const tooShort = trimmed.length > 0 && trimmed.length < MIN_QUERY_LENGTH;
  const noResults = hasSearched && !loading && results.length === 0 && trimmed.length >= MIN_QUERY_LENGTH;

  return { query, setQuery, results, loading, tooShort, noResults, reset };
}