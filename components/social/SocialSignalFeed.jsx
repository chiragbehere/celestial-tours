'use client';

import { useState, useEffect } from 'react';
import { 
  BroadcastIcon, 
  ShieldCheckIcon, 
  AlertTriangleIcon, 
  CheckCircleIcon, 
  LightningIcon,
  ChatDotsIcon,
  SearchIcon,
  RefreshIcon
} from '@/components/ui/Icons';

export default function SocialSignalFeed({ destination = 'Goa', onSignalSelect = null }) {
  const [signals, setSignals] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'critical', 'verified', 'traveler'
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportText, setReportText] = useState('');
  const [reportCategory, setReportCategory] = useState('warning');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchSignals = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/social-signals?destination=${encodeURIComponent(destination)}`);
      const data = await res.json();
      if (data.success) {
        setSignals(data.signals || []);
        setAnalysis(data.analysis || null);
      }
    } catch (err) {
      console.error('Failed to fetch social signals:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSignals();
  }, [destination]);

  const handleSubmitReport = async (e) => {
    e.preventDefault();
    if (!reportText.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/social-signals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination,
          content: reportText.trim(),
          threatLevel: reportCategory === 'critical' ? 'critical' : reportCategory === 'warning' ? 'moderate' : 'low',
          sentiment: reportCategory === 'critical' ? 'negative' : reportCategory === 'warning' ? 'warning' : 'positive',
          authorName: 'Verified On-Ground Scout',
          authorHandle: '@field_scout_goa',
          location: `${destination} Central Zone`,
          platform: 'x',
          aiImpactTag: reportCategory === 'critical' ? 'FIELD_DISRUPTION_CONFIRMED' : 'TRAVELER_WEATHER_UPDATE'
        })
      });

      const data = await res.json();
      if (data.success) {
        setReportText('');
        setReportModalOpen(false);
        fetchSignals();
      }
    } catch (err) {
      console.error('Failed to submit signal:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredSignals = signals.filter(s => {
    if (filter === 'critical') return s.threatLevel === 'critical';
    if (filter === 'verified') return s.author?.verified;
    if (filter === 'traveler') return s.platform === 'instagram' || s.platform === 'reddit';
    return true;
  });

  const getPlatformBadge = (platform) => {
    switch (platform) {
      case 'x':
        return <span style={{ background: '#0f172a', color: '#fff', fontSize: '0.68rem', fontWeight: 800, padding: '2px 8px', borderRadius: '6px' }}>𝕏 Post</span>;
      case 'instagram':
        return <span style={{ background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743)', color: '#fff', fontSize: '0.68rem', fontWeight: 800, padding: '2px 8px', borderRadius: '6px' }}>Instagram</span>;
      case 'telegram':
        return <span style={{ background: '#0284c7', color: '#fff', fontSize: '0.68rem', fontWeight: 800, padding: '2px 8px', borderRadius: '6px' }}>Telegram Dispatch</span>;
      case 'reddit':
        return <span style={{ background: '#ea580c', color: '#fff', fontSize: '0.68rem', fontWeight: 800, padding: '2px 8px', borderRadius: '6px' }}>Reddit r/{destination}</span>;
      default:
        return <span style={{ background: '#475569', color: '#fff', fontSize: '0.68rem', fontWeight: 800, padding: '2px 8px', borderRadius: '6px' }}>Field Alert</span>;
    }
  };

  return (
    <div style={{
      background: '#ffffff',
      borderRadius: '20px',
      border: '1px solid #e2e8f0',
      padding: '24px',
      boxShadow: '0 10px 30px rgba(15, 23, 42, 0.04)'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 6px 16px rgba(37, 99, 235, 0.3)'
          }}>
            <BroadcastIcon size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Real-World Social Signals
            </h3>
            <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
              Crowdsourced traveler reports, lifeguard alerts & live social radar for {destination}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => setReportModalOpen(true)}
            style={{
              padding: '8px 14px',
              borderRadius: '999px',
              border: 'none',
              background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
              color: '#ffffff',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)'
            }}
          >
            <span>+ Report Ground Alert</span>
          </button>
          <button
            onClick={fetchSignals}
            title="Refresh Social Signals"
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '999px',
              border: '1px solid #cbd5e1',
              background: '#f8fafc',
              color: '#475569',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <RefreshIcon size={14} />
          </button>
        </div>
      </div>

      {/* AI Early-Warning Intelligence Banner */}
      {analysis && (
        <div style={{
          background: analysis.threatLevel === 'critical' ? 'rgba(239, 68, 68, 0.08)' : analysis.threatLevel === 'moderate' ? 'rgba(245, 158, 11, 0.08)' : 'rgba(16, 185, 129, 0.08)',
          border: `1px solid ${analysis.threatLevel === 'critical' ? '#fca5a5' : analysis.threatLevel === 'moderate' ? '#fcd34d' : '#86efac'}`,
          borderRadius: '14px',
          padding: '14px 16px',
          marginBottom: '18px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px'
        }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: analysis.threatLevel === 'critical' ? '#ef4444' : analysis.threatLevel === 'moderate' ? '#f59e0b' : '#10b981',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            {analysis.threatLevel === 'critical' ? <AlertTriangleIcon size={18} /> : <ShieldCheckIcon size={18} />}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
              <span style={{
                fontSize: '0.75rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                color: analysis.threatLevel === 'critical' ? '#b91c1c' : analysis.threatLevel === 'moderate' ? '#b45309' : '#047857'
              }}>
                AI Social Anomaly Radar • {analysis.threatLevel} Threat (Risk Index: {analysis.riskScore}/100)
              </span>
              <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                • {analysis.totalConfirmations} traveler verifications
              </span>
            </div>
            <p style={{ fontSize: '0.84rem', color: '#1e293b', margin: 0, fontWeight: 500, lineHeight: 1.4 }}>
              {analysis.summary}
            </p>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', overflowX: 'auto', paddingBottom: '4px' }}>
        {[
          { key: 'all', label: `All Signals (${signals.length})` },
          { key: 'critical', label: 'Severe Alerts' },
          { key: 'verified', label: 'Authorities' },
          { key: 'traveler', label: 'Traveler Stories' }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            style={{
              padding: '6px 14px',
              borderRadius: '999px',
              fontSize: '0.76rem',
              fontWeight: 700,
              cursor: 'pointer',
              border: filter === tab.key ? 'none' : '1px solid #e2e8f0',
              background: filter === tab.key ? '#0f172a' : '#f8fafc',
              color: filter === tab.key ? '#ffffff' : '#64748b',
              transition: 'all 0.15s ease'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Feed List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '420px', overflowY: 'auto', paddingRight: '4px' }}>
        {filteredSignals.map(sig => (
          <div
            key={sig.id}
            onClick={() => onSignalSelect && onSignalSelect(sig)}
            style={{
              background: sig.threatLevel === 'critical' ? 'rgba(254, 242, 242, 0.7)' : '#f8fafc',
              borderRadius: '14px',
              border: `1px solid ${sig.threatLevel === 'critical' ? '#fecaca' : '#e2e8f0'}`,
              padding: '16px',
              cursor: onSignalSelect ? 'pointer' : 'default',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#94a3b8'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(15, 23, 42, 0.05)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = sig.threatLevel === 'critical' ? '#fecaca' : '#e2e8f0'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <img
                  src={sig.author?.avatar}
                  alt={sig.author?.name}
                  style={{ width: '34px', height: '34px', borderRadius: '999px', objectFit: 'cover' }}
                />
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontWeight: 800, fontSize: '0.86rem', color: '#0f172a' }}>
                      {sig.author?.name}
                    </span>
                    {sig.author?.verified && (
                      <span title="Verified Source" style={{ color: '#2563eb', display: 'inline-flex' }}>
                        <CheckCircleIcon size={13} />
                      </span>
                    )}
                  </div>
                  <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                    {sig.author?.handle} • {sig.author?.badge}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {getPlatformBadge(sig.platform)}
                <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600 }}>
                  {sig.timestamp}
                </span>
              </div>
            </div>

            <p style={{ fontSize: '0.86rem', color: '#1e293b', lineHeight: 1.45, margin: '0 0 10px' }}>
              {sig.content}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '0.72rem', color: '#2563eb', fontWeight: 700, background: '#eff6ff', padding: '3px 8px', borderRadius: '6px' }}>
                  📍 {sig.location}
                </span>
                {sig.aiImpactTag && (
                  <span style={{ fontSize: '0.7rem', color: '#475569', fontWeight: 700, background: '#e2e8f0', padding: '3px 8px', borderRadius: '6px' }}>
                    #{sig.aiImpactTag}
                  </span>
                )}
              </div>

              <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>
                🛡️ {sig.crowdConfirmations} travelers confirmed
              </div>
            </div>
          </div>
        ))}

        {filteredSignals.length === 0 && (
          <div style={{ textAlign: 'center', padding: '36px 12px', color: '#94a3b8' }}>
            <p style={{ margin: 0, fontSize: '0.88rem' }}>No signals matching current filter.</p>
          </div>
        )}
      </div>

      {/* Report Ground Alert Modal */}
      {reportModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(6px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '24px',
            maxWidth: '480px',
            width: '100%',
            padding: '28px',
            boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.25)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Submit Ground Observation
              </h4>
              <button
                onClick={() => setReportModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: '#94a3b8' }}
              >
                ✕
              </button>
            </div>
            <p style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '16px' }}>
              Provide real-world traveler observations on sea swells, weather conditions, or road diversions for {destination}.
            </p>

            <form onSubmit={handleSubmitReport}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Alert Severity
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {[
                    { key: 'warning', label: 'Moderate Weather', color: '#f59e0b' },
                    { key: 'critical', label: 'Severe Disruption', color: '#ef4444' },
                    { key: 'safe', label: 'Clear / Safe', color: '#10b981' }
                  ].map(cat => (
                    <button
                      type="button"
                      key={cat.key}
                      onClick={() => setReportCategory(cat.key)}
                      style={{
                        flex: 1,
                        padding: '8px',
                        borderRadius: '10px',
                        border: reportCategory === cat.key ? `2px solid ${cat.color}` : '1px solid #cbd5e1',
                        background: reportCategory === cat.key ? `${cat.color}15` : '#f8fafc',
                        color: reportCategory === cat.key ? cat.color : '#64748b',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Observation Details
                </label>
                <textarea
                  rows={4}
                  value={reportText}
                  onChange={(e) => setReportText(e.target.value)}
                  placeholder="e.g. Red flags up at Calangute due to sudden squall winds. Lifeguards advising no swimming. Shacks are open and safe."
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '12px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.88rem',
                    fontFamily: 'inherit',
                    resize: 'none',
                    outline: 'none'
                  }}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setReportModalOpen(false)}
                  style={{
                    padding: '10px 18px',
                    borderRadius: '999px',
                    border: '1px solid #cbd5e1',
                    background: '#f8fafc',
                    color: '#64748b',
                    fontWeight: 700,
                    fontSize: '0.84rem',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !reportText.trim()}
                  style={{
                    padding: '10px 22px',
                    borderRadius: '999px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.84rem',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)'
                  }}
                >
                  {isSubmitting ? 'Broadcasting...' : 'Broadcast to Network →'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
