'use client';

import { useState } from 'react';
import Link from 'next/link';
import DigitalTwinSimulator from '@/components/simulation/DigitalTwinSimulator';
import SocialSignalFeed from '@/components/social/SocialSignalFeed';
import { 
  LightningIcon, 
  BroadcastIcon, 
  AlertTriangleIcon, 
  ShieldCheckIcon,
  CompassIcon
} from '@/components/ui/Icons';

export default function OperatorSimulationPage() {
  const [selectedDest, setSelectedDest] = useState('Goa');
  const [notification, setNotification] = useState(null);

  const handleApplyDisruption = async (disruptionPayload) => {
    try {
      const res = await fetch('/api/operator/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(disruptionPayload)
      });
      const data = await res.json();
      if (data.success) {
        setNotification({
          type: 'success',
          message: `Disruption scenario successfully synchronized with live database (${disruptionPayload.destination || 'Goa'}). Alert is active in Disruption Shield.`
        });
      } else {
        setNotification({
          type: 'error',
          message: data.error || 'Database rejected the simulation update.'
        });
      }
    } catch (e) {
      console.error(e);
      setNotification({
        type: 'error',
        message: 'Network error connecting to simulation service.'
      });
    }
  };

  return (
    <div style={{ maxWidth: '1360px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{
              background: '#0284c7',
              color: '#ffffff',
              fontSize: '0.72rem',
              fontWeight: 800,
              padding: '3px 10px',
              borderRadius: '999px',
              textTransform: 'uppercase',
              letterSpacing: '0.04em'
            }}>
              Core Requirement 4 • Digital Twin
            </span>
            <span style={{
              background: '#ecfdf5',
              color: '#065f46',
              border: '1px solid #a7f3d0',
              fontSize: '0.72rem',
              fontWeight: 800,
              padding: '3px 10px',
              borderRadius: '999px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px'
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981' }} />
              Nugen AI Domain Aligned Engine
            </span>
            <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
              Real-Time What-If Scenario Lab & Impact Propagation
            </span>
          </div>
          <h1 style={{ fontSize: '1.9rem', fontWeight: 900, color: '#0f172a', margin: '4px 0 6px', letterSpacing: '-0.02em' }}>
            Digital Twin & Geospatial Simulation Command
          </h1>
          <p style={{ fontSize: '0.92rem', color: '#64748b', margin: 0, maxWidth: '820px' }}>
            Test weather extremes (intensity, wind speed, duration, temperature) across India’s primary travel corridors.
            Observe real-time impact radius expansion, affected vendor contracts, and automated AI mitigation rerouting.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <Link
            href="/operator/alerts"
            style={{
              padding: '10px 18px',
              borderRadius: '999px',
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              color: '#0f172a',
              fontWeight: 700,
              fontSize: '0.84rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
            }}
          >
            <AlertTriangleIcon size={16} color="#ef4444" />
            <span>View Active Disruption Shield →</span>
          </Link>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div style={{
          background: notification.type === 'success' ? '#f0fdf4' : '#fef2f2',
          border: `1px solid ${notification.type === 'success' ? '#86efac' : '#fca5a5'}`,
          borderRadius: '14px',
          padding: '14px 18px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          animation: 'fadeIn 0.2s ease'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ color: notification.type === 'success' ? '#16a34a' : '#dc2626' }}>
              <ShieldCheckIcon size={18} />
            </span>
            <span style={{ fontSize: '0.88rem', fontWeight: 700, color: notification.type === 'success' ? '#166534' : '#991b1b' }}>
              {notification.message}
            </span>
          </div>
          <button
            onClick={() => setNotification(null)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', fontWeight: 800 }}
          >
            ✕
          </button>
        </div>
      )}

      {/* 1. Digital Twin Simulator Studio (Requirements 2 & 4) */}
      <section>
        <DigitalTwinSimulator 
          initialDestination={selectedDest}
          onApplyDisruption={handleApplyDisruption}
        />
      </section>

      {/* 2. Real-World Social Signals Integration (Requirement 3) */}
      <section style={{ marginTop: '8px' }}>
        <SocialSignalFeed destination={selectedDest} />
      </section>
    </div>
  );
}
