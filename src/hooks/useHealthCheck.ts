import { useState, useEffect, useCallback, useRef } from 'react';

export type BackendStatus = 'checking' | 'online' | 'degraded' | 'offline';

const HEALTH_URL = `${import.meta.env.VITE_API_URL}/health`;
const POLL_INTERVAL_MS = 30_000;
const TIMEOUT_MS = 5_000;

export function useHealthCheck() {
  const [status, setStatus] = useState<BackendStatus>('checking');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scheduleNext = useCallback((fn: () => void) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(fn, POLL_INTERVAL_MS);
  }, []);

  const check = useCallback(async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      const res = await fetch(HEALTH_URL, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        setStatus(data.db === 'disconnected' ? 'degraded' : 'online');
      } else {
        setStatus('offline');
      }
    } catch {
      clearTimeout(timeoutId);
      setStatus('offline');
    }

    // Always schedule next check regardless of result
    scheduleNext(check);
  }, [scheduleNext]);

  useEffect(() => {
    check();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [check]);

  return { status };
}