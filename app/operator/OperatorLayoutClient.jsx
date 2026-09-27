'use client';

import { useState } from 'react';
import Link from 'next/link';
import OperatorSidebar from '@/components/layout/OperatorSidebar';

export default function OperatorLayoutClient({ children }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: '#f8fafc',
      color: '#0f172a',
      fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif"
    }}>
      {/* Responsive Operator Sidebar */}
      <OperatorSidebar 
        mobileOpen={mobileSidebarOpen} 
        onClose={() => setMobileSidebarOpen(false)} 
      />

      {/* Main Workspace */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0,
        overflowX: 'hidden'
      }}>
        {/* Top Header — Responsive Mobile + Desktop */}
        <header style={{
          minHeight: '64px',
          background: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 20px',
          flexShrink: 0,
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
          gap: '12px'
        }}>
          {/* Left: Mobile hamburger trigger + Hub pill */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="operator-mobile-hamburger"
              aria-label="Open operations menu"
              style={{
                display: 'none',
                alignItems: 'center',
                justifyContent: 'center',
                width: '38px',
                height: '38px',
                borderRadius: '8px',
                background: '#f1f5f9',
                border: '1px solid #cbd5e1',
                color: '#0f172a',
                cursor: 'pointer'
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>

            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '5px 12px',
              borderRadius: '999px',
              background: 'rgba(37, 99, 235, 0.08)',
              border: '1px solid rgba(37, 99, 235, 0.2)',
              fontSize: '0.74rem',
              fontWeight: 700,
              color: '#2563eb',
              whiteSpace: 'nowrap'
            }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
              OPERATIONS PORTAL
            </div>

            <div className="operator-hub-badge" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{
                fontSize: '0.78rem',
                color: '#334155',
                background: '#f1f5f9',
                padding: '4px 10px',
                borderRadius: '6px',
                border: '1px solid #e2e8f0',
                fontWeight: 600,
                whiteSpace: 'nowrap'
              }}>
                Pan-India Network
              </span>
            </div>
          </div>

          {/* Right: Traveler site link + User avatar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
            <Link
              href="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '6px 12px',
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: 600,
                color: '#334155',
                textDecoration: 'none',
                boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                whiteSpace: 'nowrap'
              }}
            >
              <span>Traveler Site</span>
              <span>↗</span>
            </Link>

            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #2563eb, #1e40af)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '0.84rem',
              color: '#ffffff',
              boxShadow: '0 3px 10px rgba(37, 99, 235, 0.25)',
              flexShrink: 0
            }}>
              OP
            </div>
          </div>
        </header>

        {/* Responsive Content Area */}
        <main className="operator-main-content" style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
