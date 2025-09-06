import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LocationInput from './LocationInput';
import LocationMap from './LocationMap';
import TrivagoBanner from './TrivagoBanner';
import ThreeStepProcess from './ThreeStepProcess';
import type { LocationSuggestion } from '../services/locationService';

const SearchScreen = () => {
  const navigate = useNavigate();
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [pickupLocation, setPickupLocation] = useState<LocationSuggestion | undefined>();
  const [destinationLocation, setDestinationLocation] = useState<LocationSuggestion | undefined>();
  const [loading, setLoading] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [mapFor, setMapFor] = useState<'pickup' | 'destination' | null>(null);

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

  const handleSearch = async () => {
    if (!pickup) {
      alert('Please enter pickup location');
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
      }
    } catch (error) {
      console.error('Search failed:', error);
      alert('Search failed. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="screen">
      {/* Trivago-style banner */}
      <TrivagoBanner />

      <div className="screen-header">
        <h1 className="screen-title">Find a Ride</h1>
      </div>

      <div style={{ position: 'relative' }}>
        <LocationInput
          label="Pickup Location"
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
            background: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            padding: '8px 12px',
            fontSize: '12px',
            fontWeight: '500',
            cursor: 'pointer',
            zIndex: 10
          }}
        >
          📍 Pin Location
        </button>
      </div>

      <div style={{ position: 'relative' }}>
        <LocationInput
          label="Destination (Optional)"
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
            background: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            padding: '8px 12px',
            fontSize: '12px',
            fontWeight: '500',
            cursor: 'pointer',
            zIndex: 10
          }}
        >
          📍 Pin Location
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
              onLocationSelect={handleMapLocationSelect}
              interactive={true}
            />
          </div>
        </div>
      )}

      <button 
        className="btn btn-primary"
        onClick={handleSearch}
        disabled={loading}
        style={{ width: '100%', marginTop: '20px' }}
      >
        {loading ? (
          <div className="spinner" style={{ width: '20px', height: '20px' }}></div>
        ) : (
          'Search Rides'
        )}
      </button>

      <div style={{ marginTop: '40px', padding: '20px', background: '#f8f9fa', borderRadius: '12px' }}>
        <h3>📞 Need help? Call us!</h3>
        <p>Call <strong>+91-XXXX-XXXX</strong> to book a ride via phone</p>
      </div>

      {/* Three-step process */}
      <ThreeStepProcess />
    </div>
  );
};

export default SearchScreen;