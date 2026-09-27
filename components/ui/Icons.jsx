export function SearchIcon({ size = 18, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

export function PlaneIcon({ size = 20, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
    </svg>
  );
}

export function CheckCircleIcon({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

export function CalendarIcon({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

export function MapPinIcon({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

export function ClockIcon({ size = 14, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

export function BedIcon({ size = 18, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M2 4v16" />
      <path d="M2 8h18a2 2 0 0 1 2 2v10" />
      <path d="M2 17h20" />
      <path d="M6 8v9" />
    </svg>
  );
}

export function CarIcon({ size = 18, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
      <circle cx="7" cy="17" r="2" />
      <path d="M9 17h6" />
      <circle cx="17" cy="17" r="2" />
    </svg>
  );
}

export function CompassIcon({ size = 18, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  );
}

export function RefreshIcon({ size = 14, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="23 4 23 10 17 10" />
      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
    </svg>
  );
}

export function ShieldCheckIcon({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  );
}

export function AlertTriangleIcon({ size = 18, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

export function UsersIcon({ size = 18, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

export function LayoutDashboardIcon({ size = 18, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="7" height="9" x="3" y="3" rx="1" />
      <rect width="7" height="5" x="14" y="3" rx="1" />
      <rect width="7" height="9" x="14" y="12" rx="1" />
      <rect width="7" height="5" x="3" y="16" rx="1" />
    </svg>
  );
}

export function PackageIcon({ size = 18, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m16.5 9.4-9-5.19M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  );
}

export function CreditCardIcon({ size = 18, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="20" height="14" x="2" y="5" rx="2" />
      <line x1="2" y1="10" x2="22" y2="10" />
    </svg>
  );
}

export function ArrowRightIcon({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

export function XIcon({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

export function SparklesIcon({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor" className={className}>
      <path d="m8 0 1.669.864 1.858.282.842 1.68 1.337 1.32L13.293 6l.413 1.834-1.337 1.32-.842 1.68-1.858.282L8 12l-1.669-.864-1.858-.282-.842-1.68-1.337-1.32L2.707 6l-.413-1.834 1.337-1.32.842-1.68 1.858-.282L8 0z" opacity="0.3"/>
      <path d="M7.53 1.282a.5.5 0 0 1 .94 0l.478 1.306a7.488 7.488 0 0 0 4.464 4.464l1.306.478a.5.5 0 0 1 0 .94l-1.306.478a7.488 7.488 0 0 0-4.464 4.464l-.478 1.306a.5.5 0 0 1-.94 0l-.478-1.306a7.488 7.488 0 0 0-4.464-4.464L1.282 8.47a.5.5 0 0 1 0-.94l1.306-.478a7.488 7.488 0 0 0 4.464-4.464l.478-1.306z" />
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════════
   BOOTSTRAP ICONS — Genuine, Professional Vector Icons (No Emojis)
   ══════════════════════════════════════════════════════════════ */

// Star Fill (replaces ★ or ⭐)
export function StarFillIcon({ size = 14, className = "", color = "#f59e0b" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill={color} className={className} style={{ display: 'inline-block', verticalAlign: 'middle' }}>
      <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
    </svg>
  );
}

// Sun / Beach / Coastal (replaces 🏖️ or ☀️)
export function SunIcon({ size = 18, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor" className={className}>
      <path d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z"/>
    </svg>
  );
}

// Mountain (replaces 🏔️, Manali, hill-station)
export function MountainIcon({ size = 18, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor" className={className}>
      <path d="m8.5 2.5 5.5 11h-11l5.5-11zm0 2.236L4.736 12.5h7.528L8.5 4.736z"/>
      <path d="M7.75 6.5 6 10h3.5L8.25 6.5h-.5z"/>
    </svg>
  );
}

// Landmark / Palaces / Forts (replaces 🏰 or 🏛️)
export function LandmarkIcon({ size = 18, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor" className={className}>
      <path d="M8 .95 1 5v1h14V5L8 .95zM2 7v6h2V7H2zm3 0v6h2V7H5zm4 0v6h2V7H9zm3 0v6h2V7h-2zM1 14v2h14v-2H1z"/>
    </svg>
  );
}

// Trees / Nature / Backwaters (replaces 🌴)
export function TreesIcon({ size = 18, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor" className={className}>
      <path d="M8 0a.5.5 0 0 1 .416.223l3 4.5A.5.5 0 0 1 11 5.5h-.872l1.639 2.458A.5.5 0 0 1 11.35 8.8h-.804l1.83 2.744A.5.5 0 0 1 11.96 12.4H8.5v2.1a.5.5 0 0 1-1 0v-2.1H4.04a.5.5 0 0 1-.416-.856l1.83-2.744h-.804a.5.5 0 0 1-.416-.842L5.873 5.5H5a.5.5 0 0 1-.416-.777l3-4.5A.5.5 0 0 1 8 0z"/>
    </svg>
  );
}

// Flame / Spiritual (replaces 🕉️, Aarti, ghats)
export function FlameIcon({ size = 18, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor" className={className}>
      <path d="M8 16c3.314 0 6-2 6-5.5 0-1.5-.5-4-2.5-6 .25 1.5-1.25 2-1.25 2C11 4 9 .5 6 0c.357 2 .5 4-2 6-1.25 1-2 2.729-2 4.5C2 14 4.686 16 8 16Zm0-1c-1.657 0-3-1-3-2.75 0-.75.25-2 1.25-3C6.5 10 7 10.5 7 10.5c.5-1.5 1.5-2.5 2-3 .5 1 .5 2 0 3 1.5 0 2 1.25 2 2.25C11 14 9.657 15 8 15Z"/>
    </svg>
  );
}

// Water / Lake / Sailboat (replaces ⛵)
export function WaterIcon({ size = 18, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor" className={className}>
      <path d="M8.5 1.5v5h4l-4-5zm-1 0-4 5h4v-5zM1 8.5l1.5 4.5h11l1.5-4.5H1zm1.75 5.5a.5.5 0 0 1 .5.5 2 2 0 0 0 4 0 2 2 0 0 0 4 0 2 2 0 0 0 4 0 .5.5 0 0 1 1 0 3 3 0 0 1-6 0 3 3 0 0 1-6 0 3 3 0 0 1-1-.5.5.5 0 0 1 .5-.5z"/>
    </svg>
  );
}

// Heart Pulse / Wellness / Yoga (replaces 🧘)
export function HeartPulseIcon({ size = 18, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor" className={className}>
      <path fillRule="evenodd" d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"/>
    </svg>
  );
}

// Cup / Tea / Food (replaces 🍵 or 🍛)
export function CupHotIcon({ size = 18, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor" className={className}>
      <path d="M.5 13a.5.5 0 0 0 0 1h15a.5.5 0 0 0 0-1H.5zM2 5.5A2.5 2.5 0 0 1 4.5 3h6A2.5 2.5 0 0 1 13 5.5v4.5A2.5 2.5 0 0 1 10.5 12h-6A2.5 2.5 0 0 1 2 10V5.5zm11 1.5h1a1.5 1.5 0 0 0 1.5-1.5V5a1.5 1.5 0 0 0-1.5-1.5h-1V7z"/>
    </svg>
  );
}

// House / Homestay / Budget (replaces 🏡)
export function HouseDoorIcon({ size = 18, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor" className={className}>
      <path d="M8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4.5a.5.5 0 0 0 .5-.5v-4h2v4a.5.5 0 0 0 .5.5H14a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146zM2.5 14V7.707l5.5-5.5 5.5 5.5V14H10v-4a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1v4H2.5z"/>
    </svg>
  );
}

// Crown / Palace Luxury (replaces 👑 or 🏰)
export function CrownIcon({ size = 18, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor" className={className}>
      <path d="M14 12H2v1h12v-1zM2 4.5l3.5 3 2.5-4 2.5 4 3.5-3v6H2v-6zm1 1.625v3.875h10V6.125l-2.6 2.23-2.4-3.84-2.4 3.84L3 6.125z"/>
    </svg>
  );
}

// Lightning (replaces ⚡)
export function LightningIcon({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor" className={className}>
      <path d="M5.52.359A.5.5 0 0 1 6 0h4a.5.5 0 0 1 .474.658L8.694 6H12.5a.5.5 0 0 1 .395.807l-7 9a.5.5 0 0 1-.873-.454L6.82 9H3.5a.5.5 0 0 1-.48-.641l2.5-8z"/>
    </svg>
  );
}

// Sliders / Balanced (replaces ⚖️)
export function SlidersIcon({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor" className={className}>
      <path fillRule="evenodd" d="M11.5 2a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM9.05 3a2.5 2.5 0 0 1 4.9 0H16v1h-2.05a2.5 2.5 0 0 1-4.9 0H0V3h9.05zM4.5 7a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM2.05 8a2.5 2.5 0 0 1 4.9 0H16v1H6.95a2.5 2.5 0 0 1-4.9 0H0V8h2.05zm9.45 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm-2.45 1a2.5 2.5 0 0 1 4.9 0H16v1h-2.05a2.5 2.5 0 0 1-4.9 0H0v-1h9.05z"/>
    </svg>
  );
}

// Cloud Sun (replaces 🌤️)
export function CloudSunIcon({ size = 20, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor" className={className}>
      <path d="M11.473 11a4.5 4.5 0 0 0-8.72-.99A3 3 0 0 0 3 16h8.5a2.5 2.5 0 0 0 0-5h-.027z"/>
      <path d="M10.5 1.5a.5.5 0 0 0-1 0v1a.5.5 0 0 0 1 0v-1zm3.743 1.464a.5.5 0 1 0-.707-.707l-.708.707a.5.5 0 0 0 .708.708l.707-.708zm-7.778 0a.5.5 0 0 0-.708.707l.708.708a.5.5 0 0 0 .707-.708l-.707-.707zM14.5 6.5a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1h1z"/>
    </svg>
  );
}

// Trophy (replaces 🎉)
export function TrophyIcon({ size = 20, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor" className={className}>
      <path d="M2.5.5A.5.5 0 0 1 3 0h10a.5.5 0 0 1 .5.5c0 .538-.012 1.05-.034 1.536a3 3 0 1 1-1.133 5.89c-.79 1.865-1.878 2.774-3.333 3.03V13h2a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5h-6a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 1 .5-.5h2v-2.044c-1.455-.256-2.543-1.165-3.333-3.03a3 3 0 1 1-1.133-5.89A33.437 33.437 0 0 1 2.5.5zm.748 2.052A1.996 1.996 0 0 0 3 3.5a2 2 0 0 0 1.998 1.998c.032-.515.08-1.043.14-1.579A31.626 31.626 0 0 1 3.248 2.552zm9.504 0a31.625 31.625 0 0 1-.89 1.367c.06.536.108 1.064.14 1.579A2 2 0 0 0 13 3.5c0-.36-.096-.698-.248-.948zM4 14v1h8v-1H4z"/>
    </svg>
  );
}

// Utensils / Dining (replaces 🍛)
export function UtensilsIcon({ size = 18, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor" className={className}>
      <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h.5a1.5 1.5 0 0 1 1.5 1.5v4.25a.75.75 0 0 1-.75.75H2.25a.75.75 0 0 1-.75-.75V2.5zM2 10.5V15a.5.5 0 0 0 1 0v-4.5H2zM13 1a.5.5 0 0 0-.5.5v5.75a1.75 1.75 0 0 0 1 1.6V15a.5.5 0 0 0 1 0V8.85a1.75 1.75 0 0 0 1-1.6V1.5a.5.5 0 0 0-.5-.5h-2z"/>
    </svg>
  );
}

// Camera (replaces 📷)
export function CameraIcon({ size = 18, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor" className={className}>
      <path d="M15 12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h1.172a3 3 0 0 0 2.12-.879l.83-.828A1 1 0 0 1 6.829 3h2.342a1 1 0 0 1 .707.293l.828.828A3 3 0 0 0 12.828 5H14a1 1 0 0 1 1 1v6zM2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4H2z"/>
      <path d="M8 11a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zm0 1a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7z"/>
    </svg>
  );
}

// Moon Stars / Nightlife (replaces ✨, 🌙)
export function MoonStarsIcon({ size = 18, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor" className={className}>
      <path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278z"/>
      <path d="M10.794 3.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387a1.734 1.734 0 0 0-1.097 1.097l-.387 1.162a.217.217 0 0 1-.412 0l-.387-1.162A1.734 1.734 0 0 0 9.31 6.594l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387a1.734 1.734 0 0 0 1.097-1.097l.387-1.162z"/>
    </svg>
  );
}

// Activity / Trekking / Adventure (replaces 🧗, 🏄)
export function ActivityIcon({ size = 18, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor" className={className}>
      <path fillRule="evenodd" d="M6 2a.5.5 0 0 1 .47.33L10 9.5l1.53-3.06A.5.5 0 0 1 12 6h3.5a.5.5 0 0 1 0 1h-3.16l-1.8 3.6a.5.5 0 0 1-.89 0L6 4.27 4.35 7.57A.5.5 0 0 1 3.9 7.89H.5a.5.5 0 0 1 0-1h3.07L5.53 2.33A.5.5 0 0 1 6 2z"/>
    </svg>
  );
}

// Car Front (replaces 🚗)
export function CarFrontIcon({ size = 18, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor" className={className}>
      <path d="M4 9a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm10 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM6 8a1 1 0 0 0 0 2h4a1 1 0 1 0 0-2H6z"/>
      <path d="M2.52 3.515A2.5 2.5 0 0 1 4.82 2h6.362c1 0 1.904.596 2.298 1.515l.792 1.848c.075.175.21.319.38.404.5.25.85.76.85 1.35v4.883c0 .605-.44 1.108-1.042 1.196L14 13.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1H4v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1l-.398-.058A1.205 1.205 0 0 1 1 11.999V7.117c0-.59.35-1.099.85-1.35.17-.085.304-.228.38-.403l.79-1.849zM4.82 3a1.5 1.5 0 0 0-1.379.91L2.73 5.5h10.54l-.711-1.59A1.5 1.5 0 0 0 11.18 3H4.82zM2 7.117v4.883a.206.206 0 0 0 .178.204l.43.063c.206.03.392-.128.392-.337V10a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v1.93c0 .21.186.368.392.337l.43-.063a.206.206 0 0 0 .178-.204V7.117a.406.406 0 0 0-.28-.387l-.46-.23H2.74l-.46.23a.406.406 0 0 0-.28.387z"/>
    </svg>
  );
}

// Bicycle / Scooter (replaces 🛵)
export function BicycleIcon({ size = 18, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor" className={className}>
      <path d="M4 4.5a.5.5 0 0 1 .5-.5H6a.5.5 0 0 1 0 1h-.5v.5h4v-.5H9a.5.5 0 0 1 0-1h1.5a.5.5 0 0 1 0 1H10v.5l2.25 4.5h.75a.5.5 0 0 1 0 1h-1.25a.5.5 0 0 1-.447-.276L9.62 7.5H6.38L4.697 10.87A.5.5 0 0 1 4.25 11.125H3a.5.5 0 0 1 0-1h.972L5.5 7.5H5a.5.5 0 0 1-.5-.5V5h-.5a.5.5 0 0 1-.5-.5z"/>
      <circle cx="3.5" cy="11.5" r="2.5"/>
      <circle cx="12.5" cy="11.5" r="2.5"/>
    </svg>
  );
}

// Train Front (replaces 🚂)
export function TrainFrontIcon({ size = 18, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor" className={className}>
      <path d="M10.665.545A1.75 1.75 0 0 0 8.95 0H7.05a1.75 1.75 0 0 0-1.716.545L4 2.5V13a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V2.5l-1.335-1.955zM5 3.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5h-5a.5.5 0 0 1-.5-.5v-2zM6 10a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm6 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-7 3.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z"/>
    </svg>
  );
}

// Robot / AI Engine (replaces 🤖)
export function RobotIcon({ size = 18, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor" className={className}>
      <path d="M6 12.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5ZM3 8.062C3 6.76 4.235 5.765 5.53 5.881l.54.048.22-.507a2.5 2.5 0 0 1 4.42 0l.22.507.54-.048C12.765 5.765 14 6.76 14 8.062v1.157a3.23 3.23 0 0 1-.65 1.948A3.003 3.003 0 0 1 12 13.5v.5H4v-.5c0-.68.23-1.314.65-1.833A3.23 3.23 0 0 1 3 9.22V8.062Zm2 .438a1 1 0 1 0 2 0 1 1 0 0 0-2 0Zm5 0a1 1 0 1 0 2 0 1 1 0 0 0-2 0Z"/>
    </svg>
  );
}

// Arrow Repeat / Disruption Fix (replaces 🔁)
export function ArrowRepeatIcon({ size = 18, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor" className={className}>
      <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z"/>
      <path fillRule="evenodd" d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"/>
    </svg>
  );
}

// Broadcast / Sync (replaces 📡)
export function BroadcastIcon({ size = 18, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor" className={className}>
      <path d="M3.05 3.05a7 7 0 0 0 0 9.9.5.5 0 0 1-.707.707 8 8 0 0 1 0-11.314.5.5 0 0 1 .707.707zm2.122 2.122a4 4 0 0 0 0 5.656.5.5 0 1 1-.708.708 5 5 0 0 1 0-7.072.5.5 0 0 1 .708.708zm5.656-.708a.5.5 0 0 1 .708 0 5 5 0 0 1 0 7.072.5.5 0 1 1-.708-.708 4 4 0 0 0 0-5.656.5.5 0 0 1 0-.708zm2.122-2.12a.5.5 0 0 1 .707 0 8 8 0 0 1 0 11.313.5.5 0 0 1-.707-.707 7 7 0 0 0 0-9.9.5.5 0 0 1 0-.707zM10 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0z"/>
    </svg>
  );
}

// Building / Enterprise (replaces 🏢)
export function BuildingIcon({ size = 18, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor" className={className}>
      <path d="M4 2.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1Zm3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1Zm3.5-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1ZM4 5.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1Zm3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1Zm3.5-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1ZM4 8.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1Zm3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1Zm3.5-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1Z"/>
      <path d="M2 1a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V1Zm11 0H3v14h3v-2.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5V15h3V1Z"/>
    </svg>
  );
}

// Suitcase / Luggage (replaces 🧳)
export function SuitcaseIcon({ size = 18, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor" className={className}>
      <path d="M5 2V0h6v2h4.5A1.5 1.5 0 0 1 17 3.5v9a1.5 1.5 0 0 1-1.5 1.5H.5A1.5 1.5 0 0 1-1 12.5v-9A1.5 1.5 0 0 1 .5 2H5ZM6 1v1h4V1H6ZM1 3.5v9a.5.5 0 0 0 .5.5h14a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5H.5a.5.5 0 0 0-.5.5Z"/>
    </svg>
  );
}

// Backpack / Pre-Trip (replaces 🎒)
export function BackpackIcon({ size = 18, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor" className={className}>
      <path d="M4.04 7.43A4 4 0 0 1 8 4a4 4 0 0 1 3.96 3.43L12 14H4l.04-6.57ZM8 2a6 6 0 0 0-5.92 5.03L2 14v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-1l-.08-6.97A6 6 0 0 0 8 2Z"/>
      <path d="M6 10a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-1Z"/>
    </svg>
  );
}

// Telephone / Call (replaces 📞)
export function TelephoneIcon({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor" className={className}>
      <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.568 17.568 0 0 0 4.168 6.608 17.569 17.569 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.678.678 0 0 0-.58-.122l-2.19.547a1.745 1.745 0 0 1-1.657-.459L5.482 8.062a1.745 1.745 0 0 1-.46-1.657l.548-2.19a.678.678 0 0 0-.122-.58L3.654 1.328zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z"/>
    </svg>
  );
}

// Chat Dots (replaces 💬)
export function ChatDotsIcon({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor" className={className}>
      <path d="M5 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
      <path d="m2.165 15.803.02-.004c1.83-.363 2.948-.842 3.468-1.105A9.06 9.06 0 0 0 8 15c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7c0 1.76.743 3.37 1.97 4.6a10.437 10.437 0 0 1-.524 2.318l-.003.011a10.722 10.722 0 0 1-.244.637c-.079.186.074.394.273.362a21.673 21.673 0 0 0 .693-.125zm.843-3.408a8.04 8.04 0 0 1-1.008-3.395C2 5.567 5.093 3 8 3s6 2.567 6 6-2.907 6-6 6c-.848 0-1.656-.207-2.373-.578l-.348-.18-.382.164a8.293 8.293 0 0 1-1.889.518c.105-.444.24-.875.405-1.289l.135-.345-.145-.341z"/>
    </svg>
  );
}

// Lightbulb / Insight (replaces 💡)
export function LightbulbIcon({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor" className={className}>
      <path d="M2 6a6 6 0 1 1 10.174 4.31c-.203.196-.359.4-.453.619l-.762 1.769A.5.5 0 0 1 10.5 13a.5.5 0 0 1 0 1 .5.5 0 0 1 0 1l-.224.447a1 1 0 0 1-.894.553H6.618a1 1 0 0 1-.894-.553L5.5 15a.5.5 0 0 1 0-1 .5.5 0 0 1 0-1 .5.5 0 0 1-.46-.302l-.761-1.77a1.964 1.964 0 0 0-.453-.618A5.984 5.984 0 0 1 2 6zm6-5a5 5 0 0 0-3.479 8.592c.263.254.514.564.676.941L5.83 12h4.342l.632-1.467c.162-.377.413-.687.676-.941A5 5 0 0 0 8 1z"/>
    </svg>
  );
}



