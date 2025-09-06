import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchScreen = () => {
  const navigate = useNavigate();
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!pickup) {
      alert('Please enter pickup location');
      return;
    }

    setLoading(true);
    try {
      // Mock coordinates for demo
      const searchData = {
        pickup_lat: 28.6139,
        pickup_lng: 77.2090,
        pickup_address: pickup,
        drop_lat: 28.5355,
        drop_lng: 77.3910,
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

      <div className="form-group">
        <label className="form-label">Pickup Location</label>
        <input
          type="text"
          className="form-input"
          placeholder="Enter pickup location"
          value={pickup}
          onChange={(e) => setPickup(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Destination (Optional)</label>
        <input
          type="text"
          className="form-input"
          placeholder="Where to?"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
        />
      </div>

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