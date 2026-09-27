'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/context/AuthContext';
import { BuildingIcon, SuitcaseIcon, PlaneIcon } from '@/components/ui/Icons';

export default function LoginPage() {
  const { user, loginWithEmail, signUpWithEmail, loginWithGoogle, loginAsDemo, loading } = useAuth();
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'signup'
  const [selectedRole, setSelectedRole] = useState('traveler');
  const [authError, setAuthError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // Login form fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup form fields
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    organization: ''
  });

  // Demo accordion toggle
  const [showDemoOptions, setShowDemoOptions] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      const timer = setTimeout(() => {
        if (user.role === 'operator') {
          router.push('/operator/dashboard');
        } else {
          router.push('/account');
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [user, loading, router]);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setAuthError(null);
    setIsSubmitting(true);

    try {
      const res = await loginWithEmail(loginEmail, loginPassword);
      if (!res.success) {
        setAuthError(res.error || 'Invalid email or password.');
      } else {
        if (res.user?.role === 'operator') router.push('/operator/dashboard');
        else router.push('/account');
      }
    } catch (err) {
      setAuthError(err.message || 'Error logging in.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRoleSignup = async (e) => {
    e.preventDefault();
    setAuthError(null);
    setIsSubmitting(true);

    if (!formData.name.trim()) {
      setAuthError('Please enter your full name.');
      setIsSubmitting(false);
      return;
    }

    if (!formData.password || formData.password.length < 6) {
      setAuthError('Password must be at least 6 characters.');
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await signUpWithEmail(
        formData.email,
        formData.password,
        formData.name,
        selectedRole
      );

      if (!res.success) {
        setAuthError(res.error || 'Failed to create account.');
      } else {
        if (selectedRole === 'operator') router.push('/operator/dashboard');
        else router.push('/account');
      }
    } catch (err) {
      setAuthError(err.message || 'Error signing up.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setAuthError(null);
    setIsSubmitting(true);
    try {
      const res = await loginWithGoogle();
      if (!res.success) {
        setAuthError(res.error || "Authentication failed. Please check Firebase settings.");
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
    else router.push('/account');
  };

  const roleCards = [
    {
      id: 'traveler',
      title: 'Traveler',
      icon: <SuitcaseIcon size={20} />,
      desc: 'Personalized AI itineraries, flexible checkout, vouchers & trip companion'
    },
    {
      id: 'operator',
      title: 'Tour Operator',
      icon: <BuildingIcon size={20} />,
      desc: 'Manage packages, add vendor contracts, DAG replanning & live rosters'
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
        padding: '36px 32px',
        maxWidth: authMode === 'signup' ? '540px' : '440px',
        width: '100%',
        boxShadow: '0 20px 45px -10px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.04)',
        position: 'relative',
        zIndex: 2,
        transition: 'all 0.3s'
      }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '22px' }}>
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
          marginBottom: '22px',
          border: '1px solid #e2e8f0'
        }}>
          <button
            type="button"
            onClick={() => { setAuthMode('login'); setAuthError(null); }}
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
            onClick={() => { setAuthMode('signup'); setAuthError(null); }}
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

        {authError && (
          <div style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#dc2626',
            padding: '11px 14px',
            borderRadius: '10px',
            fontSize: '0.82rem',
            marginBottom: '16px'
          }}>
            {authError}
          </div>
        )}

        {/* ================= MODE: LOGIN ================= */}
        {authMode === 'login' && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '18px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>
                Welcome to Celestial
              </h2>
              <p style={{ color: '#64748b', fontSize: '0.82rem', margin: 0 }}>
                Sign in with your email and password.
              </p>
            </div>

            {/* Email & Password Form */}
            <form onSubmit={handleEmailLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: '9px',
                    background: '#f8fafc',
                    border: '1px solid #cbd5e1',
                    color: '#0f172a',
                    fontSize: '0.88rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Password *
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: '9px',
                    background: '#f8fafc',
                    border: '1px solid #cbd5e1',
                    color: '#0f172a',
                    fontSize: '0.88rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '999px',
                  background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '0.92rem',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)',
                  marginTop: '4px'
                }}
              >
                {isSubmitting ? 'Signing in...' : 'Sign In to Account'}
              </button>
            </form>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              margin: '18px 0',
              color: '#94a3b8',
              fontSize: '0.76rem'
            }}>
              <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
              <span>Or continue with Google</span>
              <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
            </div>

            <button
              onClick={handleGoogleLogin}
              disabled={isSubmitting}
              style={{
                width: '100%',
                padding: '11px 16px',
                borderRadius: '999px',
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                color: '#334155',
                fontSize: '0.86rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
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
              <span>{isSubmitting ? 'Connecting...' : 'Sign in with Google'}</span>
            </button>

            {/* Quick Demo Access (Accordion) */}
            <div style={{ marginTop: '20px', borderTop: '1px solid #f1f5f9', paddingTop: '14px', textAlign: 'center' }}>
              <button
                type="button"
                onClick={() => setShowDemoOptions(!showDemoOptions)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#64748b',
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                {showDemoOptions ? 'Hide Evaluator Demo Logins' : 'Hackathon Evaluator Quick Access (One-Click)'}
              </button>

              {showDemoOptions && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '10px' }}>
                  <button
                    type="button"
                    onClick={() => handleDemoLogin('traveler')}
                    style={{
                      padding: '8px 12px',
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      color: '#0f172a',
                      cursor: 'pointer'
                    }}
                  >
                    Demo Traveler 🧳
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDemoLogin('operator')}
                    style={{
                      padding: '8px 12px',
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      color: '#0f172a',
                      cursor: 'pointer'
                    }}
                  >
                    Demo Operator 🏢
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= MODE: SIGNUP ================= */}
        {authMode === 'signup' && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '18px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>
                Create Your Account
              </h2>
              <p style={{ color: '#64748b', fontSize: '0.82rem', margin: 0 }}>
                Enter your details to generate your personal travel vault.
              </p>
            </div>

            {/* Role Selection Tabs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', marginBottom: '16px' }}>
              {roleCards.map(rc => {
                const isSelected = selectedRole === rc.id;
                return (
                  <div
                    key={rc.id}
                    onClick={() => setSelectedRole(rc.id)}
                    style={{
                      background: isSelected ? '#eff6ff' : '#ffffff',
                      border: isSelected ? '2px solid #2563eb' : '1px solid #e2e8f0',
                      borderRadius: '10px',
                      padding: '10px 12px',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '1.1rem' }}>{rc.icon}</span>
                      <span style={{ fontWeight: 800, fontSize: '0.84rem', color: isSelected ? '#2563eb' : '#0f172a' }}>{rc.title}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Signup Form */}
            <form onSubmit={handleRoleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chirag Behere"
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
                <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="you@domain.com"
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

              <div>
                <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
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

              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '999px',
                  background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '0.92rem',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)',
                  marginTop: '6px'
                }}
              >
                {isSubmitting ? 'Creating Account...' : `Register as ${selectedRole === 'operator' ? 'Operator' : 'Traveler'}`}
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
