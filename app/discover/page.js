'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import TravelerNav from '@/components/layout/TravelerNav';
import { SearchIcon, StarFillIcon, SparklesIcon } from '@/components/ui/Icons';



export default function DiscoverPage() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [selectedPriceBand, setSelectedPriceBand] = useState('');

  const filterTags = ['all', 'beach', 'hill-station', 'adventure', 'culture', 'heritage', 'relaxation', 'food', 'nightlife'];

  const fetchDestinations = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.append('q', searchQuery.trim());
      if (selectedTag && selectedTag !== 'all') params.append('tag', selectedTag);
      if (selectedPriceBand) params.append('price_band', selectedPriceBand);

      const res = await fetch(`/api/search?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setDestinations(data.destinations || []);
      }
    } catch (err) {
      console.error('Failed to load destinations:', err);
    } finally {
      setLoading(false);
    }
  };

  // Live debounced search as user types or changes filters
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchDestinations();
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedTag, selectedPriceBand]);

  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    fetchDestinations();
    document.getElementById('destinations-catalog')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleTagClick = (tag) => {
    const nextTag = (selectedTag === tag || (tag === 'all' && !selectedTag)) ? '' : tag;
    setSelectedTag(nextTag);
    document.getElementById('destinations-catalog')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="home-cinematic" style={{ background: '#f8fafc', minHeight: '100vh', color: '#0f172a' }}>
      <TravelerNav transparent={true} />

      {/* ═══════════════════════════════════════════════
          CINEMATIC HERO HEADER — Uses home.css keyframe animations
      ═══════════════════════════════════════════════ */}
      <section style={{
        position: 'relative',
        minHeight: '460px',
        padding: '100px 20px 50px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        overflow: 'hidden',
        background: '#050b14'
      }}>
        {/* Ken Burns background zoom from home.css */}
        <div
          className="hero-kenburns-bg"
          style={{
            backgroundImage: `url('/india-kerala.jpg')`,
            backgroundPosition: 'center 40%'
          }}
        />

        {/* Ambient overlay */}
        <div className="hero-overlay" />

        {/* Home floating particles */}
        <div className="hero-particles">
          {[10, 24, 38, 54, 68, 82, 94, 18, 44, 76, 88, 30].map((leftVal, i) => (
            <div
              key={i}
              className="particle"
              style={{
                left: `${leftVal}%`,
                top: `${(i * 17) % 95}%`,
                animationDelay: `${(i * 0.45) % 6}s`,
                animationDuration: `${7 + (i % 5)}s`,
              }}
            />
          ))}
        </div>

        {/* Radial Glow */}
        <div className="ai-cta-glow" style={{ top: '-150px', left: '50%', transform: 'translateX(-50%)', width: '600px', height: '600px' }} />

        {/* Content */}
        <div className="hero-content" style={{ padding: '0 20px', position: 'relative', zIndex: 3 }}>
          <div className="hero-slide-caption">
            <span className="caption-dot" />
            <span>Curated Sanctuaries & Wonders</span>
          </div>

          <h1 className="hero-mega-title">
            <span className="title-line title-line-1" style={{ fontSize: 'clamp(2.8rem, 7vw, 5.5rem)' }}>
              DISCOVER
            </span>
            <span className="title-line title-line-2" style={{ fontSize: 'clamp(1.8rem, 4.5vw, 3.4rem)' }}>
              TIMELESS INDIA
            </span>
          </h1>

          <p className="hero-subtitle" style={{ maxWidth: '680px', margin: '20px auto 32px' }}>
            From the sun-kissed palms of Goa to mist-shrouded Himalayan heights, explore verified havens with AI constraint intelligence.
          </p>

          {/* Floating Search Capsule Inside Hero */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.96)',
            border: '1px solid rgba(255, 255, 255, 0.4)',
            borderRadius: '24px',
            padding: '18px 24px',
            boxShadow: '0 24px 50px -10px rgba(0, 0, 0, 0.35)',
            backdropFilter: 'blur(20px)',
            maxWidth: '860px',
            margin: '0 auto',
            textAlign: 'left'
          }}>
            <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ flex: '1 1 320px', minWidth: '240px', position: 'relative' }}>
                <input
                  type="text"
                  style={{
                    width: '100%',
                    padding: '14px 20px 14px 44px',
                    borderRadius: '999px',
                    border: '1px solid #cbd5e1',
                    background: '#f8fafc',
                    fontSize: '0.92rem',
                    color: '#0f172a',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  placeholder='Search destinations, e.g. "Goa beaches", "Manali snow", "Jaipur palaces"...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', display: 'flex', alignItems: 'center' }}>
                  <SearchIcon size={18} />
                </span>
              </div>

              <select
                value={selectedPriceBand}
                onChange={(e) => setSelectedPriceBand(e.target.value)}
                style={{
                  minWidth: '170px',
                  padding: '14px 18px',
                  borderRadius: '999px',
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: '#334155',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="">All Price Tiers</option>
                <option value="budget">Budget Friendly (&lt; ₹15k)</option>
                <option value="mid">Mid-Range (₹20k - ₹40k)</option>
                <option value="premium">Luxury & Heritage</option>
              </select>

              <button
                type="submit"
                style={{
                  padding: '14px 28px',
                  borderRadius: '999px',
                  background: 'linear-gradient(135deg, #f59e0b, #ea580c)',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(245, 158, 11, 0.4)',
                  transition: 'transform 0.15s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                Find Sanctuary
              </button>
            </form>

            {/* Quick Filter Tags with Active State */}
            <div style={{
              display: 'flex',
              gap: '8px',
              flexWrap: 'wrap',
              alignItems: 'center',
              marginTop: '16px',
              paddingTop: '16px',
              borderTop: '1px solid #f1f5f9'
            }}>
              <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Filter By Vibe:
              </span>
              {filterTags.map((tag) => {
                const isActive = selectedTag === tag || (!selectedTag && tag === 'all');
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleTagClick(tag)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '999px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      border: isActive ? '1px solid #f59e0b' : '1px solid #e2e8f0',
                      background: isActive ? '#f59e0b' : '#f8fafc',
                      color: isActive ? '#ffffff' : '#64748b',
                      transform: isActive ? 'scale(1.05)' : 'scale(1)',
                      boxShadow: isActive ? '0 4px 12px rgba(245, 158, 11, 0.3)' : 'none'
                    }}
                  >
                    {tag.charAt(0).toUpperCase() + tag.slice(1).replace('-', ' ')}
                  </button>
                );
              })}
            </div>

            {/* Live Filter Result Status & Clear */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '12px',
              paddingTop: '10px',
              borderTop: '1px solid #f8fafc',
              fontSize: '0.8rem'
            }}>
              <span style={{ color: '#059669', fontWeight: 700 }}>
                ✦ {loading ? 'Scanning sanctuaries...' : `${destinations.length} ${destinations.length === 1 ? 'Sanctuary' : 'Sanctuaries'} Found`}
                {searchQuery.trim() && ` matching "${searchQuery.trim()}"`}
                {selectedTag && selectedTag !== 'all' && ` • #${selectedTag}`}
              </span>

              {(searchQuery || (selectedTag && selectedTag !== 'all') || selectedPriceBand) && (
                <button
                  type="button"
                  onClick={() => { setSearchQuery(''); setSelectedTag(''); setSelectedPriceBand(''); }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#ea580c',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}
                >
                  Reset filters
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SECTION 2: 3D ANIMATED DESTINATIONS GRID
          Matches home.css .dest-grid & .dest-card 3D perspective
      ═══════════════════════════════════════════════ */}
      <section id="destinations-catalog" className="destinations-section" style={{ background: '#f8fafc', padding: '36px 20px 80px' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '36px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <span className="section-tag">Interactive Catalog</span>
              <h2 className="section-title-huge" style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', marginBottom: '6px' }}>
                Where will India take you?
              </h2>
              <p className="section-desc" style={{ margin: 0, textAlign: 'left' }}>
                Tap any sanctuary to open its dedicated showcase, photo highlights, curated stays, and custom AI plans.
              </p>
            </div>
            <div style={{
              fontSize: '0.85rem',
              fontWeight: 800,
              color: '#ea580c',
              background: 'rgba(245, 158, 11, 0.12)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              padding: '8px 18px',
              borderRadius: '999px'
            }}>
              {destinations.length} Sanctuaries Found
            </div>
          </div>

          {loading ? (
            <div className="dest-grid">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} style={{ background: '#ffffff', borderRadius: '20px', height: '420px', padding: '16px', border: '1px solid #e2e8f0' }}>
                  <div style={{ height: '240px', background: '#f1f5f9', borderRadius: '16px', marginBottom: '16px' }} />
                  <div style={{ height: '24px', background: '#f1f5f9', width: '60%', borderRadius: '4px', marginBottom: '8px' }} />
                  <div style={{ height: '16px', background: '#f1f5f9', width: '90%', borderRadius: '4px' }} />
                </div>
              ))}
            </div>
          ) : destinations.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 24px', background: '#ffffff', borderRadius: '24px', border: '1px solid #e2e8f0' }}>
              <p style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '8px', color: '#0f172a' }}>No matching destinations found</p>
              <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '24px' }}>Try clearing filters or search for Goa, Manali, Jaipur, or Kerala.</p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedTag(''); setSelectedPriceBand(''); fetchDestinations(); }}
                className="story-cta"
                style={{ border: 'none', cursor: 'pointer' }}
              >
                <span className="cta-gradient-text">Reset All Filters</span>
              </button>
            </div>
          ) : (
            <div className="dest-grid">
              {destinations.map((dest, i) => (
                <Link
                  key={dest.id}
                  href={`/discover/${dest.id}`}
                  className="dest-card visible"
                  style={{ animationDelay: `${i * 0.08}s` }}
                >
                  <div className="dest-card-inner">
                    <img src={dest.image_url} alt={dest.name} className="dest-img" loading="lazy" />
                    <div className="dest-overlay" />
                    
                    {/* Top Tier & Season Badges */}
                    <div style={{
                      position: 'absolute',
                      top: '16px',
                      left: '16px',
                      right: '16px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      zIndex: 3
                    }}>
                      <span style={{
                        background: 'rgba(15, 23, 42, 0.75)',
                        backdropFilter: 'blur(8px)',
                        color: '#ffffff',
                        padding: '4px 12px',
                        borderRadius: '8px',
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                      }}>
                        {dest.price_band} Tier
                      </span>
                      <span style={{
                        background: 'rgba(255, 255, 255, 0.95)',
                        borderRadius: '999px',
                        padding: '4px 10px',
                        fontSize: '0.78rem',
                        fontWeight: 800,
                        color: '#0f172a',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                      }}>
                        <StarFillIcon size={13} color="#f59e0b" />
                        <span>4.9</span>
                      </span>
                    </div>

                    {/* Sliding Bottom Content */}
                    <div className="dest-content">
                      <span className="dest-tagline" style={{ color: '#fbbf24' }}>
                        {dest.tagline}
                      </span>
                      <h3 className="dest-name">{dest.name}</h3>

                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginTop: '12px'
                      }}>
                        <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>
                          Best: {dest.best_season}
                        </span>
                        <div className="dest-arrow">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SECTION 3: AI TRIP CTA WITH GLOWING RADIAL ORBS
      ═══════════════════════════════════════════════ */}
      <section className="ai-cta-section">
        <div className="ai-cta-glow" />
        <div className="ai-cta-glow-2" />
        <div className="ai-cta-inner">
          <span className="section-tag light">AI Constraint Architecture</span>
          <h2 className="section-title-huge light">Not sure where to begin?</h2>
          <p className="hero-subtitle" style={{ margin: '16px auto 32px' }}>
            Tell our AI concierge what excites you — quiet beaches, snow-covered mountain passes, or maharaja palace dinners — and receive an optimized journey in seconds.
          </p>
          <Link href="/plan" className="story-cta">
            <span className="cta-gradient-text">Launch AI Tour Builder</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
        </div>
      </section>
    </div>
  );
}
