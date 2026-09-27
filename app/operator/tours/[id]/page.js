'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import {
  CheckCircleIcon,
  AlertTriangleIcon,
  CalendarIcon,
  MapPinIcon,
  ArrowRightIcon,
  ShieldCheckIcon
} from '@/components/ui/Icons';

export default function OperatorTourDetailPage({ params }) {
  const unwrappedParams = use(params);
  const id = unwrappedParams.id;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTour() {
      try {
        const res = await fetch(`/api/itinerary/${id}`);
        const json = await res.json();
        if (json.success) {
          setData(json);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadTour();
  }, [id]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>
        Loading operational roster...
      </div>
    );
  }

  if (!data || !data.tour_plan) {
    return (
      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '40px', textAlign: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
          Tour Not Found
        </h2>
        <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '16px' }}>
          No active operations roster found for ID: {id}
        </p>
        <Link
          href="/operator/dashboard"
          style={{
            padding: '8px 16px',
            borderRadius: '6px',
            background: '#2563eb',
            color: '#ffffff',
            fontWeight: 700,
            textDecoration: 'none',
            fontSize: '0.8rem'
          }}
        >
          ← Return to Dashboard
        </Link>
      </div>
    );
  }

  const { tour_plan, days, items } = data;
  const activeItems = items.filter(i => i.status !== 'replaced' && i.status !== 'cancelled');

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: '#64748b', marginBottom: '16px' }}>
        <Link href="/operator/dashboard" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 600 }}>Operator Hub</Link>
        <span>/</span>
        <Link href="/operator/tours" style={{ color: '#64748b', textDecoration: 'none' }}>Tour Packages</Link>
        <span>/</span>
        <span style={{ color: '#0f172a', fontWeight: 700 }}>Tour Operations Roster ({id})</span>
      </div>

      {/* Tour Meta Header Card */}
      <div style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        padding: '28px',
        marginBottom: '28px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.03)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span style={{
                background: '#ecfdf5',
                color: '#059669',
                border: '1px solid #a7f3d0',
                fontSize: '0.7rem',
                fontWeight: 800,
                padding: '3px 10px',
                borderRadius: '999px',
                textTransform: 'uppercase'
              }}>
                {tour_plan.status?.toUpperCase() || 'ACTIVE ON TOUR'}
              </span>
              <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>Ref: {tour_plan.id}</span>
            </div>

            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
              {tour_plan.tour_name}
            </h1>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', fontSize: '0.84rem', color: '#64748b' }}>
              <span>Lead: <strong style={{ color: '#0f172a' }}>{tour_plan.lead_traveler || 'Aditi Sharma'}</strong></span>
              <span>•</span>
              <span>Phone: <strong style={{ color: '#0f172a' }}>{tour_plan.lead_phone || '+91 98765 43210'}</strong></span>
              <span>•</span>
              <span>Pace: <strong style={{ color: '#0f172a', textTransform: 'capitalize' }}>{tour_plan.pace || 'Relaxed'}</strong></span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <Link
              href={`/itinerary/${id}`}
              target="_blank"
              style={{
                padding: '10px 18px',
                borderRadius: '8px',
                background: '#eff6ff',
                border: '1px solid #bfdbfe',
                color: '#2563eb',
                fontWeight: 700,
                fontSize: '0.82rem',
                textDecoration: 'none'
              }}
            >
              Open Traveler View ↗
            </Link>
            <Link
              href="/operator/alerts"
              style={{
                padding: '10px 18px',
                borderRadius: '8px',
                background: '#dc2626',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.82rem',
                textDecoration: 'none',
                boxShadow: '0 2px 8px rgba(220, 38, 38, 0.25)'
              }}
            >
              Simulate / Resolve Disruption
            </Link>
          </div>
        </div>

        {/* Metrics Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '12px',
          marginTop: '20px',
          paddingTop: '20px',
          borderTop: '1px solid #f1f5f9'
        }}>
          <div>
            <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Total Budget Cap</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>
              ₹{tour_plan.budget_total?.toLocaleString('en-IN') || '60,000'}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Committed Cost</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#2563eb', marginTop: '2px' }}>
              ₹{tour_plan.total_cost?.toLocaleString('en-IN')}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Active Events</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#059669', marginTop: '2px' }}>
              {activeItems.length} Scheduled
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Assigned Coordinator</div>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>
              Meera Nair (Goa Hub)
            </div>
          </div>
        </div>
      </div>

      {/* Day-by-Day Operational Run-Sheet */}
      <div>
        <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>
          Day-by-Day Logistics Run-Sheet
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {days.map((day) => {
            const dayItems = items.filter(i => i.day_number === day.day_number);

            return (
              <div
                key={day.id || day.day_number}
                style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '14px',
                  padding: '24px',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', paddingBottom: '12px', borderBottom: '1px solid #f1f5f9' }}>
                  <div>
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#2563eb', textTransform: 'uppercase' }}>
                      Day {day.day_number}
                    </span>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>
                      {day.title || `Day ${day.day_number} Itinerary`}
                    </h3>
                  </div>
                  <span style={{ fontSize: '0.78rem', color: '#64748b', background: '#f8fafc', padding: '4px 10px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                    {dayItems.length} Logistics Nodes
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {dayItems.map((item) => {
                    const isReplaced = item.status === 'replaced';
                    const isCancelled = item.status === 'cancelled';

                    return (
                      <div
                        key={item.id}
                        style={{
                          background: isReplaced ? '#fef2f2' : '#ffffff',
                          border: isReplaced ? '1px dashed #fecaca' : '1px solid #e2e8f0',
                          borderRadius: '10px',
                          padding: '14px 18px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          opacity: isReplaced || isCancelled ? 0.6 : 1
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                          <span style={{
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            color: '#64748b',
                            fontFamily: 'monospace',
                            minWidth: '95px'
                          }}>
                            {item.start_time || '10:00'} - {item.end_time || '12:00'}
                          </span>

                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ fontWeight: 800, fontSize: '0.92rem', color: '#0f172a', textDecoration: isReplaced ? 'line-through' : 'none' }}>
                                {item.name}
                              </span>
                              {isReplaced && (
                                <span style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fee2e2', fontSize: '0.68rem', fontWeight: 800, padding: '2px 6px', borderRadius: '4px' }}>
                                  AI REPLACED
                                </span>
                              )}
                              {item.notes && item.notes.includes('AI Replan') && (
                                <span style={{ background: '#ecfdf5', color: '#059669', border: '1px solid #a7f3d0', fontSize: '0.68rem', fontWeight: 800, padding: '2px 6px', borderRadius: '4px' }}>
                                  AI REPLAN DEPLOYED
                                </span>
                              )}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
                              {item.category || item.type} • {item.location || 'Verified Location'}
                            </div>
                          </div>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#0f172a' }}>
                            ₹{item.cost?.toLocaleString('en-IN')}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: isReplaced ? '#dc2626' : '#059669', fontWeight: 700, textTransform: 'uppercase' }}>
                            {item.status || 'Confirmed'}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
