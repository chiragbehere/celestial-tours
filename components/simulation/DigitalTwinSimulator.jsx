'use client';

import { useState, useMemo } from 'react';
import GeospatialMap from '@/components/map/GeospatialMap';
import { 
  LightningIcon, 
  AlertTriangleIcon, 
  ShieldCheckIcon, 
  ArrowRepeatIcon, 
  BroadcastIcon,
  CheckCircleIcon,
  CompassIcon,
  CarIcon,
  BedIcon,
  ActivityIcon
} from '@/components/ui/Icons';
import { DESTINATION_COORDINATES } from '@/lib/weather/service';

export default function DigitalTwinSimulator({ 
  initialDestination = 'Goa',
  onApplyDisruption = null 
}) {
  const [destination, setDestination] = useState(initialDestination);
  const [rainIntensity, setRainIntensity] = useState(48); // mm/h
  const [windSpeed, setWindSpeed] = useState(52); // km/h
  const [temperature, setTemperature] = useState(28); // °C
  const [durationHours, setDurationHours] = useState(4); // hours
  const [simulatedScenario, setSimulatedScenario] = useState('squall');
  const [isApplying, setIsApplying] = useState(false);
  const [appliedSuccess, setAppliedSuccess] = useState(false);

  // Preset Scenarios
  const applyPreset = (presetKey) => {
    setSimulatedScenario(presetKey);
    setAppliedSuccess(false);
    if (presetKey === 'squall') {
      setDestination('Goa');
      setRainIntensity(55);
      setWindSpeed(58);
      setTemperature(27);
      setDurationHours(5);
    } else if (presetKey === 'blizzard') {
      setDestination('Manali');
      setRainIntensity(35);
      setWindSpeed(48);
      setTemperature(-2);
      setDurationHours(6);
    } else if (presetKey === 'heatwave') {
      setDestination('Jaipur');
      setRainIntensity(0);
      setWindSpeed(18);
      setTemperature(44);
      setDurationHours(7);
    } else if (presetKey === 'clear') {
      setDestination('Goa');
      setRainIntensity(0);
      setWindSpeed(12);
      setTemperature(28);
      setDurationHours(0);
    }
  };

  // Digital Twin Calculations: Impact Propagation & Risk Scoring
  const simulationMetrics = useMemo(() => {
    // Impact radius calculation (in kilometers)
    const impactRadiusKm = Math.min(
      30,
      Math.max(2, Math.round(4 + (rainIntensity * 0.22) + (windSpeed * 0.16) + (durationHours * 0.5)))
    );

    // Operational Risk Score (0-100)
    let risk = 10;
    if (rainIntensity > 50 || windSpeed > 55 || temperature > 43 || temperature < -1) risk = 92;
    else if (rainIntensity > 30 || windSpeed > 38 || temperature > 39 || temperature < 4) risk = 70;
    else if (rainIntensity > 10 || windSpeed > 24) risk = 42;
    else if (rainIntensity > 2) risk = 20;

    // Entity Impact Analysis
    const affectedEntities = [];
    const safeEntities = [];

    if (destination === 'Goa') {
      if (rainIntensity > 25 || windSpeed > 32) {
        affectedEntities.push({
          id: 'act-goa-scuba',
          name: 'Grand Island Scuba Diving & Watersports',
          type: 'activity',
          category: 'Water Sports',
          reason: `Violates marine safety limit: Waves >3.2m due to ${windSpeed} km/h winds and ${rainIntensity} mm/h rain.`,
          vendor: 'Oceanic Blue Watersports Co.',
          refundRequired: true,
          estLoss: 14000
        });
      } else {
        safeEntities.push({ id: 'act-goa-scuba', name: 'Grand Island Scuba Diving', type: 'activity' });
      }

      if (rainIntensity > 40) {
        affectedEntities.push({
          id: 'tr-goa-cab',
          name: 'NH66 Chauffeur Fleet Transit',
          type: 'transport',
          category: 'Road Transit',
          reason: `Transit buffer required: Coastal roads experiencing minor waterlogging. Add +35m delay buffer.`,
          vendor: 'Goa Chauffeurs Union',
          refundRequired: false,
          estLoss: 0
        });
      } else {
        safeEntities.push({ id: 'tr-goa-cab', name: 'NH66 Chauffeur Fleet', type: 'transport' });
      }

      safeEntities.push(
        { id: 'ht-goa-taj', name: 'Taj Exotica Resort & Spa', type: 'stay', reason: 'Covered luxury pavilions & indoor spa operational' },
        { id: 'act-goa-spice', name: 'Sahakari Spice Plantation & Buffet', type: 'activity', reason: 'High ground inland microclimate, 100% sheltered' }
      );
    } else if (destination === 'Manali') {
      if (windSpeed > 25 || rainIntensity > 15 || temperature < 0) {
        affectedEntities.push({
          id: 'act-manali-1',
          name: 'Solang Valley Paragliding & High Flights',
          type: 'activity',
          category: 'Aerial Sports',
          reason: `High crosswinds (${windSpeed} km/h) & sub-zero icing exceed aerial permit limits.`,
          vendor: 'Himalayan Skywings',
          refundRequired: true,
          estLoss: 12800
        });
      }

      safeEntities.push(
        { id: 'ht-manali-1', name: 'The Himalayan Castle Resort', type: 'stay', reason: 'Central heating active' },
        { id: 'act-manali-3', name: 'Old Manali Apple Orchard Folk Session', type: 'activity', reason: 'Indoor wood-fired cafe' }
      );
    } else {
      // Jaipur / Other
      if (temperature > 41) {
        affectedEntities.push({
          id: 'act-jaipur-amber',
          name: 'Amber Fort Afternoon Walking Tour',
          type: 'activity',
          category: 'Outdoor Sightseeing',
          reason: `Severe heatwave (${temperature}°C). Shifting to air-conditioned museum and artisan block-printing.`,
          vendor: 'Heritage Heritage Guides',
          refundRequired: false,
          estLoss: 0
        });
      }

      safeEntities.push({ id: 'ht-jaipur-1', name: 'Rambagh Heritage Palace', type: 'stay', reason: 'Shaded courtyard' });
    }

    const totalLossINR = affectedEntities.reduce((sum, e) => sum + (e.estLoss || 0), 0);

    return {
      impactRadiusKm,
      risk,
      affectedEntities,
      safeEntities,
      totalLossINR,
      travelersAtRisk: affectedEntities.length > 0 ? 16 : 0
    };
  }, [destination, rainIntensity, windSpeed, temperature, durationHours]);

  // Execute Digital Twin Live Disruption Injection
  const handleApplyDisruption = async () => {
    setIsApplying(true);
    try {
      const disruptionPayload = {
        title: `${destination} Weather Disruption: ${simulationMetrics.risk > 75 ? 'Severe Squall Warning' : 'Moderate Weather Alert'}`,
        destination,
        severity: simulationMetrics.risk > 75 ? 'critical' : 'moderate',
        category: 'weather',
        weatherParams: {
          rainMm: rainIntensity,
          windKmH: windSpeed,
          temperature,
          durationHours
        },
        impactRadiusKm: simulationMetrics.impactRadiusKm,
        affectedActivity: simulationMetrics.affectedEntities[0]?.name || 'Coastal Watersports',
        recommendedAlternative: destination === 'Goa' ? 'Sahakari Spice Plantation & Heritage Lunch' : 'Old Manali Apple Orchard Folk Session',
        tour_plan_id: 'tour-goa-signature',
        description: `Digital Twin simulation detected severe weather threshold breach (${rainIntensity} mm/h rain, ${windSpeed} km/h wind). Water operations suspended by Coast Guard. AI recommends auto-swapping to verified inland alternatives.`
      };

      // Call API or callback
      if (onApplyDisruption) {
        await onApplyDisruption(disruptionPayload);
      }

      setAppliedSuccess(true);
      setTimeout(() => setAppliedSuccess(false), 5000);
    } catch (err) {
      console.error('Failed to inject disruption:', err);
    } finally {
      setIsApplying(false);
    }
  };

  const getRiskColor = (risk) => {
    if (risk > 75) return '#ef4444';
    if (risk > 40) return '#f59e0b';
    return '#10b981';
  };

  const getRiskLabel = (risk) => {
    if (risk > 75) return 'CRITICAL IMPACT';
    if (risk > 40) return 'MODERATE ADAPTATION';
    return 'SAFE / NORMAL';
  };

  return (
    <div style={{
      background: '#ffffff',
      borderRadius: '24px',
      border: '1px solid #e2e8f0',
      padding: '28px',
      boxShadow: '0 12px 40px rgba(15, 23, 42, 0.06)'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '22px', flexWrap: 'wrap', gap: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 20px rgba(14, 165, 233, 0.35)'
          }}>
            <LightningIcon size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Digital Twin: What-If Weather Simulator
              </h2>
              <span style={{
                background: '#eff6ff',
                color: '#2563eb',
                fontSize: '0.72rem',
                fontWeight: 800,
                padding: '3px 8px',
                borderRadius: '6px',
                border: '1px solid #bfdbfe'
              }}>
                Interactive Scenario Engine
              </span>
            </div>
            <p style={{ fontSize: '0.84rem', color: '#64748b', margin: '4px 0 0' }}>
              Simulate weather parameter shifts and inspect real-time system impact propagation, vendor alerts, and AI mitigation.
            </p>
          </div>
        </div>

        {/* Live Disruption Injection Button */}
        <button
          onClick={handleApplyDisruption}
          disabled={isApplying || simulationMetrics.affectedEntities.length === 0}
          style={{
            padding: '12px 24px',
            borderRadius: '999px',
            border: 'none',
            background: simulationMetrics.risk > 75 
              ? 'linear-gradient(135deg, #ef4444, #dc2626)' 
              : 'linear-gradient(135deg, #2563eb, #1d4ed8)',
            color: '#ffffff',
            fontWeight: 800,
            fontSize: '0.86rem',
            cursor: simulationMetrics.affectedEntities.length === 0 ? 'not-allowed' : 'pointer',
            opacity: simulationMetrics.affectedEntities.length === 0 ? 0.6 : 1,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 6px 20px rgba(0,0,0,0.18)',
            transition: 'all 0.2s ease'
          }}
        >
          {isApplying ? (
            <span>Synchronizing Digital Twin...</span>
          ) : appliedSuccess ? (
            <>
              <CheckCircleIcon size={16} />
              <span>Disruption Injected to Live Tours!</span>
            </>
          ) : (
            <>
              <BroadcastIcon size={16} />
              <span>Apply Scenario to Live Tours →</span>
            </>
          )}
        </button>
      </div>

      {/* Preset Scenario Selector Bar */}
      <div style={{
        background: '#f8fafc',
        borderRadius: '16px',
        padding: '14px 18px',
        border: '1px solid #e2e8f0',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#334155' }}>
            ⚡ Rapid Scenarios:
          </span>
          {[
            { id: 'squall', label: '🌧️ Monsoon Coastal Squall (Goa)' },
            { id: 'blizzard', label: '❄️ Himalayan Blizzard (Manali)' },
            { id: 'heatwave', label: '☀️ Desert Heatwave (Jaipur)' },
            { id: 'clear', label: '✨ Clear Skies (Safe)' }
          ].map(preset => (
            <button
              key={preset.id}
              onClick={() => applyPreset(preset.id)}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.76rem',
                fontWeight: 700,
                cursor: 'pointer',
                border: simulatedScenario === preset.id ? '2px solid #2563eb' : '1px solid #cbd5e1',
                background: simulatedScenario === preset.id ? '#eff6ff' : '#ffffff',
                color: simulatedScenario === preset.id ? '#1d4ed8' : '#475569',
                transition: 'all 0.15s ease'
              }}
            >
              {preset.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748b' }}>Destination Hub:</span>
          <select
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              fontSize: '0.82rem',
              fontWeight: 700,
              color: '#0f172a',
              background: '#ffffff',
              outline: 'none'
            }}
          >
            {Object.keys(DESTINATION_COORDINATES).map(dest => (
              <option key={dest} value={dest}>{dest}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Grid: Left Controls & Telemetry HUD | Right Geospatial Radar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 420px) 1fr', gap: '24px' }}>
        {/* Left Column: Interactive Weather Knobs & Propagation Telemetry */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Sliders Container */}
          <div style={{
            background: '#ffffff',
            borderRadius: '18px',
            border: '1px solid #e2e8f0',
            padding: '20px',
            boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)'
          }}>
            <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>Weather Parameter Knobs</span>
            </h4>

            {/* Rain Intensity */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '6px' }}>
                <span style={{ fontWeight: 700, color: '#334155' }}>Rainfall Intensity:</span>
                <span style={{ fontWeight: 800, color: rainIntensity > 35 ? '#dc2626' : '#2563eb' }}>
                  {rainIntensity} mm/h {rainIntensity > 50 ? '(Torrential)' : rainIntensity > 20 ? '(Moderate)' : '(Light)'}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={rainIntensity}
                onChange={(e) => { setRainIntensity(Number(e.target.value)); setAppliedSuccess(false); }}
                style={{ width: '100%', accentColor: '#2563eb' }}
              />
            </div>

            {/* Wind Gusts */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '6px' }}>
                <span style={{ fontWeight: 700, color: '#334155' }}>Wind Gust Speed:</span>
                <span style={{ fontWeight: 800, color: windSpeed > 40 ? '#dc2626' : '#0284c7' }}>
                  {windSpeed} km/h {windSpeed > 50 ? '(Gale/Squall)' : windSpeed > 25 ? '(Breezy)' : '(Calm)'}
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="100"
                value={windSpeed}
                onChange={(e) => { setWindSpeed(Number(e.target.value)); setAppliedSuccess(false); }}
                style={{ width: '100%', accentColor: '#0284c7' }}
              />
            </div>

            {/* Temperature */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '6px' }}>
                <span style={{ fontWeight: 700, color: '#334155' }}>Ambient Temperature:</span>
                <span style={{ fontWeight: 800, color: temperature > 38 || temperature < 2 ? '#b45309' : '#059669' }}>
                  {temperature}°C
                </span>
              </div>
              <input
                type="range"
                min="-5"
                max="48"
                value={temperature}
                onChange={(e) => { setTemperature(Number(e.target.value)); setAppliedSuccess(false); }}
                style={{ width: '100%', accentColor: '#f59e0b' }}
              />
            </div>

            {/* Duration */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '6px' }}>
                <span style={{ fontWeight: 700, color: '#334155' }}>Storm Duration:</span>
                <span style={{ fontWeight: 800, color: '#475569' }}>
                  {durationHours} Hours
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="12"
                value={durationHours}
                onChange={(e) => { setDurationHours(Number(e.target.value)); setAppliedSuccess(false); }}
                style={{ width: '100%', accentColor: '#64748b' }}
              />
            </div>
          </div>

          {/* Digital Twin Propagation Telemetry Card */}
          <div style={{
            background: '#0f172a',
            color: '#ffffff',
            borderRadius: '18px',
            padding: '20px',
            boxShadow: '0 8px 30px rgba(15, 23, 42, 0.25)',
            border: '1px solid rgba(255,255,255,0.08)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.76rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Digital Twin Impact Telemetry
              </span>
              <span style={{
                background: `${getRiskColor(simulationMetrics.risk)}25`,
                color: getRiskColor(simulationMetrics.risk),
                border: `1px solid ${getRiskColor(simulationMetrics.risk)}50`,
                fontSize: '0.68rem',
                fontWeight: 800,
                padding: '2px 8px',
                borderRadius: '6px'
              }}>
                {getRiskLabel(simulationMetrics.risk)}
              </span>
            </div>

            {/* Risk Gauge Bar */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', fontWeight: 800, marginBottom: '6px' }}>
                <span>Vulnerability Index:</span>
                <span style={{ color: getRiskColor(simulationMetrics.risk) }}>{simulationMetrics.risk}%</span>
              </div>
              <div style={{ height: '8px', background: 'rgba(255,255,255,0.15)', borderRadius: '999px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${simulationMetrics.risk}%`,
                  background: getRiskColor(simulationMetrics.risk),
                  borderRadius: '999px',
                  transition: 'width 0.3s ease'
                }} />
              </div>
            </div>

            {/* Quick Metrics Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
              <div style={{ background: 'rgba(255,255,255,0.06)', padding: '10px 12px', borderRadius: '12px' }}>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Impact Propagation</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#60a5fa' }}>
                  {simulationMetrics.impactRadiusKm} km Radius
                </div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.06)', padding: '10px 12px', borderRadius: '12px' }}>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Travelers at Risk</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: simulationMetrics.travelersAtRisk > 0 ? '#f87171' : '#34d399' }}>
                  {simulationMetrics.travelersAtRisk} Active
                </div>
              </div>
            </div>

            {/* AI Mitigation Recommendation */}
            <div style={{
              background: 'rgba(37, 99, 235, 0.15)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '12px',
              padding: '12px',
              fontSize: '0.8rem',
              lineHeight: 1.45
            }}>
              <div style={{ fontWeight: 800, color: '#93c5fd', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ArrowRepeatIcon size={14} />
                <span>AI Automated Mitigation Proposal:</span>
              </div>
              {simulationMetrics.affectedEntities.length > 0 ? (
                <span style={{ color: '#e2e8f0' }}>
                  Auto-flagged <b>{simulationMetrics.affectedEntities[0].name}</b> for suspension. Propose auto-rebooking to inland sheltered experience (<b>{destination === 'Goa' ? 'Sahakari Spice Plantation' : 'Indoor Cultural Pavilion'}</b>). Chauffeur route buffered by +30m.
                </span>
              ) : (
                <span style={{ color: '#86efac' }}>
                  No operational constraints violated. All outdoor activities, hotels, and transit routes operate on nominal schedule.
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Geospatial Radar & Impacted Entity Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Geospatial Map */}
          <GeospatialMap
            destination={destination}
            impactRadiusKm={simulationMetrics.impactRadiusKm}
            showRadar={true}
            showPropagation={true}
            weather={{
              current: {
                temperature,
                rain: rainIntensity,
                windSpeed,
                condition: rainIntensity > 40 ? 'Heavy Squall' : rainIntensity > 10 ? 'Rain Showers' : 'Partly Cloudy',
                riskScore: simulationMetrics.risk
              }
            }}
            height="380px"
          />

          {/* Impacted vs Safe Entities Matrix */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            {/* Disrupted / Affected */}
            <div style={{
              background: '#fef2f2',
              borderRadius: '16px',
              border: '1px solid #fecaca',
              padding: '16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                <span style={{ color: '#dc2626' }}><AlertTriangleIcon size={16} /></span>
                <span style={{ fontSize: '0.84rem', fontWeight: 800, color: '#991b1b' }}>
                  Threatened Entities ({simulationMetrics.affectedEntities.length})
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {simulationMetrics.affectedEntities.map(ent => (
                  <div key={ent.id} style={{ background: '#ffffff', borderRadius: '10px', padding: '10px', border: '1px solid #fee2e2' }}>
                    <div style={{ fontWeight: 800, fontSize: '0.84rem', color: '#0f172a' }}>{ent.name}</div>
                    <div style={{ fontSize: '0.74rem', color: '#dc2626', marginTop: '2px' }}>{ent.reason}</div>
                  </div>
                ))}
                {simulationMetrics.affectedEntities.length === 0 && (
                  <div style={{ fontSize: '0.78rem', color: '#15803d', padding: '8px 0' }}>
                    ✅ Zero entities impacted under current parameters.
                  </div>
                )}
              </div>
            </div>

            {/* Safe / Verified Havens */}
            <div style={{
              background: '#f0fdf4',
              borderRadius: '16px',
              border: '1px solid #bbf7d0',
              padding: '16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                <span style={{ color: '#16a34a' }}><ShieldCheckIcon size={16} /></span>
                <span style={{ fontSize: '0.84rem', fontWeight: 800, color: '#166534' }}>
                  Safe Alternative Havens ({simulationMetrics.safeEntities.length})
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {simulationMetrics.safeEntities.map(ent => (
                  <div key={ent.id} style={{ background: '#ffffff', borderRadius: '10px', padding: '10px', border: '1px solid #dcfce7' }}>
                    <div style={{ fontWeight: 800, fontSize: '0.84rem', color: '#0f172a' }}>{ent.name}</div>
                    <div style={{ fontSize: '0.74rem', color: '#16a34a', marginTop: '2px' }}>
                      {ent.reason || 'Operational • Weather Safe'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
