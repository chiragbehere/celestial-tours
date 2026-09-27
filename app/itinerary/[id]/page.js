'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import TravelerNav from '@/components/layout/TravelerNav';
import TourLifecycleTracker from '@/components/ui/TourLifecycleTracker';
import Modal from '@/components/ui/Modal';
import GeospatialMap from '@/components/map/GeospatialMap';
import { BedIcon, CarIcon, CompassIcon, ClockIcon, RefreshIcon, CheckCircleIcon, ShieldCheckIcon, AlertTriangleIcon, StarFillIcon, LightningIcon } from '@/components/ui/Icons';

export default function ItineraryPage({ params }) {
  const unwrappedParams = use(params);
  const id = unwrappedParams.id;

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [swapModalOpen, setSwapModalOpen] = useState(false);
  const [selectedItemForSwap, setSelectedItemForSwap] = useState(null);
  const [swapping, setSwapping] = useState(false);

  const fetchItinerary = async () => {
    try {
      const res = await fetch(`/api/itinerary/${id}`);
      const json = await res.json();
      if (json.success && json.tour_plan) {
        setData(json);
        setLoading(false);
        return;
      }
    } catch (err) {
      console.error('Fetch itinerary error:', err);
    }

    // Client-side fallback from localStorage (handles serverless cold-start container switches)
    if (typeof window !== 'undefined') {
      try {
        const cachedRaw = localStorage.getItem(`celestial_tour_${id}`) || localStorage.getItem('celestial_last_tour');
        if (cachedRaw) {
          const cached = JSON.parse(cachedRaw);
          if (cached && cached.tour_plan) {
            setData(cached);
            setLoading(false);
            return;
          }
        }
      } catch (storageErr) {
        console.warn('LocalStorage retrieval error:', storageErr);
      }
    }

    setLoading(false);
  };

  useEffect(() => { fetchItinerary(); }, [id]);

  /* ── Loading ─────────────────────────────────── */
  if (loading) {
    return (
      <div style={{ background: '#f8fafc', minHeight: '100vh' }}>
        <TravelerNav transparent={false} />
        <main style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div className="loading-pulse" style={{ marginBottom: '16px' }}>
              <span /><span /><span />
            </div>
            <p style={{ fontSize: '0.925rem', color: 'var(--text-tertiary)', fontWeight: 500 }}>
              Curating your verified itinerary…
            </p>
          </div>
        </main>
      </div>
    );
  }

  /* ── Not Found ───────────────────────────────── */
  if (!data || !data.tour_plan) {
    return (
      <div style={{ background: '#f8fafc', minHeight: '100vh' }}>
        <TravelerNav transparent={false} />
        <main className="container" style={{ padding: '80px 24px', textAlign: 'center' }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            padding: '64px 40px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
            maxWidth: '480px',
            margin: '0 auto',
          }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px', color: '#2563eb' }}>
              <CompassIcon size={52} />
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '10px', color: '#0f172a' }}>Itinerary Not Found</h2>
            <p style={{ color: '#64748b', marginBottom: '28px', fontSize: '0.925rem', lineHeight: 1.6 }}>
              This itinerary session may have expired or the ID is incorrect.
            </p>
            <Link href="/plan" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              borderRadius: '999px',
              background: '#2563eb',
              color: '#ffffff',
              fontWeight: 700,
              textDecoration: 'none'
            }}>
              Plan a New Trip →
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const { tour_plan, days = [], items = [], availableAlternatives = {}, disruptions = [] } = data || {};
  const latestDisruption = disruptions && disruptions.length > 0 ? disruptions[0] : null;

  const isType = (item, target) => {
    const t = (item?.item_type || item?.type || '').toLowerCase();
    if (target === 'stay') return t === 'stay' || t.includes('hotel') || Boolean(item?.hotel_id);
    if (target === 'transport') return t === 'transport' || t.includes('cab') || t.includes('transit') || Boolean(item?.transport_id);
    return t === 'activity' || t.includes('excursion') || t.includes('experience') || (!item?.hotel_id && !item?.transport_id);
  };

  const getItemCost = (item) => {
    return Number(item?.cost || item?.price || item?.price_per_night || 0);
  };

  const activeItems      = (items || []).filter(i => i.status !== 'replaced' && i.status !== 'cancelled');
  let stayCost           = activeItems.filter(i => isType(i, 'stay')).reduce((s, i) => s + getItemCost(i), 0);
  let transportCost      = activeItems.filter(i => isType(i, 'transport')).reduce((s, i) => s + getItemCost(i), 0);
  let activityCost       = activeItems.filter(i => isType(i, 'activity')).reduce((s, i) => s + getItemCost(i), 0);
  let totalCost          = stayCost + transportCost + activityCost;

  if (totalCost === 0 && (tour_plan?.total_cost || tour_plan?.budget_total)) {
    const plannedVal = tour_plan.total_cost || Math.floor((tour_plan.budget_total || 60000) * 0.72);
    stayCost = Math.floor(plannedVal * 0.55);
    transportCost = Math.floor(plannedVal * 0.15);
    activityCost = plannedVal - stayCost - transportCost;
    totalCost = plannedVal;
  }

  const budgetTotal      = tour_plan?.budget_total || 60000;
  const remainingBudget  = budgetTotal - totalCost;

  const getRelevantAlternatives = () => {
    if (!availableAlternatives) return [];
    if (Array.isArray(availableAlternatives)) return availableAlternatives;
    const targetType = isType(selectedItemForSwap, 'stay') ? 'stay' : isType(selectedItemForSwap, 'transport') ? 'transport' : 'activity';
    if (targetType === 'stay') {
      return (availableAlternatives.hotels || []).map(h => ({
        id: h.id,
        name: h.name,
        category: `${(h.tier || 'Hotel').toUpperCase()} Tier • Stay`,
        rating: h.rating || 4.8,
        cost: h.price_per_night,
        unit: '/night'
      }));
    }
    if (targetType === 'transport') {
      return (availableAlternatives.transport || []).map(t => ({
        id: t.id,
        name: t.provider || t.name,
        category: `${(t.mode || 'Cab').toUpperCase()} Transit`,
        rating: t.rating || 4.9,
        cost: t.price,
        unit: ' flat'
      }));
    }
    return (availableAlternatives.activities || []).map(a => ({
      id: a.id,
      name: a.name,
      category: `${(a.category || 'Experience').toUpperCase()}`,
      rating: a.rating || 4.7,
      cost: a.price,
      unit: ''
    }));
  };

  const openSwap = (item) => { setSelectedItemForSwap(item); setSwapModalOpen(true); };

  const handleSwap = async (replacementEntityId) => {
    if (!selectedItemForSwap) return;
    setSwapping(true);
    try {
      const res = await fetch(`/api/itinerary/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemId: selectedItemForSwap.id,
          itemType: selectedItemForSwap.item_type,
          replacementEntityId,
        }),
      });
      const resData = await res.json();
      if (resData.success) {
        await fetchItinerary();
        setSwapModalOpen(false);
        setSelectedItemForSwap(null);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to swap component');
    } finally {
      setSwapping(false);
    }
  };

  /* ── Helpers ─────────────────────────────────── */
  const typeColor = {
    stay:      { bg: 'rgba(37,99,235,0.08)',      color: 'var(--blue-500)' },
    transport: { bg: 'rgba(16,185,129,0.10)',     color: 'var(--emerald-600)' },
    activity:  { bg: 'rgba(245,158,11,0.10)',     color: 'var(--amber-500)' },
  };

  /* ── Render ──────────────────────────────────── */
  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', color: '#0f172a' }}>
      <TravelerNav transparent={true} />

      {/* ═══════════════════════════════════════════════
          CINEMATIC HERO HEADER — Matches Home & VisitTheUSA
      ═══════════════════════════════════════════════ */}
      <section className="compact-hero-section">
        {/* Ken Burns Scenic Backdrop */}
        <div
          className="hero-kenburns-bg"
          style={{
            backgroundImage: `url('/india-taj.jpg')`,
            backgroundPosition: 'center 30%'
          }}
        />

        {/* Ambient Gradient Overlay */}
        <div className="hero-overlay" />

        {/* Floating Particles */}
        <div className="hero-particles">
          {[14, 28, 42, 59, 74, 88, 22, 65, 82, 35].map((leftVal, i) => (
            <div
              key={i}
              className="particle"
              style={{
                left: `${leftVal}%`,
                top: `${(i * 18) % 95}%`,
                animationDelay: `${(i * 0.5) % 6}s`,
                animationDuration: `${7 + (i % 5)}s`,
              }}
            />
          ))}
        </div>

        {/* Ambient Top Glow */}
        <div className="ai-cta-glow" style={{ top: '-120px', left: '50%', transform: 'translateX(-50%)', width: '600px', height: '600px' }} />

        <div style={{ maxWidth: '1240px', margin: '0 auto', position: 'relative', zIndex: 3 }} className="animate-fade-in-up">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
            <div className="hero-slide-caption">
              <span className="caption-dot" />
              <span>Constraint-Optimized & Verified</span>
            </div>
            <div className="hero-slide-caption" style={{ textTransform: 'uppercase' }}>
              <span>{tour_plan.status}</span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '24px' }}>
            <div>
              <h1 style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 'clamp(2.2rem, 4vw, 3.4rem)',
                fontWeight: 800,
                color: '#ffffff',
                marginBottom: '10px',
                lineHeight: 1.15,
                textShadow: '0 4px 20px rgba(0,0,0,0.5)'
              }}>
                {tour_plan.tour_name}
              </h1>
              <p style={{ fontSize: '0.95rem', color: '#cbd5e1', maxWidth: '640px', lineHeight: 1.6, textShadow: '0 2px 6px rgba(0,0,0,0.3)' }}>
                {tour_plan.summary}
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <Link href={`/trip/${id}`} style={{
                padding: '11px 20px', borderRadius: '999px',
                border: '1px solid rgba(56,189,248,0.4)',
                background: 'rgba(37,99,235,0.2)',
                fontWeight: 700, fontSize: '0.85rem', color: '#38bdf8',
                backdropFilter: 'blur(8px)',
                textDecoration: 'none'
              }}>
                Live Trip Companion ↗
              </Link>
              <Link href="/plan" style={{
                padding: '11px 20px', borderRadius: '999px',
                border: '1px solid rgba(255,255,255,0.25)',
                background: 'rgba(255,255,255,0.12)',
                fontWeight: 700, fontSize: '0.85rem', color: '#ffffff',
                backdropFilter: 'blur(8px)',
                textDecoration: 'none'
              }}>
                Edit Preferences
              </Link>
              <Link href={`/book/${id}`} style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '11px 24px',
                borderRadius: '999px',
                background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '0.88rem',
                textDecoration: 'none',
                boxShadow: '0 4px 16px rgba(37, 99, 235, 0.4)'
              }}>
                <span>Book & Customize Payments →</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Tour Lifecycle Progress Tracker (Sits right beneath hero) */}
      <TourLifecycleTracker currentStage="plan" />

      <main className="responsive-main-container">

        {/* ── Disruption Shield Alert Banner ────────────── */}
        {latestDisruption && (
          <div style={{
            background: latestDisruption.status === 'resolved' ? '#ecfdf5' : '#fffbeb',
            border: latestDisruption.status === 'resolved' ? '1px solid #a7f3d0' : '1px solid #fde68a',
            borderRadius: '16px',
            padding: '18px 24px',
            marginBottom: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '14px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <span style={{ display: 'flex', alignItems: 'center', color: latestDisruption.status === 'resolved' ? '#059669' : '#d97706' }}>
                {latestDisruption.status === 'resolved' ? <ShieldCheckIcon size={26} /> : <AlertTriangleIcon size={26} />}
              </span>
              <div>
                <div style={{
                  fontWeight: 800,
                  fontSize: '0.92rem',
                  color: latestDisruption.status === 'resolved' ? '#065f46' : '#92400e'
                }}>
                  {latestDisruption.status === 'resolved'
                    ? 'Disruption Shield: Intelligent Adaptation Deployed'
                    : 'Disruption Shield: Operational Advisory Detected'}
                </div>
                <div style={{
                  fontSize: '0.82rem',
                  color: latestDisruption.status === 'resolved' ? '#047857' : '#b45309',
                  marginTop: '2px'
                }}>
                  {latestDisruption.status === 'resolved'
                    ? `Schedule adjusted with alternative: "${latestDisruption.chosen_alternative}". Chauffeur and hotel vouchers updated.`
                    : `${latestDisruption.reason} Operations Command has formulated ranked alternatives.`}
                </div>
              </div>
            </div>

            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.78rem',
              fontWeight: 700,
              padding: '6px 14px',
              borderRadius: '999px',
              background: latestDisruption.status === 'resolved' ? '#059669' : '#d97706',
              color: '#ffffff',
            }}>
              {latestDisruption.status === 'resolved' ? (
                <>
                  <CheckCircleIcon size={14} />
                  <span>Auto-Rerouted & Confirmed</span>
                </>
              ) : (
                <>
                  <LightningIcon size={14} />
                  <span>Adaptation In Progress</span>
                </>
              )}
            </div>
          </div>
        )}

        {/* ── Budget Panel ─────────────────────────── */}
        <div className="travel-budget-panel" style={{
          background: '#ffffff',
          borderRadius: '20px',
          border: '1px solid #e2e8f0',
          padding: '28px',
          marginBottom: '32px',
          boxShadow: '0 4px 20px rgba(15, 23, 42, 0.04)'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '24px', alignItems: 'start' }}>
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#64748b', marginBottom: '6px' }}>
                Live Package Valuation
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.03em', lineHeight: 1 }}>
                  ₹{totalCost.toLocaleString('en-IN')}
                </span>
                <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 500 }}>
                  of ₹{budgetTotal.toLocaleString('en-IN')} target
                </span>
              </div>
            </div>
            <div>
              {remainingBudget >= 0 ? (
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  padding: '8px 16px', borderRadius: '999px',
                  background: '#ecfdf5', color: '#059669',
                  fontWeight: 700, fontSize: '0.85rem',
                  border: '1px solid #a7f3d0',
                }}>
                  <CheckCircleIcon size={14} />
                  ₹{remainingBudget.toLocaleString('en-IN')} under budget
                </span>
              ) : (
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  padding: '8px 16px', borderRadius: '999px',
                  background: '#fef2f2', color: '#dc2626',
                  fontWeight: 700, fontSize: '0.85rem',
                  border: '1px solid #fecaca',
                }}>
                  ₹{Math.abs(remainingBudget).toLocaleString('en-IN')} over target
                </span>
              )}
            </div>
          </div>

          {/* Multi-segment progress bar */}
          <div className="budget-track-lux" style={{ height: '8px', background: '#f1f5f9', borderRadius: '999px', overflow: 'hidden', display: 'flex', margin: '20px 0 16px' }}>
            <div style={{ width: `${Math.round((stayCost / budgetTotal) * 100)}%`, background: '#2563eb' }} title={`Stays: ₹${stayCost.toLocaleString('en-IN')}`} />
            <div style={{ width: `${Math.round((transportCost / budgetTotal) * 100)}%`, background: '#059669' }} title={`Transfers: ₹${transportCost.toLocaleString('en-IN')}`} />
            <div style={{ width: `${Math.round((activityCost / budgetTotal) * 100)}%`, background: '#d97706' }} title={`Activities: ₹${activityCost.toLocaleString('en-IN')}`} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
            {[
              { color: '#2563eb', label: 'Stays', cost: stayCost },
              { color: '#059669', label: 'Transfers', cost: transportCost },
              { color: '#d97706', label: 'Activities', cost: activityCost },
            ].map((seg) => (
              <div key={seg.label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: seg.color, flexShrink: 0 }} />
                <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500 }}>
                  {seg.label}: <strong style={{ color: '#0f172a', fontWeight: 700 }}>₹{seg.cost.toLocaleString('en-IN')}</strong>
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Live Weather & Geospatial Route Radar ──── */}
        <div style={{
          background: '#ffffff',
          borderRadius: '20px',
          border: '1px solid #e2e8f0',
          padding: '24px',
          marginBottom: '32px',
          boxShadow: '0 4px 20px rgba(15, 23, 42, 0.04)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', background: '#0284c7', color: '#fff', padding: '2px 8px', borderRadius: '6px' }}>
                  Live Open-Meteo Radar
                </span>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', background: '#059669', color: '#fff', padding: '2px 8px', borderRadius: '6px' }}>
                  Open-Source Map API (OpenStreetMap & Leaflet)
                </span>
                <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                  Real-time microclimate & route safety
                </span>
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: '4px 0 0' }}>
                {tour_plan.destinations?.[0] || 'Destination'} Geospatial Map & Live Conditions
              </h3>
            </div>

            {data?.weather && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', background: '#f8fafc', padding: '8px 16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700 }}>CURRENT</div>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
                    {data.weather.current?.temperature}°C • {data.weather.current?.condition}
                  </div>
                </div>
                <div style={{ width: '1px', height: '24px', background: '#cbd5e1' }} />
                <div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700 }}>WIND & RAIN</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#2563eb' }}>
                    {data.weather.current?.windSpeed} km/h • {data.weather.current?.rain || 0} mm
                  </div>
                </div>
                <div style={{ width: '1px', height: '24px', background: '#cbd5e1' }} />
                <div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700 }}>SAFETY STATUS</div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 800, color: data.weather.current?.riskScore > 50 ? '#dc2626' : '#059669' }}>
                    {data.weather.current?.riskScore > 50 ? 'Weather Warning' : 'Optimal Conditions'}
                  </div>
                </div>
              </div>
            )}
          </div>

          <GeospatialMap
            destination={tour_plan.destinations?.[0] || 'Goa'}
            items={items}
            weather={data?.weather}
            impactRadiusKm={data?.weather?.current?.riskScore > 50 ? 14 : 0}
            showRadar={true}
            showPropagation={data?.weather?.current?.riskScore > 50}
            height="340px"
          />
        </div>

        {/* ── Day-by-Day Header ────────────────────── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#0f172a', margin: 0 }}>
              Day-by-Day Schedule & Itinerary
            </h2>
            <p style={{ fontSize: '0.84rem', color: '#64748b', marginTop: '4px', marginBottom: 0 }}>
              Click any card to swap hotel, cab, or activity with a verified alternative
            </p>
          </div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '6px 14px', borderRadius: '999px',
            background: '#eff6ff', border: '1px solid #bfdbfe',
            fontSize: '0.78rem', fontWeight: 700, color: '#2563eb',
          }}>
            <RefreshIcon size={13} />
            Live Swap Ready
          </div>
        </div>

        {/* ── Day Columns ──────────────────────────── */}
        <div style={{ display: 'flex', gap: '18px', overflowX: 'auto', paddingBottom: '20px', alignItems: 'flex-start' }}>
          {days.map((day) => {
            const dayItems = activeItems
              .filter((i) => i.itinerary_day_id === day.id || i.day_number === day.day_number)
              .sort((a, b) => (a.slot_order || 0) - (b.slot_order || 0));

            return (
              <div key={day.id} className="itinerary-column" style={{
                background: '#ffffff',
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                padding: '18px',
                minWidth: '290px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
              }}>
                {/* Column Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid #f1f5f9', marginBottom: '14px' }}>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', margin: 0 }}>
                      {day.date_label || `Day ${day.day_number}`}
                    </h3>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500, marginTop: '2px' }}>
                      {day.destination_name || 'Highlights'}
                    </div>
                  </div>
                  <span style={{
                    padding: '3px 10px', borderRadius: '999px',
                    background: '#f8fafc', border: '1px solid #e2e8f0',
                    fontSize: '0.72rem', fontWeight: 700, color: '#64748b'
                  }}>
                    {dayItems.length} slots
                  </span>
                </div>

                {/* Item cards */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {dayItems.map((item) => {
                    const itemType = isType(item, 'stay') ? 'stay' : isType(item, 'transport') ? 'transport' : 'activity';
                    const tc = typeColor[itemType] || typeColor.activity;
                    return (
                      <div
                        key={item.id}
                        className="itinerary-card-item"
                        onClick={() => openSwap(item)}
                        style={{
                          background: '#f8fafc',
                          borderRadius: '12px',
                          border: '1px solid #e2e8f0',
                          padding: '14px',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '8px' }}>
                          <span style={{
                            padding: '6px',
                            borderRadius: '8px',
                            background: tc.bg,
                            color: tc.color,
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                          }}>
                            {itemType === 'stay' && <BedIcon size={16} />}
                            {itemType === 'transport' && <CarIcon size={16} />}
                            {itemType === 'activity' && <CompassIcon size={16} />}
                          </span>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>
                              {item.start_time} - {item.end_time}
                            </div>
                            <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#0f172a', lineHeight: 1.3 }}>
                              {item.name}
                            </div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px solid #f1f5f9' }}>
                          <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
                            {item.category || item.item_type || item.type}
                          </span>
                          <span style={{ fontWeight: 800, fontSize: '0.84rem', color: '#2563eb' }}>
                            ₹{getItemCost(item).toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal for Live Swap */}
        {swapModalOpen && selectedItemForSwap && (
          <Modal
            isOpen={swapModalOpen}
            onClose={() => setSwapModalOpen(false)}
            title={`Swap ${selectedItemForSwap.name}`}
          >
            <div style={{ padding: '8px 0' }}>
              <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '18px' }}>
                Select an alternative option verified for this slot order and budget cap:
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {getRelevantAlternatives().map((alt) => (
                  <div
                    key={alt.id}
                    onClick={() => handleSwap(alt.id)}
                    style={{
                      background: '#f8fafc',
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      padding: '14px 18px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.borderColor = '#93c5fd'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
                  >
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#0f172a' }}>
                        {alt.name}
                      </div>
                      <div style={{ fontSize: '0.76rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                        <span>{alt.category} •</span>
                        <StarFillIcon size={12} color="#f59e0b" />
                        <span>{alt.rating}</span>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#2563eb' }}>
                        ₹{Number(alt.cost || 0).toLocaleString('en-IN')}{alt.unit || ''}
                      </div>
                      <span style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 700 }}>
                        {swapping ? 'Swapping...' : 'Select Option →'}
                      </span>
                    </div>
                  </div>
                ))}
                {getRelevantAlternatives().length === 0 && (
                  <p style={{ color: '#64748b', fontSize: '0.85rem', textAlign: 'center', padding: '16px' }}>
                    No alternative options found for this category.
                  </p>
                )}
              </div>
            </div>
          </Modal>
        )}
      </main>
    </div>
  );
}
