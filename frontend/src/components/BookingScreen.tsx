import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const BookingScreen = () => {
  const navigate = useNavigate();
  const [offer, setOffer] = useState<any>(null);
  const [phone, setPhone] = useState('');
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    const selectedOffer = sessionStorage.getItem('selectedOffer');
    const searchData = sessionStorage.getItem('searchData');
    
    if (selectedOffer && searchData) {
      setOffer(JSON.parse(selectedOffer));
    } else {
      navigate('/search');
    }
  }, [navigate]);

  const handleBooking = async () => {
    if (!phone) {
      alert('Please enter your phone number');
      return;
    }

    setBooking(true);
    try {
      const searchData = JSON.parse(sessionStorage.getItem('searchData') || '{}');
      const bookingData = {
        phone,
        ...searchData,
        driver_id: offer.driver_id,
        fare: offer.fare
      };

      const response = await fetch('/api/v1/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });

      if (response.ok) {
        const result = await response.json();
        alert(`Booking confirmed! ID: ${result.booking_id}`);
        navigate('/history');
      }
    } catch (error) {
      console.error('Booking failed:', error);
      alert('Booking failed. Please try again.');
    }
    setBooking(false);
  };

  if (!offer) return <div className="loading"><div className="spinner"></div></div>;

  return (
    <div className="screen">
      <div className="screen-header">
        <button 
          className="btn btn-secondary"
          onClick={() => navigate('/results')}
          style={{ padding: '8px 16px' }}
        >
          ← Back
        </button>
        <h1 className="screen-title">Confirm Booking</h1>
      </div>

      <div className="card">
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{ fontSize: '48px', marginBottom: '10px' }}>
            {offer.vehicle_type === 'bike' ? '🏍️' : offer.vehicle_type === 'auto' ? '🚗' : '🚙'}
          </div>
          <h2 style={{ color: '#1e3c72', margin: 0 }}>{offer.driver_name}</h2>
          <p style={{ color: '#6c757d', margin: '4px 0' }}>
            {offer.vehicle_type.charAt(0).toUpperCase() + offer.vehicle_type.slice(1)} • ⭐ {offer.rating}
          </p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <strong>ETA:</strong> {offer.eta_minutes} minutes
          </div>
          <div>
            <strong>Phone:</strong> {offer.phone}
          </div>
        </div>

        <div style={{ textAlign: 'center', padding: '20px', background: '#f8f9fa', borderRadius: '12px' }}>
          <div style={{ fontSize: '32px', fontWeight: '700', color: '#1e3c72' }}>
            ₹{offer.fare}
          </div>
          <p style={{ margin: 0, color: '#6c757d' }}>Total Fare</p>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Your Phone Number</label>
        <input
          type="tel"
          className="form-input"
          placeholder="+91 XXXXX XXXXX"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>

      <button 
        className="btn btn-primary"
        onClick={handleBooking}
        disabled={booking}
        style={{ width: '100%', marginTop: '20px' }}
      >
        {booking ? 'Booking...' : `Confirm Booking - ₹${offer.fare}`}
      </button>
    </div>
  );
};

export default BookingScreen;