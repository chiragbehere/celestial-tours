'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  CreditCardIcon,
  CheckCircleIcon,
  RefreshIcon
} from '@/components/ui/Icons';

export default function OperatorBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const fetchBookings = async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.append('status', statusFilter);

      const res = await fetch(`/api/operator/bookings?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        setBookings(json.bookings || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [statusFilter]);

  const handleUpdateStatus = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      const res = await fetch('/api/operator/bookings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        fetchBookings();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUpdatingId(null);
    }
  };

  const totalRevenue = bookings
    .filter(b => b.status === 'confirmed')
    .reduce((sum, b) => sum + (b.amount || 0), 0);

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
            background: '#ecfdf5',
            border: '1px solid #a7f3d0',
            color: '#059669',
            fontSize: '0.72rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '8px'
          }}>
            Financial & Settlement Ledger
          </div>
          <h1 style={{
            fontSize: '1.8rem',
            fontWeight: 800,
            color: '#0f172a',
            letterSpacing: '-0.02em',
            marginBottom: '4px'
          }}>
            Traveler Bookings & Vendor Vouchers
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.88rem' }}>
            Unified ledger of hotel rooms, certified chauffeur legs, and activity reservations booked across tours.
          </p>
        </div>

        <button
          onClick={fetchBookings}
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
          <span>Refresh Bookings</span>
        </button>
      </div>

      {/* Metrics Strip */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          <div style={{ fontSize: '0.74rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>Total Ledger Records</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>{bookings.length}</div>
        </div>
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          <div style={{ fontSize: '0.74rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>Confirmed Vouchers</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#059669', marginTop: '4px' }}>
            {bookings.filter(b => b.status === 'confirmed').length}
          </div>
        </div>
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          <div style={{ fontSize: '0.74rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>Gross Confirmed Value</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#2563eb', marginTop: '4px' }}>
            ₹{totalRevenue.toLocaleString('en-IN')}
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        padding: '10px 14px',
        marginBottom: '20px',
        display: 'flex',
        gap: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
      }}>
        {[
          { id: '', label: 'All Vouchers' },
          { id: 'confirmed', label: 'Confirmed' },
          { id: 'pending', label: 'Pending' },
          { id: 'cancelled', label: 'Cancelled' }
        ].map(f => (
          <button
            key={f.id}
            onClick={() => setStatusFilter(f.id)}
            style={{
              padding: '7px 16px',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              border: 'none',
              background: statusFilter === f.id ? '#2563eb' : 'transparent',
              color: statusFilter === f.id ? '#ffffff' : '#64748b',
              transition: 'all 0.15s ease'
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Bookings Table */}
      <div style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '14px',
        overflow: 'hidden',
        boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
      }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>Loading bookings ledger...</div>
        ) : bookings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>No bookings matching current filter.</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <th style={{ padding: '14px 18px', fontWeight: 700 }}>Voucher Ref</th>
                  <th style={{ padding: '14px 18px', fontWeight: 700 }}>Traveler</th>
                  <th style={{ padding: '14px 18px', fontWeight: 700 }}>Supplier / Entity</th>
                  <th style={{ padding: '14px 18px', fontWeight: 700 }}>Category</th>
                  <th style={{ padding: '14px 18px', fontWeight: 700 }}>Amount</th>
                  <th style={{ padding: '14px 18px', fontWeight: 700 }}>Status</th>
                  <th style={{ padding: '14px 18px', textAlign: 'right', fontWeight: 700 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map(b => (
                  <tr key={b.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '14px 18px', fontFamily: 'monospace', color: '#2563eb', fontWeight: 600 }}>
                      {b.id}
                    </td>
                    <td style={{ padding: '14px 18px', fontWeight: 700, color: '#0f172a' }}>
                      {b.traveler_name || 'Aditi Sharma'}
                    </td>
                    <td style={{ padding: '14px 18px', color: '#334155', maxWidth: '240px' }}>
                      <div style={{ fontWeight: 600 }}>{b.vendor_name || 'Vendor Entity'}</div>
                      {b.notes && <div style={{ fontSize: '0.74rem', color: '#dc2626' }}>{b.notes}</div>}
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <span style={{
                        background: '#f1f5f9',
                        color: '#475569',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        textTransform: 'uppercase'
                      }}>
                        {b.vendor_type}
                      </span>
                    </td>
                    <td style={{ padding: '14px 18px', fontWeight: 800, color: '#0f172a' }}>
                      ₹{b.amount?.toLocaleString('en-IN')}
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <span style={{
                        background: b.status === 'confirmed' ? '#ecfdf5' : b.status === 'cancelled' ? '#fef2f2' : '#fffbeb',
                        color: b.status === 'confirmed' ? '#059669' : b.status === 'cancelled' ? '#dc2626' : '#d97706',
                        border: b.status === 'confirmed' ? '1px solid #a7f3d0' : b.status === 'cancelled' ? '1px solid #fee2e2' : '1px solid #fde68a',
                        padding: '3px 10px',
                        borderRadius: '999px',
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        textTransform: 'uppercase'
                      }}>
                        {b.status}
                      </span>
                    </td>
                    <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                      {b.status !== 'confirmed' ? (
                        <button
                          onClick={() => handleUpdateStatus(b.id, 'confirmed')}
                          disabled={updatingId === b.id}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '6px',
                            background: '#059669',
                            color: '#ffffff',
                            border: 'none',
                            fontSize: '0.74rem',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          Confirm
                        </button>
                      ) : (
                        <span style={{ fontSize: '0.74rem', color: '#059669', fontWeight: 600 }}>Settled</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
