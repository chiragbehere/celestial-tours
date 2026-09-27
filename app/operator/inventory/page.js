'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  PackageIcon,
  BedIcon,
  CarIcon,
  CompassIcon,
  SearchIcon,
  RefreshIcon,
  StarFillIcon,
  ActivityIcon,
  XIcon
} from '@/components/ui/Icons';

export default function OperatorInventoryPage() {
  const [activeTab, setActiveTab] = useState('hotels');
  const [data, setData] = useState({ hotels: [], activities: [], transport: [], destinations: [] });
  const [loading, setLoading] = useState(true);
  const [selectedDestId, setSelectedDestId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [togglingId, setTogglingId] = useState(null);
  const [conflictNotice, setConflictNotice] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [adding, setAdding] = useState(false);
  const [newItem, setNewItem] = useState({
    type: 'hotel',
    name: '',
    destination_id: 'dest-goa',
    destination: 'Goa',
    category: '',
    price_per_night: 5000,
    cost: 2500,
    tier: 'premium',
    mode: 'Private AC Cab',
    capacity: 4
  });

  const handleAddInventory = async (e) => {
    e.preventDefault();
    setAdding(true);
    try {
      const payload = {
        type: newItem.type,
        data: {
          name: newItem.name,
          destination_id: newItem.destination_id,
          destination: data.destinations.find(d => d.id === newItem.destination_id)?.name || 'Goa',
          category: newItem.category || (newItem.type === 'hotel' ? 'Boutique Resort' : newItem.type === 'activity' ? 'Curated Experience' : 'Private Transport'),
          rating: 4.9,
          available: true,
          ...(newItem.type === 'hotel' ? { price_per_night: Number(newItem.price_per_night) || 4500, tier: newItem.tier } : {}),
          ...(newItem.type === 'activity' ? { cost: Number(newItem.cost) || 2000, duration_hours: 3 } : {}),
          ...(newItem.type === 'transport' ? { cost: Number(newItem.cost) || 1800, mode: newItem.mode, capacity: Number(newItem.capacity) || 4, from_destination_id: newItem.destination_id } : {})
        }
      };

      const res = await fetch('/api/operator/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const resJson = await res.json();
      if (resJson.success) {
        setShowAddModal(false);
        setNewItem({
          type: 'hotel',
          name: '',
          destination_id: 'dest-goa',
          destination: 'Goa',
          category: '',
          price_per_night: 5000,
          cost: 2500,
          tier: 'premium',
          mode: 'Private AC Cab',
          capacity: 4
        });
        fetchInventory();
        alert(`Success: ${resJson.message}`);
      } else {
        alert(resJson.error || 'Failed to add item');
      }
    } catch (err) {
      console.error(err);
      alert('Network error adding inventory item');
    } finally {
      setAdding(false);
    }
  };

  const fetchInventory = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedDestId) params.append('destination_id', selectedDestId);

      const res = await fetch(`/api/operator/inventory?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        setData(json);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, [selectedDestId]);

  const handleToggleAvailability = async (type, item) => {
    setTogglingId(item.id);
    setConflictNotice(null);
    try {
      const res = await fetch('/api/operator/inventory', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          id: item.id,
          available: !item.available,
          reason: `Manual operator toggle: ${item.name} set to ${!item.available ? 'Available' : 'Unavailable'}`
        })
      });
      const resJson = await res.json();
      if (resJson.success) {
        fetchInventory();
        if (resJson.conflictsDetected > 0) {
          setConflictNotice({
            message: `Outage alert: ${resJson.conflictsDetected} active tour plan(s) affected by ${item.name} unavailability. Incident automatically logged in Disruption Shield.`,
            count: resJson.conflictsDetected
          });
        }
      }
    } catch (e) {
      console.error(e);
      alert('Error updating inventory status');
    } finally {
      setTogglingId(null);
    }
  };

  const getFilteredItems = (items) => {
    if (!searchQuery) return items;
    const q = searchQuery.toLowerCase();
    return items.filter(i =>
      i.name?.toLowerCase().includes(q) ||
      i.category?.toLowerCase().includes(q) ||
      i.tier?.toLowerCase().includes(q) ||
      i.mode?.toLowerCase().includes(q)
    );
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
            background: 'rgba(168, 85, 247, 0.15)',
            border: '1px solid rgba(168, 85, 247, 0.3)',
            color: '#c084fc',
            fontSize: '0.72rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '8px'
          }}>
            FR11 • INVENTORY & VENDOR ALLOCATION
          </div>
          <h1 style={{
            fontSize: '1.8rem',
            fontWeight: 800,
            color: '#ffffff',
            letterSpacing: '-0.02em',
            marginBottom: '4px'
          }}>
            Inventory Nodes & Supplier Availability
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.88rem' }}>
            Toggling a supplier to unavailable triggers instant DAG dependency conflict checks across all live tour rosters.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            onClick={() => setShowAddModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
              border: 'none',
              color: '#ffffff',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)'
            }}
          >
            <span>+</span>
            <span>Add Inventory Item</span>
          </button>

          <button
            onClick={fetchInventory}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 16px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: '#e2e8f0',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <RefreshIcon size={14} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Conflict Notice Banner */}
      {conflictNotice && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid rgba(239, 68, 68, 0.4)',
          borderRadius: '10px',
          padding: '16px 20px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: '#f87171'
        }}>
          <span style={{ fontWeight: 700, fontSize: '0.88rem' }}>{conflictNotice.message}</span>
          <Link
            href="/operator/alerts"
            style={{
              fontSize: '0.78rem',
              fontWeight: 800,
              padding: '6px 14px',
              borderRadius: '6px',
              background: '#ef4444',
              color: '#ffffff',
              textDecoration: 'none'
            }}
          >
            Open Disruption Shield ↗
          </Link>
        </div>
      )}

      {/* Filters & Tabs Bar */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.8)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '14px',
        padding: '16px 20px',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {[
            { id: 'hotels', label: `Hotels (${data.hotels.length})`, icon: BedIcon },
            { id: 'activities', label: `Experiences (${data.activities.length})`, icon: CompassIcon },
            { id: 'transport', label: `Transit & Chauffeurs (${data.transport.length})`, icon: CarIcon }
          ].map(t => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  background: isActive ? 'rgba(37, 99, 235, 0.25)' : 'transparent',
                  border: isActive ? '1px solid rgba(56, 189, 248, 0.4)' : '1px solid transparent',
                  color: isActive ? '#38bdf8' : '#94a3b8',
                  fontSize: '0.82rem',
                  fontWeight: isActive ? 700 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <Icon size={16} />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search & Destination Dropdown */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <select
            value={selectedDestId}
            onChange={(e) => setSelectedDestId(e.target.value)}
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              background: '#090d16',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#f8fafc',
              fontSize: '0.8rem',
              fontWeight: 600,
              outline: 'none'
            }}
          >
            <option value="">All Destinations</option>
            {data.destinations.map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Search vendor or amenity..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              background: '#090d16',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#f8fafc',
              fontSize: '0.8rem',
              outline: 'none',
              minWidth: '220px'
            }}
          />
        </div>
      </div>

      {/* Inventory Items Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>Loading inventory nodes...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
          {activeTab === 'hotels' && getFilteredItems(data.hotels).map(h => (
            <div
              key={h.id}
              style={{
                background: '#090d16',
                border: h.available ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(239, 68, 68, 0.35)',
                borderRadius: '12px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 4px 14px rgba(0,0,0,0.2)'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <span style={{
                    background: h.tier === 'premium' ? 'rgba(168, 85, 247, 0.15)' : 'rgba(56, 189, 248, 0.15)',
                    color: h.tier === 'premium' ? '#c084fc' : '#38bdf8',
                    border: '1px solid rgba(255,255,255,0.08)',
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: '999px',
                    textTransform: 'uppercase'
                  }}>
                    {h.tier} Tier
                  </span>
                  <span style={{
                    background: h.available ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                    color: h.available ? '#34d399' : '#f87171',
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: '999px'
                  }}>
                    {h.available ? 'LIVE • AVAILABLE' : 'UNAVAILABLE / OUTAGE'}
                  </span>
                </div>

                <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#ffffff', marginBottom: '4px' }}>
                  {h.name}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span>Rating:</span>
                  <StarFillIcon size={12} color="#fbbf24" />
                  <strong style={{ color: '#fbbf24' }}>{h.rating || '4.8'}</strong>
                  <span>• Capacity: {h.capacity || 40} rooms</span>
                </div>

                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
                  {h.amenities?.map(a => (
                    <span key={a} style={{ background: 'rgba(255,255,255,0.04)', color: '#94a3b8', fontSize: '0.68rem', padding: '2px 6px', borderRadius: '4px' }}>
                      {a}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '14px',
                borderTop: '1px solid rgba(255, 255, 255, 0.06)'
              }}>
                <div>
                  <div style={{ fontSize: '0.68rem', color: '#64748b', textTransform: 'uppercase' }}>Per Night</div>
                  <div style={{ fontWeight: 800, fontSize: '1rem', color: '#ffffff' }}>
                    ₹{h.price_per_night?.toLocaleString('en-IN')}
                  </div>
                </div>

                <button
                  onClick={() => handleToggleAvailability('hotel', h)}
                  disabled={togglingId === h.id}
                  style={{
                    padding: '7px 14px',
                    borderRadius: '6px',
                    background: h.available ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                    border: h.available ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(16, 185, 129, 0.3)',
                    color: h.available ? '#f87171' : '#34d399',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {togglingId === h.id ? 'Updating...' : h.available ? 'Mark Unavailable' : 'Restore Online'}
                </button>
              </div>
            </div>
          ))}

          {activeTab === 'activities' && getFilteredItems(data.activities).map(a => (
            <div
              key={a.id}
              style={{
                background: '#090d16',
                border: a.available ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(239, 68, 68, 0.35)',
                borderRadius: '12px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <span style={{
                    background: 'rgba(56, 189, 248, 0.15)',
                    color: '#38bdf8',
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: '999px',
                    textTransform: 'uppercase'
                  }}>
                    {a.category}
                  </span>
                  <span style={{
                    background: a.available ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                    color: a.available ? '#34d399' : '#f87171',
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: '999px'
                  }}>
                    {a.available ? 'LIVE' : 'UNAVAILABLE'}
                  </span>
                </div>

                <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#ffffff', marginBottom: '4px' }}>
                  {a.name}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', lineHeight: 1.4, marginBottom: '12px' }}>
                  {a.description}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#64748b', marginBottom: '16px' }}>
                  Operating: {a.opening_time} - {a.closing_time} • {a.duration_minutes} min duration
                </div>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '14px',
                borderTop: '1px solid rgba(255, 255, 255, 0.06)'
              }}>
                <div>
                  <div style={{ fontSize: '0.68rem', color: '#64748b', textTransform: 'uppercase' }}>Ticket / Person</div>
                  <div style={{ fontWeight: 800, fontSize: '1rem', color: '#ffffff' }}>
                    ₹{a.price?.toLocaleString('en-IN')}
                  </div>
                </div>

                <button
                  onClick={() => handleToggleAvailability('activity', a)}
                  disabled={togglingId === a.id}
                  style={{
                    padding: '7px 14px',
                    borderRadius: '6px',
                    background: a.available ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                    border: a.available ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(16, 185, 129, 0.3)',
                    color: a.available ? '#f87171' : '#34d399',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {togglingId === a.id ? 'Updating...' : a.available ? 'Mark Unavailable' : 'Restore Online'}
                </button>
              </div>
            </div>
          ))}

          {activeTab === 'transport' && getFilteredItems(data.transport).map(t => (
            <div
              key={t.id}
              style={{
                background: '#090d16',
                border: t.available ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(239, 68, 68, 0.35)',
                borderRadius: '12px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <span style={{
                    background: 'rgba(56, 189, 248, 0.15)',
                    color: '#38bdf8',
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: '999px',
                    textTransform: 'uppercase'
                  }}>
                    {t.mode}
                  </span>
                  <span style={{
                    background: t.available ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                    color: t.available ? '#34d399' : '#f87171',
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: '999px'
                  }}>
                    {t.available ? 'LIVE' : 'UNAVAILABLE'}
                  </span>
                </div>

                <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#ffffff', marginBottom: '4px' }}>
                  {t.provider}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '14px' }}>
                  Mode: <strong style={{ color: '#ffffff', textTransform: 'capitalize' }}>{t.mode}</strong> • Transit Time: ~{t.duration_minutes} min
                </div>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '14px',
                borderTop: '1px solid rgba(255, 255, 255, 0.06)'
              }}>
                <div>
                  <div style={{ fontSize: '0.68rem', color: '#64748b', textTransform: 'uppercase' }}>Fixed Fare</div>
                  <div style={{ fontWeight: 800, fontSize: '1rem', color: '#ffffff' }}>
                    ₹{t.price?.toLocaleString('en-IN')}
                  </div>
                </div>

                <button
                  onClick={() => handleToggleAvailability('transport', t)}
                  disabled={togglingId === t.id}
                  style={{
                    padding: '7px 14px',
                    borderRadius: '6px',
                    background: t.available ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                    border: t.available ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(16, 185, 129, 0.3)',
                    color: t.available ? '#f87171' : '#34d399',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {togglingId === t.id ? 'Updating...' : t.available ? 'Mark Unavailable' : 'Restore Online'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Inventory Modal */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.78)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div style={{
            background: '#0f172a',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '20px',
            maxWidth: '560px',
            width: '100%',
            padding: '32px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>Add Regional Inventory Node</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginTop: '4px', margin: 0 }}>Instantly available to AI itinerary planner & live booking engine</p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              >
                <XIcon size={20} />
              </button>
            </div>

            <form onSubmit={handleAddInventory} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>Inventory Type</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {[
                    { id: 'hotel', label: 'Hotel / Resort', icon: <BedIcon size={16} /> },
                    { id: 'activity', label: 'Experience', icon: <ActivityIcon size={16} /> },
                    { id: 'transport', label: 'Transport', icon: <CarIcon size={16} /> }
                  ].map(t => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setNewItem({ ...newItem, type: t.id })}
                      style={{
                        flex: 1,
                        padding: '10px 8px',
                        borderRadius: '8px',
                        background: newItem.type === t.id ? '#2563eb' : '#1e293b',
                        color: '#ffffff',
                        border: newItem.type === t.id ? '1px solid #60a5fa' : '1px solid rgba(255, 255, 255, 0.08)',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}
                    >
                      {t.icon}
                      <span>{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>Destination Hub</label>
                <select
                  value={newItem.destination_id}
                  onChange={(e) => {
                    const dest = data.destinations.find(d => d.id === e.target.value);
                    setNewItem({ ...newItem, destination_id: e.target.value, destination: dest?.name || 'Goa' });
                  }}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: '#1e293b', border: '1px solid rgba(255, 255, 255, 0.12)', color: '#fff', fontSize: '0.88rem' }}
                >
                  {data.destinations.map(d => (
                    <option key={d.id} value={d.id}>{d.name} ({d.state})</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>Item Name / Vendor Title</label>
                <input
                  type="text"
                  required
                  placeholder={newItem.type === 'hotel' ? 'e.g. Grand Heritage Palace Resort' : newItem.type === 'activity' ? 'e.g. Scuba Diving at Netrani Pier' : 'e.g. Luxury Innova Crysta Airport Transfer'}
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: '#1e293b', border: '1px solid rgba(255, 255, 255, 0.12)', color: '#fff', fontSize: '0.88rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>
                    {newItem.type === 'hotel' ? 'Rate / Night (₹)' : 'Fare / Cost (₹)'}
                  </label>
                  <input
                    type="number"
                    required
                    min={500}
                    value={newItem.type === 'hotel' ? newItem.price_per_night : newItem.cost}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (newItem.type === 'hotel') setNewItem({ ...newItem, price_per_night: val });
                      else setNewItem({ ...newItem, cost: val });
                    }}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: '#1e293b', border: '1px solid rgba(255, 255, 255, 0.12)', color: '#fff', fontSize: '0.88rem' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>Category / Classification</label>
                  <input
                    type="text"
                    placeholder="e.g. 5-Star Luxury, Adventure, AC Sedan"
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: '#1e293b', border: '1px solid rgba(255, 255, 255, 0.12)', color: '#fff', fontSize: '0.88rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '14px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{ flex: 1, padding: '12px', borderRadius: '8px', background: 'transparent', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#cbd5e1', cursor: 'pointer', fontWeight: 600 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={adding}
                  style={{ flex: 2, padding: '12px', borderRadius: '8px', background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', border: 'none', color: '#fff', cursor: 'pointer', fontWeight: 700, boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)' }}
                >
                  {adding ? 'Publishing...' : '+ Publish to Live Inventory'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
