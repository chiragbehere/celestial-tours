'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import TravelerNav from '@/components/layout/TravelerNav';
import TourLifecycleTracker from '@/components/ui/TourLifecycleTracker';
import SocialSignalFeed from '@/components/social/SocialSignalFeed';
import {
  SparklesIcon,
  CheckCircleIcon,
  ClockIcon,
  MapPinIcon,
  BackpackIcon,
  TrophyIcon,
  SunIcon,
  CompassIcon
} from '@/components/ui/Icons';

export default function TripDashboardPage({ params }) {
  const unwrappedParams = use(params);
  const id = unwrappedParams.id;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentDay, setCurrentDay] = useState(2); // Simulated Day 2 of the tour

  // Assistant Chat State
  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'assistant',
      text: 'Namaste Aditi! I am your 24/7 Celestial In-Trip Concierge. You are on Day 2 in Goa. How can I assist you with your schedule or local dining today?'
    }
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  // Packing / Prep Checklist State
  const [checklist, setChecklist] = useState([
    { id: 1, text: 'Govt Photo ID (Aadhaar / Passport) for hotel & pier check-in', checked: true },
    { id: 2, text: 'Quick-dry swimwear & towel for Grande Island Scuba', checked: true },
    { id: 3, text: 'Waterproof phone pouch & action camera', checked: false },
    { id: 4, text: 'High SPF reef-safe sunscreen & polarized sunglasses', checked: false },
    { id: 5, text: 'Comfortable walking sandals for Fontainhas Latin Quarter', checked: true }
  ]);

  // Review State
  const [reviewOpen, setReviewOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch(`/api/itinerary/${id}`);
        const json = await res.json();
        if (json.success) setData(json);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!inputMsg.trim() || chatLoading) return;

    const userText = inputMsg;
    setInputMsg('');
    setChatMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setChatLoading(true);

    try {
      const res = await fetch('/api/assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tourPlanId: id,
          message: userText,
          currentDayNumber: currentDay
        })
      });
      const resJson = await res.json();
      if (resJson.success) {
        setChatMessages(prev => [...prev, { sender: 'assistant', text: resJson.reply }]);
      } else {
        setChatMessages(prev => [...prev, { sender: 'assistant', text: 'Apologies, I encountered a temporary connection issue. Please feel free to ask again.' }]);
      }
    } catch (err) {
      setChatMessages(prev => [...prev, { sender: 'assistant', text: 'Network connection interrupted. Please try again.' }]);
    } finally {
      setChatLoading(false);
    }
  };

  const toggleChecklistItem = (itemIndex) => {
    setChecklist(prev => prev.map((item, idx) => idx === itemIndex ? { ...item, checked: !item.checked } : item));
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setSubmittingReview(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tour_plan_id: id,
          traveler_name: data?.tour_plan?.lead_traveler || 'Aditi Sharma',
          rating,
          comment
        })
      });
      const resJson = await res.json();
      if (resJson.success) {
        setReviewSubmitted(true);
        setTimeout(() => setReviewOpen(false), 2000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#0f172a' }}>
        <TravelerNav transparent={false} />
        <div style={{ textAlign: 'center', padding: '120px 24px', color: '#64748b' }}>
          Loading live trip dashboard...
        </div>
      </div>
    );
  }

  const { tour_plan, days, items, disruptions } = data || {};
  const todayItems = items?.filter(i => i.day_number === currentDay && i.status !== 'replaced' && i.status !== 'cancelled') || [];
  const latestDisruption = disruptions && disruptions.length > 0 ? disruptions[0] : null;

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', color: '#0f172a' }}>
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
            backgroundImage: `url('/dest-goa.jpg')`,
            backgroundPosition: 'center 30%'
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

        <div style={{ maxWidth: '1240px', margin: '0 auto', position: 'relative', zIndex: 3 }} className="animate-fade-in-up">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <div className="hero-slide-caption" style={{ marginBottom: '16px' }}>
                <span className="caption-dot badge-glow-green" />
                <span>ACTIVE IN-TRIP COMPANION • DAY {currentDay} OF {days?.length || 4}</span>
              </div>

              <h1 style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
                fontWeight: 800,
                color: '#ffffff',
                marginBottom: '8px',
                lineHeight: 1.15,
                textShadow: '0 4px 20px rgba(0,0,0,0.5)'
              }}>
                {tour_plan?.tour_name || 'Goa 4-Day Coastal Signature Experience'}
              </h1>
              <p style={{ color: '#cbd5e1', fontSize: '0.95rem', maxWidth: '640px', textShadow: '0 2px 6px rgba(0,0,0,0.3)' }}>
                Welcome back, {tour_plan?.lead_traveler || 'Aditi Sharma'}. Your schedule, local guide, and in-trip concierge are synchronized.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
              <Link
                href={`/trip/${id}/prepare`}
                style={{
                  padding: '10px 18px',
                  borderRadius: '999px',
                  background: 'rgba(255, 255, 255, 0.12)',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  color: '#ffffff',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                  backdropFilter: 'blur(8px)',
                  transition: 'all 0.15s ease'
                }}
              >
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <BackpackIcon size={14} />
                  <span>Pre-Trip Vault</span>
                </span>
              </Link>
              <Link
                href={`/trip/${id}/review`}
                style={{
                  padding: '10px 18px',
                  borderRadius: '999px',
                  background: 'rgba(52, 211, 153, 0.2)',
                  border: '1px solid rgba(52, 211, 153, 0.4)',
                  color: '#34d399',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                  backdropFilter: 'blur(8px)'
                }}
              >
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <TrophyIcon size={14} />
                  <span>Complete & Review</span>
                </span>
              </Link>
              <Link
                href={`/itinerary/${id}`}
                style={{
                  padding: '10px 22px',
                  borderRadius: '999px',
                  background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                  color: '#ffffff',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  textDecoration: 'none',
                  boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)'
                }}
              >
                Full Itinerary ↗
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Tour Lifecycle Progress Tracker (Sits right beneath hero) */}
      <TourLifecycleTracker currentStage="assist" />

      {/* Main Content Area */}
      <main style={{ maxWidth: '1240px', margin: '0 auto', padding: '36px 24px 80px' }}>
        
        {/* Top Status Capsule Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '18px',
          marginBottom: '32px'
        }}>
          {/* Weather Widget */}
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            padding: '22px',
            boxShadow: '0 4px 18px rgba(15, 23, 42, 0.04)'
          }}>
            <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, marginBottom: '6px' }}>
              Live Open-Meteo • {data?.tour_plan?.destinations?.[0] || 'Goa'} Hub
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>
                  {data?.weather?.current?.temperature ?? 28}°C
                </div>
                <div style={{ fontSize: '0.8rem', color: data?.weather?.current?.riskScore > 50 ? '#dc2626' : '#059669', fontWeight: 600 }}>
                  {data?.weather?.current?.condition ?? 'Pleasant Coastal Weather'} • Wind {data?.weather?.current?.windSpeed ?? 12} km/h
                </div>
              </div>
              <div style={{ color: '#d97706', display: 'flex', alignItems: 'center' }}>
                <SunIcon size={36} />
              </div>
            </div>
          </div>

          {/* Dedicated Coordinator Card */}
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            padding: '22px',
            boxShadow: '0 4px 18px rgba(15, 23, 42, 0.04)'
          }}>
            <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, marginBottom: '6px' }}>
              Dedicated Local Coordinator
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>Meera Nair</div>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Goa & South Hub • On Standby</div>
              </div>
              <a
                href="tel:+919876543210"
                style={{
                  padding: '7px 14px',
                  borderRadius: '999px',
                  background: '#eff6ff',
                  border: '1px solid #bfdbfe',
                  color: '#2563eb',
                  fontWeight: 700,
                  fontSize: '0.76rem',
                  textDecoration: 'none'
                }}
              >
                Call Concierge
              </a>
            </div>
          </div>

          {/* Next Up Activity */}
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            padding: '22px',
            boxShadow: '0 4px 18px rgba(15, 23, 42, 0.04)'
          }}>
            <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, marginBottom: '6px' }}>
              Next Scheduled Stop
            </div>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', marginBottom: '2px' }}>
              {todayItems[0]?.name || 'Grande Island Marine Excursion'}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#2563eb', fontWeight: 700 }}>
              {todayItems[0]?.start_time || '10:00 AM'} • Chauffeur Dispatched
            </div>
          </div>
        </div>

        {/* Two Columns: Left = In-Trip Concierge AI Chat, Right = Today's Timeline & Prep Checklist */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)', gap: '32px' }}>
          
          {/* Left Column: In-Trip Assistant Chat */}
          <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            border: '1px solid #e2e8f0',
            padding: '24px',
            boxShadow: '0 4px 20px rgba(15, 23, 42, 0.04)',
            display: 'flex',
            flexDirection: 'column',
            height: '620px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingBottom: '16px', borderBottom: '1px solid #f1f5f9', marginBottom: '16px' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #2563eb, #38bdf8)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(37, 99, 235, 0.25)'
              }}>
                <SparklesIcon size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Celestial In-Trip Concierge
                </h3>
                <div style={{ fontSize: '0.74rem', color: '#059669', fontWeight: 700 }}>
                  ● Connected to Live Itinerary & Vouchers
                </div>
              </div>
            </div>

            {/* Chat Messages */}
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px', paddingRight: '6px' }}>
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start'
                  }}
                >
                  <div style={{
                    maxWidth: '82%',
                    padding: '12px 16px',
                    borderRadius: '14px',
                    background: msg.sender === 'user' ? '#2563eb' : '#f8fafc',
                    color: msg.sender === 'user' ? '#ffffff' : '#1e293b',
                    border: msg.sender === 'user' ? 'none' : '1px solid #e2e8f0',
                    fontSize: '0.86rem',
                    lineHeight: 1.5,
                    boxShadow: msg.sender === 'user' ? '0 2px 8px rgba(37, 99, 235, 0.25)' : 'none'
                  }}>
                    {msg.text}
                  </div>
                  <span style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: '4px' }}>
                    {msg.sender === 'user' ? 'You' : 'Celestial AI'}
                  </span>
                </div>
              ))}
              {chatLoading && (
                <div style={{ color: '#64748b', fontSize: '0.8rem', fontStyle: 'italic', padding: '8px' }}>
                  Concierge is researching your request...
                </div>
              )}
            </div>

            {/* Quick Prompt Chips */}
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', padding: '10px 0', borderTop: '1px solid #f1f5f9' }}>
              {[
                "What's next on my schedule?",
                "Recommend lunch near Fontainhas",
                "Can we push evening dinner by 1 hour?",
                "Contact my private chauffeur"
              ].map((chip) => (
                <button
                  key={chip}
                  onClick={() => { setInputMsg(chip); }}
                  style={{
                    padding: '5px 12px',
                    borderRadius: '999px',
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    color: '#475569',
                    fontSize: '0.74rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Input Field */}
            <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
              <input
                type="text"
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                placeholder="Ask concierge anything about your trip..."
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  background: '#f8fafc',
                  color: '#0f172a',
                  fontSize: '0.86rem',
                  outline: 'none'
                }}
              />
              <button
                type="submit"
                disabled={chatLoading}
                style={{
                  padding: '12px 20px',
                  borderRadius: '10px',
                  background: '#2563eb',
                  color: '#ffffff',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 700,
                  fontSize: '0.84rem'
                }}
              >
                Send
              </button>
            </form>
          </div>

          {/* Right Column: Today's Run-Sheet */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Run-sheet list */}
            <div style={{
              background: '#ffffff',
              borderRadius: '20px',
              border: '1px solid #e2e8f0',
              padding: '24px',
              boxShadow: '0 4px 20px rgba(15, 23, 42, 0.04)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', paddingBottom: '12px', borderBottom: '1px solid #f1f5f9' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Today&apos;s Run-Sheet (Day {currentDay})
                </h3>
                <span style={{ fontSize: '0.76rem', color: '#2563eb', fontWeight: 700, background: '#eff6ff', padding: '3px 10px', borderRadius: '999px', border: '1px solid #bfdbfe' }}>
                  {todayItems.length} Events
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {todayItems.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    style={{
                      background: '#f8fafc',
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      padding: '14px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.72rem', color: '#2563eb', fontWeight: 800, textTransform: 'uppercase' }}>
                        {item.start_time || '10:00 AM'} - {item.end_time || '01:00 PM'}
                      </div>
                      <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#0f172a', marginTop: '2px' }}>
                        {item.name}
                      </div>
                      <div style={{ fontSize: '0.76rem', color: '#64748b' }}>
                        {item.location || 'Verified Location'}
                      </div>
                    </div>

                    <span style={{
                      padding: '4px 10px',
                      borderRadius: '999px',
                      background: '#ecfdf5',
                      color: '#059669',
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      textTransform: 'uppercase'
                    }}>
                      {item.status || 'Confirmed'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Readiness Card */}
            <div style={{
              background: '#ffffff',
              borderRadius: '20px',
              border: '1px solid #e2e8f0',
              padding: '24px',
              boxShadow: '0 4px 20px rgba(15, 23, 42, 0.04)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Active Trip Readiness
                </h3>
                <Link href={`/trip/${id}/prepare`} style={{ fontSize: '0.76rem', color: '#2563eb', fontWeight: 700, textDecoration: 'none' }}>
                  Open Vault →
                </Link>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {checklist.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    onClick={() => toggleChecklistItem(item.id - 1)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      background: item.checked ? '#f8fafc' : '#ffffff',
                      cursor: 'pointer'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={() => {}}
                      style={{ accentColor: '#2563eb', cursor: 'pointer' }}
                    />
                    <span style={{ fontSize: '0.8rem', color: item.checked ? '#64748b' : '#0f172a', textDecoration: item.checked ? 'line-through' : 'none' }}>
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* Real-World Social Signals Section */}
        <section style={{ marginTop: '36px' }}>
          <SocialSignalFeed destination={data?.tour_plan?.destinations?.[0] || 'Goa'} />
        </section>
      </main>
    </div>
  );
}
