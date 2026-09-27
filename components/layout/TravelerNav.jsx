'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import PWAInstallPrompt from '@/components/ui/PWAInstallPrompt';

export default function TravelerNav({ transparent = false }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile drawer when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const links = [
    { href: '/', label: 'Holiday Packages' },
    { href: '/plan', label: 'AI Trip Planner' },
    { href: '/discover', label: 'Destinations' },
    { href: '/trip/tour-goa-signature', label: 'Live Trip Companion' },
  ];

  return (
    <header style={{
      background: transparent 
        ? 'linear-gradient(to bottom, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.2) 70%, transparent 100%)' 
        : '#ffffff',
      borderBottom: transparent ? '1px solid rgba(255,255,255,0.08)' : '1px solid #eef0f8',
      position: transparent ? 'absolute' : 'sticky',
      top: 0, left: 0, right: 0,
      zIndex: 200,
      backdropFilter: transparent ? 'blur(8px)' : 'none',
      boxShadow: transparent ? 'none' : '0 1px 0 #eef0f8, 0 2px 8px rgba(0,0,0,0.04)',
    }}>
      <div style={{
        maxWidth: '1280px', margin: '0 auto', padding: '0 16px',
        height: '68px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px',
      }}>
        {/* Brand */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', flexShrink: 0 }}>
          <div style={{
            width: 38, height: 38,
            background: 'linear-gradient(140deg, #2563eb 0%, #1a3478 100%)',
            borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', boxShadow: '0 3px 10px rgba(37,99,235,0.28)',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17.8 19.2L16 11l3.5-3.5C21 6 21 4 19.5 2.5c-1.5-1.5-3.5-1.5-5 0L11 6 2.8 4.2c-.3-.1-.5 0-.7.2L.5 6.3c-.2.2-.2.5 0 .7l4.7 4.2-1.9 1.9-.8-.2c-.2-.1-.5 0-.6.2L.2 14.7c-.1.2 0 .5.2.7L3.5 18c.5.5 1.2.7 1.9.7l2.1-1.4-2.3 4.1c.2.2.5.3.7.2l2.1-1.4.4.4c.2.2.5.3.7.1l1.8-1.8-.2-.8 1.9-1.9 4.2 4.7c.2.2.5.2.7 0l1.9-1.9c.2-.2.3-.5.2-.7z"/>
            </svg>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: transparent ? '#ffffff' : '#0f172a', lineHeight: 1, letterSpacing: '-0.03em', fontFamily: 'inherit' }}>Celestial</span>
              <span style={{
                fontSize: '0.65rem', fontWeight: 700, padding: '2px 7px',
                borderRadius: '999px', background: transparent ? 'rgba(56,189,248,0.2)' : '#ecfdf5',
                color: transparent ? '#38bdf8' : '#059669', border: transparent ? '1px solid rgba(56,189,248,0.4)' : '1px solid #a7f3d0',
                display: 'inline-flex', alignItems: 'center', gap: '4px'
              }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#10b981' }} />
                Nugen AI
              </span>
            </div>
            <div style={{ fontSize: '0.63rem', color: transparent ? 'rgba(255,255,255,0.7)' : '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', marginTop: '2px' }}>Dynamic Tour Platform</div>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="desktop-only-nav" style={{ display: 'flex', alignItems: 'center', gap: '2px', flex: 1, justifyContent: 'center' }}>
          {links.map(link => {
            const active = pathname === link.href.split('?')[0];
            return (
              <Link key={link.href} href={link.href} style={{
                padding: '8px 14px', borderRadius: '999px',
                fontSize: '0.85rem', fontWeight: active ? 700 : 500,
                color: active 
                  ? (transparent ? '#38bdf8' : '#2563eb') 
                  : (transparent ? 'rgba(255,255,255,0.85)' : '#475569'),
                background: active 
                  ? (transparent ? 'rgba(255,255,255,0.12)' : 'rgba(37,99,235,0.07)') 
                  : 'transparent',
                textDecoration: 'none', transition: 'all 0.15s', whiteSpace: 'nowrap',
              }}>
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Right Side */}
        <div className="desktop-only-nav" style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          <PWAInstallPrompt mode="nav" />
          <div style={{
            display: 'flex', alignItems: 'center', gap: '5px',
            padding: '7px 12px', 
            background: transparent ? 'rgba(255,255,255,0.08)' : '#f8fafc',
            border: transparent ? '1px solid rgba(255,255,255,0.15)' : '1px solid #e8edf5', 
            borderRadius: '999px',
            fontSize: '0.8rem', fontWeight: 600, 
            color: transparent ? '#ffffff' : '#475569', 
          }}>
            <span>₹</span>
            <span>INR</span>
          </div>
          
          {!user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Link href="/signup" style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                padding: '8px 16px', 
                background: transparent ? 'rgba(255,255,255,0.12)' : '#f8fafc', 
                color: transparent ? '#ffffff' : '#0f172a',
                border: transparent ? '1px solid rgba(255,255,255,0.2)' : '1px solid #cbd5e1',
                fontSize: '0.84rem', fontWeight: 700, borderRadius: '999px',
                textDecoration: 'none', transition: 'all 0.15s',
              }}>
                Sign Up
              </Link>
              <Link href="/login" style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                padding: '8px 18px', background: '#2563eb', color: '#fff',
                fontSize: '0.84rem', fontWeight: 700, borderRadius: '999px',
                textDecoration: 'none', transition: 'all 0.15s',
                boxShadow: '0 2px 8px rgba(37,99,235,0.25)'
              }}>
                Log In
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {user.role === 'operator' && (
                <Link href="/operator/dashboard" style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  padding: '9px 18px', background: '#0f172a', color: '#fff',
                  fontSize: '0.84rem', fontWeight: 700, borderRadius: '999px',
                  textDecoration: 'none', transition: 'all 0.2s',
                }}>
                  Operator Console
                </Link>
              )}
              <button onClick={logout} style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                padding: '8px 16px', background: '#f1f5f9', color: '#334155',
                border: '1px solid #e2e8f0', fontSize: '0.84rem', fontWeight: 700, borderRadius: '999px',
                cursor: 'pointer', transition: 'all 0.2s',
              }}>
                Log Out
              </button>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Toggle Button */}
        <div className="mobile-only-toggle" style={{ display: 'none', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: transparent ? 'rgba(255,255,255,0.15)' : '#f1f5f9',
              border: transparent ? '1px solid rgba(255,255,255,0.25)' : '1px solid #cbd5e1',
              color: transparent ? '#ffffff' : '#0f172a',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            {mobileMenuOpen ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div style={{
          position: 'fixed',
          top: '68px',
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(8px)',
          zIndex: 199,
          display: 'flex',
          flexDirection: 'column',
          animation: 'fadeIn 0.2s ease'
        }}
        onClick={() => setMobileMenuOpen(false)}
        >
          <div 
            style={{
              background: '#ffffff',
              borderBottom: '1px solid #e2e8f0',
              padding: '20px 24px 28px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              boxShadow: '0 20px 30px rgba(0,0,0,0.15)',
              maxHeight: '85vh',
              overflowY: 'auto'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Navigation Menu
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {links.map(link => {
                const active = pathname === link.href.split('?')[0];
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      fontSize: '0.96rem',
                      fontWeight: active ? 700 : 600,
                      color: active ? '#2563eb' : '#1e293b',
                      background: active ? 'rgba(37,99,235,0.08)' : '#f8fafc',
                      border: active ? '1px solid rgba(37,99,235,0.2)' : '1px solid #f1f5f9',
                      textDecoration: 'none'
                    }}
                  >
                    <span>{link.label}</span>
                    <span style={{ fontSize: '1.1rem', color: active ? '#2563eb' : '#94a3b8' }}>›</span>
                  </Link>
                );
              })}
            </div>

            <div style={{ height: '1px', background: '#e2e8f0', margin: '4px 0' }} />

            {/* Auth Buttons in Mobile Menu */}
            {!user ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '12px',
                    borderRadius: '12px',
                    background: '#2563eb',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.94rem',
                    textDecoration: 'none',
                    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)'
                  }}
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '12px',
                    borderRadius: '12px',
                    background: '#ffffff',
                    border: '1.5px solid #cbd5e1',
                    color: '#0f172a',
                    fontWeight: 700,
                    fontSize: '0.94rem',
                    textDecoration: 'none'
                  }}
                >
                  Create Free Account (Sign Up)
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%',
                    background: user.role === 'operator' ? '#0f172a' : '#2563eb',
                    color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 800, fontSize: '0.85rem'
                  }}>
                    {user.displayName?.[0] || 'U'}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a' }}>{user.displayName || 'Logged In User'}</div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Role: {user.role === 'operator' ? 'Tour Operator' : 'Traveler'}</div>
                  </div>
                </div>

                {user.role === 'operator' && (
                  <Link
                    href="/operator/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '12px',
                      borderRadius: '12px',
                      background: '#0f172a',
                      color: '#ffffff',
                      fontWeight: 700,
                      fontSize: '0.92rem',
                      textDecoration: 'none'
                    }}
                  >
                    Open Operator Console ↗
                  </Link>
                )}

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '12px',
                    borderRadius: '12px',
                    background: '#fee2e2',
                    border: '1px solid #fecaca',
                    color: '#b91c1c',
                    fontWeight: 700,
                    fontSize: '0.92rem',
                    cursor: 'pointer'
                  }}
                >
                  Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
