// ============================================================
// useAuth — Authentication state management
// Handles login, register, logout, token refresh
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import { api, setAccessToken } from '../api/client';
import type { UserProfile } from '../api/client';

const REFRESH_TOKEN_KEY = 'ghm_refresh_token';

interface AuthState {
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  // ── Token management ──────────────────────────────────────
  function saveRefreshToken(token: string) {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  }

  function getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  }

  function clearRefreshToken() {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }

  // ── Auto-restore session on startup ──────────────────────
  useEffect(() => {
    const restore = async () => {
      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        setState(prev => ({ ...prev, loading: false }));
        return;
      }

      try {
        const tokens = await api.refresh(refreshToken);
        setAccessToken(tokens.accessToken);
        saveRefreshToken(tokens.refreshToken);
        const user = await api.getMe();
        setState({ user, loading: false, error: null });
      } catch {
        // Refresh token expired — clear and show logged out
        clearRefreshToken();
        setAccessToken(null);
        setState({ user: null, loading: false, error: null });
      }
    };

    restore();
  }, []);

  // ── Login ─────────────────────────────────────────────────
  const login = useCallback(async (
    email: string,
    password: string,
    rememberMe = false
  ) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const res = await api.login(email, password, rememberMe);
      setAccessToken(res.accessToken);
      saveRefreshToken(res.refreshToken);
      setState({ user: res.user, loading: false, error: null });
      return res.user;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setState(prev => ({ ...prev, loading: false, error: message }));
      throw err;
    }
  }, []);

  // ── Register ──────────────────────────────────────────────
  const register = useCallback(async (email: string, password: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const res = await api.register(email, password);
      setAccessToken(res.accessToken);
      saveRefreshToken(res.refreshToken);
      setState({ user: res.user, loading: false, error: null });
      return res.user;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registration failed';
      setState(prev => ({ ...prev, loading: false, error: message }));
      throw err;
    }
  }, []);

  // ── Logout ────────────────────────────────────────────────
  const logout = useCallback(async () => {
    try {
      await api.logout();
    } catch {
      // Ignore logout errors
    } finally {
      setAccessToken(null);
      clearRefreshToken();
      setState({ user: null, loading: false, error: null });
    }
  }, []);

  // ── Update user profile locally ───────────────────────────
  const updateUser = useCallback((user: UserProfile) => {
    setState(prev => ({ ...prev, user }));
  }, []);

  return {
    user: state.user,
    loading: state.loading,
    error: state.error,
    isLoggedIn: !!state.user,
    login,
    register,
    logout,
    updateUser,
  };
}