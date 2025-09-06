import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LocationInput from './LocationInput';
import LocationMap from './LocationMap';
import TrivagoBanner from './TrivagoBanner';
import ThreeStepProcess from './ThreeStepProcess';
import AppLayout from './AppLayout';
import OfflineNotification from './OfflineNotification';
import type { LocationSuggestion } from '../services/locationService';
import { useNetworkStatus } from '../hooks/useNetworkStatus';

const SearchScreen = () => {
  const navigate = useNavigate();
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [pickupLocation, setPickupLocation] = useState<LocationSuggestion | undefined>();
  const [destinationLocation, setDestinationLocation] = useState<LocationSuggestion | undefined>();
  const [loading, setLoading] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [mapFor, setMapFor] = useState<'pickup' | 'destination' | null>(null);
  const { isOnline, showOfflineNotification, dismissOfflineNotification, retryConnection } = useNetworkStatus();

  const handlePickupChange = (value: string, location?: LocationSuggestion) => {
    setPickup(value);
    setPickupLocation(location);
  };

  const handleDestinationChange = (value: string, location?: LocationSuggestion) => {
    setDestination(value);
    setDestinationLocation(location);
  };

  const handlePinLocation = (type: 'pickup' | 'destination') => {
    setMapFor(type);
    setShowMap(true);
  };

  const handleMapLocationSelect = (location: LocationSuggestion) => {
    if (mapFor === 'pickup') {
      setPickup(location.name);
      setPickupLocation(location);
    } else if (mapFor === 'destination') {
      setDestination(location.name);
      setDestinationLocation(location);
    }
    setShowMap(false);
    setMapFor(null);
  };

  // Use the function to avoid unused variable warning - remove this later when map integration is complete
  console.log('Map handler available:', handleMapLocationSelect);

  const handleSearch = async () => {
    if (!pickup) {
      alert('Please enter pickup location');
      return;
    }

    if (!isOnline) {
      alert('No internet connection. Please use the IVR system to book your ride by calling +91-9981910866');
      return;
    }

    setLoading(true);
    try {
      // Use actual coordinates if available, otherwise use defaults
      const searchData = {
        pickup_lat: pickupLocation?.lat || 28.6139,
        pickup_lng: pickupLocation?.lng || 77.2090,
        pickup_address: pickup,
        drop_lat: destinationLocation?.lat || 28.5355,
        drop_lng: destinationLocation?.lng || 77.3910,
        drop_address: destination
      };

      const response = await fetch('/api/v1/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(searchData)
      });

      if (response.ok) {
        const results = await response.json();
        sessionStorage.setItem('searchResults', JSON.stringify(results));
        sessionStorage.setItem('searchData', JSON.stringify(searchData));
        navigate('/results');
      } else {
        throw new Error('Search request failed');
      }
    } catch (error) {
      console.error('Search failed:', error);
      alert('Network error occurred. Please check your connection or use IVR booking: +91-9981910866');
    }
    setLoading(false);
  };

  const handleCallIVR = () => {
    window.location.href = 'tel:+919981910866';
  };

  return (
    <AppLayout title="CABA">
      <OfflineNotification 
        isVisible={showOfflineNotification}
        onDismiss={dismissOfflineNotification}
        onCallIVR={handleCallIVR}
        onRetry={retryConnection}
      />
      
      <div className="screen" style={{ paddingBottom: '20px' }}>
        {/* Find a Ride - Professional Section */}
        <div style={{
          background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
          color: 'white',
          padding: '32px 24px',
          borderRadius: '20px',
          margin: '24px 0',
          position: 'sticky',
          top: '60px',
          zIndex: 100,
          boxShadow: '0 16px 40px rgba(44,62,80,0.3)',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <h1 style={{ 
              margin: '0 0 8px 0', 
              fontSize: '28px', 
              fontWeight: '300',
              letterSpacing: '0.5px'
            }}>
              Compare & Book Rides
            </h1>
            <p style={{ 
              margin: 0, 
              fontSize: '14px', 
              opacity: 0.8,
              fontWeight: '300'
            }}>
              Get the best prices across all major ride-hailing platforms
            </p>
          </div>

          <div style={{ position: 'relative', marginBottom: '16px' }}>
            <LocationInput
              label="📍 From"
              placeholder="Enter pickup location"
              value={pickup}
              onChange={handlePickupChange}
              showCurrentLocation={true}
            />
            <button
              type="button"
              onClick={() => handlePinLocation('pickup')}
              style={{
                position: 'absolute',
                right: '8px',
                top: '32px',
                background: 'rgba(255,255,255,0.2)',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: '6px',
                padding: '6px 10px',
                fontSize: '11px',
                fontWeight: '500',
                cursor: 'pointer',
                zIndex: 10
              }}
            >
              📍 Pin
            </button>
          </div>

          <div style={{ position: 'relative', marginBottom: '20px' }}>
            <LocationInput
              label="🎯 To (Optional)"
              placeholder="Where to?"
              value={destination}
              onChange={handleDestinationChange}
            />
            <button
              type="button"
              onClick={() => handlePinLocation('destination')}
              style={{
                position: 'absolute',
                right: '8px',
                top: '32px',
                background: 'rgba(255,255,255,0.2)',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: '6px',
                padding: '6px 10px',
                fontSize: '11px',
                fontWeight: '500',
                cursor: 'pointer',
                zIndex: 10
              }}
            >
              📍 Pin
            </button>
          </div>

          <button 
            className="btn"
            onClick={handleSearch}
            disabled={loading}
            style={{ 
              width: '100%', 
              background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)',
              color: 'white',
              border: 'none',
              padding: '16px',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '500',
              marginTop: '16px',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(52,152,219,0.3)',
              cursor: loading ? 'default' : 'pointer'
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                (e.target as HTMLElement).style.transform = 'translateY(-2px)';
                (e.target as HTMLElement).style.boxShadow = '0 8px 25px rgba(52,152,219,0.4)';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                (e.target as HTMLElement).style.transform = 'translateY(0)';
                (e.target as HTMLElement).style.boxShadow = '0 4px 15px rgba(52,152,219,0.3)';
              }
            }}
          >
            {loading ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <div className="spinner" style={{ width: '20px', height: '20px' }}></div>
                <span>Searching...</span>
              </div>
            ) : (
              'Find Best Rides'
            )}
          </button>
        </div>

      {showMap && (
        <div style={{
          position: 'fixed',
          top: '0',
          left: '0',
          right: '0',
          bottom: '0',
          background: 'rgba(0,0,0,0.5)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            width: '100%',
            maxWidth: '500px',
            maxHeight: '80vh',
            overflow: 'hidden'
          }}>
            <div style={{
              padding: '16px',
              borderBottom: '1px solid #eee',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h3 style={{ margin: 0 }}>
                Pin {mapFor === 'pickup' ? 'Pickup' : 'Destination'} Location
              </h3>
              <button
                onClick={() => setShowMap(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer'
                }}
              >
                ×
              </button>
            </div>
            <LocationMap
              pickupLocation={pickupLocation}
              destinationLocation={destinationLocation}
              height="400px"
            />
          </div>
        </div>
      )}

        {/* Additional Features Section */}
        <div style={{ margin: '24px 0' }}>
          <div style={{ marginBottom: '20px', padding: '16px', background: '#e8f4f8', borderRadius: '12px' }}>
            <h3 style={{ margin: '0 0 8px 0', color: '#1e3c72', fontSize: '16px' }}>📞 Need help? Call us!</h3>
            <p style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#495057' }}>Book a ride via phone with our IVR system</p>
            <button
              onClick={handleCallIVR}
              style={{
                background: 'linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 20px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 3px 12px rgba(39,174,96,0.3)'
              }}
            >
              📞 Call +91-9981910866
            </button>
          </div>

          {/* Trivago-style banner - moved down */}
          <TrivagoBanner />
        </div>

        {/* Three-step process - moved to bottom */}
        <ThreeStepProcess />
      </div>
    </AppLayout>
  );
};

export default SearchScreen;