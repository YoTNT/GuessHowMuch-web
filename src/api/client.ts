import type {
  ApiResponse,
  Stock,
  StockSnapshot,
  NewsArticle,
  Prediction,
} from '../types';

const BASE_URL = '/api';

// ── Auth token management ─────────────────────────────────
let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function getAccessToken(): string | null {
  return accessToken;
}

// ── Core request function ─────────────────────────────────
async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: { ...headers, ...options?.headers },
  });

  const json: ApiResponse<T> = await res.json();

  if (!json.success || !json.data) {
    throw new Error(json.error || 'Unknown error');
  }

  return json.data;
}

// ── Auth ──────────────────────────────────────────────────
export interface AuthResponse {
  user: UserProfile;
  accessToken: string;
  refreshToken: string;
}

export interface UserProfile {
  userId: string;
  email: string;
  apiKeys: {
    alphaVantage?: string;
    anthropic?: string;
    newsApi?: string;
    huggingFace?: string;
  };
  watchlist: string[];
  createdAt: string;
}

export const api = {
  // ── Auth ────────────────────────────────────────────────
  register: (email: string, password: string) =>
    request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  login: (email: string, password: string, rememberMe = false) =>
    request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, rememberMe }),
    }),

  refresh: (refreshToken: string) =>
    request<{ accessToken: string; refreshToken: string }>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    }),

  logout: () =>
    request<void>('/auth/logout', { method: 'POST' }),

  // ── User ────────────────────────────────────────────────
  getMe: () =>
    request<UserProfile>('/users/me'),

  updateApiKeys: (keys: {
    alphaVantage?: string;
    anthropic?: string;
    newsApi?: string;
    huggingFace?: string;
  }) =>
    request<UserProfile>('/users/api-keys', {
      method: 'PUT',
      body: JSON.stringify(keys),
    }),

  addToWatchlist: (symbol: string) =>
    request<string[]>('/users/watchlist', {
      method: 'POST',
      body: JSON.stringify({ symbol }),
    }),

  removeFromWatchlist: (symbol: string) =>
    request<string[]>(`/users/watchlist/${symbol}`, { method: 'DELETE' }),

  getUserWatchlist: () =>
    request<string[]>('/users/watchlist'),

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