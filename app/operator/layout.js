import OperatorSidebar from '@/components/layout/OperatorSidebar';

export const metadata = {
  title: 'Celestial Tours Operations | Dashboard',
  description: 'Manage tours, bookings, and alerts.'
};

export default function OperatorLayout({ children }) {
  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: '#f8fafc',
      color: '#0f172a',
      fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif"
    }}>
      {/* Sidebar Navigation */}
      <OperatorSidebar />

      {/* Main Workspace */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0,
        overflowX: 'hidden'
      }}>
        {/* Top Header — Clean Main Site Aesthetic */}
        <header style={{
          height: '68px',
          background: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 32px',
          flexShrink: 0,
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '999px',
              background: 'rgba(37, 99, 235, 0.08)',
              border: '1px solid rgba(37, 99, 235, 0.2)',
              fontSize: '0.75rem',
              fontWeight: 700,
              color: '#2563eb'
            }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
              OPERATIONS PORTAL
            </div>

            <span style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>|</span>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Active Hub:</span>
              <span style={{
                fontSize: '0.82rem',
                color: '#334155',
                background: '#f1f5f9',
                padding: '4px 12px',
                borderRadius: '6px',
                border: '1px solid #e2e8f0',
                fontWeight: 600
              }}>
                Pan-India Network (Goa • Manali • Jaipur • Munnar • Udaipur)
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 16px',
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: 600,
                color: '#334155',
                textDecoration: 'none',
                transition: 'all 0.2s',
                boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
              }}
            >
              <span>Traveler Site</span>
              <span>↗</span>
            </a>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0f172a' }}>
                Rajesh Varma
              </div>
              <div style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end' }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981' }} />
                Goa Operations Lead
              </div>
            </div>

            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #2563eb, #1e40af)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '0.88rem',
              color: '#ffffff',
              boxShadow: '0 3px 10px rgba(37, 99, 235, 0.25)'
            }}>
              RV
            </div>
          </div>
        </header>

        {/* Content View */}
        <main style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
