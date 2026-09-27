'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import TravelerNav from '@/components/layout/TravelerNav';
import TourLifecycleTracker from '@/components/ui/TourLifecycleTracker';
import { TelephoneIcon, ChatDotsIcon } from '@/components/ui/Icons';



export default function TripPreparePage({ params }) {
  const unwrappedParams = use(params);
  const tripId = unwrappedParams.id || 'tour-goa-signature';

  // Packing Checklist State
  const [items, setItems] = useState([
    { id: 1, name: 'Original Govt Photo ID / Passport (Required for hotel & scuba check-in)', packed: true, tag: 'Mandatory' },
    { id: 2, name: 'Reef-safe Sunscreen (SPF 50+) & Polarized Sunglasses', packed: true, tag: 'Weather' },
    { id: 3, name: 'Quick-dry Swimwear & Microfiber Towel for Grand Island Scuba', packed: false, tag: 'Activity' },
    { id: 4, name: 'Waterproof Phone Pouch for boat transfers', packed: false, tag: 'Activity' },
    { id: 5, name: 'Breathable Cotton Wear & Walking Shoes for Fontainhas Heritage Walk', packed: true, tag: 'Culture' },
    { id: 6, name: 'Light Evening Jacket / Resort Casuals for Mandovi Sunset Dinner Cruise', packed: false, tag: 'Dining' },
    { id: 7, name: 'Personal Medication & Motion Sickness Pills (for catamaran ride)', packed: true, tag: 'Health' },
  ]);

  // Document Vault State
  const [dietaryPref, setDietaryPref] = useState('Non-Vegetarian (Prefers Fresh Local Seafood)');
  const [medicalNotes, setMedicalNotes] = useState('No medical restrictions. Swimmer: Intermediate.');
  const [savedNotes, setSavedNotes] = useState(false);

  const toggleItem = (id) => {
    setItems(items.map(item => item.id === id ? { ...item, packed: !item.packed } : item));
  };

  const packedCount = items.filter(i => i.packed).length;
  const progressPercent = Math.round((packedCount / items.length) * 100);

  return (
    <div className="home-cinematic" style={{ minHeight: '100vh', background: '#f8fafc', color: '#0f172a', fontFamily: "var(--font-body)" }}>
      <TravelerNav transparent={true} />

      {/* ═══════════════════════════════════════════════
          CINEMATIC HERO HEADER — Matches Home & VisitTheUSA
      ═══════════════════════════════════════════════ */}
      <section className="compact-hero-section">
        {/* Ken Burns Scenic Backdrop */}
        <div
          className="hero-kenburns-bg"
          style={{
            backgroundImage: `url('/india-kerala.jpg')`,
            backgroundPosition: 'center 40%'
          }}
        />

        {/* Ambient Gradient Overlay */}
        <div className="hero-overlay" />

        {/* Floating Particles */}
        <div className="hero-particles">
          {[12, 26, 40, 56, 72, 86, 20, 64, 80, 32].map((leftVal, i) => (
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

        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 3 }} className="animate-fade-in-up">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <div className="hero-slide-caption" style={{ marginBottom: '14px' }}>
                <span className="caption-dot badge-glow-blue" />
                <span>Pre-Trip Readiness & Logistics Vault</span>
              </div>
              <h1 style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 'clamp(2.2rem, 4vw, 3.4rem)',
                fontWeight: 800,
                color: '#ffffff',
                letterSpacing: '-0.02em',
                marginBottom: '8px',
                textShadow: '0 4px 20px rgba(0,0,0,0.5)'
              }}>
                Preparing for Your Coastal Tour
              </h1>
              <p style={{ color: '#cbd5e1', fontSize: '0.95rem', textShadow: '0 2px 6px rgba(0,0,0,0.3)' }}>
                Tour Reference: <strong style={{ color: '#38bdf8' }}>{tripId}</strong> • Dates: Oct 5 - Oct 9 • Lead Traveler: Aditi Sharma (2 Guests)
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <Link
                href={`/trip/${tripId}`}
                className="story-cta"
                style={{ padding: '12px 24px', fontSize: '0.88rem' }}
              >
                <span className="cta-gradient-text">Launch Live Trip Companion</span>
                <span style={{ color: '#fff' }}>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <TourLifecycleTracker currentStage="prepare" />

      <main className="responsive-main-container">

        {/* Readiness Meter Card */}
        <div style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
        }}>
          <div style={{ flex: 1, minWidth: '260px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f172a' }}>Pre-Trip Readiness Score</span>
              <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#2563eb' }}>{progressPercent}% Complete</span>
            </div>
            <div style={{ width: '100%', height: '8px', background: '#f1f5f9', borderRadius: '999px', overflow: 'hidden' }}>
              <div style={{ width: `${progressPercent}%`, height: '100%', background: 'linear-gradient(90deg, #38bdf8, #2563eb)', transition: 'width 0.4s ease' }} />
            </div>
            <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '8px' }}>
              {packedCount} of {items.length} checklist items verified. All vouchers synced.
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '12px 18px', borderRadius: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Destination Weather</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#d97706', marginTop: '2px' }}>29°C Sunny</div>
            </div>
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '12px 18px', borderRadius: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Hotel Check-in</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#059669', marginTop: '2px' }}>Taj Exotica (14:00)</div>
            </div>
          </div>
        </div>

        {/* 2-Column Content */}
        <div className="responsive-two-col-grid">
          
          {/* Left: Dynamic Packing Checklist */}
          <div style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
                  Smart Packing Checklist
                </h2>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  AI-curated based on coastal weather, Scuba diving, and evening cruises.
                </div>
              </div>
              <span style={{ fontSize: '0.78rem', color: '#2563eb', fontWeight: 700, background: '#eff6ff', padding: '3px 10px', borderRadius: '999px', border: '1px solid #bfdbfe' }}>
                {packedCount}/{items.length} Ready
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {items.map(item => (
                <div
                  key={item.id}
                  onClick={() => toggleItem(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 14px',
                    borderRadius: '10px',
                    background: item.packed ? '#f8fafc' : '#ffffff',
                    border: item.packed ? '1px solid #cbd5e1' : '1px solid #e2e8f0',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <input
                      type="checkbox"
                      checked={item.packed}
                      onChange={() => {}}
                      style={{ width: '16px', height: '16px', accentColor: '#2563eb', cursor: 'pointer' }}
                    />
                    <span style={{
                      fontSize: '0.86rem',
                      color: item.packed ? '#94a3b8' : '#0f172a',
                      textDecoration: item.packed ? 'line-through' : 'none'
                    }}>
                      {item.name}
                    </span>
                  </div>

                  <span style={{
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: '999px',
                    background: item.tag === 'Mandatory' ? '#fef2f2' : '#f1f5f9',
                    color: item.tag === 'Mandatory' ? '#dc2626' : '#64748b',
                    border: item.tag === 'Mandatory' ? '1px solid #fee2e2' : '1px solid #e2e8f0'
                  }}>
                    {item.tag}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Digital Travel Vault & Coordinator Briefing */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Coordinator Card */}
            <div style={{
              background: '#eff6ff',
              border: '1px solid #bfdbfe',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 2px 8px rgba(37, 99, 235, 0.04)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
                <div style={{
                  width: '46px', height: '46px', borderRadius: '50%',
                  background: '#2563eb', color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 800, fontSize: '1.1rem',
                  boxShadow: '0 2px 8px rgba(37, 99, 235, 0.25)'
                }}>
                  RK
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', color: '#2563eb', fontWeight: 800, textTransform: 'uppercase' }}>
                    Assigned Tour Coordinator
                  </div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                    Rahul Kulkarni
                  </div>
                  <div style={{ fontSize: '0.76rem', color: '#64748b' }}>
                    Certified Local Ops Lead • Goa Region
                  </div>
                </div>
              </div>

              <div style={{ fontSize: '0.84rem', color: '#334155', lineHeight: 1.5, marginBottom: '16px' }}>
                &ldquo;Hello Aditi! I will meet you at Dabolim Airport at 13:30. Your private chauffeur Innova is pre-positioned.&rdquo;
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <a
                  href="tel:+919876543210"
                  style={{
                    flex: 1, padding: '10px', textAlign: 'center',
                    background: '#ffffff', color: '#0f172a', borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.8rem', fontWeight: 700, textDecoration: 'none',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                  }}
                >
                  <TelephoneIcon size={14} />
                  <span>Call Coordinator</span>
                </a>
                <a
                  href={`https://wa.me/919876543210?text=Hi%20Rahul,%20confirming%20tour%20${tripId}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    flex: 1, padding: '10px', textAlign: 'center',
                    background: '#059669', color: '#ffffff', borderRadius: '8px',
                    fontSize: '0.8rem', fontWeight: 700, textDecoration: 'none',
                    boxShadow: '0 2px 6px rgba(5, 150, 105, 0.2)',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                  }}
                >
                  <ChatDotsIcon size={14} />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Document Vault & Dietary Requirements */}
            <div style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
            }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', marginBottom: '14px' }}>
                Digital Travel Vault
              </h3>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '10px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: '#059669', fontWeight: 800 }}>✓</span>
                  <span style={{ fontSize: '0.82rem', color: '#065f46', fontWeight: 600 }}>Government Photo ID Verified</span>
                </div>
                <span style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 800 }}>APPROVED</span>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                  Dietary & Culinary Preferences
                </label>
                <input
                  type="text"
                  value={dietaryPref}
                  onChange={(e) => setDietaryPref(e.target.value)}
                  style={{
                    width: '100%', padding: '10px 12px', borderRadius: '8px',
                    background: '#f8fafc', border: '1px solid #cbd5e1',
                    color: '#0f172a', fontSize: '0.84rem', outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                  Medical & Emergency Notes for Coordinator
                </label>
                <textarea
                  rows={2}
                  value={medicalNotes}
                  onChange={(e) => setMedicalNotes(e.target.value)}
                  style={{
                    width: '100%', padding: '10px 12px', borderRadius: '8px',
                    background: '#f8fafc', border: '1px solid #cbd5e1',
                    color: '#0f172a', fontSize: '0.84rem', outline: 'none', resize: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <button
                onClick={() => {
                  setSavedNotes(true);
                  setTimeout(() => setSavedNotes(false), 2500);
                }}
                style={{
                  width: '100%', padding: '11px',
                  borderRadius: '8px', background: '#2563eb',
                  border: 'none', color: '#ffffff',
                  fontSize: '0.84rem', fontWeight: 700, cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(37, 99, 235, 0.25)'
                }}
              >
                {savedNotes ? '✓ Preferences Synced with Coordinator' : 'Save & Sync Preferences'}
              </button>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
