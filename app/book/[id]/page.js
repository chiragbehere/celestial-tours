'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import TravelerNav from '@/components/layout/TravelerNav';
import TourLifecycleTracker from '@/components/ui/TourLifecycleTracker';
import { useAuth } from '@/lib/context/AuthContext';
import { 
  CheckCircleIcon, 
  ShieldCheckIcon, 
  BedIcon, 
  CarIcon, 
  ActivityIcon,
  ClockIcon,
  SparklesIcon
} from '@/components/ui/Icons';

export default function BookPage({ params }) {
  const unwrappedParams = use(params);
  const id = unwrappedParams.id;
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  const [name, setName] = useState(user?.displayName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [paymentMethod, setPaymentMethod] = useState('upi');

  // Flexible payment customizations: itemId => 'pay_now' | 'pay_on_trip' | 'skip'
  const [paymentPrefs, setPaymentPrefs] = useState({});

  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(null);

  useEffect(() => {
    if (user) {
      if (user.displayName && !name) setName(user.displayName);
      if (user.email && !email) setEmail(user.email);
    }
  }, [user]);

  const isType = (item, target) => {
    const t = (item?.item_type || item?.type || '').toLowerCase();
    if (target === 'stay') return t === 'stay' || t.includes('hotel') || Boolean(item?.hotel_id);
    if (target === 'transport') return t === 'transport' || t.includes('cab') || t.includes('transit') || Boolean(item?.transport_id);
    return t === 'activity' || t.includes('excursion') || t.includes('experience') || (!item?.hotel_id && !item?.transport_id);
  };

  const initPaymentPrefs = (items) => {
    const initialPrefs = {};
    (items || []).forEach(item => {
      if (isType(item, 'stay')) {
        initialPrefs[item.id] = 'pay_now'; // Core stay
      } else if (isType(item, 'transport')) {
        initialPrefs[item.id] = 'pay_now'; // Core transfer
      } else {
        initialPrefs[item.id] = 'pay_on_trip'; // Flexible on-trip payment by default
      }
    });
    setPaymentPrefs(initialPrefs);
  };

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch(`/api/itinerary/${id}`);
        const json = await res.json();
        if (json.success && json.tour_plan) {
          setData(json);
          initPaymentPrefs(json.items);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.error('Error fetching itinerary for booking:', err);
      }

      // Client-side cache fallback for serverless container switches
      if (typeof window !== 'undefined') {
        try {
          const cachedRaw = localStorage.getItem(`celestial_tour_${id}`) || localStorage.getItem('celestial_last_tour');
          if (cachedRaw) {
            const cached = JSON.parse(cachedRaw);
            if (cached && cached.tour_plan) {
              setData(cached);
              initPaymentPrefs(cached.items);
              setLoading(false);
              return;
            }
          }
        } catch (e) {
          console.warn('LocalStorage error in book page:', e);
        }
      }

      setLoading(false);
    }
    loadData();
  }, [id]);

  if (loading) {
    return (
      <div style={{ background: '#f8fafc', minHeight: '100vh' }}>
        <TravelerNav />
        <main style={{ maxWidth: '800px', margin: '80px auto', textAlign: 'center', padding: '0 24px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid #e2e8f0',
            borderTopColor: '#2563eb',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 16px'
          }} />
          <p style={{ color: '#64748b', fontSize: '0.95rem' }}>Preparing customizable checkout session...</p>
        </main>
      </div>
    );
  }

  if (!data || !data.tour_plan) {
    return (
      <div style={{ background: '#f8fafc', minHeight: '100vh' }}>
        <TravelerNav />
        <main style={{ maxWidth: '600px', margin: '80px auto', textAlign: 'center', padding: '0 24px' }}>
          <div style={{ background: '#ffffff', borderRadius: '16px', padding: '48px 32px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>Tour Session Expired</h2>
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '24px' }}>This itinerary link is not active or has been cleared.</p>
            <Link
              href="/plan"
              style={{
                display: 'inline-block',
                padding: '12px 24px',
                borderRadius: '8px',
                background: '#0f172a',
                color: '#ffffff',
                fontWeight: 700,
                textDecoration: 'none'
              }}
            >
              Plan New Tour ↗
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const { tour_plan, days = [], items = [] } = data;
  const activeItems = (items || []).filter(i => i.status !== 'replaced' && i.status !== 'cancelled');

  // Segregate necessary items (stays) and optional customizable items (rides & activities)
  const necessaryItems = activeItems.filter(i => i.item_type === 'stay');
  const optionalItems = activeItems.filter(i => i.item_type !== 'stay');

  // Dynamic calculations based on user preferences
  let amountDueNow = 0;
  let amountPayOnLocation = 0;

  activeItems.forEach(item => {
    const pref = paymentPrefs[item.id] || (item.item_type === 'stay' ? 'pay_now' : 'pay_on_trip');
    if (pref === 'pay_now') {
      amountDueNow += (item.cost || 0);
    } else if (pref === 'pay_on_trip') {
      amountPayOnLocation += (item.cost || 0);
    }
  });

  const totalTourValuation = amountDueNow + amountPayOnLocation;

  const handlePreferenceChange = (itemId, newPref) => {
    setPaymentPrefs(prev => ({
      ...prev,
      [itemId]: newPref
    }));
  };

  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tourPlanId: id,
          travelerName: name,
          travelerEmail: email,
          paymentMethod,
          paymentPreferences: paymentPrefs
        })
      });

      const resData = await res.json();
      if (resData.success) {
        setBookingConfirmed(resData);
        if (typeof window !== 'undefined') {
          try {
            const existingBookings = JSON.parse(localStorage.getItem('celestial_user_bookings') || '[]');
            existingBookings.unshift({
              ...resData,
              tourPlanId: id,
              booked_at: new Date().toISOString()
            });
            localStorage.setItem('celestial_user_bookings', JSON.stringify(existingBookings));

            const cachedRaw = localStorage.getItem(`celestial_tour_${id}`);
            if (cachedRaw) {
              const cached = JSON.parse(cachedRaw);
              cached.tour_plan = { ...cached.tour_plan, status: 'booked' };
              localStorage.setItem(`celestial_tour_${id}`, JSON.stringify(cached));
            }
          } catch (e) {
            console.warn('LocalStorage save booking error:', e);
          }
        }
      } else {
        alert(resData.error || 'Booking failed. Please try again.');
      }
    } catch (err) {
      console.error(err);
      alert('Error finalizing booking');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="home-cinematic" style={{ background: '#f8fafc', minHeight: '100vh', color: '#0f172a' }}>
      <TravelerNav transparent={true} />

      {/* ═══════════════════════════════════════════════
          CINEMATIC HERO HEADER
      ═══════════════════════════════════════════════ */}
      <section className="compact-hero-section">
        <div
          className="hero-kenburns-bg"
          style={{
            backgroundImage: `url('/hero-india.jpg')`,
            backgroundPosition: 'center 40%'
          }}
        />
        <div className="hero-overlay" />

        <div style={{ maxWidth: '1040px', margin: '0 auto', position: 'relative', zIndex: 3 }} className="animate-fade-in-up">
          <div className="hero-slide-caption" style={{ marginBottom: '14px' }}>
            <span className="caption-dot badge-glow-blue" />
            <span>Customizable Travel Checkout • Pay for What You Need</span>
          </div>
          <h1 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
            fontWeight: 800,
            color: '#ffffff',
            letterSpacing: '-0.02em',
            marginBottom: '8px',
            textShadow: '0 4px 20px rgba(0,0,0,0.5)'
          }}>
            Customize Package & Choose Payment Mode
          </h1>
          <p style={{ color: '#cbd5e1', fontSize: '0.95rem', textShadow: '0 2px 6px rgba(0,0,0,0.3)', maxWidth: '780px' }}>
            Pay upfront only for what is necessary (hotel reservations). Choose whether to pre-pay rides and activities or pay directly on location while visiting.
          </p>
        </div>
      </section>

      <TourLifecycleTracker currentStage="book" />

      <main className="responsive-main-container">
        {bookingConfirmed ? (
          /* Luxury Voucher Confirmation */
          <div style={{
            background: '#ffffff',
            borderRadius: '24px',
            border: '1px solid #e2e8f0',
            padding: '48px 36px',
            boxShadow: '0 12px 40px rgba(15, 23, 42, 0.08)',
            textAlign: 'center'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: '#ecfdf5',
              color: '#059669',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <CheckCircleIcon size={32} />
            </div>

            <div style={{
              display: 'inline-block',
              padding: '4px 14px',
              background: '#ecfdf5',
              color: '#059669',
              borderRadius: '999px',
              fontSize: '0.75rem',
              fontWeight: 800,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              marginBottom: '12px'
            }}>
              Customized Booking Confirmed & Dispatched
            </div>

            <h1 style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: '2.2rem',
              fontWeight: 800,
              color: '#0f172a',
              marginBottom: '8px'
            }}>
              Tour Vouchers Issued for {tour_plan.destinations?.[0] || 'Your Journey'}!
            </h1>
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '28px' }}>
              Booking Reference: <strong style={{ color: '#0f172a', fontFamily: 'monospace', letterSpacing: '0.05em' }}>{bookingConfirmed.confirmation_code}</strong>
            </p>

            {/* Payment Summary Box */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
              maxWidth: '680px',
              margin: '0 auto 32px'
            }}>
              <div style={{ background: '#f0fdf4', padding: '16px', borderRadius: '14px', border: '1px solid #bbf7d0', textAlign: 'center' }}>
                <div style={{ fontSize: '0.72rem', color: '#166534', fontWeight: 800, textTransform: 'uppercase' }}>Paid Upfront (Pre-paid)</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#15803d', marginTop: '4px' }}>
                  ₹{(bookingConfirmed.amountPaidNow ?? amountDueNow).toLocaleString('en-IN')}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#166534', marginTop: '2px' }}>Guaranteed Stays & Locked Items</div>
              </div>

              <div style={{ background: '#eff6ff', padding: '16px', borderRadius: '14px', border: '1px solid #bfdbfe', textAlign: 'center' }}>
                <div style={{ fontSize: '0.72rem', color: '#1e40af', fontWeight: 800, textTransform: 'uppercase' }}>Pay on Location (On Trip)</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#2563eb', marginTop: '4px' }}>
                  ₹{(bookingConfirmed.amountPayOnLocation ?? amountPayOnLocation).toLocaleString('en-IN')}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#1e40af', marginTop: '2px' }}>Pay Directly at Venues During Visit</div>
              </div>
            </div>

            {/* Issued Vouchers Itemization */}
            <div style={{ maxWidth: '680px', margin: '0 auto 36px', textAlign: 'left' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', marginBottom: '14px' }}>
                Allocated Vouchers & Payment Instructions:
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {(bookingConfirmed.bookings || []).map((b, idx) => (
                  <div
                    key={b.id || idx}
                    style={{
                      background: '#f8fafc',
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      padding: '14px 18px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#0f172a' }}>
                        {b.vendor_name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        {b.vendor_type?.toUpperCase()} • {b.payment_status === 'paid' ? 'Pre-Paid in Package' : 'Pay Directly on Visit'}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '3px 10px',
                        borderRadius: '6px',
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        background: b.payment_status === 'paid' ? '#ecfdf5' : '#eff6ff',
                        color: b.payment_status === 'paid' ? '#059669' : '#2563eb',
                        border: `1px solid ${b.payment_status === 'paid' ? '#a7f3d0' : '#bfdbfe'}`
                      }}>
                        {b.payment_status === 'paid' ? 'Fully Pre-Paid' : `Pay ₹${b.amount?.toLocaleString('en-IN')} on Spot`}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
              <Link
                href={`/trip/${id}`}
                style={{
                  padding: '14px 28px',
                  borderRadius: '999px',
                  background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  textDecoration: 'none',
                  boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)'
                }}
              >
                Launch Live Trip Companion →
              </Link>
              <Link
                href={`/itinerary/${id}`}
                style={{
                  padding: '14px 24px',
                  borderRadius: '999px',
                  background: '#f8fafc',
                  color: '#334155',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  textDecoration: 'none',
                  border: '1px solid #cbd5e1'
                }}
              >
                View Full Itinerary Studio
              </Link>
            </div>
          </div>
        ) : (
          /* Checkout & Customization Screen */
          <div className="responsive-checkout-grid">
            {/* Left Column: Customization Controls & Payment Form */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Flexible Customization Card */}
              <div style={{
                background: '#ffffff',
                borderRadius: '20px',
                border: '1px solid #e2e8f0',
                padding: '28px',
                boxShadow: '0 4px 20px rgba(15, 23, 42, 0.04)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    background: '#eff6ff',
                    color: '#2563eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <SparklesIcon size={18} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                      Customize Package Payment
                    </h3>
                    <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>
                      Pay only for what is necessary. Choose whether to pay rides and activities on trip or pre-pay.
                    </p>
                  </div>
                </div>

                {/* 1. Necessary Core Section */}
                <div style={{ marginTop: '20px', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#0f172a' }}>
                      🔒 Necessary Core (Guaranteed Pre-Paid Stays)
                    </span>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#059669', background: '#ecfdf5', padding: '2px 8px', borderRadius: '4px' }}>
                      Required Upfront
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {necessaryItems.map(item => (
                      <div
                        key={item.id}
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
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ color: '#2563eb' }}><BedIcon size={18} /></span>
                          <div>
                            <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#0f172a' }}>
                              {item.name}
                            </div>
                            <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
                              Hotel Room Confirmation • Nightly Stay
                            </div>
                          </div>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#0f172a' }}>
                            ₹{item.cost?.toLocaleString('en-IN')}
                          </div>
                          <span style={{ fontSize: '0.7rem', color: '#059669', fontWeight: 700 }}>
                            Pre-paid in Package
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Optional Rides & Experiences Section */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#0f172a' }}>
                      ⚡ Optional Rides & Activities ({optionalItems.length} items)
                    </span>
                    <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                      Choose on-trip, pre-pay, or skip
                    </span>
                  </div>

                  {/* Compact scrollable container so page never stretches excessively */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    maxHeight: '410px',
                    overflowY: 'auto',
                    paddingRight: '6px'
                  }}>
                    {optionalItems.map(item => {
                      const currentPref = paymentPrefs[item.id] || 'pay_on_trip';
                      const isActivity = item.item_type === 'activity';

                      return (
                        <div
                          key={item.id}
                          style={{
                            background: currentPref === 'skip' ? '#f8fafc' : '#ffffff',
                            borderRadius: '12px',
                            border: `1px solid ${currentPref === 'pay_on_trip' ? '#bfdbfe' : currentPref === 'pay_now' ? '#bbf7d0' : '#e2e8f0'}`,
                            padding: '10px 14px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '12px',
                            flexWrap: 'wrap',
                            opacity: currentPref === 'skip' ? 0.6 : 1,
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: '220px', flex: 1 }}>
                            <span style={{
                              color: isActivity ? '#d97706' : '#059669',
                              background: isActivity ? '#fef3c7' : '#ecfdf5',
                              width: '32px',
                              height: '32px',
                              borderRadius: '8px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0
                            }}>
                              {isActivity ? <ActivityIcon size={16} /> : <CarIcon size={16} />}
                            </span>
                            <div>
                              <div style={{ fontWeight: 800, fontSize: '0.84rem', color: '#0f172a', lineHeight: 1.25 }}>
                                {item.name}
                              </div>
                              <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '1px' }}>
                                {isActivity ? 'Optional Excursion' : 'Local Ride / Transit'} • Scheduled Slot
                              </div>
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#0f172a', whiteSpace: 'nowrap' }}>
                              ₹{item.cost?.toLocaleString('en-IN')}
                            </div>

                            {/* Compact 3-way Segmented Switcher */}
                            <div style={{
                              display: 'inline-flex',
                              background: '#f1f5f9',
                              padding: '2px',
                              borderRadius: '8px',
                              border: '1px solid #e2e8f0'
                            }}>
                              <button
                                type="button"
                                onClick={() => handlePreferenceChange(item.id, 'pay_on_trip')}
                                style={{
                                  padding: '5px 9px',
                                  borderRadius: '6px',
                                  border: 'none',
                                  background: currentPref === 'pay_on_trip' ? '#2563eb' : 'transparent',
                                  color: currentPref === 'pay_on_trip' ? '#ffffff' : '#64748b',
                                  fontSize: '0.7rem',
                                  fontWeight: 700,
                                  cursor: 'pointer',
                                  whiteSpace: 'nowrap',
                                  transition: 'all 0.12s'
                                }}
                              >
                                📍 Pay on Spot
                              </button>

                              <button
                                type="button"
                                onClick={() => handlePreferenceChange(item.id, 'pay_now')}
                                style={{
                                  padding: '5px 9px',
                                  borderRadius: '6px',
                                  border: 'none',
                                  background: currentPref === 'pay_now' ? '#059669' : 'transparent',
                                  color: currentPref === 'pay_now' ? '#ffffff' : '#64748b',
                                  fontSize: '0.7rem',
                                  fontWeight: 700,
                                  cursor: 'pointer',
                                  whiteSpace: 'nowrap',
                                  transition: 'all 0.12s'
                                }}
                              >
                                💳 Pre-Pay
                              </button>

                              <button
                                type="button"
                                onClick={() => handlePreferenceChange(item.id, 'skip')}
                                style={{
                                  padding: '5px 9px',
                                  borderRadius: '6px',
                                  border: 'none',
                                  background: currentPref === 'skip' ? '#64748b' : 'transparent',
                                  color: currentPref === 'skip' ? '#ffffff' : '#94a3b8',
                                  fontSize: '0.7rem',
                                  fontWeight: 700,
                                  cursor: 'pointer',
                                  whiteSpace: 'nowrap',
                                  transition: 'all 0.12s'
                                }}
                              >
                                ✕ Skip
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Primary Traveler Information Form */}
              <form onSubmit={handleConfirmBooking} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '28px', boxShadow: '0 2px 12px rgba(15, 23, 42, 0.04)' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', marginBottom: '18px' }}>Primary Traveler Information</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', display: 'block', marginBottom: '6px', letterSpacing: '0.04em' }}>
                        Full Name (as per Govt ID)
                      </label>
                      <input
                        type="text"
                        required
                        style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#f8fafc', fontWeight: 600, fontSize: '0.9rem', outline: 'none' }}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div className="responsive-form-two-col">
                      <div>
                        <label style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', display: 'block', marginBottom: '6px', letterSpacing: '0.04em' }}>
                          Email (for e-vouchers)
                        </label>
                        <input
                          type="email"
                          required
                          style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#f8fafc', fontWeight: 600, fontSize: '0.9rem', outline: 'none' }}
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', display: 'block', marginBottom: '6px', letterSpacing: '0.04em' }}>
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          required
                          style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#f8fafc', fontWeight: 600, fontSize: '0.9rem', outline: 'none' }}
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Mode Selector */}
                <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '28px', boxShadow: '0 2px 12px rgba(15, 23, 42, 0.04)' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>Upfront Payment Mode</h3>
                  <p style={{ color: '#64748b', fontSize: '0.8rem', marginBottom: '16px' }}>
                    Pay only the upfront amount (₹{amountDueNow.toLocaleString('en-IN')}) now to lock essential hotel reservations.
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {[
                      { id: 'upi', name: 'Instant UPI / QR Code', desc: 'Google Pay, PhonePe, Paytm, BHIM' },
                      { id: 'card', name: 'Credit / Debit Card', desc: 'Visa, MasterCard, RuPay, Amex' },
                      { id: 'netbanking', name: 'Net Banking', desc: 'HDFC, ICICI, SBI, Axis' }
                    ].map((m) => (
                      <label
                        key={m.id}
                        style={{
                          border: paymentMethod === m.id ? '2px solid #2563eb' : '1px solid #e2e8f0',
                          borderRadius: '10px',
                          padding: '14px 18px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          cursor: 'pointer',
                          background: paymentMethod === m.id ? '#eff6ff' : '#ffffff',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <input
                            type="radio"
                            name="payment"
                            value={m.id}
                            checked={paymentMethod === m.id}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            style={{ accentColor: '#2563eb' }}
                          />
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#0f172a' }}>{m.name}</div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{m.desc}</div>
                          </div>
                        </div>
                        <span style={{ fontSize: '0.7rem', fontWeight: 700, background: '#f1f5f9', color: '#475569', padding: '3px 8px', borderRadius: '4px' }}>
                          Verified Secure
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isProcessing}
                  style={{
                    padding: '18px 32px',
                    width: '100%',
                    borderRadius: '999px',
                    background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                    color: '#ffffff',
                    fontWeight: 800,
                    fontSize: '1.05rem',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 8px 25px rgba(37, 99, 235, 0.4)',
                    opacity: isProcessing ? 0.7 : 1,
                    transition: 'all 0.2s ease'
                  }}
                >
                  {isProcessing ? 'Issuing Customized Vouchers...' : `Pay ₹${amountDueNow.toLocaleString('en-IN')} Now & Confirm Tour`}
                </button>
              </form>
            </div>

            {/* Right Column: Pricing Summary & Live Split */}
            <div>
              <div style={{
                background: '#ffffff',
                borderRadius: '20px',
                border: '1px solid #e2e8f0',
                padding: '24px',
                boxShadow: '0 4px 20px rgba(15, 23, 42, 0.06)',
                position: 'sticky',
                top: '90px'
              }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', paddingBottom: '12px', borderBottom: '1px solid #e2e8f0', marginBottom: '14px' }}>
                  Customized Payment Split
                </h3>

                <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0f172a', marginBottom: '2px' }}>{tour_plan.tour_name}</div>
                <div style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '16px' }}>{days.length} Days • Customized Tour Selection</div>

                {/* Side-by-Side Live Payment Split Badges */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
                  <div style={{ background: '#ecfdf5', borderRadius: '12px', padding: '12px 14px', border: '1px solid #a7f3d0' }}>
                    <div style={{ fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', color: '#059669', letterSpacing: '0.04em' }}>
                      Due Today
                    </div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#047857', marginTop: '2px' }}>
                      ₹{amountDueNow.toLocaleString('en-IN')}
                    </div>
                    <div style={{ fontSize: '0.68rem', color: '#059669', marginTop: '2px' }}>
                      Pre-paid online
                    </div>
                  </div>

                  <div style={{ background: '#eff6ff', borderRadius: '12px', padding: '12px 14px', border: '1px solid #bfdbfe' }}>
                    <div style={{ fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', color: '#2563eb', letterSpacing: '0.04em' }}>
                      On-Trip
                    </div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#1d4ed8', marginTop: '2px' }}>
                      ₹{amountPayOnLocation.toLocaleString('en-IN')}
                    </div>
                    <div style={{ fontSize: '0.68rem', color: '#2563eb', marginTop: '2px' }}>
                      Pay vendors on spot
                    </div>
                  </div>
                </div>

                {/* Breakdown List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #e2e8f0', maxHeight: '180px', overflowY: 'auto' }}>
                  {activeItems.map((item) => {
                    const pref = paymentPrefs[item.id] || (item.item_type === 'stay' ? 'pay_now' : 'pay_on_trip');
                    if (pref === 'skip') return null;

                    return (
                      <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                        <span style={{ color: '#475569', maxWidth: '160px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {item.name}
                        </span>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontWeight: 600, color: '#0f172a' }}>₹{item.cost?.toLocaleString('en-IN')} </span>
                          <span style={{ fontSize: '0.7rem', color: pref === 'pay_now' ? '#059669' : '#2563eb', fontWeight: 700 }}>
                            ({pref === 'pay_now' ? 'Pre-Paid' : 'On-Trip'})
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.88rem', color: '#64748b' }}>Total Package Value</span>
                  <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#0f172a' }}>
                    ₹{totalTourValuation.toLocaleString('en-IN')}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.76rem', color: '#475569', lineHeight: 1.5, background: '#f8fafc', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <ShieldCheckIcon size={16} style={{ color: '#2563eb', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong>Celestial Flexible Guarantee</strong>: Free cancellation up to 48h before departure. All on-trip items remain reserved for your group.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
