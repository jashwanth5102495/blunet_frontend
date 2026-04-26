const FALLBACK_BACKEND_URL =
  import.meta.env.DEV
    ? 'http://localhost:5000'
    : (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5000');

const BASE_URL = import.meta.env.VITE_BACKEND_URL || FALLBACK_BACKEND_URL;
const LOG_ENDPOINT = `${BASE_URL}/api/log/client-log`;

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

type LogContext = Record<string, unknown>;

function sanitize(value: unknown): unknown {
  if (value == null) return value;
  if (typeof value === 'string') return value.length > 2000 ? `${value.slice(0, 2000)}...[truncated]` : value;
  if (typeof value === 'object') {
    try {
      return JSON.parse(JSON.stringify(value));
    } catch {
      return String(value);
    }
  }
  return value;
}

function emit(level: LogLevel, event: string, message: string, context: LogContext = {}) {
  const payload = {
    level,
    event,
    message,
    context: {
      ...sanitize(context) as LogContext,
      pageUrl: typeof window !== 'undefined' ? window.location.href : 'n/a',
      ts: new Date().toISOString()
    }
  };

  fetch(LOG_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    keepalive: true
  }).catch(() => {
    // Deliberately swallow client logging transport errors.
  });
}

export const appLogger = {
  debug: (event: string, message: string, context: LogContext = {}) => emit('debug', event, message, context),
  info: (event: string, message: string, context: LogContext = {}) => emit('info', event, message, context),
  warn: (event: string, message: string, context: LogContext = {}) => emit('warn', event, message, context),
  error: (event: string, message: string, context: LogContext = {}) => emit('error', event, message, context),
};
