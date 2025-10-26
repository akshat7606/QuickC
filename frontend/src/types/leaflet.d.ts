// Minimal ambient declaration for 'leaflet' to satisfy TypeScript during build in environments
// where `@types/leaflet` is not installed (e.g., CI or a lightweight deployment).
// This is intentionally permissive; for full type safety install `npm i -D @types/leaflet`.

declare global {
  // Provide a global namespace `L` with minimal types used by the project.
  namespace L {
    // Common Leaflet types used in the codebase
    type Map = any;
    type LayerGroup = any;
    type TileLayer = any;

    interface LatLng {
      lat: number;
      lng: number;
      // helper methods may be used by code; keep permissive
      toString?: () => string;
    }

    interface LeafletMouseEvent {
      latlng: LatLng;
      // keep permissive
      [key: string]: any;
    }
  }
}

declare module 'leaflet' {
  // Export a permissive module object so `import * as L from 'leaflet'` works.
  const L: any;
  export = L;
}

export {};
