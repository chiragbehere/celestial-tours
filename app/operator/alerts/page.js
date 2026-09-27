'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  AlertTriangleIcon,
  CheckCircleIcon,
  SparklesIcon,
  ArrowRightIcon,
  RefreshIcon
} from '@/components/ui/Icons';

export default function DisruptionAlertsPage() {
  const [disruptions, setDisruptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDisruption, setSelectedDisruption] = useState(null);
  const [generatingAlternatives, setGeneratingAlternatives] = useState(false);
  const [resolvingAlternativeId, setResolvingAlternativeId] = useState(null);
  const [resolutionSuccess, setResolutionSuccess] = useState(null);
  const [simType, setSimType] = useState('weather_monsoon');
  const [simulating, setSimulating] = useState(false);

  const fetchDisruptions = async () => {
    try {
      const res = await fetch('/api/operator/disruptions');
      const data = await res.json();
      if (data.success) {
        setDisruptions(data.disruptions || []);
        if (data.disruptions?.length > 0 && !selectedDisruption) {
          const unresolved = data.disruptions.find(d => d.status !== 'resolved') || data.disruptions[0];
          setSelectedDisruption(unresolved);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDisruptions();
  }, []);

  const handleGenerateAlternatives = async (disruption) => {
    setGeneratingAlternatives(true);
    setResolutionSuccess(null);
    try {
      const res = await fetch(`/api/itinerary/${disruption.tour_plan_id}/adapt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ disruptionId: disruption.id })
      });
      const data = await res.json();
      if (data.success) {
        setSelectedDisruption({
          ...disruption,
          status: 'alternatives_generated',
          alternatives: data.alternatives
        });
        fetchDisruptions();
      } else {
        alert(data.error || 'Failed to generate alternatives');
      }
    } catch (err) {
      console.error(err);
      alert('Error contacting Nugen Adapt AI');
    } finally {
      setGeneratingAlternatives(false);
    }
  };

  const handleApproveAlternative = async (disruption, alternative) => {
    setResolvingAlternativeId(alternative.id);
    try {
      const res = await fetch('/api/operator/disruptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          disruptionId: disruption.id,
          alternative
        })
      });
      const data = await res.json();
      if (data.success) {
        setResolutionSuccess({
          message: `Alternative "${alternative.title}" approved and live. Tour cost updated to ₹${data.tourPlan?.total_cost?.toLocaleString('en-IN')}.`,
          tourPlanId: disruption.tour_plan_id
        });
        fetchDisruptions();
        setSelectedDisruption(prev => ({
          ...prev,
          status: 'resolved',
          chosen_alternative: alternative.title
        }));
      } else {
        alert(data.error || 'Failed to execute resolution');
      }
    } catch (err) {
      console.error(err);
      alert('Error updating tour plan');
    } finally {
      setResolvingAlternativeId(null);
    }
  };

  const handleSimulate = async () => {
    setSimulating(true);
    try {
      const res = await fetch('/api/operator/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: simType })
      });
      const data = await res.json();
      if (data.success) {
        await fetchDisruptions();
        if (data.disruption) {
          setSelectedDisruption(data.disruption);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSimulating(false);
    }
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 10px',
            borderRadius: '999px',
            background: '#fef2f2',
            border: '1px solid #fee2e2',
            color: '#dc2626',
            fontSize: '0.72rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '8px'
          }}>
            Live Tour Operations • Disruption Management
          </div>
          <h1 style={{
            fontSize: '1.8rem',
            fontWeight: 800,
            color: '#0f172a',
            letterSpacing: '-0.02em',
            marginBottom: '4px'
          }}>
            Disruption Shield & Dynamic Itinerary Replanning
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.88rem' }}>
            Monitors real-time weather and vendor alerts, detects cascade delays across schedule legs, and synthesizes 3 ranked feasible resolutions via Nugen AI.
          </p>
        </div>

        <button
          onClick={fetchDisruptions}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '9px 16px',
            borderRadius: '8px',
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            color: '#334155',
            fontSize: '0.8rem',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
          }}
        >
          <RefreshIcon size={14} />
          <span>Refresh Live Alerts</span>
        </button>
      </div>

      {/* Simulator Trigger Banner for Demonstration & Testing */}
      <div style={{
        background: 'linear-gradient(135deg, #f0fdf4 0%, #eff6ff 100%)',
        border: '1px solid #bfdbfe',
        borderRadius: '12px',
        padding: '16px 20px',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        boxShadow: '0 2px 8px rgba(37, 99, 235, 0.04)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: '#dbeafe',
            color: '#2563eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <SparklesIcon size={20} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#0f172a' }}>
              Simulate Live Operational Disruption (Testing Sandbox)
            </div>
            <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
              Triggers real-time schedule conflict detection and activates AI itinerary replanning.
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <select
            value={simType}
            onChange={(e) => setSimType(e.target.value)}
            style={{
              padding: '9px 14px',
              borderRadius: '8px',
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              color: '#0f172a',
              fontSize: '0.82rem',
              fontWeight: 600,
              outline: 'none',
              boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
            }}
          >
            <option value="weather_monsoon">Weather: Coastal High Surge Alert (Scuba Suspended)</option>
            <option value="hotel_unavailable">Vendor: Resort Water Main Burst (Flooded Wing)</option>
            <option value="transport_delay">Transit: Highway Landslide NH-66 (3.5h Delay)</option>
          </select>
          <button
            onClick={handleSimulate}
            disabled={simulating}
            style={{
              padding: '9px 18px',
              borderRadius: '8px',
              background: '#2563eb',
              color: '#ffffff',
              fontSize: '0.82rem',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(37, 99, 235, 0.25)',
              transition: 'all 0.15s ease'
            }}
          >
            {simulating ? 'Injecting Disruption...' : 'Simulate Event'}
          </button>
        </div>
      </div>

      {/* Resolution Success Banner */}
      {resolutionSuccess && (
        <div style={{
          background: '#ecfdf5',
          border: '1px solid #a7f3d0',
          borderRadius: '10px',
          padding: '16px 20px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: '#065f46',
          boxShadow: '0 2px 6px rgba(16, 185, 129, 0.05)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CheckCircleIcon size={20} />
            <span style={{ fontWeight: 700, fontSize: '0.88rem' }}>{resolutionSuccess.message}</span>
          </div>
          <Link
            href={`/itinerary/${resolutionSuccess.tourPlanId}`}
            target="_blank"
            style={{
              fontSize: '0.8rem',
              fontWeight: 700,
              padding: '7px 15px',
              borderRadius: '6px',
              background: '#059669',
              color: '#ffffff',
              textDecoration: 'none',
              boxShadow: '0 1px 3px rgba(5, 150, 105, 0.2)'
            }}
          >
            View Live Traveler Schedule ↗
          </Link>
        </div>
      )}

      {/* Two Column Layout: Left = Alert List, Right = AI Replanning Workbench */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 2fr)', gap: '24px' }}>
        {/* Left: Incident Feed List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', padding: '0 4px' }}>
            Active Disruption Incidents ({disruptions.length})
          </div>

          {loading ? (
            <div style={{ color: '#64748b', fontSize: '0.85rem', padding: '20px' }}>Loading disruption records...</div>
          ) : disruptions.length === 0 ? (
            <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '32px 20px', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
              <div style={{ color: '#059669', fontWeight: 700, marginBottom: '6px' }}>All Clear</div>
              <div style={{ fontSize: '0.78rem', color: '#64748b' }}>No active alerts. Use simulator above to test.</div>
            </div>
          ) : (
            disruptions.map(d => {
              const isSelected = selectedDisruption?.id === d.id;
              const isResolved = d.status === 'resolved';

              return (
                <div
                  key={d.id}
                  onClick={() => setSelectedDisruption(d)}
                  style={{
                    background: isSelected ? '#eff6ff' : '#ffffff',
                    border: isSelected
                      ? '2px solid #2563eb'
                      : isResolved
                      ? '1px solid #e2e8f0'
                      : '1px solid #fecaca',
                    borderRadius: '10px',
                    padding: '16px',
                    cursor: 'pointer',
                    boxShadow: isSelected ? '0 4px 12px rgba(37, 99, 235, 0.08)' : '0 1px 3px rgba(0,0,0,0.02)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{
                      background: isResolved ? '#ecfdf5' : '#fef2f2',
                      color: isResolved ? '#059669' : '#dc2626',
                      border: isResolved ? '1px solid #a7f3d0' : '1px solid #fee2e2',
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      padding: '2px 8px',
                      borderRadius: '999px',
                      textTransform: 'uppercase'
                    }}>
                      {isResolved ? 'RESOLVED' : d.source?.replace('_', ' ') || 'ACTIVE ALERT'}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                      {new Date(d.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#0f172a', marginBottom: '4px' }}>
                    {d.affected_item_name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '6px' }}>
                    Tour: <strong style={{ color: '#334155' }}>{d.tour_name}</strong>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: isResolved ? '#64748b' : '#b91c1c', lineHeight: 1.4, margin: 0 }}>
                    {d.reason}
                  </p>
                </div>
              );
            })
          )}
        </div>

        {/* Right: Selected Disruption Workbench */}
        <div>
          {selectedDisruption ? (
            <div style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '14px',
              padding: '28px',
              boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.05), 0 2px 6px -1px rgba(0, 0, 0, 0.02)'
            }}>
              {/* Incident Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', paddingBottom: '18px', borderBottom: '1px solid #f1f5f9' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span style={{
                      background: selectedDisruption.status === 'resolved' ? '#ecfdf5' : '#fef2f2',
                      color: selectedDisruption.status === 'resolved' ? '#059669' : '#dc2626',
                      fontWeight: 800,
                      fontSize: '0.72rem',
                      padding: '3px 10px',
                      borderRadius: '999px',
                      textTransform: 'uppercase'
                    }}>
                      {selectedDisruption.status === 'resolved' ? 'RESOLVED & DEPLOYED' : 'UNRESOLVED DISRUPTION'}
                    </span>
                    <span style={{ color: '#94a3b8', fontSize: '0.78rem' }}>
                      ID: {selectedDisruption.id}
                    </span>
                  </div>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>
                    {selectedDisruption.affected_item_name}
                  </h2>
                  <p style={{ color: '#dc2626', fontSize: '0.88rem', margin: 0, fontWeight: 500 }}>
                    {selectedDisruption.reason}
                  </p>
                </div>

                <Link
                  href={`/itinerary/${selectedDisruption.tour_plan_id}`}
                  target="_blank"
                  style={{
                    padding: '8px 14px',
                    borderRadius: '8px',
                    background: '#f8fafc',
                    border: '1px solid #cbd5e1',
                    color: '#334155',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    textDecoration: 'none',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
                  }}
                >
                  View Itinerary ↗
                </Link>
              </div>

              {/* Dependency Schedule Impact Analysis */}
              <div style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                padding: '16px',
                marginBottom: '24px'
              }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0284c7', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                  Logistics & Schedule Cascade Analysis
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem' }}>
                    <span style={{ color: '#dc2626', fontWeight: 700 }}>Disrupted Item:</span>
                    <span style={{ color: '#0f172a', fontWeight: 600 }}>{selectedDisruption.affected_item_name} ({selectedDisruption.affected_item_type})</span>
                  </div>

                  {selectedDisruption.cascade_details && selectedDisruption.cascade_details.length > 0 ? (
                    selectedDisruption.cascade_details.map((c, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.8rem', color: '#475569' }}>
                        <span style={{ color: '#d97706', fontWeight: 700, flexShrink: 0 }}>Downstream Impact:</span>
                        <span>{c.name} — <em style={{ color: '#b45309' }}>{c.impactReason}</em></span>
                      </div>
                    ))
                  ) : (
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                      No downstream items blocked; schedule can accommodate in-place replacement without rescheduling following days.
                    </div>
                  )}
                </div>
              </div>

              {/* AI Replanning Generator Section */}
              {selectedDisruption.status === 'resolved' ? (
                <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '10px', padding: '20px', textAlign: 'center' }}>
                  <div style={{ color: '#065f46', fontWeight: 800, fontSize: '0.95rem', marginBottom: '4px' }}>
                    Disruption Resolved with Alternative:
                  </div>
                  <div style={{ color: '#047857', fontWeight: 800, fontSize: '1.15rem', marginBottom: '8px' }}>
                    &ldquo;{selectedDisruption.chosen_alternative}&rdquo;
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#065f46' }}>
                    All vendor booking vouchers, chauffeur dispatch notes, and traveler notifications were updated automatically.
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', marginBottom: '2px' }}>
                        AI Ranked Feasible Alternatives
                      </h3>
                      <p style={{ color: '#64748b', fontSize: '0.78rem' }}>
                        Evaluated against opening hours, geo-transit buffers, and total trip budget ceiling.
                      </p>
                    </div>

                    <button
                      onClick={() => handleGenerateAlternatives(selectedDisruption)}
                      disabled={generatingAlternatives}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px 18px',
                        borderRadius: '8px',
                        background: '#2563eb',
                        color: '#ffffff',
                        fontSize: '0.84rem',
                        fontWeight: 700,
                        border: 'none',
                        cursor: 'pointer',
                        boxShadow: '0 2px 10px rgba(37, 99, 235, 0.25)',
                        opacity: generatingAlternatives ? 0.7 : 1
                      }}
                    >
                      <SparklesIcon size={16} />
                      <span>{generatingAlternatives ? 'Querying Nugen AI...' : 'Generate AI Alternatives'}</span>
                    </button>
                  </div>

                  {/* Alternatives List */}
                  {selectedDisruption.alternatives && selectedDisruption.alternatives.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {selectedDisruption.alternatives.map((alt, idx) => (
                        <div
                          key={alt.id || idx}
                          style={{
                            background: '#ffffff',
                            border: '1px solid #e2e8f0',
                            borderRadius: '12px',
                            padding: '20px',
                            boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                <span style={{
                                  background: '#eff6ff',
                                  color: '#2563eb',
                                  border: '1px solid #bfdbfe',
                                  fontSize: '0.7rem',
                                  fontWeight: 800,
                                  padding: '2px 8px',
                                  borderRadius: '999px'
                                }}>
                                  RANK #{idx + 1}
                                </span>
                                <span style={{ fontWeight: 800, fontSize: '1.05rem', color: '#0f172a' }}>
                                  {alt.title}
                                </span>
                              </div>
                              <p style={{ color: '#475569', fontSize: '0.84rem', lineHeight: 1.5, margin: 0 }}>
                                {alt.description}
                              </p>
                            </div>

                            <div style={{ textAlign: 'right', flexShrink: 0 }}>
                              <div style={{
                                display: 'inline-block',
                                padding: '3px 10px',
                                borderRadius: '999px',
                                background: alt.feasibility_score >= 95 ? '#ecfdf5' : '#fffbeb',
                                color: alt.feasibility_score >= 95 ? '#059669' : '#d97706',
                                border: alt.feasibility_score >= 95 ? '1px solid #a7f3d0' : '1px solid #fde68a',
                                fontSize: '0.74rem',
                                fontWeight: 800,
                                marginBottom: '4px'
                              }}>
                                {alt.feasibility_score}% Feasible
                              </div>
                              <div style={{ fontSize: '0.84rem', fontWeight: 800, color: alt.cost_delta <= 0 ? '#059669' : '#d97706' }}>
                                {alt.cost_delta <= 0 ? `Saves ₹${Math.abs(alt.cost_delta)}` : `+₹${alt.cost_delta}`}
                              </div>
                            </div>
                          </div>

                          {/* Replacement Specs */}
                          {alt.replacement && (
                            <div style={{ background: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: '8px', padding: '12px 14px', margin: '12px 0', fontSize: '0.78rem', color: '#475569' }}>
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '8px' }}>
                                <div>
                                  <span style={{ color: '#64748b' }}>Replacement:</span>{' '}
                                  <strong style={{ color: '#0f172a' }}>{alt.replacement.name}</strong>
                                </div>
                                <div>
                                  <span style={{ color: '#64748b' }}>Time Slot:</span>{' '}
                                  <strong style={{ color: '#0f172a' }}>{alt.replacement.start_time} - {alt.replacement.end_time}</strong>
                                </div>
                                <div>
                                  <span style={{ color: '#64748b' }}>Unit Cost:</span>{' '}
                                  <strong style={{ color: '#0284c7' }}>₹{alt.replacement.cost?.toLocaleString('en-IN')}</strong>
                                </div>
                              </div>
                            </div>
                          )}

                          {alt.rationale && (
                            <div style={{ fontSize: '0.78rem', color: '#64748b', fontStyle: 'italic', marginBottom: '14px' }}>
                              <strong style={{ color: '#334155', fontStyle: 'normal' }}>AI Logistics Rationale:</strong> {alt.rationale}
                            </div>
                          )}

                          <button
                            onClick={() => handleApproveAlternative(selectedDisruption, alt)}
                            disabled={resolvingAlternativeId === alt.id}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '8px',
                              width: '100%',
                              padding: '11px',
                              borderRadius: '8px',
                              background: '#059669',
                              color: '#ffffff',
                              fontSize: '0.85rem',
                              fontWeight: 800,
                              border: 'none',
                              cursor: 'pointer',
                              boxShadow: '0 2px 8px rgba(5, 150, 105, 0.2)',
                              opacity: resolvingAlternativeId === alt.id ? 0.7 : 1
                            }}
                          >
                            <CheckCircleIcon size={16} />
                            <span>{resolvingAlternativeId === alt.id ? 'Applying & Rebooking...' : 'Approve & Deploy This Alternative'}</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ background: '#f8fafc', borderRadius: '10px', border: '1px dashed #cbd5e1', padding: '36px 20px', textAlign: 'center' }}>
                      <p style={{ color: '#64748b', fontSize: '0.84rem', margin: '0 0 14px 0' }}>
                        No alternatives generated yet. Click above to trigger Nugen AI candidate generation.
                      </p>
                      <button
                        onClick={() => handleGenerateAlternatives(selectedDisruption)}
                        style={{
                          padding: '9px 18px',
                          borderRadius: '8px',
                          background: '#2563eb',
                          color: '#ffffff',
                          fontSize: '0.82rem',
                          fontWeight: 700,
                          border: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        Generate Ranked Solutions
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '48px 24px', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
              <AlertTriangleIcon size={32} style={{ color: '#cbd5e1', margin: '0 auto 12px' }} />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
                Select an incident from the feed
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.82rem' }}>
                Select any incident to inspect dependency graph conflicts and execute AI resolution.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
