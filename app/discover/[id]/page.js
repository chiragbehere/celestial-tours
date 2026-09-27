'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import TravelerNav from '@/components/layout/TravelerNav';
import TourLifecycleTracker from '@/components/ui/TourLifecycleTracker';
import { BedIcon, CompassIcon, CarIcon, CheckCircleIcon, SparklesIcon, MapPinIcon, StarFillIcon, CloudSunIcon, ActivityIcon } from '@/components/ui/Icons';

export default function DestinationDetailPage({ params }) {
  const unwrappedParams = use(params);
  const id = unwrappedParams.id;

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    async function loadDestination() {
      try {
        const res = await fetch(`/api/destinations/${id}`);
        const json = await res.json();
        if (json.success) {
          setData(json);
        }
      } catch (err) {
        console.error('Failed to load destination details:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDestination();
  }, [id]);

  if (loading) {
    return (
      <div className="home-cinematic" style={{ background: '#020617', minHeight: '100vh', color: '#ffffff' }}>
        <TravelerNav transparent={true} />
        <div style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{
            width: '44px',
            height: '44px',
            border: '3px solid rgba(255,255,255,0.2)',
            borderTopColor: '#fbbf24',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            marginBottom: '16px'
          }} />
          <p style={{ color: '#94a3b8', fontSize: '0.95rem', letterSpacing: '0.05em' }}>
            Unveiling destination sanctuaries & verified stays...
          </p>
        </div>
      </div>
    );
  }

  if (!data || !data.destination) {
    return (
      <div style={{ background: '#f8fafc', minHeight: '100vh', color: '#0f172a' }}>
        <TravelerNav />
        <main style={{ maxWidth: '600px', margin: '100px auto', textAlign: 'center', padding: '0 24px' }}>
          <div style={{ background: '#ffffff', borderRadius: '24px', padding: '48px 32px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '8px' }}>Sanctuary Not Found</h2>
            <p style={{ color: '#64748b', fontSize: '0.92rem', marginBottom: '24px' }}>
              We could not find the destination you requested.
            </p>
            <Link
              href="/discover"
              className="story-cta"
            >
              <span className="cta-gradient-text">← Back to Destinations</span>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const { destination, hotels, activities, transport, matchingTours, gallery, weather } = data;
  const signatureTour = matchingTours && matchingTours.length > 0 ? matchingTours[0] : null;

  return (
    <div className="home-cinematic" style={{ background: '#f8fafc', minHeight: '100vh', color: '#0f172a' }}>
      <TravelerNav transparent={true} />

      {/* ═══════════════════════════════════════════════
          CINEMATIC FULL-VIEWPORT HERO WITH ANIMATIONS
      ═══════════════════════════════════════════════ */}
      <section className="hero-fullscreen" style={{ minHeight: '85vh', height: '85vh' }}>
        {/* Background Image with Ken Burns animation */}
        <div
          className="hero-slide active hero-kenburns-bg"
          style={{
            backgroundImage: `url('${destination.image_url}')`,
            backgroundPosition: 'center 35%'
          }}
        />

        <div className="hero-overlay" />

        {/* Floating Particles */}
        <div className="hero-particles">
          {[12, 28, 45, 63, 79, 91, 15, 34, 52, 70, 84, 96, 7, 23, 41, 58, 77, 88].map((leftVal, i) => (
            <div
              key={i}
              className="particle"
              style={{
                left: `${leftVal}%`,
                top: `${(i * 19) % 95}%`,
                animationDelay: `${(i * 0.45) % 6}s`,
                animationDuration: `${7 + (i % 5)}s`,
              }}
            />
          ))}
        </div>

        {/* Glowing orb in hero */}
        <div className="ai-cta-glow" style={{ top: '-100px', right: '-100px' }} />

        {/* Hero Content */}
        <div className="hero-content" style={{ paddingBottom: '60px' }}>
          {/* Breadcrumb Pill */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
            <Link
              href="/discover"
              className="hero-slide-caption"
              style={{ textDecoration: 'none', cursor: 'pointer' }}
            >
              <span>← All Destinations</span>
            </Link>

            <div className="hero-slide-caption">
              <span className="caption-dot" />
              <span>Verified Indian Sanctuary</span>
            </div>

            <div className="hero-slide-caption" style={{ color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <StarFillIcon size={14} color="#fbbf24" />
              <span>4.9 (1,480+ Reviews)</span>
            </div>
          </div>

          {/* Mega Title with Gradient Animation */}
          <h1 className="hero-mega-title">
            <span className="title-line title-line-1" style={{ fontSize: 'clamp(3rem, 8vw, 6.5rem)' }}>
              {destination.name}
            </span>
            <span className="title-line title-line-2" style={{ fontSize: 'clamp(1.4rem, 3.5vw, 2.8rem)' }}>
              {destination.tagline}
            </span>
          </h1>

          {/* Floating Key Metadata Strip inside Hero */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.72)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '24px',
            padding: '18px 28px',
            backdropFilter: 'blur(20px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '24px',
            boxShadow: '0 24px 50px -10px rgba(0, 0, 0, 0.45)',
            maxWidth: '1000px',
            margin: '36px auto 0',
            textAlign: 'left'
          }}>
            <div style={{ display: 'flex', gap: '36px', flexWrap: 'wrap', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.06em' }}>
                  Best Season
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: '#fbbf24' }}>
                  {destination.best_season}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.06em' }}>
                  Live Microclimate
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: '#34d399' }}>
                  {weather.temp} • {weather.condition}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.06em' }}>
                  Price Tier
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: '#38bdf8', textTransform: 'capitalize' }}>
                  {destination.price_band} Tier
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <Link
                href={`/plan?destination=${encodeURIComponent(destination.name)}`}
                className="story-cta"
                style={{ padding: '12px 28px', fontSize: '0.88rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
              >
                <span className="cta-gradient-text">Plan with AI Concierge</span>
                <SparklesIcon size={16} />
              </Link>

              {signatureTour && (
                <Link
                  href={`/itinerary/${signatureTour.id}`}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 22px',
                    borderRadius: '999px',
                    background: 'rgba(255, 255, 255, 0.15)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    textDecoration: 'none',
                    backdropFilter: 'blur(8px)',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'}
                >
                  <span>Signature Package</span>
                  <span>→</span>
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className="scroll-indicator">
          <div className="scroll-mouse">
            <div className="scroll-wheel" />
          </div>
          <span>Scroll to explore</span>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          LIFECYCLE TRACKER (STAGE 1: DISCOVER ACTIVE)
      ═══════════════════════════════════════════════ */}
      <TourLifecycleTracker currentStage="discover" />

      {/* ═══════════════════════════════════════════════
          CONTENT MAIN CONTAINER
      ═══════════════════════════════════════════════ */}
      <main className="responsive-main-container">
        {/* Story Section */}
        <div style={{
          background: '#ffffff',
          borderRadius: '24px',
          border: '1px solid #e2e8f0',
          padding: '40px',
          marginBottom: '50px',
          boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.05)'
        }} className="card-hover-lift">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '36px', alignItems: 'center' }}>
            <div>
              <span className="section-tag">Sanctuary Story</span>
              <h2 className="section-title-huge" style={{ fontSize: '2.2rem', margin: '8px 0 16px' }}>
                The Soul of {destination.name}
              </h2>
              <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '24px' }}>
                {destination.description}
              </p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {destination.tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      color: '#334155',
                      padding: '6px 16px',
                      borderRadius: '999px',
                      fontSize: '0.82rem',
                      fontWeight: 700
                    }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Weather & Guarantee Card */}
            <div style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '20px',
              padding: '28px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <span style={{ color: '#d97706', display: 'flex', alignItems: 'center' }}>
                  <CloudSunIcon size={36} />
                </span>
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
                    Microclimate Intelligence
                  </div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                    {weather.bestMonths} Recommended
                  </div>
                </div>
              </div>
              <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: 1.6, margin: 0 }}>
                Every reservation in {destination.name} is synchronized with Celestial&apos;s 24/7 Autonomous Weather & Contingency guarantee. If sudden monsoons or road blockages occur, alternative havens are reassigned automatically.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#059669', fontSize: '0.84rem', fontWeight: 800 }}>
                <CheckCircleIcon size={16} />
                <span>Zero-Cancellation Logistics Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════
            VISUAL SHOWCASE / PHOTO HIGHLIGHTS (USING dest-grid 3D CARDS)
        ═══════════════════════════════════════════════ */}
        <section style={{ marginBottom: '60px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '28px' }}>
            <div>
              <span className="section-tag">Visual Showcase</span>
              <h2 className="section-title-huge" style={{ fontSize: '2.2rem', margin: '4px 0 0' }}>
                Captivating Sights & Moments
              </h2>
            </div>
          </div>

          <div className="dest-grid">
            {gallery.map((photo, idx) => (
              <div
                key={idx}
                className="dest-card visible"
              >
                <div className="dest-card-inner">
                  <img src={photo.image} alt={photo.title} className="dest-img" loading="lazy" />
                  <div className="dest-overlay" />
                  <div className="dest-content">
                    <span className="dest-tagline" style={{ color: '#fbbf24' }}>
                      {photo.caption}
                    </span>
                    <h3 className="dest-name" style={{ fontSize: '1.4rem' }}>
                      {photo.title}
                    </h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
            CURATED EXPERIENCES & ACTIVITIES (USING exp-grid)
        ═══════════════════════════════════════════════ */}
        <section style={{ marginBottom: '60px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '28px' }}>
            <div>
              <span className="section-tag">Signature Experiences</span>
              <h2 className="section-title-huge" style={{ fontSize: '2.2rem', margin: '4px 0 0' }}>
                Adventures in {destination.name}
              </h2>
            </div>
            <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#ea580c' }}>
              {activities.length} Curated Tours
            </span>
          </div>

          <div className="exp-grid">
            {activities.map((act) => (
              <div key={act.id} className="exp-card visible card-hover-3d">
                <img
                  src={act.image_url || destination.image_url}
                  alt={act.name}
                  className="exp-img"
                  loading="lazy"
                />
                <div className="exp-overlay" />
                <div className="exp-content">
                  <span className="exp-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ActivityIcon size={24} />
                  </span>
                  <h3 className="exp-title">{act.name}</h3>
                  <p className="exp-desc">{act.description}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '14px' }}>
                    <span style={{ fontSize: '1rem', fontWeight: 900, color: '#fbbf24' }}>
                      ₹{act.cost?.toLocaleString('en-IN')}
                    </span>
                    <Link
                      href={`/plan?destination=${encodeURIComponent(destination.name)}`}
                      className="exp-cta"
                      style={{ opacity: 1, transform: 'none' }}
                    >
                      Add to Plan →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
            CURATED STAYS (HOTELS & RESORTS)
        ═══════════════════════════════════════════════ */}
        <section style={{ marginBottom: '70px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '28px' }}>
            <div>
              <span className="section-tag">Boutique Stays</span>
              <h2 className="section-title-huge" style={{ fontSize: '2.2rem', margin: '4px 0 0' }}>
                Handpicked Heritage Havens & Resorts
              </h2>
            </div>
            <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#2563eb' }}>
              {hotels.length} Verified Properties
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
            {hotels.map((hotel) => (
              <div
                key={hotel.id}
                className="card-hover-3d"
                style={{
                  background: '#ffffff',
                  borderRadius: '24px',
                  border: '1px solid #e2e8f0',
                  overflow: 'hidden',
                  boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.05)',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <div className="img-zoom-parent" style={{ position: 'relative', height: '220px' }}>
                  <img
                    src={hotel.image_url}
                    alt={hotel.name}
                    className="zoom-img"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{
                    position: 'absolute',
                    top: '14px',
                    left: '14px',
                    background: 'rgba(15, 23, 42, 0.8)',
                    backdropFilter: 'blur(8px)',
                    color: '#ffffff',
                    padding: '4px 12px',
                    borderRadius: '8px',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    textTransform: 'uppercase'
                  }}>
                    {hotel.tier} Tier
                  </div>
                  <div style={{
                    position: 'absolute',
                    top: '14px',
                    right: '14px',
                    background: '#ffffff',
                    borderRadius: '999px',
                    padding: '4px 10px',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    color: '#0f172a',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                  }}>
                    <StarFillIcon size={14} color="#f59e0b" />
                    <span>{hotel.rating}</span>
                  </div>
                </div>

                <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
                    {hotel.name}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#64748b', fontSize: '0.82rem', marginBottom: '14px' }}>
                    <MapPinIcon size={14} />
                    <span>{hotel.location}</span>
                  </div>

                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '20px' }}>
                    {hotel.amenities?.map((amenity) => (
                      <span
                        key={amenity}
                        style={{
                          background: '#f1f5f9',
                          color: '#475569',
                          padding: '4px 10px',
                          borderRadius: '999px',
                          fontSize: '0.72rem',
                          fontWeight: 600
                        }}
                      >
                        ✓ {amenity}
                      </span>
                    ))}
                  </div>

                  <div style={{
                    marginTop: 'auto',
                    paddingTop: '16px',
                    borderTop: '1px solid #f1f5f9',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Starting from</div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
                        ₹{hotel.price_per_night?.toLocaleString('en-IN')} <span style={{ fontSize: '0.8rem', fontWeight: 500, color: '#64748b' }}>/ night</span>
                      </div>
                    </div>

                    <Link
                      href={`/plan?destination=${encodeURIComponent(destination.name)}`}
                      className="story-cta"
                      style={{ padding: '8px 20px', fontSize: '0.82rem' }}
                    >
                      <span className="cta-gradient-text">Select Stay →</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
            GLOWING AI CTA BOTTOM SECTION
        ═══════════════════════════════════════════════ */}
        <section className="ai-cta-section" style={{ borderRadius: '28px' }}>
          <div className="ai-cta-glow" />
          <div className="ai-cta-glow-2" />
          <div className="ai-cta-inner">
            <span className="section-tag light">AI Constraint Architecture</span>
            <h2 className="section-title-huge light">Ready for {destination.name}?</h2>
            <p className="hero-subtitle" style={{ margin: '16px auto 32px' }}>
              Let our AI generate a balanced, constraint-optimized day-by-day itinerary tailored to your exact budget, group size, and preferred pace.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
              <Link href={`/plan?destination=${encodeURIComponent(destination.name)}`} className="story-cta">
                <span className="cta-gradient-text">Build My Custom Tour</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
              <Link
                href="/discover"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '14px 28px',
                  borderRadius: '999px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  textDecoration: 'none',
                  backdropFilter: 'blur(8px)'
                }}
              >
                Compare Other Sanctuaries
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
