'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import TravelerNav from '@/components/layout/TravelerNav';
import { 

  PlaneIcon, 
  SearchIcon, 
  CheckCircleIcon, 
  SparklesIcon, 
  BedIcon, 
  CompassIcon, 
  CarIcon, 
  RefreshIcon,
  SunIcon,
  MountainIcon,
  LandmarkIcon,
  TreesIcon,
  FlameIcon,
  WaterIcon,
  HeartPulseIcon,
  CupHotIcon,
  HouseDoorIcon,
  StarFillIcon,
  CrownIcon,
  LightningIcon,
  SlidersIcon,
  ActivityIcon,
  UtensilsIcon,
  MoonStarsIcon,
  CarFrontIcon,
  BicycleIcon,
  TrainFrontIcon,
  ChatDotsIcon
} from '@/components/ui/Icons';


function PlanContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialDest = searchParams.get('destination') || 'Goa';
  const initialDuration = searchParams.get('duration') ? Number(searchParams.get('duration')) : 4;
  const initialBudget = searchParams.get('budget') ? Number(searchParams.get('budget')) : 30000;
  const initialPace = searchParams.get('pace') || 'moderate';

  const [mode, setMode] = useState('form');

  // Conversational Concierge
  const [chatMessages, setChatMessages] = useState([
    {
      role: 'assistant',
      content: `Welcome to Celestial Concierge.\n\nDescribe your dream vacation in plain words, and our system will extract your destinations, dates, budget, stay tier, and activities automatically.\n\nExample: "I want a relaxed 4-day trip to Goa with my partner under ₹30,000. We love quiet beaches, fresh seafood, and evening sunset sailing."`
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);

  // Form State
  const [destination, setDestination] = useState(initialDest);
  const [duration, setDuration] = useState(initialDuration);
  const [budget, setBudget] = useState(initialBudget);
  const [groupSize, setGroupSize] = useState(2);
  const [tier, setTier] = useState('mid');
  const [pace, setPace] = useState(initialPace);
  const [transport, setTransport] = useState('cab');
  const [selectedInterests, setSelectedInterests] = useState(['beach', 'food', 'relaxation']);

  // Loading state during generation
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState('');

  const interestOptions = [
    { id: 'beach', label: 'Coastal & Beaches', icon: <SunIcon size={16} /> },
    { id: 'adventure', label: 'Trekking & Mountain Pass', icon: <ActivityIcon size={16} /> },
    { id: 'culture', label: 'Royal Forts & Palaces', icon: <LandmarkIcon size={16} /> },
    { id: 'food', label: 'Local Food & Culinary Trails', icon: <UtensilsIcon size={16} /> },
    { id: 'relaxation', label: 'Wellness & Spa Retreat', icon: <HeartPulseIcon size={16} /> },
    { id: 'nightlife', label: 'Night Markets & Social', icon: <MoonStarsIcon size={16} /> },
    { id: 'water-sports', label: 'Scuba & Water Sports', icon: <WaterIcon size={16} /> },
    { id: 'heritage', label: 'UNESCO Heritage & Temples', icon: <LandmarkIcon size={16} /> }
  ];

  const destinationOptions = [
    { name: 'Goa', icon: <SunIcon size={24} />, vibe: 'Sun, Sand & Heritage' },
    { name: 'Manali', icon: <MountainIcon size={24} />, vibe: 'Snow & Himalayan Peaks' },
    { name: 'Jaipur', icon: <LandmarkIcon size={24} />, vibe: 'Palaces & Royal Bazaars' },
    { name: 'Kerala', icon: <TreesIcon size={24} />, vibe: 'Tropical Backwaters' },
    { name: 'Varanasi', icon: <FlameIcon size={24} />, vibe: 'Ghats & Spiritual Aarti' },
    { name: 'Udaipur', icon: <WaterIcon size={24} />, vibe: 'Lakes & Maharaja Havelis' },
    { name: 'Rishikesh', icon: <HeartPulseIcon size={24} />, vibe: 'Yoga & River Rafting' },
    { name: 'Munnar', icon: <CupHotIcon size={24} />, vibe: 'Misty Tea Highlands' },
  ];

  const toggleInterest = (id) => {
    if (selectedInterests.includes(id)) {
      setSelectedInterests(selectedInterests.filter(i => i !== id));
    } else {
      setSelectedInterests([...selectedInterests, id]);
    }
  };

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || isExtracting) return;

    const userText = chatInput;
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', content: userText }]);
    setIsExtracting(true);

    try {
      const res = await fetch('/api/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: userText })
      });
      const data = await res.json();

      if (data.success && data.preferences) {
        const p = data.preferences;
        if (p.destinations?.[0]) setDestination(p.destinations[0]);
        if (p.duration_days) setDuration(p.duration_days);
        if (p.budget_total) setBudget(p.budget_total);
        if (p.group_size) setGroupSize(p.group_size);
        if (p.accommodation_tier) setTier(p.accommodation_tier);
        if (p.pace) setPace(p.pace);
        if (p.interests) setSelectedInterests(p.interests);

        setChatMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            content: `Parameters Extracted:\n\n• Destination: ${p.destinations?.join(', ') || 'Goa'}\n• Duration: ${p.duration_days || 4} Days\n• Budget: ₹${(p.budget_total || 30000).toLocaleString('en-IN')}\n• Tier: ${p.accommodation_tier?.toUpperCase() || 'MID'}\n• Pace: ${p.pace || 'moderate'}\n\nSummary: ${p.summary}\n\nClick "Build & Validate Itinerary" below to finalize!`
          }
        ]);
      }
    } catch (err) {
      console.error(err);
      setChatMessages(prev => [...prev, { role: 'assistant', content: 'Connection issue. Using manual form settings.' }]);
    } finally {
      setIsExtracting(false);
    }
  };

  const handleBuildItinerary = async () => {
    setIsGenerating(true);
    setGenerationStep('Analyzing local hub inventory & hotel contracts...');

    try {
      setTimeout(() => setGenerationStep('Solving schedule buffer constraints & transit times...'), 600);
      setTimeout(() => setGenerationStep('Locking verified live vendor pricing & weather contingencies...'), 1200);

      const res = await fetch('/api/itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destinations: [destination],
          duration_days: duration,
          budget_total: budget,
          group_size: groupSize,
          accommodation_tier: tier,
          pace,
          transport,
          interests: selectedInterests
        })
      });

      const data = await res.json();
      if (data.success) {
        setGenerationStep('Tour plan constraint-checked! Launching studio...');
        setTimeout(() => {
          router.push(`/itinerary/${data.tour_plan.id}`);
        }, 500);
      } else {
        alert(data.error || 'Failed to generate itinerary');
        setIsGenerating(false);
      }
    } catch (err) {
      console.error('Error generating:', err);
      alert('Error connecting to itinerary engine.');
      setIsGenerating(false);
    }
  };

  return (
    <div className="home-cinematic" style={{ background: '#f8fafc', minHeight: '100vh', color: '#0f172a' }}>
      <TravelerNav transparent={true} />

      {/* ═══════════════════════════════════════════════
          CINEMATIC HERO HEADER WITH PARTICLES & KEN BURNS
      ═══════════════════════════════════════════════ */}
      <section style={{
        position: 'relative',
        minHeight: '580px',
        padding: '150px 24px 70px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        overflow: 'hidden',
        background: '#050b14'
      }}>
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
          {[14, 28, 42, 58, 74, 88, 22, 66, 82, 36, 50, 92].map((leftVal, i) => (
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
        <div className="ai-cta-glow" style={{ top: '-120px', left: '50%', transform: 'translateX(-50%)', width: '650px', height: '650px' }} />

        <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative', zIndex: 3 }} className="animate-fade-in-up">
          <div className="hero-slide-caption" style={{ marginBottom: '16px' }}>
            <span className="caption-dot badge-glow-blue" />
            <span>AI Trip Configuration Studio · Nugen AI Domain-Aligned Engine</span>
          </div>

          <h1 className="hero-mega-title">
            <span className="title-line title-line-1" style={{ fontSize: 'clamp(2.6rem, 6vw, 4.8rem)' }}>
              DESIGN YOUR
            </span>
            <span className="title-line title-line-2" style={{ fontSize: 'clamp(1.8rem, 4.5vw, 3.2rem)' }}>
              PERFECT TOUR
            </span>
          </h1>

          <p className="hero-subtitle" style={{ maxWidth: '640px', margin: '18px auto 30px' }}>
            Personalized down to the hour. Our constraint solver guarantees zero schedule conflicts, verified hotel slots, and private transfers.
          </p>

          {/* Mode Switcher Tabs */}
          <div style={{
            display: 'inline-flex',
            gap: '8px',
            padding: '6px',
            background: 'rgba(15, 23, 42, 0.75)',
            borderRadius: '999px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(16px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.35)'
          }}>
            {[
              { key: 'form', label: 'Interactive Studio', icon: <LightningIcon size={16} /> },
              { key: 'chat', label: 'AI Concierge Chat', icon: <ChatDotsIcon size={16} /> },
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setMode(tab.key)}
                style={{
                  padding: '10px 24px',
                  borderRadius: '999px',
                  cursor: 'pointer',
                  background: mode === tab.key ? 'linear-gradient(135deg, #f59e0b, #ea580c)' : 'transparent',
                  color: mode === tab.key ? '#ffffff' : 'rgba(255, 255, 255, 0.75)',
                  border: 'none',
                  fontWeight: 800,
                  fontSize: '0.88rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s',
                  boxShadow: mode === tab.key ? '0 4px 16px rgba(245, 158, 11, 0.4)' : 'none',
                }}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          MAIN WORKSPACE CARD — Crisp, Luxury Aesthetic
      ═══════════════════════════════════════════════ */}
      <main style={{ maxWidth: '1040px', margin: '-40px auto 90px', padding: '0 24px', position: 'relative', zIndex: 5 }}>
        {/* Loading Screen Animation */}
        {isGenerating ? (
          <div style={{
            background: '#ffffff',
            borderRadius: '28px',
            padding: '72px 48px',
            textAlign: 'center',
            border: '1px solid #e2e8f0',
            boxShadow: '0 25px 60px -15px rgba(15, 23, 42, 0.15)'
          }} className="animate-fade-in-up">
            <div style={{
              width: '84px',
              height: '84px',
              borderRadius: '24px',
              background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              boxShadow: '0 12px 30px rgba(37, 99, 235, 0.4)'
            }} className="badge-glow-blue">
              <PlaneIcon size={40} />
            </div>
            <h2 style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: '2.2rem',
              fontWeight: 800,
              color: '#0f172a',
              marginBottom: '12px',
              letterSpacing: '-0.02em'
            }}>
              Synthesizing Your Constraint-Optimized Tour
            </h2>
            <p style={{ color: '#2563eb', fontWeight: 700, fontSize: '1rem', marginBottom: '28px', maxWidth: '480px', margin: '0 auto 28px' }}>
              {generationStep}
            </p>
            <div className="loading-pulse" style={{ justifyContent: 'center' }}>
              <span /><span /><span />
            </div>
          </div>
        ) : (
          <>
            {/* Conversational Mode */}
            {mode === 'chat' && (
              <div style={{
                background: '#ffffff',
                borderRadius: '28px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 20px 45px -10px rgba(15, 23, 42, 0.08)',
                padding: '32px',
                marginBottom: '32px'
              }} className="animate-fade-in-up">
                <div style={{ height: '340px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px', padding: '12px' }}>
                  {chatMessages.map((msg, idx) => (
                    <div
                      key={idx}
                      style={{
                        maxWidth: '82%',
                        alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                        background: msg.role === 'user' ? 'linear-gradient(135deg, #2563eb, #1d4ed8)' : '#f8fafc',
                        color: msg.role === 'user' ? '#ffffff' : '#0f172a',
                        padding: '16px 22px',
                        borderRadius: '20px',
                        fontSize: '0.92rem',
                        lineHeight: 1.6,
                        whiteSpace: 'pre-line',
                        border: msg.role === 'user' ? 'none' : '1px solid #e2e8f0',
                        boxShadow: msg.role === 'user' ? '0 4px 14px rgba(37, 99, 235, 0.3)' : '0 2px 8px rgba(0,0,0,0.03)'
                      }}
                    >
                      {msg.content}
                    </div>
                  ))}
                  {isExtracting && (
                    <div style={{ alignSelf: 'flex-start', background: '#f8fafc', padding: '12px 18px', borderRadius: '18px', fontSize: '0.85rem', color: '#2563eb', fontWeight: 600 }}>
                      ✦ Nugen AI is extracting your travel parameters...
                    </div>
                  )}
                </div>

                <form onSubmit={handleChatSubmit} style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder='Type your vision, e.g. "5 days in Manali for family of 4, staying at a luxury resort under ₹60k"'
                    style={{
                      flex: 1,
                      padding: '14px 20px',
                      borderRadius: '999px',
                      border: '1px solid #cbd5e1',
                      background: '#f8fafc',
                      color: '#0f172a',
                      fontSize: '0.92rem',
                      outline: 'none'
                    }}
                  />
                  <button
                    type="submit"
                    className="story-cta"
                    style={{ padding: '12px 28px', fontSize: '0.88rem', border: 'none', cursor: 'pointer' }}
                  >
                    <span className="cta-gradient-text">Apply to Form</span>
                  </button>
                </form>
              </div>
            )}

            {/* Main Interactive Studio Workspace Card */}
            <div style={{
              background: '#ffffff',
              borderRadius: '28px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 20px 45px -10px rgba(15, 23, 42, 0.08)',
              padding: '40px',
              color: '#0f172a'
            }} className="card-hover-lift animate-fade-in-up">
              {/* Header inside card */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: '24px',
                marginBottom: '32px',
                borderBottom: '1px solid #f1f5f9',
                flexWrap: 'wrap',
                gap: '14px'
              }}>
                <div>
                  <h2 style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: '1.75rem',
                    fontWeight: 800,
                    color: '#0f172a',
                    letterSpacing: '-0.02em',
                    margin: 0
                  }}>
                    Tour Logistics & Pacing Studio
                  </h2>
                  <p style={{ color: '#64748b', fontSize: '0.88rem', marginTop: '4px', margin: 0 }}>
                    Real-time inventory solver connects verified boutique stays, licensed chauffeurs & local naturalist guides.
                  </p>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  color: '#059669',
                  background: '#ecfdf5',
                  padding: '6px 16px',
                  borderRadius: '999px',
                  border: '1px solid #a7f3d0'
                }}>
                  <CheckCircleIcon size={14} />
                  <span>Real-Time Inventory Synced</span>
                </div>
              </div>

              {/* Destination Selector with 3D Animated Chips */}
              <div style={{ marginBottom: '32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.08em' }}>
                    Select Sanctuary Destination
                  </label>
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#2563eb' }}>
                    Current: {destination}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '12px', marginBottom: '16px' }}>
                  {destinationOptions.map(dest => {
                    const isSelected = destination.toLowerCase() === dest.name.toLowerCase();
                    return (
                      <button
                        key={dest.name}
                        type="button"
                        onClick={() => setDestination(dest.name)}
                        className="card-hover-lift"
                        style={{
                          padding: '14px 18px',
                          borderRadius: '16px',
                          background: isSelected ? 'linear-gradient(135deg, #2563eb, #1d4ed8)' : '#f8fafc',
                          color: isSelected ? '#ffffff' : '#1e293b',
                          border: isSelected ? '1px solid #2563eb' : '1px solid #e2e8f0',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          textAlign: 'left',
                          transition: 'all 0.2s',
                          boxShadow: isSelected ? '0 8px 20px rgba(37, 99, 235, 0.3)' : '0 1px 3px rgba(0,0,0,0.02)'
                        }}
                      >
                        <span style={{ 
                          display: 'inline-flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          width: '36px', 
                          height: '36px', 
                          borderRadius: '10px', 
                          background: isSelected ? 'rgba(255,255,255,0.2)' : '#e2e8f0', 
                          color: isSelected ? '#ffffff' : '#2563eb', 
                          flexShrink: 0 
                        }}>
                          {dest.icon}
                        </span>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '0.96rem' }}>{dest.name}</div>
                          <div style={{ fontSize: '0.74rem', color: isSelected ? 'rgba(255,255,255,0.85)' : '#64748b' }}>
                            {dest.vibe}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Duration & Budget Controls with 3D Elevation */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '32px' }}>
                {/* Duration Slider Card */}
                <div style={{
                  background: '#f8fafc',
                  padding: '24px',
                  borderRadius: '20px',
                  border: '1px solid #e2e8f0'
                }} className="card-hover-lift">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.06em' }}>
                      Trip Duration
                    </label>
                    <span style={{
                      fontWeight: 800,
                      color: '#2563eb',
                      fontSize: '0.95rem',
                      background: '#eff6ff',
                      padding: '4px 12px',
                      borderRadius: '999px',
                      border: '1px solid #bfdbfe'
                    }}>
                      {duration} Days • {duration - 1} Nights
                    </span>
                  </div>
                  <input
                    type="range"
                    min={2}
                    max={7}
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    style={{ width: '100%', accentColor: '#2563eb', cursor: 'pointer', height: '6px' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', color: '#64748b', marginTop: '10px', fontWeight: 600 }}>
                    <span>2 Days (Weekend)</span>
                    <span>4 Days (Signature)</span>
                    <span>7 Days (Grand)</span>
                  </div>
                </div>

                {/* Budget Slider Card */}
                <div style={{
                  background: '#f8fafc',
                  padding: '24px',
                  borderRadius: '20px',
                  border: '1px solid #e2e8f0'
                }} className="card-hover-lift">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.06em' }}>
                      Budget Target (Total)
                    </label>
                    <span style={{
                      fontWeight: 800,
                      color: '#059669',
                      fontSize: '1.05rem',
                      background: '#ecfdf5',
                      padding: '4px 14px',
                      borderRadius: '999px',
                      border: '1px solid #a7f3d0'
                    }}>
                      ₹{budget.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={10000}
                    max={100000}
                    step={5000}
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    style={{ width: '100%', accentColor: '#059669', cursor: 'pointer', height: '6px' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', color: '#64748b', marginTop: '10px', fontWeight: 600 }}>
                    <span>₹10,000</span>
                    <span>₹50,000</span>
                    <span>₹1,00,000</span>
                  </div>
                </div>
              </div>

              {/* Pacing & Accommodation Tier 3D Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '32px' }}>
                {/* Pacing */}
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.06em', display: 'block', marginBottom: '12px' }}>
                    Daily Pacing
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                    {[
                      { id: 'relaxed', label: 'Relaxed', icon: <SunIcon size={24} />, desc: 'Max 2 slots / day' },
                      { id: 'moderate', label: 'Balanced', icon: <SlidersIcon size={24} />, desc: 'Ideal standard pace' },
                      { id: 'packed', label: 'Thrill', icon: <LightningIcon size={24} />, desc: 'Action-packed tour' }
                    ].map((p) => {
                      const isSelected = pace === p.id;
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => setPace(p.id)}
                          className="card-hover-lift"
                          style={{
                            padding: '14px 10px',
                            textAlign: 'center',
                            borderRadius: '16px',
                            cursor: 'pointer',
                            background: isSelected ? 'linear-gradient(135deg, #2563eb, #1d4ed8)' : '#f8fafc',
                            color: isSelected ? '#ffffff' : '#334155',
                            border: isSelected ? '1px solid #2563eb' : '1px solid #e2e8f0',
                            transition: 'all 0.2s',
                            boxShadow: isSelected ? '0 6px 16px rgba(37, 99, 235, 0.3)' : 'none'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '30px', marginBottom: '4px' }}>{p.icon}</div>
                          <div style={{ fontWeight: 800, fontSize: '0.88rem' }}>{p.label}</div>
                          <div style={{ fontSize: '0.68rem', color: isSelected ? 'rgba(255,255,255,0.8)' : '#64748b', marginTop: '2px' }}>
                            {p.desc}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Accommodation Preference */}
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.06em', display: 'block', marginBottom: '12px' }}>
                    Accommodation Standard
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                    {[
                      { id: 'budget', label: 'Budget Haven', icon: <HouseDoorIcon size={24} />, tierDesc: 'Clean Homestays' },
                      { id: 'mid', label: '4-Star Boutique', icon: <StarFillIcon size={22} color="#f59e0b" />, tierDesc: 'Premium Comfort' },
                      { id: 'premium', label: '5-Star Luxury', icon: <CrownIcon size={24} />, tierDesc: 'Palace Heritage' }
                    ].map((t) => {
                      const isSelected = tier === t.id;
                      return (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setTier(t.id)}
                          className="card-hover-lift"
                          style={{
                            padding: '14px 10px',
                            textAlign: 'center',
                            borderRadius: '16px',
                            cursor: 'pointer',
                            background: isSelected ? 'linear-gradient(135deg, #2563eb, #1d4ed8)' : '#f8fafc',
                            color: isSelected ? '#ffffff' : '#334155',
                            border: isSelected ? '1px solid #2563eb' : '1px solid #e2e8f0',
                            transition: 'all 0.2s',
                            boxShadow: isSelected ? '0 6px 16px rgba(37, 99, 235, 0.3)' : 'none'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '30px', marginBottom: '4px' }}>{t.icon}</div>
                          <div style={{ fontWeight: 800, fontSize: '0.88rem' }}>{t.label}</div>
                          <div style={{ fontSize: '0.68rem', color: isSelected ? 'rgba(255,255,255,0.8)' : '#64748b', marginTop: '2px' }}>
                            {t.tierDesc}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Local Commute Mode */}
              <div style={{ marginBottom: '32px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.06em', display: 'block', marginBottom: '10px' }}>
                  Local Commute Mode
                </label>
                <select
                  value={transport}
                  onChange={(e) => setTransport(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '14px 20px',
                    borderRadius: '16px',
                    border: '1px solid #cbd5e1',
                    background: '#f8fafc',
                    color: '#0f172a',
                    fontSize: '0.92rem',
                    fontWeight: 600,
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <option value="cab">Dedicated Private Chauffeur AC Cab (Airport pickup, full-day touring & return drop)</option>
                  <option value="auto">Self-drive Royal Enfield / Scooter Rental with helmets</option>
                  <option value="train">Scenic Express Train & Station Chauffeur Transfers</option>
                </select>
              </div>

              {/* Desired Experiences & Activities Chips */}
              <div style={{ marginBottom: '36px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.06em' }}>
                    Desired Experiences & Themes ({selectedInterests.length} Selected)
                  </label>
                  <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                    Tap to toggle preferences
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {interestOptions.map((item) => {
                    const isSelected = selectedInterests.includes(item.id);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => toggleInterest(item.id)}
                        className="card-hover-lift"
                        style={{
                          padding: '10px 18px',
                          borderRadius: '999px',
                          fontSize: '0.85rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                          transition: 'all 0.2s',
                          border: isSelected ? '1px solid #f59e0b' : '1px solid #e2e8f0',
                          background: isSelected ? '#f59e0b' : '#f8fafc',
                          color: isSelected ? '#ffffff' : '#334155',
                          boxShadow: isSelected ? '0 4px 12px rgba(245, 158, 11, 0.3)' : 'none'
                        }}
                      >
                        <span style={{ display: 'inline-flex', alignItems: 'center' }}>{item.icon}</span>
                        <span>{item.label}</span>
                        {isSelected && <CheckCircleIcon size={14} />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Main Submit Button with Animation */}
              <button
                type="button"
                onClick={handleBuildItinerary}
                className="story-cta"
                style={{
                  width: '100%',
                  padding: '18px 36px',
                  borderRadius: '999px',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '12px',
                  fontSize: '1.05rem',
                  fontWeight: 800,
                  boxShadow: '0 8px 30px rgba(245, 158, 11, 0.45)',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                }}
              >
                <SparklesIcon size={20} />
                <span className="cta-gradient-text">Build & Validate Constraint-Optimized Itinerary</span>
                <span style={{ color: '#fff' }}>→</span>
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default function PlanPage() {
  return (
    <Suspense fallback={
      <div className="home-cinematic" style={{ minHeight: '100vh', background: '#020617', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#94a3b8' }}>Loading AI Plan Studio...</p>
      </div>
    }>
      <PlanContent />
    </Suspense>
  );
}
