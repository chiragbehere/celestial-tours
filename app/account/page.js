'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import TravelerNav from '@/components/layout/TravelerNav';
import { useAuth } from '@/lib/context/AuthContext';
import {
  SuitcaseIcon,
  CheckCircleIcon,
  SparklesIcon,
  CompassIcon,
  BuildingIcon,
  PlaneIcon,
  ActivityIcon,
  ShieldCheckIcon
} from '@/components/ui/Icons';

export default function TravelerAccountPage() {
  const { user, loginAsDemo, updateUserProfile, logout, loading } = useAuth();

  // Active tab in right column: 'upcoming' | 'past' | 'saved'
  const [activeTab, setActiveTab] = useState('upcoming');

  // Profile Form state
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    phone: '',
    city: 'India',
    travelStyle: 'Luxury & Wellness',
    pace: 'Balanced (2-3 curated activities/day)',
    dietary: 'Vegetarian',
    emergencyContactName: '',
    emergencyContactPhone: ''
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [tourPlans, setTourPlans] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [selectedVoucher, setSelectedVoucher] = useState(null);

  // Sync formData with user
  useEffect(() => {
    if (user) {
      setFormData({
        displayName: user.displayName || '',
        email: user.email || '',
        phone: user.phone || '',
        city: user.city || 'India',
        travelStyle: user.travelStyle || 'Luxury & Wellness',
        pace: user.pace || 'Balanced (2-3 curated activities/day)',
        dietary: user.dietary || 'Vegetarian',
        emergencyContactName: user.emergencyContactName || '',
        emergencyContactPhone: user.emergencyContactPhone || ''
      });
    }
  }, [user]);

  // Fetch bookings & tour plans
  useEffect(() => {
    async function fetchTravelData() {
      try {
        const res = await fetch('/api/booking');
        const data = await res.json();
        if (data.success) {
          setBookings(data.bookings || []);
          setTourPlans(data.tourPlans || []);
        }
      } catch (err) {
        console.warn('Failed to load traveler bookings:', err);
      } finally {
        setLoadingData(false);
      }
    }
    fetchTravelData();
  }, []);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      await updateUserProfile({
        displayName: formData.displayName,
        email: formData.email,
        phone: formData.phone,
        city: formData.city,
        travelStyle: formData.travelStyle,
        pace: formData.pace,
        dietary: formData.dietary,
        emergencyContactName: formData.emergencyContactName,
        emergencyContactPhone: formData.emergencyContactPhone
      });

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3500);
    } catch (err) {
      console.error('Failed to update profile:', err);
      alert('Unable to save changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Mock list of comprehensive user trips
  const userTrips = [
    {
      id: 'tour-goa-signature',
      title: 'Goa 4-Day Coastal Signature Experience',
      destination: 'Goa & Western Coast',
      dates: 'Oct 5 - Oct 9, 2026',
      daysCount: 4,
      refCode: 'CT-GOA-8821',
      status: 'active',
      statusLabel: '● In-Trip Active',
      statusBg: '#ecfdf5',
      statusColor: '#059669',
      image: '/dest-goa.jpg',
      paidUpfront: 28300,
      payOnSpot: 9900,
      vouchersCount: 5,
      leadTraveler: formData.displayName || 'Aditi Sharma',
      items: [
        { type: 'Stay', name: 'Taj Exotica Resort & Spa', detail: 'Mediterranean Villa Suite • Fully Pre-paid' },
        { type: 'Cab', name: 'Innova Crysta Private Chauffeur', detail: 'Airport Transfer & Coastal Exploration' },
        { type: 'Excursion', name: 'Grande Island Marine Excursion', detail: 'Private Boat & Scuba Diving Pass' },
        { type: 'Dining', name: 'Sahakari Spice Plantation Banquet', detail: 'Traditional Organic Buffet & Guided Walk' }
      ]
    },
    {
      id: 'tour-rajasthan-heritage',
      title: 'Royal Rajasthan: Forts, Palaces & Desert Twilight',
      destination: 'Jaipur & Udaipur',
      dates: 'Dec 12 - Dec 18, 2026',
      daysCount: 7,
      refCode: 'CT-RAJ-4029',
      status: 'confirmed',
      statusLabel: '✓ Confirmed & Booked',
      statusBg: '#eff6ff',
      statusColor: '#2563eb',
      image: '/dest-rajasthan.jpg',
      paidUpfront: 42000,
      payOnSpot: 14500,
      vouchersCount: 6,
      leadTraveler: formData.displayName || 'Aditi Sharma',
      items: [
        { type: 'Stay', name: 'The Leela Palace Udaipur', detail: 'Lakeview Heritage Room • Fully Pre-paid' },
        { type: 'Transport', name: 'Chauffeur Driven Mercedes E-Class', detail: 'Jaipur - Jodhpur - Udaipur Circuit' },
        { type: 'Activity', name: 'Private Sunset Boat Cruise', detail: 'Lake Pichola Exclusive Charter' }
      ]
    },
    {
      id: 'tour-kerala-backwaters',
      title: 'Kerala Serenity: Mist Mountains & Emerald Backwaters',
      destination: 'Munnar & Alleppey',
      dates: 'Jan 15 - Jan 20, 2026',
      daysCount: 6,
      refCode: 'CT-KER-1932',
      status: 'completed',
      statusLabel: '✓ Completed & Verified',
      statusBg: '#f8fafc',
      statusColor: '#64748b',
      image: '/dest-kerala.jpg',
      paidUpfront: 36500,
      payOnSpot: 8000,
      vouchersCount: 4,
      leadTraveler: formData.displayName || 'Aditi Sharma',
      items: [
        { type: 'Stay', name: 'Spice Tree Munnar Resort', detail: 'Plantation Suite • Completed' },
        { type: 'Cruiser', name: 'Traditional Luxury Houseboat', detail: 'Alleppey Backwater Overnight Charter' }
      ]
    }
  ];

  const filteredTrips = userTrips.filter(t => {
    if (activeTab === 'upcoming') return t.status === 'active' || t.status === 'confirmed';
    if (activeTab === 'past') return t.status === 'completed';
    return true; // 'saved'
  });

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', color: '#0f172a' }}>
      <TravelerNav transparent={false} />

      {/* ═══════════════════════════════════════════════
          COMPACT PROFILE HEADER
      ═══════════════════════════════════════════════ */}
      <section style={{
        background: 'linear-gradient(135deg, #050b14 0%, #0f172a 100%)',
        color: '#ffffff',
        padding: '36px 24px 32px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '-100px',
          right: '-50px',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(37,99,235,0.25) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ maxWidth: '1240px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
              <div style={{
                width: '68px',
                height: '68px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #2563eb, #38bdf8)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.8rem',
                fontWeight: 800,
                boxShadow: '0 8px 24px rgba(37, 99, 235, 0.4)',
                border: '3px solid rgba(255, 255, 255, 0.2)'
              }}>
                {(user?.displayName?.[0] || 'U').toUpperCase()}
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <h1 style={{
                    fontSize: 'clamp(1.4rem, 2.5vw, 1.85rem)',
                    fontWeight: 800,
                    margin: 0,
                    fontFamily: "'Playfair Display', Georgia, serif",
                    color: '#ffffff'
                  }}>
                    {user?.displayName || 'Traveler Account'}
                  </h1>
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    padding: '3px 10px',
                    borderRadius: '999px',
                    background: '#fef3c7',
                    color: '#b45309',
                    border: '1px solid #fde68a'
                  }}>
                    ★ Verified Explorer
                  </span>
                </div>
                <p style={{ margin: '4px 0 0', fontSize: '0.84rem', color: '#94a3b8' }}>
                  {user?.email || 'Sign in to access your profile & itineraries'}
                </p>
              </div>
            </div>

            {/* Quick Stat Capsules */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.08)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255, 255, 255, 0.12)', padding: '10px 18px', borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.68rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Total Journeys</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#38bdf8', marginTop: '1px' }}>{user ? '2 Active' : '0'}</div>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.08)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255, 255, 255, 0.12)', padding: '10px 18px', borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.68rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Vouchers Vault</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#34d399', marginTop: '1px' }}>{user ? '5 Synced' : '0'}</div>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.08)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255, 255, 255, 0.12)', padding: '10px 18px', borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.68rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Account Status</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fbbf24', marginTop: '1px' }}>{user ? 'Active' : 'Guest'}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          MAIN ACCOUNT WORKSPACE
      ═══════════════════════════════════════════════ */}
      {!user ? (
        <main className="responsive-main-container">
          <div style={{
            background: '#ffffff',
            borderRadius: '24px',
            border: '1px solid #e2e8f0',
            padding: '52px 32px',
            maxWidth: '520px',
            margin: '36px auto',
            textAlign: 'center',
            boxShadow: '0 12px 40px rgba(15, 23, 42, 0.06)'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: '#eff6ff',
              color: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 18px'
            }}>
              <SuitcaseIcon size={32} />
            </div>

            <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
              Sign In to Your Traveler Account
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '28px' }}>
              Create an account or sign in with your email and password to view your customized bookings, download vouchers, and manage your travel preferences.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '320px', margin: '0 auto' }}>
              <Link
                href="/login"
                style={{
                  padding: '13px 24px',
                  borderRadius: '999px',
                  background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '0.92rem',
                  textDecoration: 'none',
                  boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)'
                }}
              >
                Sign In With Email & Password
              </Link>

              <Link
                href="/signup"
                style={{
                  padding: '13px 24px',
                  borderRadius: '999px',
                  background: '#f8fafc',
                  color: '#0f172a',
                  border: '1.5px solid #cbd5e1',
                  fontWeight: 700,
                  fontSize: '0.92rem',
                  textDecoration: 'none'
                }}
              >
                Create Free Account
              </Link>
            </div>
          </div>
        </main>
      ) : (
        <main className="responsive-main-container">

        <div className="responsive-two-col-grid">
          
          {/* ═════════════════════════════════════════════
              LEFT COLUMN: PROFILE DETAILS & EDIT FORM
          ═════════════════════════════════════════════ */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            <div style={{
              background: '#ffffff',
              borderRadius: '20px',
              border: '1px solid #e2e8f0',
              padding: '28px',
              boxShadow: '0 4px 20px rgba(15, 23, 42, 0.04)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '10px',
                    background: '#eff6ff', color: '#2563eb',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <SuitcaseIcon size={18} />
                  </div>
                  <div>
                    <h2 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
                      Traveler Profile & Preferences
                    </h2>
                    <p style={{ margin: 0, fontSize: '0.78rem', color: '#64748b' }}>
                      Saved preferences automatically personalize your AI tour plans.
                    </p>
                  </div>
                </div>

                {saveSuccess && (
                  <span style={{
                    fontSize: '0.75rem', fontWeight: 700, color: '#059669',
                    background: '#ecfdf5', padding: '4px 12px', borderRadius: '999px',
                    border: '1px solid #a7f3d0'
                  }}>
                    ✓ Saved to Cloud!
                  </span>
                )}
              </div>

              <form onSubmit={handleProfileSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                {/* Full Name & Email */}
                <div className="responsive-form-two-col">
                  <div>
                    <label style={{ fontSize: '0.74rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', display: 'block', marginBottom: '6px' }}>
                      Full Name (Govt ID Match)
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.displayName}
                      onChange={e => setFormData({ ...formData, displayName: e.target.value })}
                      style={{
                        width: '100%', padding: '11px 14px', borderRadius: '10px',
                        border: '1px solid #cbd5e1', background: '#f8fafc', fontWeight: 600, fontSize: '0.88rem'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.74rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', display: 'block', marginBottom: '6px' }}>
                      Email Address (Vouchers)
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      style={{
                        width: '100%', padding: '11px 14px', borderRadius: '10px',
                        border: '1px solid #cbd5e1', background: '#f8fafc', fontWeight: 600, fontSize: '0.88rem'
                      }}
                    />
                  </div>
                </div>

                {/* Phone & City */}
                <div className="responsive-form-two-col">
                  <div>
                    <label style={{ fontSize: '0.74rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', display: 'block', marginBottom: '6px' }}>
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      style={{
                        width: '100%', padding: '11px 14px', borderRadius: '10px',
                        border: '1px solid #cbd5e1', background: '#f8fafc', fontWeight: 600, fontSize: '0.88rem'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.74rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', display: 'block', marginBottom: '6px' }}>
                      Base City / Region
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={e => setFormData({ ...formData, city: e.target.value })}
                      style={{
                        width: '100%', padding: '11px 14px', borderRadius: '10px',
                        border: '1px solid #cbd5e1', background: '#f8fafc', fontWeight: 600, fontSize: '0.88rem'
                      }}
                    />
                  </div>
                </div>

                {/* Travel Persona & Pacing */}
                <div className="responsive-form-two-col">
                  <div>
                    <label style={{ fontSize: '0.74rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', display: 'block', marginBottom: '6px' }}>
                      Travel Style
                    </label>
                    <select
                      value={formData.travelStyle}
                      onChange={e => setFormData({ ...formData, travelStyle: e.target.value })}
                      style={{
                        width: '100%', padding: '11px 14px', borderRadius: '10px',
                        border: '1px solid #cbd5e1', background: '#f8fafc', fontWeight: 600, fontSize: '0.88rem'
                      }}
                    >
                      <option value="Luxury & Wellness">Luxury & Wellness</option>
                      <option value="Heritage & Culture">Heritage & Cultural Immersion</option>
                      <option value="Adventure & Diving">Adventure & Coastal Diving</option>
                      <option value="Slow Travel & Nature">Slow Travel & Tea Trails</option>
                      <option value="Culinary & Spice">Culinary & Spice Exploration</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.74rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', display: 'block', marginBottom: '6px' }}>
                      Preferred Daily Pace
                    </label>
                    <select
                      value={formData.pace}
                      onChange={e => setFormData({ ...formData, pace: e.target.value })}
                      style={{
                        width: '100%', padding: '11px 14px', borderRadius: '10px',
                        border: '1px solid #cbd5e1', background: '#f8fafc', fontWeight: 600, fontSize: '0.88rem'
                      }}
                    >
                      <option value="Relaxed (1-2 curated activities/day)">Relaxed (1-2 stops/day)</option>
                      <option value="Balanced (2-3 curated activities/day)">Balanced (2-3 stops/day)</option>
                      <option value="Active (Full day immersive pace)">Active (Full day packed)</option>
                    </select>
                  </div>
                </div>

                {/* Dietary Preference & Emergency Contact */}
                <div className="responsive-form-two-col">
                  <div>
                    <label style={{ fontSize: '0.74rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', display: 'block', marginBottom: '6px' }}>
                      Dietary Requirement
                    </label>
                    <select
                      value={formData.dietary}
                      onChange={e => setFormData({ ...formData, dietary: e.target.value })}
                      style={{
                        width: '100%', padding: '11px 14px', borderRadius: '10px',
                        border: '1px solid #cbd5e1', background: '#f8fafc', fontWeight: 600, fontSize: '0.88rem'
                      }}
                    >
                      <option value="Vegetarian">Pure Vegetarian</option>
                      <option value="Jain Vegetarian">Jain Vegetarian (No onion/garlic)</option>
                      <option value="Vegan">Vegan (Plant based)</option>
                      <option value="Non-Veg">Non-Vegetarian</option>
                      <option value="Seafood Coastal">Seafood Specialist</option>
                      <option value="Gluten-Free">Gluten-Free</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.74rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', display: 'block', marginBottom: '6px' }}>
                      Emergency Contact Phone
                    </label>
                    <input
                      type="tel"
                      value={formData.emergencyContactPhone}
                      onChange={e => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
                      style={{
                        width: '100%', padding: '11px 14px', borderRadius: '10px',
                        border: '1px solid #cbd5e1', background: '#f8fafc', fontWeight: 600, fontSize: '0.88rem'
                      }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSaving}
                  style={{
                    padding: '13px 24px',
                    borderRadius: '999px',
                    background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                    color: '#ffffff',
                    fontWeight: 800,
                    fontSize: '0.92rem',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)',
                    marginTop: '8px',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {isSaving ? 'Saving to Cloud Firestore...' : 'Save Profile & Preferences'}
                </button>
              </form>
            </div>

            {/* Loyalty & Safety Shield Card */}
            <div style={{
              background: '#ffffff',
              borderRadius: '20px',
              border: '1px solid #e2e8f0',
              padding: '24px',
              boxShadow: '0 4px 20px rgba(15, 23, 42, 0.04)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '10px',
                  background: '#ecfdf5', color: '#059669',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <ShieldCheckIcon size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
                    Celestial Safety & Verification Shield
                  </h3>
                  <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 700 }}>
                    ● 24/7 Rapid SOS & Operator Dispatch Connected
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.84rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: '#f8fafc', borderRadius: '10px' }}>
                  <span style={{ color: '#64748b' }}>Govt ID & Passport Vault</span>
                  <span style={{ fontWeight: 800, color: '#059669' }}>✓ Verified & Encrypted</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: '#f8fafc', borderRadius: '10px' }}>
                  <span style={{ color: '#64748b' }}>Assigned Tour Coordinator</span>
                  <span style={{ fontWeight: 800, color: '#2563eb' }}>Meera Nair (+91 98765 43210)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: '#f8fafc', borderRadius: '10px' }}>
                  <span style={{ color: '#64748b' }}>Disruption Auto-Shield</span>
                  <span style={{ fontWeight: 800, color: '#059669' }}>Active (Weather & Traffic)</span>
                </div>
              </div>

              <div style={{ marginTop: '16px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <Link
                  href="/operator/dashboard"
                  style={{
                    flex: 1,
                    textAlign: 'center',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    background: '#f1f5f9',
                    color: '#334155',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    textDecoration: 'none',
                    border: '1px solid #cbd5e1'
                  }}
                >
                  Switch to Operator Console ↗
                </Link>
                <button
                  type="button"
                  onClick={logout}
                  style={{
                    padding: '10px 18px',
                    borderRadius: '10px',
                    background: '#fee2e2',
                    color: '#dc2626',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  Log Out
                </button>
              </div>
            </div>

          </div>

          {/* ═════════════════════════════════════════════
              RIGHT COLUMN: TRIPS HISTORY & VOUCHERS
          ═════════════════════════════════════════════ */}
          <div>
            
            {/* Tab Switcher */}
            <div style={{
              display: 'flex',
              background: '#ffffff',
              padding: '6px',
              borderRadius: '14px',
              border: '1px solid #e2e8f0',
              marginBottom: '20px',
              gap: '6px'
            }}>
              {[
                { id: 'upcoming', label: 'Active & Upcoming Tours (2)' },
                { id: 'past', label: 'Past Trips History (1)' },
                { id: 'saved', label: 'All Vouchers Vault' }
              ].map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    flex: 1,
                    padding: '10px 12px',
                    borderRadius: '10px',
                    border: 'none',
                    background: activeTab === tab.id ? '#2563eb' : 'transparent',
                    color: activeTab === tab.id ? '#ffffff' : '#64748b',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Trip Cards Feed */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {filteredTrips.map(trip => (
                <div
                  key={trip.id}
                  style={{
                    background: '#ffffff',
                    borderRadius: '20px',
                    border: '1px solid #e2e8f0',
                    overflow: 'hidden',
                    boxShadow: '0 4px 20px rgba(15, 23, 42, 0.05)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {/* Card Header Banner */}
                  <div style={{
                    padding: '20px 24px',
                    borderBottom: '1px solid #f1f5f9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '12px'
                  }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span style={{
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          padding: '3px 10px',
                          borderRadius: '999px',
                          background: trip.statusBg,
                          color: trip.statusColor
                        }}>
                          {trip.statusLabel}
                        </span>
                        <span style={{ fontSize: '0.74rem', color: '#64748b', fontFamily: 'monospace', fontWeight: 700 }}>
                          Ref: {trip.refCode}
                        </span>
                      </div>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                        {trip.title}
                      </h3>
                      <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '3px' }}>
                        {trip.dates} • {trip.destination} • {trip.daysCount} Days Tour
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedVoucher(selectedVoucher?.id === trip.id ? null : trip)}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '999px',
                        background: '#eff6ff',
                        color: '#2563eb',
                        border: '1px solid #bfdbfe',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      {selectedVoucher?.id === trip.id ? 'Hide Voucher' : 'View Vouchers (5) 🧾'}
                    </button>
                  </div>

                  {/* Financial Breakdown Pill */}
                  <div style={{
                    padding: '14px 24px',
                    background: '#f8fafc',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                    gap: '12px',
                    borderBottom: '1px solid #f1f5f9'
                  }}>
                    <div>
                      <div style={{ fontSize: '0.68rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Paid Upfront (Pre-paid)</div>
                      <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#059669', marginTop: '1px' }}>
                        ₹{trip.paidUpfront.toLocaleString('en-IN')}
                      </div>
                      <div style={{ fontSize: '0.68rem', color: '#059669' }}>Stays & Essential Locked</div>
                    </div>

                    <div>
                      <div style={{ fontSize: '0.68rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Pay on Location (On Trip)</div>
                      <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#2563eb', marginTop: '1px' }}>
                        ₹{trip.payOnSpot.toLocaleString('en-IN')}
                      </div>
                      <div style={{ fontSize: '0.68rem', color: '#2563eb' }}>Direct to local vendors</div>
                    </div>

                    <div>
                      <div style={{ fontSize: '0.68rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Lead Traveler</div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>
                        {trip.leadTraveler}
                      </div>
                      <div style={{ fontSize: '0.68rem', color: '#64748b' }}>2 Guests Included</div>
                    </div>
                  </div>

                  {/* Expanded Voucher Details Modal / Drawer */}
                  {selectedVoucher?.id === trip.id && (
                    <div style={{
                      padding: '20px 24px',
                      background: '#f0fdf4',
                      borderBottom: '1px solid #bbf7d0'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                        <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#166534', textTransform: 'uppercase' }}>
                          Verified Digital Tour Vouchers • Instant Entry Validated
                        </span>
                        <span style={{ fontSize: '0.72rem', color: '#15803d', fontWeight: 700 }}>QR & Code Dispatched to WhatsApp</span>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {trip.items.map((it, idx) => (
                          <div
                            key={idx}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '10px 14px',
                              background: '#ffffff',
                              borderRadius: '8px',
                              border: '1px solid #dcfce7',
                              fontSize: '0.82rem'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ color: '#059669' }}>✓</span>
                              <div>
                                <strong style={{ color: '#0f172a' }}>{it.name}</strong>
                                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{it.detail}</div>
                              </div>
                            </div>
                            <span style={{
                              fontSize: '0.7rem', fontWeight: 800,
                              background: '#ecfdf5', color: '#059669',
                              padding: '3px 8px', borderRadius: '4px'
                            }}>
                              Pass Active
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons Row */}
                  <div style={{
                    padding: '16px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    gap: '10px',
                    flexWrap: 'wrap'
                  }}>
                    <Link
                      href={`/trip/${trip.id}`}
                      style={{
                        padding: '9px 18px',
                        borderRadius: '999px',
                        background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                        color: '#ffffff',
                        fontWeight: 800,
                        fontSize: '0.82rem',
                        textDecoration: 'none',
                        boxShadow: '0 2px 8px rgba(37, 99, 235, 0.25)'
                      }}
                    >
                      Live Companion ↗
                    </Link>

                    <Link
                      href={`/trip/${trip.id}/prepare`}
                      style={{
                        padding: '9px 16px',
                        borderRadius: '999px',
                        background: '#f8fafc',
                        color: '#334155',
                        border: '1px solid #cbd5e1',
                        fontWeight: 700,
                        fontSize: '0.82rem',
                        textDecoration: 'none'
                      }}
                    >
                      Pre-Trip Vault 🧳
                    </Link>

                    <Link
                      href={`/itinerary/${trip.id}`}
                      style={{
                        padding: '9px 16px',
                        borderRadius: '999px',
                        background: '#f8fafc',
                        color: '#334155',
                        border: '1px solid #cbd5e1',
                        fontWeight: 700,
                        fontSize: '0.82rem',
                        textDecoration: 'none'
                      }}
                    >
                      Full Itinerary 📋
                    </Link>

                    <Link
                      href={`/trip/${trip.id}/review`}
                      style={{
                        padding: '9px 16px',
                        borderRadius: '999px',
                        background: '#fef3c7',
                        color: '#92400e',
                        border: '1px solid #fde68a',
                        fontWeight: 700,
                        fontSize: '0.82rem',
                        textDecoration: 'none'
                      }}
                    >
                      Vendor Reviews ⭐
                    </Link>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>
      </main>
      )}
    </div>
  );
}
