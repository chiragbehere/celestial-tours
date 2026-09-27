'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboardIcon,
  AlertTriangleIcon,
  PackageIcon,
  CreditCardIcon,
  UsersIcon,
  ArrowRightIcon,
  SparklesIcon,
  PlaneIcon,
  LightningIcon
} from '@/components/ui/Icons';
import { useEffect, useState } from 'react';

export default function OperatorSidebar({ mobileOpen = false, onClose = () => {} }) {
  const pathname = usePathname();
  const [unresolvedAlerts, setUnresolvedAlerts] = useState(0);

  useEffect(() => {
    onClose();
  }, [pathname]);

  useEffect(() => {
    async function checkAlerts() {
      try {
        const res = await fetch('/api/operator/stats');
        const data = await res.json();
        if (data.success && data.stats) {
          setUnresolvedAlerts(data.stats.unresolvedAlerts || 0);
        }
      } catch (e) {
        // quiet error handle
      }
    }
    checkAlerts();
    const interval = setInterval(checkAlerts, 10000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    {
      name: 'Operations Overview',
      href: '/operator/dashboard',
      icon: LayoutDashboardIcon,
      badge: null
    },
    {
      name: 'Digital Twin Simulator',
      href: '/operator/simulation',
      icon: LightningIcon,
      badge: 'Live GIS'
    },
    {
      name: 'Tour Packages & Builder',
      href: '/operator/tours',
      icon: PackageIcon,
      badge: 'Create'
    },
    {
      name: 'Disruption Shield',
      href: '/operator/alerts',
      icon: AlertTriangleIcon,
      badge: unresolvedAlerts > 0 ? `${unresolvedAlerts} Active` : null,
      badgeColor: '#ef4444'
    },
    {
      name: 'Inventory & Suppliers',
      href: '/operator/inventory',
      icon: PackageIcon,
      badge: null
    },
    {
      name: 'Bookings & Vouchers',
      href: '/operator/bookings',
      icon: CreditCardIcon,
      badge: null
    },
    {
      name: 'Vendor Network & Settlements',
      href: '/operator/vendors',
      icon: UsersIcon,
      badge: 'B2B Partners'
    }
  ];

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div 
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            zIndex: 998,
            animation: 'fadeIn 0.2s ease'
          }}
        />
      )}

      <aside 
        className={`operator-sidebar ${mobileOpen ? 'mobile-sidebar-active' : ''}`}
        style={{
          width: '270px',
          background: '#ffffff',
          borderRight: '1px solid #e2e8f0',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          flexShrink: 0,
          zIndex: 999,
          boxShadow: '1px 0 3px rgba(0, 0, 0, 0.02)',
          transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Brand Header — Matches Main Site Aesthetic */}
        <div style={{ padding: '20px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: 36, height: 36,
              background: 'linear-gradient(140deg, #2563eb 0%, #1a3478 100%)',
              borderRadius: '10px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff',
              boxShadow: '0 3px 10px rgba(37,99,235,0.25)',
              flexShrink: 0
            }}>
              <PlaneIcon size={18} />
            </div>
            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', lineHeight: 1 }}>Celestial</div>
              <div style={{ fontSize: '0.62rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', marginTop: '2px' }}>
                Operations Suite
              </div>
            </div>
          </Link>

          {/* Close button inside mobile drawer */}
          <button
            onClick={onClose}
            className="mobile-sidebar-close"
            style={{
              display: 'none',
              background: '#f1f5f9',
              border: 'none',
              borderRadius: '8px',
              width: '32px',
              height: '32px',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#475569'
            }}
          >
            ✕
          </button>
        </div>

      {/* Navigation Links */}
      <nav style={{ padding: '18px 14px', flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={{
          fontSize: '0.7rem',
          fontWeight: 800,
          color: '#94a3b8',
          padding: '6px 12px 6px',
          textTransform: 'uppercase',
          letterSpacing: '0.08em'
        }}>
          Operations Portal
        </div>

        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/operator/dashboard' && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '11px 14px',
                borderRadius: '10px',
                color: isActive ? '#2563eb' : '#475569',
                background: isActive ? 'rgba(37, 99, 235, 0.08)' : 'transparent',
                border: isActive ? '1px solid rgba(37, 99, 235, 0.15)' : '1px solid transparent',
                textDecoration: 'none',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.88rem',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={e => {
                if (!isActive) {
                  e.currentTarget.style.background = '#f8fafc';
                  e.currentTarget.style.color = '#0f172a';
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#475569';
                }
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Icon size={18} style={{ color: isActive ? '#2563eb' : '#64748b' }} />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span style={{
                  background: item.badgeColor || '#2563eb',
                  color: '#ffffff',
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: '999px',
                  letterSpacing: '0.02em',
                }}>
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Engine Status & Switch to Traveler View */}
      <div style={{ padding: '16px', borderTop: '1px solid #f1f5f9', background: '#fafbfc' }}>
        <div style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          padding: '12px 14px',
          marginBottom: '12px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
            <SparklesIcon size={14} style={{ color: '#10b981' }} />
            <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#0f172a' }}>
              Nugen AI Aligned Engine
            </span>
          </div>
          <div style={{ fontSize: '0.7rem', color: '#64748b', lineHeight: 1.4 }}>
            Constraint Solver & Auto-Reroute active across all live itineraries.
          </div>
        </div>

        {/* Switch to Traveler View */}
        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '10px 14px',
            borderRadius: '10px',
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            color: '#334155',
            fontSize: '0.82rem',
            fontWeight: 700,
            textDecoration: 'none',
            transition: 'all 0.15s ease',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = '#f8fafc';
            e.currentTarget.style.borderColor = '#cbd5e1';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = '#ffffff';
            e.currentTarget.style.borderColor = '#e2e8f0';
          }}
        >
          <span>Open Traveler Portal</span>
          <ArrowRightIcon size={14} />
        </Link>
      </div>
    </aside>
    </>
  );
}
