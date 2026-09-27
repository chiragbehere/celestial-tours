'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  LayoutDashboardIcon,
  AlertTriangleIcon,
  PackageIcon,
  CreditCardIcon,
  UsersIcon,
  ArrowRightIcon,
  RefreshIcon,
  ShieldCheckIcon,
  SparklesIcon,
  LightningIcon
} from '@/components/ui/Icons';

export default function OperatorDashboard() {
  const [stats, setStats] = useState(null);
  const [tours, setTours] = useState([]);
  const [disruptions, setDisruptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [simulating, setSimulating] = useState(false);
  const [simType, setSimType] = useState('weather_monsoon');

  const fetchData = async () => {
    try {
      const [resStats, resDisruptions] = await Promise.all([
        fetch('/api/operator/stats'),
        fetch('/api/operator/disruptions')
      ]);

      const sData = await resStats.json();
      const dData = await resDisruptions.json();

      if (sData.success) setStats(sData.stats);
      if (dData.success) setDisruptions(dData.disruptions || []);
    } catch (e) {
      console.error('Failed to load operator dashboard data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleTriggerSimulation = async () => {
    setSimulating(true);
    try {
      const res = await fetch('/api/operator/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: simType })
      });
      const data = await res.json();
      if (data.success) {
        fetchData();
        window.location.href = '/operator/alerts';
      } else {
        alert(data.error || 'Failed to simulate');
      }
    } catch (err) {
      console.error(err);
      alert('Error triggering simulation');
    } finally {
      setSimulating(false);
    }
  };

  const pendingDisruptions = disruptions.filter(d => d.status === 'detected' || d.status === 'alternatives_generated');

  return (
    <div style={{ maxWidth: '1360px', margin: '0 auto' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{
            fontSize: '1.9rem',
            fontWeight: 800,
            color: '#0f172a',
            letterSpacing: '-0.02em',
            marginBottom: '6px'
          }}>
            Operations Overview
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.92rem' }}>
            Monitor active regional itineraries, live bookings, hotel inventory & tour operations.
          </p>
        </div>

        <button
          onClick={fetchData}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            borderRadius: '10px',
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            color: '#334155',
            fontSize: '0.85rem',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
            transition: 'all 0.15s'
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
          onMouseLeave={e => e.currentTarget.style.background = '#ffffff'}
        >
          <RefreshIcon size={14} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* KPI Stat Cards Row — Main Site Clean Card Aesthetic */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
        gap: '20px',
        marginBottom: '32px'
      }}>
        {/* Card 1: Active Tours */}
        <div style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          padding: '22px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Active Tours</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(37, 99, 235, 0.1)', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <LayoutDashboardIcon size={18} />
            </div>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>
            {stats ? stats.activeTours : '—'}
          </div>
          <div style={{ fontSize: '0.76rem', color: '#059669', marginTop: '10px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span>●</span> Live GPS & coordinator sync
          </div>
        </div>

        {/* Card 2: Disruption Alerts */}
        <div style={{
          background: pendingDisruptions.length > 0 ? '#fff1f2' : '#ffffff',
          border: pendingDisruptions.length > 0 ? '1px solid #fecdd3' : '1px solid #e2e8f0',
          borderRadius: '16px',
          padding: '22px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: pendingDisruptions.length > 0 ? '#e11d48' : '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Disruption Alerts
            </span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: pendingDisruptions.length > 0 ? '#ffe4e6' : 'rgba(239, 68, 68, 0.1)', color: '#e11d48', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AlertTriangleIcon size={18} />
            </div>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: pendingDisruptions.length > 0 ? '#e11d48' : '#0f172a', lineHeight: 1 }}>
            {pendingDisruptions.length}
          </div>
          <div style={{ fontSize: '0.76rem', color: pendingDisruptions.length > 0 ? '#e11d48' : '#64748b', marginTop: '10px', fontWeight: 600 }}>
            {pendingDisruptions.length > 0 ? 'Requires 1-Click AI Approval ↗' : 'All itineraries on schedule'}
          </div>
        </div>

        {/* Card 3: Confirmed Bookings */}
        <div style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          padding: '22px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Live Bookings</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.1)', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CreditCardIcon size={18} />
            </div>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>
            {stats ? stats.confirmedBookings : '—'}
          </div>
          <div style={{ fontSize: '0.76rem', color: '#059669', marginTop: '10px', fontWeight: 600 }}>
            Verified with hotel & cab APIs
          </div>
        </div>

        {/* Card 4: Inventory Nodes */}
        <div style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          padding: '22px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Inventory Nodes</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(168, 85, 247, 0.1)', color: '#9333ea', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <PackageIcon size={18} />
            </div>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>
            {stats ? stats.totalVendors : '—'}
          </div>
          <div style={{ fontSize: '0.76rem', color: '#64748b', marginTop: '10px', fontWeight: 600 }}>
            Across 12 Indian destination hubs
          </div>
        </div>
      </div>

      {/* Digital Twin & Geospatial Weather Command Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a, #1e293b)',
        borderRadius: '20px',
        padding: '24px 28px',
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px',
        marginBottom: '28px',
        boxShadow: '0 10px 30px rgba(15, 23, 42, 0.15)',
        border: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <div style={{
            width: '54px',
            height: '54px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 25px rgba(14, 165, 233, 0.4)'
          }}>
            <LightningIcon size={28} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', background: '#0284c7', padding: '2px 8px', borderRadius: '6px' }}>
                Digital Twin & GIS Radar Active
              </span>
              <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                Open-Meteo Real-Time Telemetry & Geospatial Impact Propagation
              </span>
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 900, margin: '2px 0 4px', letterSpacing: '-0.01em' }}>
              What-If Weather Simulation & Social Anomaly Radar
            </h3>
            <p style={{ fontSize: '0.86rem', color: '#cbd5e1', margin: 0, maxWidth: '640px' }}>
              Adjust live rainfall, wind squall, and storm duration parameters. Run what-if simulations and observe instant geospatial impact propagation.
            </p>
          </div>
        </div>

        <Link
          href="/operator/simulation"
          style={{
            padding: '12px 26px',
            borderRadius: '999px',
            background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
            color: '#ffffff',
            fontWeight: 800,
            fontSize: '0.88rem',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 6px 20px rgba(37, 99, 235, 0.4)'
          }}
        >
          <span>Launch Digital Twin Studio →</span>
        </Link>
      </div>

      {/* Main Grid: 2 Columns */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.8fr) minmax(0, 1.2fr)', gap: '24px' }}>
        {/* Left Column: Active Tour Plans & Today's Operations */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Active Tours Table Card */}
          <div style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '26px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '3px' }}>
                  Live Tour Plans
                </h2>
                <p style={{ color: '#64748b', fontSize: '0.85rem', margin: 0 }}>
                  Active traveler groups currently on location across India.
                </p>
              </div>
              <Link
                href="/operator/bookings"
                style={{
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  color: '#2563eb',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <span>All Bookings</span>
                <ArrowRightIcon size={12} />
              </Link>
            </div>

            {/* Tour Row Card */}
            <div style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '18px',
              marginBottom: '14px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                      Goa 4-Day Coastal Signature Experience
                    </span>
                    <span style={{
                      background: 'rgba(16, 185, 129, 0.12)',
                      color: '#059669',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      padding: '3px 10px',
                      borderRadius: '999px'
                    }}>
                      ACTIVE ON TOUR
                    </span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '4px' }}>
                    Lead Traveler: <strong style={{ color: '#334155' }}>Aditi Sharma (+91 98765 43210)</strong> • Coordinator: <strong style={{ color: '#334155' }}>Meera Nair</strong>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#2563eb' }}>
                    ₹41,200
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>4 Days • 7 Items</div>
                </div>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '12px',
                borderTop: '1px solid #e2e8f0',
                fontSize: '0.8rem',
                flexWrap: 'wrap',
                gap: '10px'
              }}>
                <span style={{ color: '#64748b' }}>
                  Current Zone: <strong style={{ color: '#0f172a' }}>Taj Exotica Resort & Spa (Benaulim, South Goa)</strong>
                </span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Link
                    href="/operator/tours/tour-goa-signature"
                    style={{
                      padding: '7px 14px',
                      borderRadius: '8px',
                      background: '#ffffff',
                      border: '1px solid #cbd5e1',
                      color: '#334155',
                      fontWeight: 600,
                      textDecoration: 'none',
                      fontSize: '0.8rem'
                    }}
                  >
                    View Roster
                  </Link>
                  <Link
                    href="/itinerary/tour-goa-signature"
                    target="_blank"
                    style={{
                      padding: '7px 14px',
                      borderRadius: '8px',
                      background: '#2563eb',
                      color: '#ffffff',
                      fontWeight: 700,
                      textDecoration: 'none',
                      fontSize: '0.8rem',
                      boxShadow: '0 2px 6px rgba(37, 99, 235, 0.25)'
                    }}
                  >
                    Traveler Itinerary ↗
                  </Link>
                </div>
              </div>
            </div>

            <div style={{ fontSize: '0.76rem', color: '#94a3b8', textAlign: 'center', marginTop: '10px' }}>
              ✦ Any itinerary generated on the Traveler Portal automatically appears in this operational view.
            </div>
          </div>

          {/* Coordinators Quick Panel */}
          <div style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <UsersIcon size={18} style={{ color: '#2563eb' }} />
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Ground Tour Coordinators</h3>
              </div>
              <Link href="/operator/coordinators" style={{ fontSize: '0.8rem', color: '#2563eb', fontWeight: 700, textDecoration: 'none' }}>
                Manage All →
              </Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
              {[
                { name: 'Meera Nair', hub: 'Goa & Coastal Hub', phone: '+91 98765 43210', active: 1 },
                { name: 'Vikram Chauhan', hub: 'Himachal & Valley Hub', phone: '+91 98111 22334', active: 2 },
                { name: 'Ananya Deshmukh', hub: 'Rajasthan Heritage Hub', phone: '+91 99201 55678', active: 0 }
              ].map(c => (
                <div key={c.name} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#0f172a' }}>{c.name}</div>
                  <div style={{ fontSize: '0.74rem', color: '#64748b', marginBottom: '6px' }}>{c.hub}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#64748b' }}>
                    <span>{c.phone}</span>
                    <span style={{ color: c.active > 0 ? '#059669' : '#94a3b8', fontWeight: 700 }}>
                      {c.active} Active {c.active === 1 ? 'Tour' : 'Tours'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Disruption Shield & Scenario Simulator */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Notifications Card */}
          <div style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '8px',
                  background: 'rgba(239, 68, 68, 0.1)',
                  color: '#e11d48',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <AlertTriangleIcon size={16} />
                </div>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Disruption Shield
                </h2>
              </div>
              <Link
                href="/operator/alerts"
                style={{
                  fontSize: '0.8rem',
                  color: '#2563eb',
                  fontWeight: 700,
                  textDecoration: 'none'
                }}
              >
                View Shield ({pendingDisruptions.length}) →
              </Link>
            </div>

            {pendingDisruptions.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '36px 16px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px', color: '#059669' }}>
                  <ShieldCheckIcon size={32} />
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#059669', marginBottom: '4px' }}>
                  Zero Operational Conflicts
                </div>
                <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                  All scheduled hotels, transfers, and activities operating within normal parameters.
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {pendingDisruptions.map(d => (
                  <div
                    key={d.id}
                    style={{
                      background: '#fff1f2',
                      border: '1px solid #fecdd3',
                      borderRadius: '12px',
                      padding: '16px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                      <span style={{
                        background: '#ffe4e6',
                        color: '#e11d48',
                        fontSize: '0.68rem',
                        fontWeight: 800,
                        padding: '2px 8px',
                        borderRadius: '999px',
                        textTransform: 'uppercase'
                      }}>
                        {d.source?.replace('_', ' ') || 'INCIDENT'}
                      </span>
                      <span style={{ fontSize: '0.72rem', color: '#9f1239' }}>
                        {new Date(d.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#881337', marginBottom: '4px' }}>
                      {d.affected_item_name}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#9f1239', lineHeight: 1.45, marginBottom: '12px' }}>
                      {d.reason}
                    </div>

                    {d.cascade_details && d.cascade_details.length > 0 && (
                      <div style={{ background: '#ffffff', padding: '8px 10px', borderRadius: '8px', fontSize: '0.72rem', color: '#64748b', marginBottom: '12px', border: '1px solid #fecdd3' }}>
                        <span style={{ color: '#d97706', fontWeight: 700 }}>Cascade Impact:</span> {d.cascade_details[0].impactReason}
                      </div>
                    )}

                    <Link
                      href="/operator/alerts"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        width: '100%',
                        padding: '9px',
                        borderRadius: '8px',
                        background: '#e11d48',
                        color: '#ffffff',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        textDecoration: 'none',
                        boxShadow: '0 2px 6px rgba(225, 29, 72, 0.25)'
                      }}
                    >
                      <span>Resolve in Disruption Shield</span>
                      <ArrowRightIcon size={12} />
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Scenario Simulator Card */}
          <div style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '8px',
                background: 'rgba(37, 99, 235, 0.1)',
                color: '#2563eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <SparklesIcon size={16} />
              </div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Disruption Simulator
              </h3>
            </div>
            <p style={{ color: '#64748b', fontSize: '0.82rem', lineHeight: 1.5, marginBottom: '16px' }}>
              Simulate vendor outages and adverse weather to showcase the AI constraint solver and auto-rerouting.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.74rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', display: 'block', marginBottom: '6px' }}>
                  Select Disruption Scenario
                </label>
                <select
                  value={simType}
                  onChange={(e) => setSimType(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: '10px',
                    background: '#f8fafc',
                    border: '1px solid #cbd5e1',
                    color: '#0f172a',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    outline: 'none'
                  }}
                >
                  <option value="weather_monsoon">Monsoon Coastal Red Alert (Port Suspends Scuba)</option>
                  <option value="hotel_unavailable">Resort Water Line Burst (Flooded Wing & Cancellation)</option>
                  <option value="transport_delay">Highway Landslide NH-66 (3.5hr Chauffeur Delay)</option>
                </select>
              </div>

              <button
                onClick={handleTriggerSimulation}
                disabled={simulating}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '13px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                  color: '#ffffff',
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(37, 99, 235, 0.25)',
                  opacity: simulating ? 0.7 : 1
                }}
              >
                <SparklesIcon size={14} />
                <span>{simulating ? 'Simulating Conflict & Cascade...' : 'Simulate Crisis & Open Shield ↗'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
