'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  UsersIcon,
  CheckCircleIcon,
  RefreshIcon
} from '@/components/ui/Icons';

export default function OperatorCoordinatorsPage() {
  const [coordinators, setCoordinators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assigningTourId, setAssigningTourId] = useState('tour-goa-signature');
  const [selectedCoordId, setSelectedCoordId] = useState('');
  const [assigning, setAssigning] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null);

  const fetchCoordinators = async () => {
    try {
      const res = await fetch('/api/operator/coordinators');
      const data = await res.json();
      if (data.success) {
        setCoordinators(data.coordinators || []);
        if (data.coordinators.length > 0 && !selectedCoordId) {
          setSelectedCoordId(data.coordinators[0].id);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoordinators();
  }, []);

  const handleAssign = async (e) => {
    e.preventDefault();
    if (!selectedCoordId || !assigningTourId) return;

    setAssigning(true);
    setStatusMsg(null);
    try {
      const res = await fetch('/api/operator/coordinators', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tourPlanId: assigningTourId,
          coordinatorId: selectedCoordId
        })
      });
      const data = await res.json();
      if (data.success) {
        setStatusMsg('Coordinator successfully assigned to tour group.');
        fetchCoordinators();
      } else {
        alert(data.error || 'Assignment failed');
      }
    } catch (err) {
      console.error(err);
      alert('Error assigning coordinator');
    } finally {
      setAssigning(false);
    }
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 10px',
            borderRadius: '999px',
            background: '#eff6ff',
            border: '1px solid #bfdbfe',
            color: '#2563eb',
            fontSize: '0.72rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '8px'
          }}>
            On-Ground Operations • Guide Roster
          </div>
          <h1 style={{
            fontSize: '1.8rem',
            fontWeight: 800,
            color: '#0f172a',
            letterSpacing: '-0.02em',
            marginBottom: '4px'
          }}>
            Regional Tour Coordinators
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.88rem' }}>
            On-ground coordinators assigned to traveler groups to oversee vendor logistics, hotel check-ins, and emergency responses.
          </p>
        </div>

        <button
          onClick={fetchCoordinators}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '9px 16px',
            borderRadius: '8px',
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            color: '#334155',
            fontSize: '0.8rem',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
          }}
        >
          <RefreshIcon size={14} />
          <span>Refresh Roster</span>
        </button>
      </div>

      {statusMsg && (
        <div style={{
          background: '#ecfdf5',
          border: '1px solid #a7f3d0',
          borderRadius: '10px',
          padding: '14px 20px',
          marginBottom: '24px',
          color: '#065f46',
          fontWeight: 700,
          fontSize: '0.86rem',
          boxShadow: '0 1px 3px rgba(16, 185, 129, 0.1)'
        }}>
          ✓ {statusMsg}
        </div>
      )}

      {/* Grid: Left = Coordinator Cards, Right = Quick Assignment Tool */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '24px' }}>
        {/* Coordinators List */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
          {loading ? (
            <div style={{ color: '#64748b', padding: '40px' }}>Loading coordinators...</div>
          ) : (
            coordinators.map(c => (
              <div
                key={c.id}
                style={{
                  background: '#ffffff',
                  border: selectedCoordId === c.id ? '2px solid #2563eb' : '1px solid #e2e8f0',
                  borderRadius: '14px',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                  transition: 'all 0.15s ease'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '0.95rem',
                        boxShadow: '0 2px 6px rgba(37, 99, 235, 0.2)'
                      }}>
                        {c.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '1rem', color: '#0f172a' }}>{c.name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{c.base || 'Regional Ops Base'}</div>
                      </div>
                    </div>

                    <span style={{
                      background: c.active_tours > 0 ? '#ecfdf5' : '#f1f5f9',
                      color: c.active_tours > 0 ? '#059669' : '#64748b',
                      border: c.active_tours > 0 ? '1px solid #a7f3d0' : '1px solid #e2e8f0',
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      padding: '3px 8px',
                      borderRadius: '999px'
                    }}>
                      {c.active_tours} Active Tour
                    </span>
                  </div>

                  <div style={{ fontSize: '0.78rem', color: '#475569', marginBottom: '6px' }}>
                    Phone: <strong style={{ color: '#0f172a' }}>{c.phone}</strong>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#475569', marginBottom: '16px' }}>
                    Email: <span style={{ color: '#2563eb' }}>{c.email}</span>
                  </div>

                  {c.assigned_tours && c.assigned_tours.length > 0 && (
                    <div style={{ background: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: '8px', padding: '10px 12px', fontSize: '0.75rem' }}>
                      <div style={{ color: '#64748b', fontWeight: 700, marginBottom: '4px', textTransform: 'uppercase' }}>Assigned Tours:</div>
                      {c.assigned_tours.map(t => (
                        <div key={t.id} style={{ color: '#0f172a', fontWeight: 600 }}>
                          • {t.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div style={{ paddingTop: '16px', borderTop: '1px solid #f1f5f9', marginTop: '16px' }}>
                  <button
                    onClick={() => {
                      setSelectedCoordId(c.id);
                    }}
                    style={{
                      width: '100%',
                      padding: '9px',
                      borderRadius: '8px',
                      background: selectedCoordId === c.id ? '#eff6ff' : '#f8fafc',
                      border: selectedCoordId === c.id ? '1px solid #2563eb' : '1px solid #e2e8f0',
                      color: selectedCoordId === c.id ? '#2563eb' : '#475569',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {selectedCoordId === c.id ? '✓ Selected for Assignment' : 'Select Coordinator'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Quick Assignment Form */}
        <div>
          <div style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '14px',
            padding: '24px',
            position: 'sticky',
            top: '20px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.03)'
          }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
              Assign Coordinator to Tour
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.8rem', lineHeight: 1.5, marginBottom: '20px' }}>
              Link a certified local coordinator to lead hotel check-in and handle any emergency escalations.
            </p>

            <form onSubmit={handleAssign} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', display: 'block', marginBottom: '6px' }}>
                  Target Tour Group
                </label>
                <select
                  value={assigningTourId}
                  onChange={(e) => setAssigningTourId(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    color: '#0f172a',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    outline: 'none'
                  }}
                >
                  <option value="tour-goa-signature">Goa 4-Day Coastal Signature Experience</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', display: 'block', marginBottom: '6px' }}>
                  Assign Coordinator
                </label>
                <select
                  value={selectedCoordId}
                  onChange={(e) => setSelectedCoordId(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    color: '#0f172a',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    outline: 'none'
                  }}
                >
                  {coordinators.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.base})
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={assigning}
                style={{
                  padding: '12px',
                  borderRadius: '8px',
                  background: '#2563eb',
                  color: '#ffffff',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(37, 99, 235, 0.25)',
                  opacity: assigning ? 0.7 : 1
                }}
              >
                {assigning ? 'Dispatching...' : 'Confirm Assignment'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
