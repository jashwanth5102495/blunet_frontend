import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { appLogger } from './lib/logger';

window.addEventListener('error', (event) => {
  appLogger.error('window.error', event.message || 'Unhandled browser error', {
    filename: event.filename,
    line: event.lineno,
    column: event.colno,
    stack: event.error?.stack || null
  });
});

window.addEventListener('unhandledrejection', (event) => {
  appLogger.error('window.unhandledrejection', 'Unhandled promise rejection', {
    reason: typeof event.reason === 'string' ? event.reason : JSON.stringify(event.reason)
  });
});

appLogger.info('app.bootstrap', 'Frontend application bootstrap started');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
