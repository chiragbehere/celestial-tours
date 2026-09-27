'use client';

import { useEffect, useRef, useState } from 'react';
import { 
  CompassIcon, 
  BedIcon, 
  CarIcon, 
  ActivityIcon, 
  AlertTriangleIcon, 
  ShieldCheckIcon,
  RefreshIcon,
  LightningIcon,
  BroadcastIcon
} from '@/components/ui/Icons';
import { DESTINATION_COORDINATES } from '@/lib/weather/service';

export const OPEN_SOURCE_MAP_PROVIDERS = {
  osm: {
    id: 'osm',
    name: 'OpenStreetMap (Standard)',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '© OpenStreetMap contributors',
    maxZoom: 19
  },
  voyager: {
    id: 'voyager',
    name: 'CartoDB Voyager (OSM Modern)',
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attribution: '© OpenStreetMap, © CARTO',
    maxZoom: 19
  },
  topo: {
    id: 'topo',
    name: 'OpenTopoMap (Topographic GIS)',
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: '© OpenTopoMap, © OpenStreetMap',
    maxZoom: 17
  },
  dark: {
    id: 'dark',
    name: 'CartoDB Dark Matter (Night GIS)',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '© OpenStreetMap, © CARTO',
    maxZoom: 19
  }
};

export default function GeospatialMap({
  destination = 'Goa',
  items = [],
  weather = null,
  impactRadiusKm = 10,
  showRadar = true,
  showPropagation = true,
  onNodeClick = null,
  height = '520px'
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const tileLayerRef = useRef(null);
  const layersRef = useRef({ markers: [], circles: [], routes: [] });

  const [mapProvider, setMapProvider] = useState('osm');
  const [activeLayer, setActiveLayer] = useState('all'); // 'all', 'stays', 'activities', 'radar'
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  const destCoords = DESTINATION_COORDINATES[destination] || DESTINATION_COORDINATES['Goa'];

  // Initialize Leaflet Map
  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      if (typeof window === 'undefined' || !mapContainerRef.current) return;

      // Dynamically load Leaflet
      const L = (await import('leaflet')).default;

      // Ensure Leaflet CSS is in head
      if (!document.getElementById('leaflet-css')) {
        const link = document.createElement('link');
        link.id = 'leaflet-css';
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }

      if (!isMounted) return;

      // If map already exists, remove it cleanly before re-centering
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      const map = L.map(mapContainerRef.current, {
        center: [destCoords.latitude, destCoords.longitude],
        zoom: 11,
        zoomControl: false,
        attributionControl: false
      });

      // Initialize with selected Open-Source Map Provider
      const provider = OPEN_SOURCE_MAP_PROVIDERS[mapProvider] || OPEN_SOURCE_MAP_PROVIDERS.osm;
      tileLayerRef.current = L.tileLayer(provider.url, {
        maxZoom: provider.maxZoom,
        attribution: provider.attribution,
        subdomains: provider.id.startsWith('voyager') || provider.id === 'dark' ? 'abcd' : 'abc'
      }).addTo(map);

      // Add Zoom control at top-right
      L.control.zoom({ position: 'topright' }).addTo(map);

      mapInstanceRef.current = map;
      setMapLoaded(true);

      renderEntitiesAndOverlays(L, map);
    }

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [destination]);

  // Handle Dynamic Open-Source Tile Layer Switch
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    import('leaflet').then(({ default: L }) => {
      if (tileLayerRef.current) {
        tileLayerRef.current.remove();
      }
      const provider = OPEN_SOURCE_MAP_PROVIDERS[mapProvider] || OPEN_SOURCE_MAP_PROVIDERS.osm;
      tileLayerRef.current = L.tileLayer(provider.url, {
        maxZoom: provider.maxZoom,
        attribution: provider.attribution,
        subdomains: provider.id.startsWith('voyager') || provider.id === 'dark' ? 'abcd' : 'abc'
      }).addTo(mapInstanceRef.current);
    });
  }, [mapProvider]);

  // Re-render markers and overlays when parameters update
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    import('leaflet').then(({ default: L }) => {
      renderEntitiesAndOverlays(L, mapInstanceRef.current);
    });
  }, [items, weather, impactRadiusKm, showRadar, showPropagation, activeLayer]);

  const renderEntitiesAndOverlays = (L, map) => {
    // Clear old layers
    layersRef.current.markers.forEach(m => m.remove());
    layersRef.current.circles.forEach(c => c.remove());
    layersRef.current.routes.forEach(r => r.remove());
    layersRef.current = { markers: [], circles: [], routes: [] };

    const centerLat = destCoords.latitude;
    const centerLon = destCoords.longitude;

    // 1. Simulated Impact Propagation Rings
    if (showPropagation && impactRadiusKm > 0) {
      // Danger Zone (Red circle: direct storm squall)
      const dangerRadiusM = (impactRadiusKm * 1000) * 0.5;
      const dangerCircle = L.circle([centerLat, centerLon], {
        color: '#ef4444',
        fillColor: '#ef4444',
        fillOpacity: 0.18,
        weight: 2,
        dashArray: '4, 4'
      }).addTo(map);

      // Warning Zone (Amber circle: moderate gust & wave surge)
      const warningRadiusM = impactRadiusKm * 1000;
      const warningCircle = L.circle([centerLat, centerLon], {
        color: '#f59e0b',
        fillColor: '#f59e0b',
        fillOpacity: 0.10,
        weight: 1.5
      }).addTo(map);

      // Safe Haven Buffer (Emerald ring: alternative sheltered hub)
      const safeCircle = L.circle([centerLat, centerLon], {
        radius: (impactRadiusKm * 1000) * 1.8,
        color: '#10b981',
        fillColor: '#10b981',
        fillOpacity: 0.04,
        weight: 1.5,
        dashArray: '6, 6'
      }).addTo(map);

      dangerCircle.bindTooltip(`<b>Storm Epicenter</b><br/>Rain: ${weather?.current?.rain || 45} mm/h`, { permanent: false, direction: 'top' });
      warningCircle.bindTooltip(`<b>Impact Propagation Zone</b><br/>Radius: ${impactRadiusKm} km`, { permanent: false, direction: 'top' });
      safeCircle.bindTooltip(`<b>Safe Relocation Zone</b><br/>Sheltered Heritage & Spices`, { permanent: false, direction: 'top' });

      layersRef.current.circles.push(dangerCircle, warningCircle, safeCircle);
    }

    // 2. Weather Radar Sweep Overlay
    if (showRadar && weather) {
      const radarIcon = L.divIcon({
        className: 'radar-sweep-icon',
        html: `
          <div style="position: relative; width: 64px; height: 64px; display: flex; align-items: center; justify-content: center;">
            <div style="position: absolute; inset: 0; border-radius: 999px; background: rgba(37, 99, 235, 0.2); animation: pulse 2s infinite;"></div>
            <div style="background: #1e293b; color: #fff; padding: 6px 12px; border-radius: 999px; font-size: 11px; font-weight: 800; border: 2px solid #3b82f6; box-shadow: 0 4px 15px rgba(0,0,0,0.3); display: flex; align-items: center; gap: 4px; white-space: nowrap; z-index: 10;">
              <span>🌧️ ${weather.current?.temperature || 28}°C</span>
              <span style="color: #60a5fa;">${weather.current?.condition || 'Storm'}</span>
            </div>
          </div>
        `,
        iconSize: [64, 64],
        iconAnchor: [32, 32]
      });

      const radarMarker = L.marker([centerLat + 0.02, centerLon - 0.02], { icon: radarIcon }).addTo(map);
      layersRef.current.markers.push(radarMarker);
    }

    // 3. Render Entity Markers (Hotels, Activities, Transit)
    // Default regional POIs if no custom items passed
    const regionalNodes = items.length > 0 ? items : [
      {
        id: 'node-stay-1',
        name: 'Taj Exotica Resort & Spa',
        type: 'stay',
        lat: centerLat - 0.05,
        lon: centerLon - 0.03,
        status: 'safe',
        price: '₹18,000/nt',
        notes: 'Luxury beachfront haven • Flood-proofed infrastructure'
      },
      {
        id: 'node-act-1',
        name: 'Grand Island Scuba & Watersports',
        type: 'activity',
        lat: centerLat + 0.04,
        lon: centerLon - 0.05,
        status: impactRadiusKm > 8 ? 'disrupted' : 'safe',
        price: '₹3,500',
        notes: impactRadiusKm > 8 ? 'RED-FLAGGED: Coast Guard wave advisory' : 'Operational'
      },
      {
        id: 'node-act-2',
        name: 'Sahakari Spice Plantation & Lunch',
        type: 'activity',
        lat: centerLat - 0.08,
        lon: centerLon + 0.09,
        status: 'safe',
        price: '₹1,200',
        notes: 'SAFE INLAND ALTERNATIVE • Covered pavilions'
      },
      {
        id: 'node-trans-1',
        name: 'NH66 Coastal Chauffeur Hub',
        type: 'transport',
        lat: centerLat,
        lon: centerLon,
        status: impactRadiusKm > 15 ? 'rerouted' : 'safe',
        price: '₹1,500',
        notes: 'Chauffeur fleet with live GPS transit tracking'
      }
    ];

    regionalNodes.forEach(node => {
      const isStay = node.type === 'stay' || node.item_type === 'stay';
      const isActivity = node.type === 'activity' || node.item_type === 'activity';
      const isTransport = node.type === 'transport' || node.item_type === 'transport';

      if (activeLayer === 'stays' && !isStay) return;
      if (activeLayer === 'activities' && !isActivity) return;

      const nodeLat = node.lat || (isStay ? centerLat - 0.04 : isActivity ? centerLat + 0.03 : centerLat);
      const nodeLon = node.lon || (isStay ? centerLon - 0.02 : isActivity ? centerLon + 0.02 : centerLon + 0.01);

      const isDisrupted = node.status === 'disrupted' || (isActivity && impactRadiusKm > 8 && node.name?.toLowerCase().includes('scuba'));
      const bg = isDisrupted ? '#ef4444' : isStay ? '#2563eb' : isActivity ? '#f59e0b' : '#10b981';
      const iconSymbol = isStay ? '🏨' : isActivity ? '🏄' : '🚗';

      const customIcon = L.divIcon({
        className: 'custom-geo-marker',
        html: `
          <div style="position: relative; cursor: pointer; transform: scale(${isDisrupted ? 1.15 : 1}); transition: transform 0.2s ease;">
            <div style="
              width: 38px;
              height: 38px;
              border-radius: 999px;
              background: ${bg};
              color: #ffffff;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 16px;
              box-shadow: 0 4px 14px ${isDisrupted ? 'rgba(239, 68, 68, 0.6)' : 'rgba(0,0,0,0.25)'};
              border: 2.5px solid #ffffff;
            ">
              ${iconSymbol}
            </div>
            ${isDisrupted ? `
              <div style="
                position: absolute;
                top: -6px;
                right: -6px;
                background: #b91c1c;
                color: #ffffff;
                border-radius: 999px;
                width: 18px;
                height: 18px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 10px;
                font-weight: 900;
                border: 1.5px solid #ffffff;
                animation: bounce 1s infinite;
              ">!</div>
            ` : ''}
          </div>
        `,
        iconSize: [38, 38],
        iconAnchor: [19, 19]
      });

      const marker = L.marker([nodeLat, nodeLon], { icon: customIcon }).addTo(map);

      marker.on('click', () => {
        setSelectedEntity(node);
        if (onNodeClick) onNodeClick(node);
      });

      marker.bindTooltip(`
        <div style="font-family: inherit; font-size: 12px;">
          <b>${node.name}</b><br/>
          <span style="color: ${isDisrupted ? '#ef4444' : '#2563eb'}; font-weight: 700;">
            ${isDisrupted ? '⚠️ High Weather Threat' : '✅ Operational'}
          </span>
          <br/>${node.price || ''}
        </div>
      `, { direction: 'top', offset: [0, -16] });

      layersRef.current.markers.push(marker);
    });

    // 4. Transit Route Vectors between hubs
    if (regionalNodes.length >= 2) {
      const latlngs = regionalNodes.map(n => [
        n.lat || centerLat,
        n.lon || centerLon
      ]);

      const routePolyline = L.polyline(latlngs, {
        color: impactRadiusKm > 12 ? '#f59e0b' : '#3b82f6',
        weight: 3,
        opacity: 0.65,
        dashArray: impactRadiusKm > 12 ? '8, 8' : undefined
      }).addTo(map);

      layersRef.current.routes.push(routePolyline);
    }
  };

  return (
    <div style={{
      position: 'relative',
      borderRadius: '24px',
      overflow: 'hidden',
      border: '1px solid #e2e8f0',
      boxShadow: '0 12px 36px rgba(15, 23, 42, 0.08)',
      background: '#f8fafc'
    }}>
      {/* Map Control Bar */}
      <div style={{
        position: 'absolute',
        top: '16px',
        left: '16px',
        zIndex: 500,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        background: 'rgba(255, 255, 255, 0.92)',
        backdropFilter: 'blur(10px)',
        padding: '6px 12px',
        borderRadius: '999px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
        border: '1px solid rgba(226, 232, 240, 0.8)'
      }}>
        <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <CompassIcon size={14} color="#2563eb" />
          <span>{destination} Geospatial Radar</span>
        </span>

        <div style={{ height: '14px', width: '1px', background: '#cbd5e1' }} />

        {/* Open-Source Tile Provider Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700 }}>Map Engine:</span>
          <select
            value={mapProvider}
            onChange={(e) => setMapProvider(e.target.value)}
            style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              padding: '3px 8px',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              background: '#f8fafc',
              color: '#0f172a',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            {Object.entries(OPEN_SOURCE_MAP_PROVIDERS).map(([key, prov]) => (
              <option key={key} value={key}>{prov.name}</option>
            ))}
          </select>
        </div>

        <div style={{ height: '14px', width: '1px', background: '#cbd5e1' }} />

        <div style={{ display: 'flex', gap: '4px' }}>
          {[
            { id: 'all', label: 'All Layers' },
            { id: 'stays', label: 'Hotels' },
            { id: 'activities', label: 'Activities' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveLayer(tab.id)}
              style={{
                border: 'none',
                background: activeLayer === tab.id ? '#2563eb' : 'transparent',
                color: activeLayer === tab.id ? '#ffffff' : '#64748b',
                padding: '4px 10px',
                borderRadius: '999px',
                fontSize: '0.72rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Open Source Map API Verified Badge */}
      <div style={{
        position: 'absolute',
        bottom: '16px',
        right: '16px',
        zIndex: 500,
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(8px)',
        padding: '6px 14px',
        borderRadius: '10px',
        fontSize: '0.72rem',
        fontWeight: 700,
        color: '#1e293b',
        border: '1px solid #cbd5e1',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        display: 'flex',
        alignItems: 'center',
        gap: '6px'
      }}>
        <span style={{ width: '8px', height: '8px', borderRadius: '999px', background: '#10b981', display: 'inline-block' }} />
        <span>Open-Source Map: <b>OpenStreetMap & Leaflet</b></span>
      </div>

      {/* Map Legend & Telemetry HUD */}
      <div style={{
        position: 'absolute',
        bottom: '16px',
        left: '16px',
        zIndex: 500,
        background: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(10px)',
        color: '#ffffff',
        padding: '10px 16px',
        borderRadius: '16px',
        fontSize: '0.75rem',
        boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
        border: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '999px', background: '#ef4444', display: 'inline-block' }} />
            <span>Danger Wavefront ({Math.round(impactRadiusKm * 0.5)} km)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '999px', background: '#f59e0b', display: 'inline-block' }} />
            <span>Caution Zone ({impactRadiusKm} km)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '999px', background: '#10b981', display: 'inline-block' }} />
            <span>Safe Inland Haven</span>
          </div>
        </div>
      </div>

      {/* Selected Entity Drawer Popup */}
      {selectedEntity && (
        <div style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          zIndex: 500,
          width: '280px',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(12px)',
          borderRadius: '18px',
          padding: '16px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
          border: '1px solid #e2e8f0',
          animation: 'fadeIn 0.2s ease'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
            <span style={{
              fontSize: '0.68rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              color: selectedEntity.status === 'disrupted' ? '#ef4444' : '#2563eb',
              background: selectedEntity.status === 'disrupted' ? '#fee2e2' : '#eff6ff',
              padding: '2px 8px',
              borderRadius: '6px'
            }}>
              {selectedEntity.type || 'Entity'}
            </span>
            <button
              onClick={() => setSelectedEntity(null)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: '1rem' }}
            >
              ✕
            </button>
          </div>

          <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', margin: '0 0 4px' }}>
            {selectedEntity.name}
          </h4>
          <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '0 0 10px', lineHeight: 1.4 }}>
            {selectedEntity.notes}
          </p>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px solid #f1f5f9' }}>
            <span style={{ fontWeight: 800, fontSize: '0.9rem', color: '#0f172a' }}>
              {selectedEntity.price || 'Included'}
            </span>
            <span style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              color: selectedEntity.status === 'disrupted' ? '#dc2626' : '#059669'
            }}>
              {selectedEntity.status === 'disrupted' ? 'Disrupted by Storm' : 'Verified Available'}
            </span>
          </div>
        </div>
      )}

      {/* Leaflet Map DOM Target */}
      <div ref={mapContainerRef} style={{ width: '100%', height, background: '#e2e8f0' }} />
    </div>
  );
}
