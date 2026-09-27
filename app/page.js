'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import TravelerNav from '@/components/layout/TravelerNav';
import {
  ActivityIcon,
  LandmarkIcon,
  HeartPulseIcon,
  UtensilsIcon,
  StarFillIcon,
  RobotIcon,
  ArrowRepeatIcon,
  ShieldCheckIcon,
  BroadcastIcon,
  PlaneIcon,
  CompassIcon,
  LightningIcon
} from '@/components/ui/Icons';
import './home.css';

/* ── DATA ─────────────────────────────────────────── */
const heroSlides = [
  { img: '/india-taj.jpg', title: 'Timeless Wonders', sub: 'Agra · Uttar Pradesh' },
  { img: '/india-kerala.jpg', title: 'Tropical Paradise', sub: 'Alleppey · Kerala' },
  { img: '/india-rajasthan.jpg', title: 'Royal Heritage', sub: 'Jodhpur · Rajasthan' },
];

const aiChips = [
  { icon: '✦', label: 'Explore iconic landmarks' },
  { icon: '✦', label: 'Plan a hill station escape' },
  { icon: '✦', label: 'Get beach holiday ideas' },
  { icon: '✦', label: 'Discover spiritual journeys' },
  { icon: '✦', label: 'Plan a wildlife safari' },
];

