'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  PackageIcon,
  SparklesIcon,
  MapPinIcon,
  CalendarIcon,
  RefreshIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  XIcon
} from '@/components/ui/Icons';

export default function OperatorToursPage() {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [filterDest, setFilterDest] = useState('all');
  const [successBanner, setSuccessBanner] = useState(null);

  // Form State for creating custom package
  const [newTour, setNewTour] = useState({
    tour_name: '',
    destination: 'Goa',
    duration_days: 5,
    accommodation_tier: 'premium',
    pace: 'relaxed',
    budget_total: 55000,
    group_size: 2,
    operator_name: 'Incredible India Tours DMC'
  });

  const fetchTours = async () => {
    try {
      const res = await fetch('/api/operator/tours');
      const data = await res.json();
      if (data.success) {
        setTours(data.tours || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTours();
  }, []);

  const handleCreatePackage = async (e) => {
    e.preventDefault();
    if (!newTour.tour_name.trim()) return;

    setCreating(true);
    setSuccessBanner(null);

    try {
      const res = await fetch('/api/operator/tours', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tour_name: newTour.tour_name,
          destinations: [newTour.destination],
          duration_days: parseInt(newTour.duration_days),
          accommodation_tier: newTour.accommodation_tier,
          pace: newTour.pace,
          budget_total: parseInt(newTour.budget_total),
          group_size: parseInt(newTour.group_size),
          operator_name: newTour.operator_name
        })
      });

      const data = await res.json();
      if (data.success) {
        setSuccessBanner(`Package "${newTour.tour_name}" published successfully! Travelers can now book this experience.`);
        setShowCreateModal(false);
        setNewTour({
          tour_name: '',
          destination: 'Goa',
          duration_days: 5,
          accommodation_tier: 'premium',
          pace: 'relaxed',
          budget_total: 55000,
          group_size: 2,
          operator_name: 'Incredible India Tours DMC'
        });
        fetchTours();
      } else {
        alert(data.error || 'Failed to publish package');
      }
    } catch (err) {
      console.error(err);
      alert('Error creating tour package');
    } finally {
      setCreating(false);
    }
  };

  const filteredTours = tours.filter(t => {
    if (filterDest === 'all') return true;
    return t.destinations?.some(d => d.toLowerCase().includes(filterDest.toLowerCase()));
  });

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
            Package Catalog & Itinerary Publishing
          </div>
          <h1 style={{
            fontSize: '1.8rem',
            fontWeight: 800,
            color: '#0f172a',
            letterSpacing: '-0.02em',
            marginBottom: '4px'
          }}>
            Tour Packages & Custom Itineraries
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.88rem' }}>
            Build, price, and publish signature packages with bundled hotels, chauffeured routes, and excursions across India.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={fetchTours}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 14px',
              borderRadius: '8px',
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              color: '#475569',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
            }}
          >
            <RefreshIcon size={14} />
            <span>Refresh</span>
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '9px 18px',
              borderRadius: '8px',
              background: '#2563eb',
              color: '#ffffff',
              fontSize: '0.82rem',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(37, 99, 235, 0.25)',
              transition: 'all 0.15s ease'
            }}
          >
            <span>+ Build New Package</span>
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {successBanner && (
        <div style={{
          background: '#ecfdf5',
          border: '1px solid #a7f3d0',
          borderRadius: '10px',
          padding: '14px 20px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          color: '#065f46',
          boxShadow: '0 1px 3px rgba(16, 185, 129, 0.1)'
        }}>
          <CheckCircleIcon size={20} />
          <span style={{ fontWeight: 700, fontSize: '0.86rem' }}>{successBanner}</span>
        </div>
      )}

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', overflowX: 'auto', paddingBottom: '4px' }}>
        {[
          { id: 'all', label: 'All Destinations' },
          { id: 'goa', label: 'Goa Coastal' },
          { id: 'manali', label: 'Manali & Himachal' },
          { id: 'jaipur', label: 'Rajasthan Heritage' },
          { id: 'kerala', label: 'Kerala Backwaters' },
          { id: 'kashmir', label: 'Kashmir Valley' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilterDest(tab.id)}
            style={{
              padding: '8px 18px',
              borderRadius: '999px',
              background: filterDest === tab.id ? '#2563eb' : '#ffffff',
              border: filterDest === tab.id ? '1px solid #2563eb' : '1px solid #e2e8f0',
              color: filterDest === tab.id ? '#ffffff' : '#64748b',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
              transition: 'all 0.15s ease'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Packages Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '80px', color: '#64748b' }}>
          Loading operator tour packages...
        </div>
      ) : filteredTours.length === 0 ? (
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '60px 24px', textAlign: 'center' }}>
          <PackageIcon size={36} style={{ color: '#cbd5e1', margin: '0 auto 12px' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
            No packages found
          </h3>
          <p style={{ color: '#64748b', fontSize: '0.84rem', marginBottom: '20px' }}>
            Click &ldquo;+ Build New Package&rdquo; above to construct your first custom itinerary!
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            style={{
              padding: '9px 18px',
              borderRadius: '8px',
              background: '#2563eb',
              color: '#ffffff',
              fontSize: '0.82rem',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer'
            }}
          >
            + Create Package
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '24px' }}>
          {filteredTours.map(tour => {
            const destName = tour.destinations?.[0] || 'India';
            const price = tour.budget_total || tour.total_cost || 45000;

            return (
              <div
                key={tour.id}
                style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                }}
              >
                <div>
                  {/* Top Image Banner */}
                  <div style={{
                    height: '180px',
                    width: '100%',
                    background: `linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.5) 100%), url(${tour.image_url || 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&auto=format&fit=crop&q=80'}) center/cover no-repeat`,
                    position: 'relative',
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxSizing: 'border-box'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{
                        background: 'rgba(255, 255, 255, 0.92)',
                        backdropFilter: 'blur(4px)',
                        color: '#0f172a',
                        fontWeight: 800,
                        fontSize: '0.7rem',
                        padding: '3px 10px',
                        borderRadius: '999px',
                        textTransform: 'uppercase'
                      }}>
                        {destName}
                      </span>

                      <span style={{
                        background: '#059669',
                        color: '#ffffff',
                        fontWeight: 800,
                        fontSize: '0.68rem',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        textTransform: 'uppercase'
                      }}>
                        {tour.status?.toUpperCase() || 'ACTIVE'}
                      </span>
                    </div>

                    <div style={{ color: '#ffffff' }}>
                      <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 700, opacity: 0.9 }}>
                        {tour.accommodation_tier?.toUpperCase() || 'PREMIUM'} • {tour.pace?.toUpperCase() || 'BALANCED'}
                      </div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800, textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                        {tour.tour_name}
                      </div>
                    </div>
                  </div>

                  {/* Body Specs */}
                  <div style={{ padding: '20px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #f1f5f9' }}>
                      <div>
                        <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Duration</div>
                        <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>{tour.duration_days || 4} Days</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Group Size</div>
                        <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>{tour.group_size || 2} Pax</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Est. Cost</div>
                        <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#2563eb' }}>₹{price.toLocaleString('en-IN')}</div>
                      </div>
                    </div>

                    <div style={{ fontSize: '0.76rem', color: '#64748b', marginBottom: '4px' }}>
                      Operator: <strong style={{ color: '#334155' }}>{tour.operator_name || 'Incredible Tours DMC'}</strong>
                    </div>
                    <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                      Assigned Lead: {tour.lead_traveler || 'Open Traveler Group'}
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div style={{
                  padding: '16px 20px',
                  background: '#f8fafc',
                  borderTop: '1px solid #f1f5f9',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <Link
                    href={`/itinerary/${tour.id}`}
                    target="_blank"
                    style={{
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      color: '#64748b',
                      textDecoration: 'none'
                    }}
                  >
                    Traveler View ↗
                  </Link>
                  <Link
                    href={`/operator/tours/${tour.id}`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 14px',
                      borderRadius: '8px',
                      background: '#2563eb',
                      color: '#ffffff',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      textDecoration: 'none',
                      boxShadow: '0 2px 6px rgba(37, 99, 235, 0.2)'
                    }}
                  >
                    <span>Manage Roster</span>
                    <ArrowRightIcon size={14} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Package Modal */}
      {showCreateModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          background: 'rgba(15, 23, 42, 0.45)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '28px',
            maxWidth: '560px',
            width: '100%',
            boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '2px' }}>
                  Create New Tour Package
                </h3>
                <p style={{ color: '#64748b', fontSize: '0.8rem', margin: 0 }}>
                  Build custom packages bundled with stays, private chauffeur legs, and curated activities.
                </p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              >
                <XIcon size={20} />
              </button>
            </div>

            <form onSubmit={handleCreatePackage} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.76rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
                  Package Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kashmir Valley Tulip & Houseboat Odyssey"
                  value={newTour.tour_name}
                  onChange={(e) => setNewTour({ ...newTour, tour_name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    background: '#f8fafc',
                    border: '1px solid #cbd5e1',
                    color: '#0f172a',
                    fontSize: '0.86rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.76rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
                    Primary Destination
                  </label>
                  <select
                    value={newTour.destination}
                    onChange={(e) => setNewTour({ ...newTour, destination: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      background: '#f8fafc',
                      border: '1px solid #cbd5e1',
                      color: '#0f172a',
                      fontSize: '0.84rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="Goa">Goa (Coastal & Beaches)</option>
                    <option value="Manali">Manali (Himachal Snow & Treks)</option>
                    <option value="Jaipur">Jaipur (Rajasthan Palaces)</option>
                    <option value="Munnar">Munnar (Kerala Tea Hills)</option>
                    <option value="Rishikesh">Rishikesh (Ganga Rafting & Ashrams)</option>
                    <option value="Kashmir">Kashmir (Srinagar & Gulmarg)</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.76rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
                    Duration (Days)
                  </label>
                  <input
                    type="number"
                    min="2"
                    max="14"
                    value={newTour.duration_days}
                    onChange={(e) => setNewTour({ ...newTour, duration_days: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      background: '#f8fafc',
                      border: '1px solid #cbd5e1',
                      color: '#0f172a',
                      fontSize: '0.86rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.76rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
                    Accommodation Tier
                  </label>
                  <select
                    value={newTour.accommodation_tier}
                    onChange={(e) => setNewTour({ ...newTour, accommodation_tier: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      background: '#f8fafc',
                      border: '1px solid #cbd5e1',
                      color: '#0f172a',
                      fontSize: '0.84rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="luxury">Luxury Heritage (Taj / Oberoi)</option>
                    <option value="premium">Premium 4-Star Resort</option>
                    <option value="standard">Standard Boutique Hotel</option>
                    <option value="budget">Comfort Homestay / Eco Lodge</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.76rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
                    Pacing
                  </label>
                  <select
                    value={newTour.pace}
                    onChange={(e) => setNewTour({ ...newTour, pace: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      background: '#f8fafc',
                      border: '1px solid #cbd5e1',
                      color: '#0f172a',
                      fontSize: '0.84rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="relaxed">Relaxed & Leisure</option>
                    <option value="moderate">Moderate & Balanced</option>
                    <option value="fast">Fast-Paced Explorer</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.76rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
                    Package Price (₹ per person)
                  </label>
                  <input
                    type="number"
                    min="5000"
                    step="1000"
                    value={newTour.budget_total}
                    onChange={(e) => setNewTour({ ...newTour, budget_total: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      background: '#f8fafc',
                      border: '1px solid #cbd5e1',
                      color: '#0f172a',
                      fontSize: '0.86rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.76rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
                    Publishing Operator Agency
                  </label>
                  <input
                    type="text"
                    value={newTour.operator_name}
                    onChange={(e) => setNewTour({ ...newTour, operator_name: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      background: '#f8fafc',
                      border: '1px solid #cbd5e1',
                      color: '#0f172a',
                      fontSize: '0.86rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  style={{
                    padding: '10px 18px',
                    borderRadius: '8px',
                    background: '#f1f5f9',
                    border: '1px solid #e2e8f0',
                    color: '#475569',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  style={{
                    padding: '10px 22px',
                    borderRadius: '8px',
                    background: '#2563eb',
                    border: 'none',
                    color: '#ffffff',
                    fontSize: '0.84rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(37, 99, 235, 0.25)',
                    opacity: creating ? 0.7 : 1
                  }}
                >
                  {creating ? 'Publishing Package...' : 'Publish Tour Package'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
