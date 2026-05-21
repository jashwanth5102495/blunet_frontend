/**
 * Normalizes backend base URL (no trailing slash, no duplicate /api suffix).
 */
export function getBackendOrigin(): string {
  const env = import.meta.env.VITE_BACKEND_URL?.trim();
  if (env) {
    return env.replace(/\/+$/, '').replace(/\/api$/i, '');
  }
  if (import.meta.env.DEV) {
    return 'http://localhost:5000';
  }
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return 'http://localhost:5000';
}

/** REST API prefix — in dev uses Vite proxy when VITE_BACKEND_URL is unset */
export function getApiBaseUrl(): string {
  const env = import.meta.env.VITE_BACKEND_URL?.trim();
  if (env) {
    const base = env.replace(/\/+$/, '');
    return base.endsWith('/api') ? base : `${base}/api`;
  }
  if (import.meta.env.DEV) {
    return '/api';
  }
  return `${getBackendOrigin()}/api`;
}

/** Socket.IO must use absolute URL */
export function getSocketOrigin(): string {
  return getBackendOrigin();
}
