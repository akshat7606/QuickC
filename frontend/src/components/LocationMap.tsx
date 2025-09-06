import { useEffect, useState } from 'react';
import { LocationSuggestion } from '../services/locationService';

interface LocationMapProps {
  pickupLocation?: LocationSuggestion;
  destinationLocation?: LocationSuggestion;
  height?: string;
}

const LocationMap = ({ pickupLocation, destinationLocation, height = '200px' }: LocationMapProps) => {
  const [mapCenter, setMapCenter] = useState({ lat: 28.6139, lng: 77.2090 }); // Default to Delhi

  useEffect(() => {
    // Update map center when locations change
    if (pickupLocation) {
      setMapCenter({ lat: pickupLocation.lat, lng: pickupLocation.lng });
    } else if (destinationLocation) {
      setMapCenter({ lat: destinationLocation.lat, lng: destinationLocation.lng });
    }
  }, [pickupLocation, destinationLocation]);

  // Simple map visualization using CSS (in a real app, you'd use Google Maps or Mapbox)
  const getMarkerPosition = (location: LocationSuggestion) => {
    // Convert lat/lng to percentage position on the map container
    const mapBounds = {
      north: mapCenter.lat + 0.05,
      south: mapCenter.lat - 0.05,
      east: mapCenter.lng + 0.05,
      west: mapCenter.lng - 0.05
    };

    const x = ((location.lng - mapBounds.west) / (mapBounds.east - mapBounds.west)) * 100;
    const y = ((mapBounds.north - location.lat) / (mapBounds.north - mapBounds.south)) * 100;

    return { x: Math.max(5, Math.min(95, x)), y: Math.max(5, Math.min(95, y)) };
  };

  return (
    <div 
      style={{
        width: '100%',
        height,
        background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)',
        borderRadius: '12px',
        position: 'relative',
        overflow: 'hidden',
        border: '2px solid #e0e0e0',
        marginTop: '16px'
      }}
    >
      {/* Map grid pattern */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }}
      />

      {/* Roads/paths */}
      <div
        style={{
          position: 'absolute',
          top: '30%',
          left: '10%',
          right: '10%',
          height: '3px',
          backgroundColor: 'rgba(0,0,0,0.2)',
          borderRadius: '2px'
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '60%',
          left: '20%',
          right: '15%',
          height: '2px',
          backgroundColor: 'rgba(0,0,0,0.15)',
          borderRadius: '1px'
        }}
      />

      {/* Pickup location marker */}
      {pickupLocation && (
        <div
          style={{
            position: 'absolute',
            left: `${getMarkerPosition(pickupLocation).x}%`,
            top: `${getMarkerPosition(pickupLocation).y}%`,
            transform: 'translate(-50%, -50%)',
            zIndex: 10
          }}
        >
          <div
            style={{
              width: '30px',
              height: '30px',
              backgroundColor: '#4CAF50',
              borderRadius: '50% 50% 50% 0',
              transform: 'rotate(-45deg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '3px solid white',
              boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
              cursor: 'pointer'
            }}
            title={`Pickup: ${pickupLocation.name}`}
          >
            <span style={{ transform: 'rotate(45deg)', fontSize: '12px' }}>📍</span>
          </div>
          <div
            style={{
              position: 'absolute',
              top: '35px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(0,0,0,0.8)',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '10px',
              whiteSpace: 'nowrap',
              pointerEvents: 'none'
            }}
          >
            Pickup: {pickupLocation.name}
          </div>
        </div>
      )}

      {/* Destination location marker */}
      {destinationLocation && (
        <div
          style={{
            position: 'absolute',
            left: `${getMarkerPosition(destinationLocation).x}%`,
            top: `${getMarkerPosition(destinationLocation).y}%`,
            transform: 'translate(-50%, -50%)',
            zIndex: 10
          }}
        >
          <div
            style={{
              width: '30px',
              height: '30px',
              backgroundColor: '#F44336',
              borderRadius: '50% 50% 50% 0',
              transform: 'rotate(-45deg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '3px solid white',
              boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
              cursor: 'pointer'
            }}
            title={`Destination: ${destinationLocation.name}`}
          >
            <span style={{ transform: 'rotate(45deg)', fontSize: '12px' }}>🏁</span>
          </div>
          <div
            style={{
              position: 'absolute',
              top: '35px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(0,0,0,0.8)',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '10px',
              whiteSpace: 'nowrap',
              pointerEvents: 'none'
            }}
          >
            Drop: {destinationLocation.name}
          </div>
        </div>
      )}

      {/* Route line between pickup and destination */}
      {pickupLocation && destinationLocation && (
        <svg
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none'
          }}
        >
          <defs>
            <pattern id="dashed" patternUnits="userSpaceOnUse" width="8" height="2">
              <rect width="4" height="2" fill="#2196F3"/>
            </pattern>
          </defs>
          <line
            x1={`${getMarkerPosition(pickupLocation).x}%`}
            y1={`${getMarkerPosition(pickupLocation).y}%`}
            x2={`${getMarkerPosition(destinationLocation).x}%`}
            y2={`${getMarkerPosition(destinationLocation).y}%`}
            stroke="url(#dashed)"
            strokeWidth="3"
            strokeDasharray="8,4"
          />
        </svg>
      )}

      {/* Center indicator when no locations */}
      {!pickupLocation && !destinationLocation && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: '#666',
            fontSize: '24px'
          }}
        >
          🗺️
        </div>
      )}

      {/* Map controls */}
      <div
        style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          background: 'rgba(255,255,255,0.9)',
          borderRadius: '6px',
          padding: '4px',
          fontSize: '10px',
          color: '#666'
        }}
      >
        📍 Map View
      </div>
    </div>
  );
};

export default LocationMap;