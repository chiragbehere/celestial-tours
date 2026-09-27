'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/context/AuthContext';
import { BuildingIcon, SuitcaseIcon, CompassIcon, HouseDoorIcon, PlaneIcon } from '@/components/ui/Icons';


export default function LoginPage() {
  const { user, loginWithGoogle, loginAsDemo, signUpWithRole, loading } = useAuth();
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'signup'
  const [selectedRole, setSelectedRole] = useState('operator');
  const [authError, setAuthError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // Form State for role signup
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    organization: '',
    region: 'Goa & Western Coast'
  });

  useEffect(() => {
    if (!loading && user) {
      const timer = setTimeout(() => {
        if (user.role === 'operator') {
          router.push('/operator/dashboard');
        } else {
          router.push('/');
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [user, loading, router]);

  const handleGoogleLogin = async () => {
    setAuthError(null);
    setIsSubmitting(true);
    try {
      const res = await loginWithGoogle();
      if (!res.success) {
        setAuthError(res.error || "Authentication failed. Please verify Firebase settings.");
      }
    } catch (err) {
      setAuthError(err.message || "An unexpected error occurred during Google sign in.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoLogin = (role) => {
    loginAsDemo(role);
    if (role === 'operator') router.push('/operator/dashboard');
    else router.push('/');
  };

  const handleRoleSignup = (e) => {
    e.preventDefault();
    setAuthError(null);
    setIsSubmitting(true);

    try {
      const roleTitles = {
        traveler: 'Explorer & Traveler',
        operator: `${formData.organization || 'Celestial Tours'} Tour Operator`
      };

      signUpWithRole(
        formData.name || (selectedRole === 'traveler' ? 'Aditi Sharma' : 'Team Lead'),
        formData.email,
        selectedRole,
        roleTitles[selectedRole]
      );

      if (selectedRole === 'operator') router.push('/operator/dashboard');
      else router.push('/');
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
      icon: <BuildingIcon size={20} />,
      desc: 'Manage packages, add vendor options, DAG replanning & live rosters'
    },
    {
      id: 'traveler',
      title: 'Traveler',
      icon: <SuitcaseIcon size={20} />,
      desc: 'Explore, plan AI itineraries, customize payments & trip companion'
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
      padding: '32px 20px',
      position: 'relative'
    }}>
      <div className="auth-card-responsive" style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '24px',
        padding: '38px 36px',
        maxWidth: authMode === 'signup' ? '560px' : '480px',
        width: '100%',
        boxShadow: '0 20px 45px -10px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.04)',
        position: 'relative',
        zIndex: 2,
        transition: 'all 0.3s'
      }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
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
              <div style={{ fontSize: '0.68rem', color: '#2563eb', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '2px' }}>
                Tour Operating Platform
              </div>
            </div>
          </Link>
        </div>

        {/* Auth Mode Toggle Tabs */}
        <div style={{
          display: 'flex',
          background: '#f1f5f9',
          borderRadius: '12px',
          padding: '4px',
          marginBottom: '24px',
          border: '1px solid #e2e8f0'
        }}>
          <button
            type="button"
            onClick={() => setAuthMode('login')}
            style={{
              flex: 1,
              padding: '10px 14px',
              borderRadius: '9px',
              border: 'none',
              background: authMode === 'login' ? '#2563eb' : 'transparent',
              color: authMode === 'login' ? '#ffffff' : '#64748b',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: authMode === 'login' ? '0 2px 8px rgba(37, 99, 235, 0.3)' : 'none'
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setAuthMode('signup')}
            style={{
              flex: 1,
              padding: '10px 14px',
              borderRadius: '9px',
              border: 'none',
              background: authMode === 'signup' ? '#2563eb' : 'transparent',
              color: authMode === 'signup' ? '#ffffff' : '#64748b',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: authMode === 'signup' ? '0 2px 8px rgba(37, 99, 235, 0.3)' : 'none'
            }}
          >
            Create Account
          </button>
        </div>

        {/* ================= MODE: LOGIN ================= */}
        {authMode === 'login' && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '22px' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
                Welcome Back
              </h2>
              <p style={{ color: '#64748b', fontSize: '0.84rem', margin: 0 }}>
                Log in to access your itinerary, operator console, or supplier portal.
              </p>
            </div>

            {authError && (
              <div style={{
                background: '#fef2f2',
                border: '1px solid #fecaca',
                color: '#dc2626',
                padding: '12px 16px',
                borderRadius: '10px',
                fontSize: '0.84rem',
                marginBottom: '18px'
              }}>
                {authError}
              </div>
            )}

            {/* Quick Demo Role Logins */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>
                Instant Access by Role (One-Click)
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                {roleCards.map(rc => (
                  <button
                    key={rc.id}
                    type="button"
                    onClick={() => handleDemoLogin(rc.id)}
                    style={{
                      background: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '10px',
                      padding: '12px',
                      textAlign: 'left',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      transition: 'all 0.15s ease',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
                    }}
                  >
                    <span style={{ fontSize: '1.3rem' }}>{rc.icon}</span>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.84rem', color: '#0f172a' }}>{rc.title}</div>
                      <div style={{ fontSize: '0.68rem', color: '#2563eb', fontWeight: 700 }}>Log In →</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              margin: '20px 0',
              color: '#94a3b8',
              fontSize: '0.78rem'
            }}>
              <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
              <span>Or sign in with Google</span>
              <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
            </div>

            <button
              onClick={handleGoogleLogin}
              disabled={isSubmitting}
              style={{
                width: '100%',
                padding: '12px 18px',
                borderRadius: '10px',
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                color: '#334155',
                fontSize: '0.9rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                cursor: 'pointer',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                transition: 'all 0.2s'
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>{isSubmitting ? 'Authenticating...' : 'Sign in with Google Account'}</span>
            </button>
          </div>
        )}

        {/* ================= MODE: SIGNUP ================= */}
        {authMode === 'signup' && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>
                Join the Platform
              </h2>
              <p style={{ color: '#64748b', fontSize: '0.84rem', margin: 0 }}>
                Select your role to access specialized workspaces.
              </p>
            </div>

            {authError && (
              <div style={{
                background: '#fef2f2',
                border: '1px solid #fecaca',
                color: '#dc2626',
                padding: '12px 16px',
                borderRadius: '10px',
                fontSize: '0.84rem',
                marginBottom: '18px'
              }}>
                {authError}
              </div>
            )}

            {/* Role Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '20px' }}>
              {roleCards.map(rc => {
                const isSelected = selectedRole === rc.id;
                return (
                  <div
                    key={rc.id}
                    onClick={() => setSelectedRole(rc.id)}
                    style={{
                      background: isSelected ? '#eff6ff' : '#ffffff',
                      border: isSelected ? '2px solid #2563eb' : '1px solid #e2e8f0',
                      borderRadius: '12px',
                      padding: '12px 14px',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      boxShadow: isSelected ? '0 4px 12px rgba(37, 99, 235, 0.08)' : '0 1px 2px rgba(0,0,0,0.02)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ fontSize: '1.25rem' }}>{rc.icon}</span>
                      <span style={{ fontWeight: 800, fontSize: '0.86rem', color: '#0f172a' }}>{rc.title}</span>
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', lineHeight: 1.3 }}>
                      {rc.desc}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Signup Form */}
            <form onSubmit={handleRoleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.76rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
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
                    padding: '10px 14px',
                    borderRadius: '8px',
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
                <label style={{ fontSize: '0.76rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    background: '#f8fafc',
                    border: '1px solid #cbd5e1',
                    color: '#0f172a',
                    fontSize: '0.86rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {(selectedRole === 'operator' || selectedRole === 'vendor') && (
                <div>
                  <label style={{ fontSize: '0.76rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    {selectedRole === 'operator' ? 'Tour Agency / Organization Name *' : 'Business / Hotel Property Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={selectedRole === 'operator' ? 'e.g. Celestial Heritage Expeditions' : 'e.g. Taj Exotica / DiveGoa'}
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      background: '#f8fafc',
                      border: '1px solid #cbd5e1',
                      color: '#0f172a',
                      fontSize: '0.86rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              )}

              {selectedRole === 'coordinator' && (
                <div>
                  <label style={{ fontSize: '0.76rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Assigned Region / Base
                  </label>
                  <select
                    value={formData.region}
                    onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      background: '#f8fafc',
                      border: '1px solid #cbd5e1',
                      color: '#0f172a',
                      fontSize: '0.84rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="Goa & Western Coast">Goa & Western Coast</option>
                    <option value="Manali & Himachal">Manali & Himachal</option>
                    <option value="Rajasthan Royal Circuits">Rajasthan Royal Circuits</option>
                    <option value="Kerala Backwaters & Munnar">Kerala Backwaters & Munnar</option>
                  </select>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  padding: '12px 18px',
                  borderRadius: '10px',
                  background: '#2563eb',
                  color: '#ffffff',
                  fontSize: '0.9rem',
                  fontWeight: 800,
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)',
                  marginTop: '8px',
                  transition: 'all 0.15s ease'
                }}
              >
                {isSubmitting ? 'Registering...' : `Sign Up as ${roleCards.find(r => r.id === selectedRole)?.title}`}
              </button>

              <div style={{ textAlign: 'center', marginTop: '6px' }}>
                <Link href="/signup" style={{ color: '#2563eb', fontSize: '0.78rem', fontWeight: 600, textDecoration: 'none' }}>
                  Need more role customization? Open Full Registration Portal →
                </Link>
              </div>
            </form>
          </div>
        )}

        {/* Footer info */}
        <div style={{
          marginTop: '28px',
          paddingTop: '20px',
          borderTop: '1px solid #f1f5f9',
          textAlign: 'center',
          fontSize: '0.78rem',
          color: '#64748b'
        }}>
          Protected by role-based RBAC authentication and enterprise TLS encryption.
        </div>
      </div>
    </div>
  );
}
