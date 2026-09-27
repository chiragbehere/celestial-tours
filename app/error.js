'use client';

import { useEffect } from 'react';

export default function ErrorBoundary({ error, reset }) {
  useEffect(() => {
    console.error('App Error caught:', error);
  }, [error]);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#0a0e1a',
      color: '#fff',
      padding: '24px',
      fontFamily: 'sans-serif'
    }}>
      <div style={{
        maxWidth: '500px',
        textAlign: 'center',
        background: '#1e293b',
        padding: '40px',
        borderRadius: '16px',
        border: '1px solid rgba(255,255,255,0.1)'
      }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>Something went wrong</h2>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '24px' }}>
          {error?.message || 'An unexpected rendering error occurred.'}
        </p>
        <button
          onClick={() => reset()}
          style={{
            padding: '12px 24px',
            background: '#2563eb',
            color: '#fff',
            border: 'none',
            borderRadius: '999px',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