const destinations = [
  { id: 'dest-goa', name: 'Goa', tagline: 'Beaches & Vibes', img: '/dest-goa.jpg', color: '#0ea5e9' },
  { id: 'dest-manali', name: 'Manali', tagline: 'Snow & Adventure', img: '/dest-manali.jpg', color: '#22c55e' },
  { id: 'dest-jaipur', name: 'Jaipur', tagline: 'Palaces & Forts', img: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600&q=80&fit=crop', color: '#f59e0b' },
  { id: 'dest-varanasi', name: 'Varanasi', tagline: 'Spiritual Heart', img: '/dest-varanasi.jpg', color: '#ef4444' },
  { id: 'dest-munnar', name: 'Munnar', tagline: 'Tea & Mist', img: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=600&q=80&fit=crop', color: '#10b981' },
  { id: 'dest-udaipur', name: 'Udaipur', tagline: 'City of Lakes', img: 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?w=600&q=80&fit=crop', color: '#8b5cf6' },
];

const experiences = [
  { icon: <ActivityIcon size={24} />, title: 'Adventure', desc: 'Rafting, trekking, paragliding across the Himalayas and beyond', img: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?w=500&q=80&fit=crop' },
  { icon: <LandmarkIcon size={24} />, title: 'Heritage', desc: 'Walk through centuries of Mughal, Rajput, and Dravidian architecture', img: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=500&q=80&fit=crop' },
  { icon: <HeartPulseIcon size={24} />, title: 'Wellness', desc: 'Ayurveda retreats, yoga ashrams, and spiritual sanctuaries', img: 'https://images.unsplash.com/photo-1545389336-cf090694435e?w=500&q=80&fit=crop' },
  { icon: <UtensilsIcon size={24} />, title: 'Culinary', desc: 'Street food trails, spice plantations, and royal Thali experiences', img: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500&q=80&fit=crop' },
];

const statsData = [
  { value: '29', label: 'States' },
  { value: '40+', label: 'UNESCO Sites' },
  { value: '50k+', label: 'Trips Planned' },
  { value: '4.9 ★', label: 'Avg Rating' },
];

/* ── HOMEPAGE COMPONENT ───────────────────────────── */
export default function Home() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [visibleSections, setVisibleSections] = useState({
    story: true,
    destinations: true,
    experiences: true,
    stats: true,
    aicta: true,
    why: true,
  });
  const sectionRefs = useRef({});

  useEffect(() => {
    setMounted(true);
  }, []);

  /* Parallax scroll listener */
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* Hero slideshow auto-play */
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  /* Intersection observer for scroll reveal animations */
  const observerCallback = useCallback((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setVisibleSections(prev => ({ ...prev, [entry.target.id]: true }));
      }
    });
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(observerCallback, { threshold: 0.1 });
    Object.values(sectionRefs.current).forEach(ref => {
      if (ref) observer.observe(ref);
    });
    return () => observer.disconnect();
  }, [observerCallback]);

  const registerRef = (id) => (el) => {
    if (el) { el.id = id; sectionRefs.current[id] = el; }
  };

  const handleAIChip = (label) => {
    const dest = label.includes('hill') ? 'Manali' : label.includes('beach') ? 'Goa' : label.includes('spiritual') ? 'Varanasi' : label.includes('wildlife') ? 'Rishikesh' : 'Jaipur';
    router.push(`/plan?destination=${encodeURIComponent(dest)}&duration=4&budget=30000&pace=moderate`);
  };

  return (
    <div className="home-cinematic">
      <TravelerNav transparent={true} />

      {/* ═══════════════════════════════════════════════
          SECTION 1: FULL-VIEWPORT CINEMATIC HERO
      ═══════════════════════════════════════════════ */}
      <section className="hero-fullscreen">
        {heroSlides.map((slide, i) => (
          <div
            key={slide.img}
            className={`hero-slide ${i === currentSlide ? 'active' : ''}`}
            style={{
              backgroundImage: `url(${slide.img})`,
              transform: `scale(1.08) translateY(${scrollY * 0.25}px)`,
            }}
          />
        ))}

        <div className="hero-overlay" />

        {mounted && (
          <div className="hero-particles">
            {[12, 28, 45, 63, 79, 91, 15, 34, 52, 70, 84, 96, 7, 23, 41, 58, 77, 88, 3, 67].map((leftVal, i) => (
              <div key={i} className="particle" style={{
                left: `${leftVal}%`,
                top: `${(i * 19) % 95}%`,
                animationDelay: `${(i * 0.45) % 6}s`,
                animationDuration: `${7 + (i % 5)}s`,
              }} />
            ))}
          </div>
        )}

        <div className="hero-content">
          <div className="hero-slide-caption">
            <span className="caption-dot" />
            <span>{heroSlides[currentSlide]?.sub || 'India'}</span>
          </div>

          <h1 className="hero-mega-title">
            <span className="title-line title-line-1">INDIA</span>
            <span className="title-line title-line-2">THE INCREDIBLE</span>
          </h1>

          <p className="hero-subtitle">
            This is a land where every journey reveals something extraordinary — ancient temples rising through mist,
            beaches that stretch to the horizon, mountains that touch the sky. Whatever your travel dream,
            India is ready to make it unforgettable.
          </p>

          <div className="hero-ai-section">
            <div className="ai-label">
              <span className="ai-sparkle">✦</span> Get travel ideas with AI
            </div>
            <div className="ai-chips">
              {aiChips.map(chip => (
                <button key={chip.label} className="ai-chip" onClick={() => handleAIChip(chip.label)}>
                  <span className="chip-icon">{chip.icon}</span>
                  <span>{chip.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="hero-dots">
            {heroSlides.map((s, i) => (
              <button
                key={i}
                className={`hero-dot ${i === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(i)}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </div>

        <Link href="/plan" className="side-plan-tab">
          <span className="side-plan-icon">✦</span>
          <span className="side-plan-text">Plan Your Trip with AI</span>
        </Link>

        <div className="scroll-indicator">
          <div className="scroll-mouse">
            <div className="scroll-wheel" />
          </div>
          <span>Scroll to explore</span>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SECTION 2: STORY BLOCK
      ═══════════════════════════════════════════════ */}
      <section className="story-section" ref={registerRef('story')}>
        <div className={`story-inner ${visibleSections['story'] ? 'visible' : ''}`}>
          <p className="story-text">
            From the snow-capped Himalayas to the sun-kissed coasts of Goa, from the royal palaces of Rajasthan
            to the serene backwaters of Kerala — India unfolds a thousand stories in every direction.
            Our AI crafts the perfect journey, tailored to your dreams.
          </p>

          <h2 className="story-heading">THINKING ABOUT A TRIP?</h2>

          <Link href="/plan" className="story-cta">
            <span className="cta-gradient-text">Start Planning</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </Link>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SECTION 3: DESTINATIONS — 3D Perspective Cards
      ═══════════════════════════════════════════════ */}
      <section className="destinations-section" ref={registerRef('destinations')}>
        <div className={`section-header ${visibleSections['destinations'] ? 'visible' : ''}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', justifyContent: 'center' }}>
          <span className="section-tag">Destinations</span>
          <h2 className="section-title-huge">Where will India take you?</h2>
          <p className="section-desc">Explore iconic destinations with AI-powered itineraries personalized to your pace, budget, and interests.</p>
        </div>

        <div className="dest-grid">
          {destinations.map((dest, i) => (
            <Link
              key={dest.id}
              href={`/discover/${dest.id}`}
              className={`dest-card ${visibleSections['destinations'] ? 'visible' : ''}`}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="dest-card-inner">
                <img src={dest.img} alt={dest.name} className="dest-img" loading="lazy" />
                <div className="dest-overlay" />
                <div className="dest-content">
                  <span className="dest-tagline" style={{ color: dest.color }}>{dest.tagline}</span>
                  <h3 className="dest-name">{dest.name}</h3>
                  <div className="dest-arrow">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SECTION 4: EXPERIENCES — Immersive Grid
      ═══════════════════════════════════════════════ */}
      <section className="experiences-section" ref={registerRef('experiences')}>
        <div className={`section-header ${visibleSections['experiences'] ? 'visible' : ''}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', justifyContent: 'center' }}>
          <span className="section-tag">Experiences</span>
          <h2 className="section-title-huge">How do you want to explore?</h2>
        </div>

        <div className="exp-grid">
          {experiences.map((exp, i) => (
            <div
              key={exp.title}
              className={`exp-card ${visibleSections['experiences'] ? 'visible' : ''}`}
              style={{ animationDelay: `${i * 0.15}s` }}
              onClick={() => router.push('/discover')}
            >
              <img src={exp.img} alt={exp.title} className="exp-img" loading="lazy" />
              <div className="exp-overlay" />
              <div className="exp-content">
                <span className="exp-icon">{exp.icon}</span>
                <h3 className="exp-title">{exp.title}</h3>
                <p className="exp-desc">{exp.desc}</p>
                <span className="exp-cta">Explore →</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SECTION 5: STATS — Full-bleed parallax
      ═══════════════════════════════════════════════ */}
      <section className="stats-section" ref={registerRef('stats')}>
        <div
          className="stats-bg"
          style={{ transform: `translateY(${(scrollY - 2000) * 0.15}px)` }}
        />
        <div className="stats-overlay" />
        <div className={`stats-inner ${visibleSections['stats'] ? 'visible' : ''}`}>
          <h2 className="stats-title">India in Numbers</h2>
          <div className="stats-grid">
            {statsData.map((s, i) => (
              <div key={s.label} className="stat-item" style={{ animationDelay: `${i * 0.15}s` }}>
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SECTION 6: AI-POWERED CTA
      ═══════════════════════════════════════════════ */}
      <section className="ai-cta-section" ref={registerRef('aicta')}>
        <div className={`ai-cta-inner ${visibleSections['aicta'] ? 'visible' : ''}`}>
          <div className="ai-cta-glow" />
          <div className="ai-cta-glow-2" />
          <span className="ai-cta-badge">✦ Powered by Nugen AI (Domain Aligned)</span>
          <h2 className="ai-cta-title">Your perfect trip, crafted by AI</h2>
          <p className="ai-cta-desc">
            Tell us your dream destination, budget, and travel style. Our AI builds a constraint-verified
            itinerary with real hotel inventory, private transfers, and curated experiences — in seconds.
          </p>
          <div className="ai-cta-buttons">
            <Link href="/plan" className="cta-btn-primary">
              <span>Start Planning</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </Link>
            <Link href="/discover" className="cta-btn-secondary">
              Browse Packages
            </Link>
          </div>
          <div className="ai-cta-trust">
            <span>✓ Personalized plans — never templates</span>
            <span>✓ Handpicked stays & private transport</span>
            <span>✓ 24×7 on-trip support</span>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SECTION 7: WHY US
      ═══════════════════════════════════════════════ */}
      <section className="why-section" ref={registerRef('why')}>
        <div className={`section-header light ${visibleSections['why'] ? 'visible' : ''}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', justifyContent: 'center' }}>
          <span className="section-tag light">Built Different</span>
          <h2 className="section-title-huge light">Why Celestial Stands Apart</h2>
        </div>
        <div className="why-grid">
          {[
            { icon: <RobotIcon size={32} />, title: 'AI Itinerary Engine', desc: 'Nugen AI Domain-Aligned Model generates plans optimized to your exact budget, pace, and interests.' },
            { icon: <CompassIcon size={32} />, title: 'Live Weather Radar', desc: 'Open-Meteo API integration feeds live rainfall, winds, and forecast models directly into constraint solving.' },
            { icon: <LightningIcon size={32} />, title: 'Digital Twin Simulation', desc: 'Interactive what-if scenario testing with geospatial impact propagation and crowdsourced field signals.' },
            { icon: <ArrowRepeatIcon size={32} />, title: 'Auto Disruption Fix', desc: 'Hotel cancelled? Weather issue? AI instantly proposes ranked alternatives in real-time.' },
            { icon: <ShieldCheckIcon size={32} />, title: 'Constraint Solver', desc: 'Verifies opening hours, transit buffers, and budget caps before every single booking.' },
            { icon: <BroadcastIcon size={32} />, title: 'Operator Sync', desc: 'Real-time coordination between you, operators, hotels, cabs, and activity vendors.' },
          ].map((item, i) => (
            <div key={item.title} className={`why-card ${visibleSections['why'] ? 'visible' : ''}`} style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="why-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{item.icon}</div>
              <h3 className="why-title">{item.title}</h3>
              <p className="why-desc">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          FOOTER
      ═══════════════════════════════════════════════ */}
      <footer className="home-footer">
        <div className="footer-inner">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="footer-logo">
                <div className="footer-logo-icon"><PlaneIcon size={18} /></div>
                <div>
                  <div className="footer-logo-name">Celestial</div>
                  <div className="footer-logo-sub">Dynamic Tour Platform</div>
                </div>
              </div>
              <p className="footer-brand-desc">
                AI-orchestrated Indian holiday planning with constraint-verified itineraries and real-time disruption handling.
              </p>
            </div>
            {[
              { title: 'Destinations', links: ['Goa Beaches', 'Himalayan Trails', 'Rajputana Heritage', 'Kerala Backwaters', 'Spiritual India'] },
              { title: 'Platform', links: [{ l: 'AI Trip Planner', h: '/plan' }, { l: 'Discover Stays', h: '/discover' }, { l: 'Operator Console', h: '/operator/dashboard' }] },
              { title: 'HackCelestial', links: ['PS ID 07', 'Constraint Engine v3', 'Nugen AI Aligned', 'Real-time Sync'] },
            ].map(col => (
              <div key={col.title} className="footer-col">
                <div className="footer-col-title">{col.title}</div>
                {col.links.map(link => typeof link === 'string' ? (
                  <div key={link} className="footer-link">{link}</div>
                ) : (
                  <Link key={link.l} href={link.h} className="footer-link clickable">{link.l}</Link>
                ))}
              </div>
            ))}
          </div>
          <div className="footer-bottom">
            <span>© 2026 Celestial Tour Platform · HackCelestial 3.0</span>
            <span>Constraint-Aware Itinerary Engine & Operator Sync</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
