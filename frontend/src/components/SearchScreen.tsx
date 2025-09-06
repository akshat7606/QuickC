import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LocationInput from './LocationInput';
import LocationMap from './LocationMap';
import { LocationSuggestion } from '../services/locationService';

const SearchScreen = () => {
  const navigate = useNavigate();
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [pickupLocation, setPickupLocation] = useState<LocationSuggestion | undefined>();
  const [destinationLocation, setDestinationLocation] = useState<LocationSuggestion | undefined>();
  const [loading, setLoading] = useState(false);

  const handlePickupChange = (value: string, location?: LocationSuggestion) => {
    setPickup(value);
    setPickupLocation(location);
  };

  const handleDestinationChange = (value: string, location?: LocationSuggestion) => {
    setDestination(value);
    setDestinationLocation(location);
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
      <div className="screen-header">
        <h1 className="screen-title">Find a Ride</h1>
      </div>

      <LocationInput
        label="Pickup Location"
        placeholder="Enter pickup location"
        value={pickup}
        onChange={handlePickupChange}
        showCurrentLocation={true}
      />

      <LocationInput
        label="Destination (Optional)"
        placeholder="Where to?"
        value={destination}
        onChange={handleDestinationChange}
      />

      {(pickupLocation || destinationLocation) && (
        <LocationMap
          pickupLocation={pickupLocation}
          destinationLocation={destinationLocation}
          height="180px"
        />
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
    </div>
  );
};

export default SearchScreen;