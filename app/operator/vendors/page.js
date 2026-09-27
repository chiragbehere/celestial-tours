'use client';

import { useState, useEffect } from 'react';
import { RefreshIcon, StarFillIcon, XIcon, CheckCircleIcon } from '@/components/ui/Icons';



export default function OperatorVendorsPage() {
  const [vendors, setVendors] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [dispatchStatus, setDispatchStatus] = useState(null);
  const [selectedVendorForDispatch, setSelectedVendorForDispatch] = useState(null);
  const [customMsg, setCustomMsg] = useState('');
  const [dispatching, setDispatching] = useState(false);
  const [showAddVendorModal, setShowAddVendorModal] = useState(false);
  const [addingVendor, setAddingVendor] = useState(false);
  const [newVendorData, setNewVendorData] = useState({
    name: '',
    category: 'Hospitality / Resort',
    destination: 'Goa',
    contact_person: '',
    phone: '',
    email: '',
    service_rate: 4500,
    sla_score: 98
  });

  const handleAddVendor = async (e) => {
    e.preventDefault();
    if (!newVendorData.name) return;
    setAddingVendor(true);
    try {
      const res = await fetch('/api/operator/vendors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create',
          vendorData: newVendorData
        })
      });
      const data = await res.json();
      if (data.success) {
        setShowAddVendorModal(false);
        setNewVendorData({
          name: '',
          category: 'Hospitality / Resort',
          destination: 'Goa',
          contact_person: '',
          phone: '',
          email: '',
          service_rate: 4500,
          sla_score: 98
        });
        await fetchVendors();
        setDispatchStatus(`Successfully enrolled new vendor "${data.vendor?.name}" into active network & live inventory!`);
      } else {
        alert(data.error || 'Failed to add vendor');
      }
    } catch (err) {
      console.error(err);
      alert('Error creating vendor option');
    } finally {
      setAddingVendor(false);
    }
  };

  const fetchVendors = async () => {
    try {
      const res = await fetch('/api/operator/vendors');
      const data = await res.json();
      if (data.success) {
        setVendors(data.vendors || []);
        setStats(data.stats || null);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const handleDispatch = async (e) => {
    e.preventDefault();
    if (!selectedVendorForDispatch) return;
    setDispatching(true);
    setDispatchStatus(null);
    try {
      const res = await fetch('/api/operator/vendors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vendorId: selectedVendorForDispatch.id,
          message: customMsg || `Updated itinerary schedule broadcast for ${selectedVendorForDispatch.name}.`
        })
      });
      const data = await res.json();
      if (data.success) {
        setDispatchStatus(`Successfully dispatched notification to ${selectedVendorForDispatch.name} via WhatsApp/Webhook.`);
        setSelectedVendorForDispatch(null);
        setCustomMsg('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDispatching(false);
    }
  };

  const filteredVendors = vendors.filter(v => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'hotel') return v.category.includes('Hospitality');
    if (activeFilter === 'activity') return v.category.includes('Experience');
    if (activeFilter === 'transport') return v.category.includes('Fleet');
    return true;
  });

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '4px 10px', borderRadius: '999px',
            background: '#eff6ff', border: '1px solid #bfdbfe',
            color: '#2563eb', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px'
          }}>
            Supplier Network & B2B Settlements
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', marginBottom: '4px' }}>
            Vendor Coordination & Financial Settlements
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.88rem' }}>
            Centralized hub for managing hotels, transport providers, excursion operators, automated dispatches, and SLA performance.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setShowAddVendorModal(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '9px 18px', borderRadius: '8px',
              background: '#2563eb', border: 'none',
              color: '#ffffff', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(37,99,235,0.3)'
            }}
          >
            <span>＋ Add Vendor Option</span>
          </button>

          <button
            onClick={fetchVendors}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '9px 16px', borderRadius: '8px',
              background: '#ffffff', border: '1px solid #e2e8f0',
              color: '#334155', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer',
              boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
            }}
          >
            <RefreshIcon size={14} />
            <span>Refresh Vendors</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Row */}
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '28px' }}>
          <div style={{ background: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
            <div style={{ fontSize: '0.74rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Contracted Vendors</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>{stats.totalVendors}</div>
            <div style={{ fontSize: '0.76rem', color: '#059669', marginTop: '2px', fontWeight: 600 }}>{stats.activeContracts} Active Contracts</div>
          </div>
          <div style={{ background: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
            <div style={{ fontSize: '0.74rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Pending Settlements</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#d97706', marginTop: '4px' }}>₹{stats.totalPendingSettlements.toLocaleString('en-IN')}</div>
            <div style={{ fontSize: '0.76rem', color: '#64748b', marginTop: '2px' }}>Awaiting bi-weekly cycle</div>
          </div>
          <div style={{ background: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
            <div style={{ fontSize: '0.74rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Settled Payouts</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#2563eb', marginTop: '4px' }}>₹{stats.totalSettledPayouts.toLocaleString('en-IN')}</div>
            <div style={{ fontSize: '0.76rem', color: '#64748b', marginTop: '2px' }}>Total disbursed to date</div>
          </div>
          <div style={{ background: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
            <div style={{ fontSize: '0.74rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Avg SLA Compliance</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#059669', marginTop: '4px' }}>{stats.avgSlaScore}%</div>
            <div style={{ fontSize: '0.76rem', color: '#64748b', marginTop: '2px' }}>On-time arrival & service</div>
          </div>
        </div>
      )}

      {/* Notification Banner */}
      {dispatchStatus && (
        <div style={{
          background: '#ecfdf5', border: '1px solid #a7f3d0',
          borderRadius: '10px', padding: '14px 20px', marginBottom: '24px',
          color: '#065f46', fontWeight: 700, fontSize: '0.86rem',
          boxShadow: '0 1px 3px rgba(16, 185, 129, 0.1)'
        }}>
          ✓ {dispatchStatus}
        </div>
      )}

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', overflowX: 'auto', paddingBottom: '4px' }}>
        {[
          { id: 'all', label: 'All Suppliers' },
          { id: 'hotel', label: 'Hotels & Resorts' },
          { id: 'activity', label: 'Activities & Excursions' },
          { id: 'transport', label: 'Chauffeurs & Fleets' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id)}
            style={{
              padding: '8px 18px', borderRadius: '999px',
              background: activeFilter === tab.id ? '#2563eb' : '#ffffff',
              border: activeFilter === tab.id ? '1px solid #2563eb' : '1px solid #e2e8f0',
              color: activeFilter === tab.id ? '#ffffff' : '#64748b',
              fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer',
              boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
              transition: 'all 0.15s ease'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Vendor Table */}
      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', overflow: 'hidden', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <th style={{ padding: '14px 20px', color: '#64748b', fontWeight: 700, fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>SUPPLIER / VENDOR</th>
              <th style={{ padding: '14px 20px', color: '#64748b', fontWeight: 700, fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>CATEGORY</th>
              <th style={{ padding: '14px 20px', color: '#64748b', fontWeight: 700, fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>DESTINATION</th>
              <th style={{ padding: '14px 20px', color: '#64748b', fontWeight: 700, fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>SLA & RATING</th>
              <th style={{ padding: '14px 20px', color: '#64748b', fontWeight: 700, fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>SETTLEMENT STATUS</th>
              <th style={{ padding: '14px 20px', color: '#64748b', fontWeight: 700, fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.04em', textAlign: 'right' }}>OPERATIONAL ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredVendors.map(v => (
              <tr key={v.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '16px 20px' }}>
                  <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.92rem' }}>{v.name}</div>
                  <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '2px' }}>
                    Contact: {v.contact_person} • {v.phone}
                  </div>
                </td>
                <td style={{ padding: '16px 20px', color: '#334155' }}>
                  {v.category}
                </td>
                <td style={{ padding: '16px 20px' }}>
                  <span style={{ padding: '3px 8px', borderRadius: '6px', background: '#eff6ff', color: '#2563eb', fontWeight: 700, fontSize: '0.74rem', border: '1px solid #bfdbfe' }}>
                    {v.destination}
                  </span>
                </td>
                <td style={{ padding: '16px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ color: '#d97706', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                      <StarFillIcon size={12} color="#d97706" />
                      <span>{v.rating}</span>
                    </span>
                    <span style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 700 }}>({v.sla_score}% SLA)</span>
                  </div>
                </td>
                <td style={{ padding: '16px 20px' }}>
                  <div style={{ color: '#d97706', fontWeight: 700 }}>
                    ₹{v.pending_payout.toLocaleString('en-IN')} <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Pending</span>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                    ₹{v.settled_payout.toLocaleString('en-IN')} Settled
                  </div>
                </td>
                <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                  <button
                    onClick={() => {
                      setSelectedVendorForDispatch(v);
                      setCustomMsg(`Attention ${v.name}: Please note traveler itinerary check-in confirmed for upcoming tour. Group size 2.`);
                    }}
                    style={{
                      padding: '7px 14px', borderRadius: '6px',
                      background: '#eff6ff', border: '1px solid #bfdbfe',
                      color: '#2563eb', fontSize: '0.76rem', fontWeight: 700, cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    Broadcast Dispatch ↗
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Dispatch Modal */}
      {selectedVendorForDispatch && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
        }}>
          <div style={{
            background: '#ffffff', border: '1px solid #e2e8f0',
            borderRadius: '16px', padding: '28px', maxWidth: '520px', width: '100%',
            boxShadow: '0 20px 40px rgba(0,0,0,0.12)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
                Broadcast Itinerary Update to Supplier
              </h3>
              <button
                onClick={() => setSelectedVendorForDispatch(null)}
                style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              >
                <XIcon size={18} />
              </button>
            </div>

            <p style={{ color: '#475569', fontSize: '0.82rem', marginBottom: '16px', lineHeight: 1.5 }}>
              Sending direct dispatch to <strong>{selectedVendorForDispatch.name}</strong> ({selectedVendorForDispatch.phone}).
            </p>

            <form onSubmit={handleDispatch}>
              <textarea
                rows={4}
                value={customMsg}
                onChange={(e) => setCustomMsg(e.target.value)}
                style={{
                  width: '100%', padding: '12px', borderRadius: '8px',
                  background: '#f8fafc', border: '1px solid #cbd5e1',
                  color: '#0f172a', fontSize: '0.85rem', outline: 'none', resize: 'vertical',
                  marginBottom: '16px', boxSizing: 'border-box'
                }}
              />

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setSelectedVendorForDispatch(null)}
                  style={{
                    padding: '9px 16px', borderRadius: '8px',
                    background: '#f1f5f9', border: '1px solid #e2e8f0', color: '#475569',
                    fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={dispatching}
                  style={{
                    padding: '9px 20px', borderRadius: '8px',
                    background: '#2563eb', border: 'none', color: '#ffffff',
                    fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(37, 99, 235, 0.25)'
                  }}
                >
                  {dispatching ? 'Broadcasting...' : 'Send Dispatch'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Vendor Option Modal */}
      {showAddVendorModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: '20px'
        }}>
          <div style={{
            background: '#ffffff', borderRadius: '16px', maxWidth: '580px', width: '100%',
            padding: '28px', border: '1px solid #e2e8f0', boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
            maxHeight: '90vh', overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Add New Vendor Option
                </h3>
                <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '2px 0 0 0' }}>
                  Enroll a new partner hotel, excursion provider, or chauffeur fleet into the live network.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddVendorModal(false)}
                style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              >
                <XIcon size={18} />
              </button>
            </div>

            <form onSubmit={handleAddVendor} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Vendor / Business Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alila Diwa Luxury Resort / Mandovi Catamaran Cruise"
                  value={newVendorData.name}
                  onChange={(e) => setNewVendorData({ ...newVendorData, name: e.target.value })}
                  style={{
                    width: '100%', padding: '10px 14px', borderRadius: '8px',
                    background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a',
                    fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Category *
                  </label>
                  <select
                    value={newVendorData.category}
                    onChange={(e) => setNewVendorData({ ...newVendorData, category: e.target.value })}
                    style={{
                      width: '100%', padding: '10px 12px', borderRadius: '8px',
                      background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a',
                      fontSize: '0.84rem', outline: 'none', boxSizing: 'border-box'
                    }}
                  >
                    <option value="Hospitality / Resort">Hospitality / Resort (Hotel Stay)</option>
                    <option value="Experience & Excursions">Experience & Excursions (Activity)</option>
                    <option value="Fleet & Chauffeur Services">Fleet & Chauffeur Services (Transit)</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Destination *
                  </label>
                  <select
                    value={newVendorData.destination}
                    onChange={(e) => setNewVendorData({ ...newVendorData, destination: e.target.value })}
                    style={{
                      width: '100%', padding: '10px 12px', borderRadius: '8px',
                      background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a',
                      fontSize: '0.84rem', outline: 'none', boxSizing: 'border-box'
                    }}
                  >
                    <option value="Goa">Goa</option>
                    <option value="Manali">Manali</option>
                    <option value="Jaipur">Jaipur</option>
                    <option value="Munnar">Munnar</option>
                    <option value="Rishikesh">Rishikesh</option>
                    <option value="Udaipur">Udaipur</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Unit Rate / Cost (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min={200}
                    step={100}
                    placeholder="4500"
                    value={newVendorData.service_rate}
                    onChange={(e) => setNewVendorData({ ...newVendorData, service_rate: Number(e.target.value) })}
                    style={{
                      width: '100%', padding: '10px 14px', borderRadius: '8px',
                      background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a',
                      fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    SLA Compliance Score (%)
                  </label>
                  <input
                    type="number"
                    min={80}
                    max={100}
                    value={newVendorData.sla_score}
                    onChange={(e) => setNewVendorData({ ...newVendorData, sla_score: Number(e.target.value) })}
                    style={{
                      width: '100%', padding: '10px 14px', borderRadius: '8px',
                      background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a',
                      fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Contact Person
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Sunil Kamat (GM)"
                    value={newVendorData.contact_person}
                    onChange={(e) => setNewVendorData({ ...newVendorData, contact_person: e.target.value })}
                    style={{
                      width: '100%', padding: '10px 14px', borderRadius: '8px',
                      background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a',
                      fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Contact Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 98200 44556"
                    value={newVendorData.phone}
                    onChange={(e) => setNewVendorData({ ...newVendorData, phone: e.target.value })}
                    style={{
                      width: '100%', padding: '10px 14px', borderRadius: '8px',
                      background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a',
                      fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddVendorModal(false)}
                  style={{
                    padding: '10px 18px', borderRadius: '8px',
                    background: '#f1f5f9', border: '1px solid #e2e8f0', color: '#475569',
                    fontSize: '0.84rem', fontWeight: 600, cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addingVendor}
                  style={{
                    padding: '10px 22px', borderRadius: '8px',
                    background: '#2563eb', border: 'none', color: '#ffffff',
                    fontSize: '0.84rem', fontWeight: 700, cursor: 'pointer',
                    boxShadow: '0 2px 10px rgba(37, 99, 235, 0.3)'
                  }}
                >
                  {addingVendor ? 'Enrolling Vendor...' : 'Save & Publish to Live Inventory'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
