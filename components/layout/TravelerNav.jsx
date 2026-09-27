'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import PWAInstallPrompt from '@/components/ui/PWAInstallPrompt';

export default function TravelerNav({ transparent = false }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

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
        maxWidth: '1280px', margin: '0 auto', padding: '0 24px',
        height: '68px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '24px',
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
              <span style={{ fontSize: '1.3rem', fontWeight: 800, color: transparent ? '#ffffff' : '#0f172a', lineHeight: 1, letterSpacing: '-0.03em', fontFamily: 'inherit' }}>Celestial</span>
              <span style={{
                fontSize: '0.65rem', fontWeight: 700, padding: '2px 7px',
                borderRadius: '999px', background: transparent ? 'rgba(56,189,248,0.2)' : '#ecfdf5',
                color: transparent ? '#38bdf8' : '#059669', border: transparent ? '1px solid rgba(56,189,248,0.4)' : '1px solid #a7f3d0',
                display: 'inline-flex', alignItems: 'center', gap: '4px'
              }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#10b981' }} />
                Nugen AI Aligned
              </span>
            </div>
            <div style={{ fontSize: '0.63rem', color: transparent ? 'rgba(255,255,255,0.7)' : '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', marginTop: '2px' }}>Dynamic Tour Platform</div>
          </div>
        </Link>

        {/* Nav */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '2px', flex: 1, justifyContent: 'center' }}>
          {links.map(link => {
            const active = pathname === link.href.split('?')[0];
            return (
              <Link key={link.href} href={link.href} style={{
                padding: '8px 15px', borderRadius: '999px',
                fontSize: '0.875rem', fontWeight: active ? 700 : 500,
                color: active 
                  ? (transparent ? '#38bdf8' : '#2563eb') 
                  : (transparent ? 'rgba(255,255,255,0.85)' : '#475569'),
                background: active 
                  ? (transparent ? 'rgba(255,255,255,0.12)' : 'rgba(37,99,235,0.07)') 
                  : 'transparent',
                textDecoration: 'none', transition: 'all 0.15s', whiteSpace: 'nowrap',
              }}
                onMouseEnter={e => { 
                  if (!active) { 
                    e.currentTarget.style.color = transparent ? '#ffffff' : '#2563eb'; 
                    e.currentTarget.style.background = transparent ? 'rgba(255,255,255,0.1)' : 'rgba(37,99,235,0.05)'; 
                  } 
                }}
                onMouseLeave={e => { 
                  if (!active) { 
                    e.currentTarget.style.color = transparent ? 'rgba(255,255,255,0.85)' : '#475569'; 
                    e.currentTarget.style.background = 'transparent'; 
                  } 
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          <PWAInstallPrompt mode="nav" />
          <div style={{
            display: 'flex', alignItems: 'center', gap: '5px',
            padding: '7px 14px', 
            background: transparent ? 'rgba(255,255,255,0.08)' : '#f8fafc',
            border: transparent ? '1px solid rgba(255,255,255,0.15)' : '1px solid #e8edf5', 
            borderRadius: '999px',
            fontSize: '0.8rem', fontWeight: 600, 
            color: transparent ? '#ffffff' : '#475569', 
            cursor: 'pointer',
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
                  padding: '9px 20px', background: '#0f172a', color: '#fff',
                  fontSize: '0.85rem', fontWeight: 700, borderRadius: '999px',
                  textDecoration: 'none', transition: 'all 0.2s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#1e3a8a'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#0f172a'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  Operator Console
                </Link>
              )}
              <button onClick={logout} style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                padding: '9px 20px', background: '#f1f5f9', color: '#334155',
                border: '1px solid #e2e8f0', fontSize: '0.85rem', fontWeight: 700, borderRadius: '999px',
                cursor: 'pointer', transition: 'all 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = '#e2e8f0'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#f1f5f9'; }}
              >
                Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
