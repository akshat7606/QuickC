import { useEffect, useRef } from 'react';
import type { LocationSuggestion } from '../services/locationService';
import * as L from 'leaflet';
import { reverseGeocode as mapmyindiaReverseGeocode } from '../services/mapmyindiaService';

interface LocationMapProps {
  pickupLocation?: LocationSuggestion;
  destinationLocation?: LocationSuggestion;
  height?: string;
  onSelect?: (location: LocationSuggestion) => void; // called when user picks a point on the map
  visible?: boolean; // when used inside a modal, set to true when modal is open
}

const DEFAULT_CENTER = { lat: 28.6139, lng: 77.2090 };

const LocationMap = ({ pickupLocation, destinationLocation, height = '300px', onSelect, visible }: LocationMapProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const pickupLayerRef = useRef<L.LayerGroup | null>(null);
  const destLayerRef = useRef<L.LayerGroup | null>(null);
  const osmRef = useRef<L.TileLayer | null>(null);
  const esriRef = useRef<L.TileLayer | null>(null);

  // helper that attempts to refresh failed tiles by reassigning image src
  const refreshTiles = (force = false) => {
    const map = mapRef.current;
    if (!map) return;
    try {
      const container = map.getContainer();
      const tiles: NodeListOf<HTMLImageElement> = container.querySelectorAll('img.leaflet-tile');
      tiles.forEach((img) => {
        // If tile has not loaded (naturalWidth === 0) or if forced, try reloading
        if (force || img.naturalWidth === 0) {
          const src = img.getAttribute('src');
          if (src) {
            // small jitter to bypass some caches that return broken images
            const retrySrc = src.includes('?') ? `${src}&_=${Date.now()}` : `${src}?_=${Date.now()}`;
            // Assign back to the image to trigger reload
            img.src = retrySrc;
          }
        }
      });
    } catch (e) {
      // ignore
    }
  };

  useEffect(() => {
    if (!containerRef.current) return;

    console.debug('[LocationMap] initializing map, container rect:', containerRef.current.getBoundingClientRect());

    // NOTE: removed manual pixel-setting of the container width/height here.
    // Overwriting inline width/height from the layout can cause zero-size when the
    // component is mounted while hidden (for example inside a modal). The component
    // already applies the provided `height` prop on the wrapper div and we rely on
    // invalidateSize() after it becomes visible.

    // Initialize map
    const map = L.map(containerRef.current, { center: [DEFAULT_CENTER.lat, DEFAULT_CENTER.lng], zoom: 13 });
    mapRef.current = map;

    // Base layers with better options for reliability
    const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
      detectRetina: true,
      crossOrigin: true
    });
    const esri = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri',
      maxZoom: 19,
      detectRetina: true
    });

    osm.addTo(map);
    osmRef.current = osm;
    esriRef.current = esri;

    // Layer control
    const baseMaps: any = { 'OpenStreetMap': osm, 'Esri Satellite': esri };
    L.control.layers(baseMaps).addTo(map);

    // Tile error handling: try to reload failing tiles
    const onTileError = (err: any) => {
      try {
        const tile = err.tile as HTMLImageElement | undefined;
        if (tile) {
          console.warn('[LocationMap] tile error, retrying tile:', tile.src);
          // Try a short retry
          setTimeout(() => {
            try {
              const src = tile.getAttribute('src');
              if (src) {
                const retrySrc = src.includes('?') ? `${src}&_=${Date.now()}` : `${src}?_=${Date.now()}`;
                tile.src = retrySrc;
              }
            } catch (e) {
              // ignore
            }
          }, 500);
        }
      } catch (e) {
        // ignore
      }
    };

    // Attach tileerror handlers
    try {
      osm.on('tileerror', onTileError);
      esri.on('tileerror', onTileError);
    } catch (e) {
      // older leaflet builds may not support events this way — ignore
    }

    // Click handler
    const onMapClick = async (e: L.LeafletMouseEvent) => {
      if (!onSelect) return;
      const { lat, lng } = e.latlng;
      try {
        const addr = await mapmyindiaReverseGeocode(lat, lng);
        const location: LocationSuggestion = {
          id: `picked-${Date.now()}`,
          name: addr || `Picked Location`,
          description: addr || `Lat ${lat.toFixed(5)}, Lng ${lng.toFixed(5)}`,
          lat,
          lng
        };
        onSelect(location);
      } catch (err) {
        const location: LocationSuggestion = {
          id: `picked-${Date.now()}`,
          name: `Picked Location`,
          description: `Lat ${lat.toFixed(5)}, Lng ${lng.toFixed(5)}`,
          lat,
          lng
        };
        onSelect(location);
      }
    };

    map.on('click', onMapClick);

    // Initialize layer groups for markers
    pickupLayerRef.current = L.layerGroup().addTo(map);
    destLayerRef.current = L.layerGroup().addTo(map);

    // Ensure map invalidates size after it's shown (useful when the map is in a modal)
    // Also observe container resizes and invalidate when needed.
    const doInvalidate = () => {
      try {
        // use the stronger invalidation (force) so Leaflet recomputes sizes immediately
        map.invalidateSize(true);
        console.debug('[LocationMap] invalidateSize called');
      } catch (e) {
        // ignore
      }
    };

    // call once after a short delay to handle case when the container becomes visible after mount
    const t = window.setTimeout(() => {
      try {
        map.invalidateSize(true);
        // Force a tile redraw and attempt to refresh any previously failed tiles
        osm?.redraw && (osm as any).redraw();
        refreshTiles();
      } catch (e) {}
    }, 200);

    // ResizeObserver to handle CSS/layout changes (modal open, window resize, etc.)
    let ro: ResizeObserver | null = null;
    try {
      ro = new ResizeObserver(() => doInvalidate());
      ro.observe(containerRef.current);
    } catch (e) {
      // ResizeObserver not available or failed — fall back to window resize
      window.addEventListener('resize', doInvalidate);
    }

    // Listen for an explicit cross-component invalidate event
    const onQuickInvalidate = () => doInvalidate();
    window.addEventListener('quickc:map:invalidate', onQuickInvalidate as EventListener);

    // Listen for an explicit refresh request to force tile reloads/redraws
    const onQuickRefresh = () => {
      try {
        osm?.redraw && (osm as any).redraw();
        refreshTiles(true);
        map.invalidateSize(true);
      } catch (e) {}
    };
    window.addEventListener('quickc:map:refresh', onQuickRefresh as EventListener);

    // When map is ready, attempt a full refresh (handles initial hidden/modal cases)
    map.whenReady(() => {
      try {
        map.invalidateSize(true);
        osm?.redraw && (osm as any).redraw();
        refreshTiles(true);
      } catch (e) {}
    });

    return () => {
      try { osm.off('tileerror', onTileError); } catch (e) {}
      try { esri.off('tileerror', onTileError); } catch (e) {}
      map.off('click', onMapClick);
      map.remove();
      mapRef.current = null;
      window.clearTimeout(t);
      if (ro) {
        try { ro.disconnect(); } catch (e) {}
      } else {
        window.removeEventListener('resize', doInvalidate);
      }
      window.removeEventListener('quickc:map:invalidate', onQuickInvalidate as EventListener);
      window.removeEventListener('quickc:map:refresh', onQuickRefresh as EventListener);
    };
  }, []);

  // When parent makes the map visible (e.g. opens a modal), invalidate size and recenter/zoom
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    // Only act when visible becomes true
    if (!visible) return;

    let attempts = 0;
    const maxAttempts = 16; // try longer to handle slower modal animations
    const intervalMs = 300; // poll more slowly but more times
    const timer = window.setInterval(() => {
      attempts += 1;
      try { map.invalidateSize(true); console.debug('[LocationMap] visibility retry', attempts); } catch (e) {}

      // If we have a target, try to fly to it (smoothly). This will also help trigger tile load.
      if (pickupLocation) {
        try { map.flyTo([pickupLocation.lat, pickupLocation.lng], 13, { duration: 0.6 }); } catch (e) { try { map.setView([pickupLocation.lat, pickupLocation.lng], 13); } catch (e) {} }
      } else if (destinationLocation) {
        try { map.flyTo([destinationLocation.lat, destinationLocation.lng], 13, { duration: 0.6 }); } catch (e) { try { map.setView([destinationLocation.lat, destinationLocation.lng], 13); } catch (e) {} }
      }

      // Force tile redraw and retry any failed tiles during visibility retries
      try {
        osmRef.current && (osmRef.current as any).redraw && (osmRef.current as any).redraw();
        refreshTiles();
      } catch (e) {}

      const el = containerRef.current;
      if (el && el.clientWidth > 50 && el.clientHeight > 50) {
        // Probably laid out correctly — one final invalidate and stop.
        try { map.invalidateSize(true); } catch (e) {}
        // final refresh
        try { osmRef.current && (osmRef.current as any).redraw && (osmRef.current as any).redraw(); refreshTiles(true); } catch (e) {}
        window.clearInterval(timer);
      } else if (attempts >= maxAttempts) {
        window.clearInterval(timer);
      }
    }, intervalMs);

    return () => window.clearInterval(timer);
  }, [visible, pickupLocation, destinationLocation]);

  // Update pickup/destination markers
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // pickup
    if (pickupLayerRef.current) {
      pickupLayerRef.current.clearLayers();
      if (pickupLocation) {
        const c = L.circleMarker([pickupLocation.lat, pickupLocation.lng], { radius: 8, color: '#4CAF50', fillColor: '#4CAF50' });
        c.bindPopup(`<div style="font-weight:600">${pickupLocation.name}</div><div style="font-size:12px">${pickupLocation.description}</div>`);
        c.addTo(pickupLayerRef.current);
        // Ensure correct size then smoothly fly to the pickup location
        try {
          map.invalidateSize(true);
        } catch (e) {}
        try {
          map.flyTo([pickupLocation.lat, pickupLocation.lng], 13, { duration: 0.8 });
        } catch (e) {
          map.setView([pickupLocation.lat, pickupLocation.lng], 13);
        }
      }
    }

    // destination
    if (destLayerRef.current) {
      destLayerRef.current.clearLayers();
      if (destinationLocation) {
        const c = L.circleMarker([destinationLocation.lat, destinationLocation.lng], { radius: 8, color: '#F44336', fillColor: '#F44336' });
        c.bindPopup(`<div style="font-weight:600">${destinationLocation.name}</div><div style="font-size:12px">${destinationLocation.description}</div>`);
        c.addTo(destLayerRef.current);
        // Ensure correct size then smoothly fly to the destination location
        try {
          map.invalidateSize(true);
        } catch (e) {}
        try {
          map.flyTo([destinationLocation.lat, destinationLocation.lng], 13, { duration: 0.8 });
        } catch (e) {
          map.setView([destinationLocation.lat, destinationLocation.lng], 13);
        }
      }
    }
  }, [pickupLocation, destinationLocation]);

  return <div ref={containerRef} style={{ width: '100%', height, borderRadius: '12px', overflow: 'hidden', marginTop: '16px', display: 'block' }} />;
};

export default LocationMap;
