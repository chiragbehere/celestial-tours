'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/context/AuthContext';
import { CheckCircleIcon, SparklesIcon, ShieldCheckIcon, BuildingIcon, SuitcaseIcon, CompassIcon, HouseDoorIcon, PlaneIcon } from '@/components/ui/Icons';

export default function SignUpPage() {
  const { user, signUpWithEmail, loading } = useAuth();
  const [selectedRole, setSelectedRole] = useState('traveler'); // 'traveler' | 'operator'
  const [authError, setAuthError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // Role-specific Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    // Operator fields
    agencyName: '',
    licenseNumber: '',
    fleetSize: '15-50 Vehicles / Groups',
    operationalHubs: 'Goa & Western Coast',
    // Traveler fields
    travelStyle: 'Luxury & Heritage',
    groupType: 'Couples / Small Family',
    budgetBand: 'Premium (₹40k - ₹80k per pax)'
  });

  useEffect(() => {
    if (!loading && user) {
      const timer = setTimeout(() => {
        if (user.role === 'operator') router.push('/operator/dashboard');
        else router.push('/account');
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [user, loading, router]);

  const handleRoleSignup = async (e) => {
    e.preventDefault();
    setAuthError(null);
    setIsSubmitting(true);

    if (!formData.name?.trim()) {
      setAuthError('Please enter your full name.');
      setIsSubmitting(false);
      return;
    }
    if (!formData.email?.trim()) {
      setAuthError('Please enter your email address.');
      setIsSubmitting(false);
      return;
    }
    if (!formData.password || formData.password.length < 6) {
      setAuthError('Password must be at least 6 characters long.');
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await signUpWithEmail(
        formData.email.trim(),
        formData.password,
        formData.name.trim(),
        selectedRole
      );

      if (!res.success) {
        setAuthError(res.error || 'Failed to create account.');
      } else {
        if (selectedRole === 'operator') router.push('/operator/dashboard');
        else router.push('/account');
      }
    } catch (err) {
      setAuthError(err.message || 'Error signing up');
    } finally {
      setIsSubmitting(false);
    }
  };

  const roleCards = [
    {
      id: 'operator',
      title: 'Tour Operator',
      icon: <BuildingIcon size={22} />,
      tagline: 'Manage tours & vendor network',
      desc: 'Add & manage vendor options (stays, rides, excursions), package creation, DAG replanning & settlements.'
    },
    {
      id: 'traveler',
      title: 'Traveler / Explorer',
      icon: <SuitcaseIcon size={22} />,
      tagline: 'Plan & explore vacations',
      desc: 'Generate AI trip itineraries, customize payments (pre-pay vs pay on location), and live companion.'
    }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(180deg, #f8fafc 0%, #edf2f7 100%)',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      padding: '40px 20px',
      position: 'relative'
    }}>
      <div className="auth-card-responsive" style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '24px',
        padding: '40px 36px',
        maxWidth: '680px',
        width: '100%',
        boxShadow: '0 20px 45px -10px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.04)',
        position: 'relative',
        zIndex: 2
      }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: 44, height: 44,
              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              borderRadius: '12px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)'
            }}>
              <PlaneIcon size={20} />
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', lineHeight: 1 }}>Celestial</div>
              <div style={{ fontSize: '0.68rem', color: '#2563eb', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '3px' }}>
                Role-Based Platform Registration
              </div>
            </div>
          </Link>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', marginTop: '16px', marginBottom: '4px' }}>
            Select Your Account Role
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.84rem', margin: 0 }}>
            Choose how you will participate in the travel ecosystem to unlock specialized tools.
          </p>
        </div>

        {/* Role Selector Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '12px',
          marginBottom: '28px'
        }}>
          {roleCards.map(rc => {
            const isSelected = selectedRole === rc.id;
            return (
              <div
                key={rc.id}
                onClick={() => setSelectedRole(rc.id)}
                style={{
                  background: isSelected ? '#eff6ff' : '#ffffff',
                  border: isSelected ? '2px solid #2563eb' : '1px solid #e2e8f0',
                  borderRadius: '14px',
                  padding: '16px',
                  cursor: 'pointer',
                  boxShadow: isSelected ? '0 4px 12px rgba(37, 99, 235, 0.08)' : '0 1px 3px rgba(0, 0, 0, 0.02)',
                  transition: 'all 0.15s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '1.5rem' }}>{rc.icon}</span>
                    <span style={{
                      background: isSelected ? '#2563eb' : '#f1f5f9',
                      color: isSelected ? '#ffffff' : '#64748b',
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      padding: '2px 8px',
                      borderRadius: '999px',
                      textTransform: 'uppercase'
                    }}>
                      {isSelected ? '✓ SELECTED' : 'CHOOSE'}
                    </span>
                  </div>
                  <div style={{ fontWeight: 800, fontSize: '0.96rem', color: '#0f172a', marginBottom: '2px' }}>
                    {rc.title}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#64748b', lineHeight: 1.4 }}>
                    {rc.desc}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Registration Form with Role-Specific Fields */}
        <form onSubmit={handleRoleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {authError && (
            <div style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#dc2626',
              padding: '12px 16px',
              borderRadius: '10px',
              fontSize: '0.84rem'
            }}>
              {authError}
            </div>
          )}

          {/* Common Fields */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '0.76rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
                Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Aditi Sharma"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: '10px',
                  background: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  color: '#0f172a',
                  fontSize: '0.86rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.76rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
                Work Email *
              </label>
              <input
                type="email"
                required
                placeholder="name@organization.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: '10px',
                  background: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  color: '#0f172a',
                  fontSize: '0.86rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.76rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
              Create Password * (min 6 characters)
            </label>
            <input
              type="password"
              required
              minLength={6}
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              style={{
                width: '100%',
                padding: '11px 14px',
                borderRadius: '10px',
                background: '#f8fafc',
                border: '1px solid #cbd5e1',
                color: '#0f172a',
                fontSize: '0.86rem',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.76rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
              Mobile / WhatsApp Contact *
            </label>
            <input
              type="tel"
              required
              placeholder="+91 98765 43210"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              style={{
                width: '100%',
                padding: '11px 14px',
                borderRadius: '10px',
                background: '#f8fafc',
                border: '1px solid #cbd5e1',
                color: '#0f172a',
                fontSize: '0.86rem',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* ROLE SPECIFIC SECTION: Tour Operator */}
          {selectedRole === 'operator' && (
            <div style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '18px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px'
            }}>
              <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BuildingIcon size={16} />
                <span>Tour Operator Credentials & Capacity</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                    Agency / DMC Business Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Celestial Heritage Expeditions"
                    value={formData.agencyName}
                    onChange={(e) => setFormData({ ...formData, agencyName: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      background: '#ffffff',
                      border: '1px solid #cbd5e1',
                      color: '#0f172a',
                      fontSize: '0.84rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                    IATA / MOT License Number
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. MOT-IND-2026-889"
                    value={formData.licenseNumber}
                    onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      background: '#ffffff',
                      border: '1px solid #cbd5e1',
                      color: '#0f172a',
                      fontSize: '0.84rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                    Primary Operational Hubs
                  </label>
                  <select
                    value={formData.operationalHubs}
                    onChange={(e) => setFormData({ ...formData, operationalHubs: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      background: '#ffffff',
                      border: '1px solid #cbd5e1',
                      color: '#0f172a',
                      fontSize: '0.84rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="Goa & Western Coast">Goa & Western Coast</option>
                    <option value="Himachal & Leh Ladakh">Himachal & Leh Ladakh</option>
                    <option value="Rajasthan Royal Circuit">Rajasthan Royal Circuit</option>
                    <option value="Kerala Backwaters & Hills">Kerala Backwaters & Hills</option>
                    <option value="Pan-India Multi-Hub">Pan-India Multi-Hub</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                    Monthly Tour Volume Capacity
                  </label>
                  <select
                    value={formData.fleetSize}
                    onChange={(e) => setFormData({ ...formData, fleetSize: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      background: '#ffffff',
                      border: '1px solid #cbd5e1',
                      color: '#0f172a',
                      fontSize: '0.84rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="1-15 Groups">Boutique (1 - 15 Groups / month)</option>
                    <option value="15-50 Groups">Mid-Scale (15 - 50 Groups / month)</option>
                    <option value="50+ Groups">Enterprise Fleet (50+ Groups / month)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* ROLE SPECIFIC SECTION: Traveler */}
          {selectedRole === 'traveler' && (
            <div style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '18px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px'
            }}>
              <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <SuitcaseIcon size={16} />
                <span>Traveler Vacation Preferences</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                    Preferred Travel Style
                  </label>
                  <select
                    value={formData.travelStyle}
                    onChange={(e) => setFormData({ ...formData, travelStyle: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      background: '#ffffff',
                      border: '1px solid #cbd5e1',
                      color: '#0f172a',
                      fontSize: '0.84rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="Luxury & Heritage">Luxury & Heritage</option>
                    <option value="Adventure & Treks">Adventure & Treks</option>
                    <option value="Beaches & Leisure">Beaches & Coastal Leisure</option>
                    <option value="Spiritual & Wellness">Spiritual & Wellness</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                    Typical Group Configuration
                  </label>
                  <select
                    value={formData.groupType}
                    onChange={(e) => setFormData({ ...formData, groupType: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      background: '#ffffff',
                      border: '1px solid #cbd5e1',
                      color: '#0f172a',
                      fontSize: '0.84rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="Solo Traveler">Solo Traveler</option>
                    <option value="Couples / Small Family">Couple / Partners</option>
                    <option value="Family with Kids">Family with Kids</option>
                    <option value="Friends Group">Group of Friends</option>
                  </select>
                </div>
              </div>
            </div>
          )}



          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              padding: '13px 20px',
              borderRadius: '10px',
              background: '#2563eb',
              color: '#ffffff',
              fontSize: '0.92rem',
              fontWeight: 800,
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)',
              marginTop: '8px',
              transition: 'all 0.15s ease'
            }}
          >
            {isSubmitting ? 'Creating Account...' : `Register as ${roleCards.find(r => r.id === selectedRole)?.title}`}
          </button>
        </form>

        {/* Footer switch to login */}
        <div style={{ textAlign: 'center', marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #f1f5f9', fontSize: '0.82rem', color: '#64748b' }}>
          Already have an account?{' '}
          <Link href="/login" style={{ color: '#2563eb', fontWeight: 700, textDecoration: 'none' }}>
            Sign In here →
          </Link>
        </div>
      </div>
    </div>
  );
}
