'use client';

import Link from 'next/link';

const LIFECYCLE_STAGES = [
  { key: 'discover', label: '1. Discover', desc: 'Destinations & themes', href: '/discover' },
  { key: 'personalize', label: '2. Personalize', desc: 'Traveler style & pace', href: '/plan' },
  { key: 'plan', label: '3. Plan', desc: 'Constraint AI engine', href: '/itinerary/tour-goa-signature' },
  { key: 'price', label: '4. Price', desc: 'Transparent breakdown', href: '/itinerary/tour-goa-signature' },
  { key: 'book', label: '5. Book', desc: 'Instant confirmation', href: '/book/tour-goa-signature' },
  { key: 'prepare', label: '6. Prepare', desc: 'Vault & smart packing', href: '/trip/tour-goa-signature/prepare' },
  { key: 'operate', label: '7. On-Tour', desc: 'Live group dispatch & stays', href: '/trip/tour-goa-signature' },
  { key: 'assist', label: '8. Concierge', desc: 'Live in-trip AI assistant', href: '/trip/tour-goa-signature' },
  { key: 'complete', label: '9. Complete', desc: 'Milestones & badges', href: '/trip/tour-goa-signature/review' },
  { key: 'review', label: '10. Review', desc: 'Multi-vendor feedback', href: '/trip/tour-goa-signature/review' },
];

export default function TourLifecycleTracker({ currentStage = 'plan' }) {
  const currentIndex = LIFECYCLE_STAGES.findIndex(s => s.key === currentStage);

  return (
    <div style={{
      background: '#ffffff',
      borderBottom: '1px solid #e2e8f0',
      padding: '8px 16px',
      overflowX: 'auto',
      WebkitOverflowScrolling: 'touch',
      whiteSpace: 'nowrap',
      fontSize: '0.78rem',
      position: 'sticky',
      top: '64px',
      zIndex: 150,
      backdropFilter: 'blur(12px)',
      boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
    }}>
      <div style={{
        maxWidth: '1380px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        minWidth: 'max-content'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          paddingRight: '14px',
          borderRight: '1px solid #e2e8f0',
          color: '#64748b',
          fontWeight: 700,
          textTransform: 'uppercase',
          fontSize: '0.68rem',
          letterSpacing: '0.06em'
        }}>
          <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#2563eb' }} />
          Tour Lifecycle:
        </div>

        {LIFECYCLE_STAGES.map((stage, idx) => {
          const isActive = stage.key === currentStage;
          const isPassed = currentIndex > idx;

          return (
            <div key={stage.key} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Link
                href={stage.href}
                title={stage.desc}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '5px 13px',
                  borderRadius: '999px',
                  textDecoration: 'none',
                  fontSize: '0.75rem',
                  fontWeight: isActive ? 800 : (isPassed ? 700 : 500),
                  background: isActive
                    ? '#2563eb'
                    : (isPassed ? '#eff6ff' : '#f8fafc'),
                  color: isActive
                    ? '#ffffff'
                    : (isPassed ? '#2563eb' : '#64748b'),
                  border: isActive
                    ? '1px solid #2563eb'
                    : (isPassed ? '1px solid #bfdbfe' : '1px solid #e2e8f0'),
                  transition: 'all 0.15s ease',
                  boxShadow: isActive ? '0 2px 8px rgba(37, 99, 235, 0.25)' : 'none'
                }}
              >
                <span>{stage.label}</span>
                {isActive && (
                  <span style={{
                    width: '5px',
                    height: '5px',
                    borderRadius: '50%',
                    background: '#ffffff',
                    display: 'inline-block'
                  }} />
                )}
                {isPassed && (
                  <span style={{ fontSize: '0.7rem' }}>✓</span>
                )}
              </Link>

              {idx < LIFECYCLE_STAGES.length - 1 && (
                <span style={{ color: '#cbd5e1', fontSize: '0.7rem' }}>→</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
