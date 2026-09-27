'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import TravelerNav from '@/components/layout/TravelerNav';
import TourLifecycleTracker from '@/components/ui/TourLifecycleTracker';
import { TrophyIcon, StarFillIcon, LightbulbIcon } from '@/components/ui/Icons';



export default function TripReviewPage({ params }) {
  const unwrappedParams = use(params);
  const tripId = unwrappedParams.id || 'tour-goa-signature';

  // Multi-dimensional Ratings
  const [overallRating, setOverallRating] = useState(5);
  const [coordRating, setCoordRating] = useState(5);
  const [hotelRating, setHotelRating] = useState(5);
  const [adaptationRating, setAdaptationRating] = useState(5);

  const [comment, setComment] = useState('Celestial made our tour completely seamless! When our coastal catamaran was delayed by high winds, the system instantly rescheduled our Latin Quarter visit without any manual stress. Rahul our coordinator was phenomenal!');
  const [selectedTags, setSelectedTags] = useState(['Prompt Chauffeur', 'Flawless Scuba Logistics', 'Great Crisis Handling']);
  const [submitting, setSubmitting] = useState(false);
  const [submittedReview, setSubmittedReview] = useState(null);
  const [pastReviews, setPastReviews] = useState([]);

  const availableTags = [
    'Prompt Chauffeur',
    'Flawless Scuba Logistics',
    'Great Crisis Handling',
    'Accurate AI Rescheduling',
    'Luxury Hotel Standards',
    'Value for Budget'
  ];

  const toggleTag = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const fetchReviews = async () => {
    try {
      const res = await fetch(`/api/reviews?tour_plan_id=${tripId}`);
      const data = await res.json();
      if (data.success) {
        setPastReviews(data.reviews || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [tripId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tour_plan_id: tripId,
          traveler_name: 'Aditi Sharma',
          rating: overallRating,
          comment,
          highlights: selectedTags,
          dimensions: {
            coordinator: coordRating,
            hotel: hotelRating,
            adaptation: adaptationRating
          }
        })
      });
      const data = await res.json();
      if (data.success) {
        setSubmittedReview(data.review);
        fetchReviews();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="home-cinematic" style={{ minHeight: '100vh', background: '#f8fafc', color: '#0f172a', fontFamily: "var(--font-body)" }}>
      <TravelerNav transparent={true} />

      {/* ═══════════════════════════════════════════════
          CINEMATIC HERO HEADER — Matches Home & VisitTheUSA
      ═══════════════════════════════════════════════ */}
      <section style={{
        position: 'relative',
        padding: '150px 24px 70px',
        color: '#ffffff',
        overflow: 'hidden',
        background: '#050b14'
      }}>
        {/* Ken Burns Scenic Backdrop */}
        <div
          className="hero-kenburns-bg"
          style={{
            backgroundImage: `url('/india-rajasthan.jpg')`,
            backgroundPosition: 'center 40%'
          }}
        />

        {/* Ambient Gradient Overlay */}
        <div className="hero-overlay" />

        {/* Floating Particles */}
        <div className="hero-particles">
          {[14, 28, 42, 58, 74, 88, 22, 66, 82, 36].map((leftVal, i) => (
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
                <span className="caption-dot badge-glow-green" />
                <span>Tour Completed • Quality Certification</span>
              </div>
              <h1 style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 'clamp(2.2rem, 4vw, 3.4rem)',
                fontWeight: 800,
                color: '#ffffff',
                letterSpacing: '-0.02em',
                marginBottom: '8px',
                textShadow: '0 4px 20px rgba(0,0,0,0.5)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                flexWrap: 'wrap'
              }}>
                <TrophyIcon size={38} color="#fbbf24" />
                <span>Tour Complete: Coastal Signature Experience</span>
              </h1>
              <p style={{ color: '#cbd5e1', fontSize: '0.95rem', textShadow: '0 2px 6px rgba(0,0,0,0.3)' }}>
                Tour Reference: <strong style={{ color: '#fbbf24' }}>{tripId}</strong> • Completed on Oct 9 • Travelers: Aditi Sharma & Partner
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <Link
                href="/discover"
                className="story-cta"
                style={{ padding: '12px 24px', fontSize: '0.88rem' }}
              >
                <span className="cta-gradient-text">Explore Next Sanctuary</span>
                <span style={{ color: '#fff' }}>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <TourLifecycleTracker currentStage="review" />

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px 80px' }}>
        {/* Certificate Card */}
        <div style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '20px',
          padding: '32px',
          marginBottom: '32px',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.03)'
        }} className="card-hover-lift">

          {/* Tour Milestone Highlights */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginTop: '24px' }}>
            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Total Spent</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#059669', marginTop: '2px' }}>₹41,200</div>
              <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '2px' }}>₹18,800 under ₹60k budget</div>
            </div>
            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Experiences</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#2563eb', marginTop: '2px' }}>4 of 4 Done</div>
              <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '2px' }}>Scuba, Spice Farm, Cruise</div>
            </div>
            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Schedule Adjustments</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#d97706', marginTop: '2px' }}>1 Automated</div>
              <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '2px' }}>Zero delay to guest schedule</div>
            </div>
          </div>
        </div>

        {/* 2-Column: Left = Review Form, Right = Verified Reviews Feed */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)', gap: '32px' }}>
          
          {/* Review Form */}
          <div style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '18px',
            padding: '28px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
          }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
              Multi-Vendor Performance Review
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.84rem', marginBottom: '24px' }}>
              Your feedback directly updates the vendor quality scoring and service benchmarks.
            </p>

            {submittedReview ? (
              <div style={{
                background: '#ecfdf5',
                border: '1px solid #a7f3d0',
                borderRadius: '14px',
                padding: '24px',
                textAlign: 'center'
              }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
                  <StarFillIcon size={36} color="#f59e0b" />
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#065f46', marginBottom: '8px' }}>
                  Thank you for your verified feedback!
                </h3>
                <p style={{ color: '#047857', fontSize: '0.85rem', lineHeight: 1.5, marginBottom: '14px' }}>
                  Your review has been analyzed by Nugen AI and synced with regional operators.
                </p>
                {submittedReview.ai_summary && (
                  <div style={{ background: '#ffffff', border: '1px solid #a7f3d0', padding: '12px', borderRadius: '8px', fontSize: '0.82rem', color: '#065f46', fontStyle: 'italic' }}>
                    AI Summary: &ldquo;{submittedReview.ai_summary}&rdquo;
                  </div>
                )}
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                {/* 5-Star Sliders for Dimensions */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                      Overall Trip Rating
                    </div>
                    <div style={{ display: 'flex', gap: '6px', cursor: 'pointer', alignItems: 'center' }}>
                      {[1,2,3,4,5].map(star => (
                        <span key={star} onClick={() => setOverallRating(star)}>
                          <StarFillIcon size={20} color={star <= overallRating ? '#f59e0b' : '#cbd5e1'} />
                        </span>
                      ))}
                    </div>
                  </div>

                  <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                      Tour Coordinator (Rahul K.)
                    </div>
                    <div style={{ display: 'flex', gap: '6px', cursor: 'pointer', alignItems: 'center' }}>
                      {[1,2,3,4,5].map(star => (
                        <span key={star} onClick={() => setCoordRating(star)}>
                          <StarFillIcon size={20} color={star <= coordRating ? '#f59e0b' : '#cbd5e1'} />
                        </span>
                      ))}
                    </div>
                  </div>

                  <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                      Resort & Stay (Taj Exotica)
                    </div>
                    <div style={{ display: 'flex', gap: '6px', cursor: 'pointer', alignItems: 'center' }}>
                      {[1,2,3,4,5].map(star => (
                        <span key={star} onClick={() => setHotelRating(star)}>
                          <StarFillIcon size={20} color={star <= hotelRating ? '#f59e0b' : '#cbd5e1'} />
                        </span>
                      ))}
                    </div>
                  </div>

                  <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                      AI Schedule Replanning
                    </div>
                    <div style={{ display: 'flex', gap: '6px', cursor: 'pointer', alignItems: 'center' }}>
                      {[1,2,3,4,5].map(star => (
                        <span key={star} onClick={() => setAdaptationRating(star)}>
                          <StarFillIcon size={20} color={star <= adaptationRating ? '#f59e0b' : '#cbd5e1'} />
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Highlight Tags */}
                <div>
                  <label style={{ fontSize: '0.76rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                    What were the highlights?
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {availableTags.map(tag => {
                      const active = selectedTags.includes(tag);
                      return (
                        <button
                          type="button"
                          key={tag}
                          onClick={() => toggleTag(tag)}
                          style={{
                            padding: '6px 14px', borderRadius: '999px',
                            background: active ? '#eff6ff' : '#f8fafc',
                            border: active ? '1px solid #2563eb' : '1px solid #e2e8f0',
                            color: active ? '#2563eb' : '#64748b',
                            fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Review Text */}
                <div>
                  <label style={{ fontSize: '0.76rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                    Detailed Experience Review
                  </label>
                  <textarea
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    style={{
                      width: '100%', padding: '12px', borderRadius: '10px',
                      background: '#f8fafc', border: '1px solid #cbd5e1',
                      color: '#0f172a', fontSize: '0.86rem', outline: 'none', resize: 'vertical',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    padding: '14px', borderRadius: '10px',
                    background: '#2563eb',
                    color: '#ffffff', fontSize: '0.9rem', fontWeight: 800,
                    border: 'none', cursor: 'pointer', boxShadow: '0 4px 14px rgba(37, 99, 235, 0.25)',
                    opacity: submitting ? 0.7 : 1
                  }}
                >
                  {submitting ? 'Generating AI Sentiment & Submitting...' : 'Submit Verified Tour Review'}
                </button>
              </form>
            )}
          </div>

          {/* Past Verified Reviews Feed */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
              Verified Traveler Ratings & AI Sentiments
            </h3>

            {pastReviews.length === 0 ? (
              <div style={{ background: '#ffffff', padding: '24px', borderRadius: '12px', color: '#64748b', fontSize: '0.85rem', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                No reviews yet for this tour. Be the first to share your verified review!
              </div>
            ) : (
              pastReviews.map(r => (
                <div
                  key={r.id}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '18px',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#0f172a' }}>{r.traveler_name}</div>
                      <div style={{ fontSize: '0.74rem', color: '#64748b' }}>Verified Guest</div>
                    </div>
                    <div style={{ display: 'flex', gap: '3px', color: '#f59e0b' }}>
                      {[...Array(Number(r.rating) || 5)].map((_, idx) => (
                        <StarFillIcon key={idx} size={14} color="#f59e0b" />
                      ))}
                    </div>
                  </div>

                  <p style={{ color: '#334155', fontSize: '0.84rem', lineHeight: 1.5, marginBottom: '10px' }}>
                    &ldquo;{r.comment}&rdquo;
                  </p>

                  {r.ai_summary && (
                    <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', padding: '8px 10px', borderRadius: '6px', fontSize: '0.78rem', color: '#2563eb', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <LightbulbIcon size={14} />
                      <span><strong>AI Sentiment:</strong> {r.ai_summary}</span>
                    </div>
                  )}

                  {r.highlights && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {r.highlights.map(h => (
                        <span key={h} style={{ fontSize: '0.68rem', padding: '2px 8px', borderRadius: '999px', background: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0' }}>
                          ✓ {h}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
