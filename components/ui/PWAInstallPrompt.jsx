'use client';
import { useEffect, useState } from 'react';
import { XIcon } from '@/components/ui/Icons';


export default function PWAInstallPrompt({ mode = 'floating' }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    // Check if already running standalone (installed PWA)
    if (
      typeof window !== 'undefined' &&
      (window.matchMedia('(display-mode: standalone)').matches ||
       window.navigator.standalone === true)
    ) {
      setIsInstalled(true);
    }

    // Detect iOS
    if (typeof window !== 'undefined') {
      const ua = window.navigator.userAgent.toLowerCase();
      const isApple = /iphone|ipad|ipod/.test(ua);
      if (isApple && !window.navigator.standalone) {
        setIsIOS(true);
      }
    }

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      setIsMinimized(true);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setIsMinimized(true);
      }
    } else {
      setShowGuide(true);
    }
  };

  if (isInstalled) return null;

  // Nav inline button mode
  if (mode === 'nav') {
    return (
      <button
        onClick={handleInstallClick}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          padding: '7px 14px', background: 'rgba(37, 99, 235, 0.08)', color: '#2563eb',
          border: '1px solid rgba(37, 99, 235, 0.2)', borderRadius: '999px',
          fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s',
          whiteSpace: 'nowrap'
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(37, 99, 235, 0.15)'}
        onMouseLeave={e => e.currentTarget.style.background = 'rgba(37, 99, 235, 0.08)'}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="7 10 12 15 17 10"/>
          <line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
        Install App
      </button>
    );
  }

  // Floating prompt: If minimized, show small sleek pill button in the bottom-right
  if (isMinimized) {
    return (
      <button
        onClick={() => { setIsMinimized(false); setShowGuide(false); }}
        className="pwa-floating-pill"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 18px',
          background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
          color: '#ffffff',
          border: 'none',
          borderRadius: '999px',
          fontWeight: 700,
          fontSize: '0.85rem',
          boxShadow: '0 8px 24px rgba(37, 99, 235, 0.4)',
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="7 10 12 15 17 10"/>
          <line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
        Install App
      </button>
    );
  }

  // Expanded Floating Card
  return (
    <div
      className="pwa-floating-card"
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        maxWidth: '380px',
        width: 'calc(100% - 48px)',
        background: '#ffffff',
        borderRadius: '16px',
        boxShadow: '0 20px 45px -10px rgba(15, 23, 42, 0.35), 0 0 0 1px rgba(15, 23, 42, 0.08)',
        padding: '16px 18px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              flexShrink: 0,
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17.8 19.2L16 11l3.5-3.5C21 6 21 4 19.5 2.5c-1.5-1.5-3.5-1.5-5 0L11 6 2.8 4.2c-.3-.1-.5 0-.7.2L.5 6.3c-.2.2-.2.5 0 .7l4.7 4.2-1.9 1.9-.8-.2c-.2-.1-.5 0-.6.2L.2 14.7c-.1.2 0 .5.2.7L3.5 18c.5.5 1.2.7 1.9.7l2.1-1.4-2.3 4.1c.2.2.5.3.7.2l2.1-1.4.4.4c.2.2.5.3.7.1l1.8-1.8-.2-.8 1.9-1.9 4.2 4.7c.2.2.5.2.7 0l1.9-1.9c.2-.2.3-.5.2-.7z"/>
            </svg>
          </div>
          <div>
            <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
              Install Celestial App
            </div>
            <div style={{ fontSize: '0.76rem', color: '#64748b', marginTop: '1px', lineHeight: 1.35 }}>
              Install on phone or desktop for instant live trip alerts.
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsMinimized(true)}
          aria-label="Minimize"
          style={{
            background: '#f1f5f9',
            border: 'none',
            borderRadius: '50%',
            width: '26px',
            height: '26px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#64748b',
            cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          <XIcon size={14} />
        </button>
      </div>

      {showGuide ? (
        <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '10px', fontSize: '0.78rem', color: '#334155', border: '1px solid #e2e8f0', lineHeight: 1.45 }}>
          {isIOS ? (
            <span>Tap <strong>Share</strong> in Safari, then tap <strong>&apos;Add to Home Screen&apos; (+)</strong></span>
          ) : (
            <span>Click the <strong>Install</strong> icon in your browser address bar, or use the menu <strong>&apos;Install App&apos;</strong>.</span>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', gap: '8px', marginTop: '2px' }}>
          <button
            onClick={handleInstallClick}
            style={{
              flex: 1,
              padding: '9px 14px',
              background: '#2563eb',
              color: '#ffffff',
              border: 'none',
              borderRadius: '10px',
              fontSize: '0.84rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Download / Install
          </button>
          <button
            onClick={() => setIsMinimized(true)}
            style={{
              padding: '9px 14px',
              background: '#f8fafc',
              color: '#64748b',
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Later
          </button>
        </div>
      )}
    </div>
  );
}
