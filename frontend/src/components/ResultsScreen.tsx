import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Offer {
  driver_id: string;
  driver_name: string;
  vehicle_type: string;
  fare: number;
  eta_minutes: number;
  rating: number;
  phone: string;
}

const ResultsScreen = () => {
  const navigate = useNavigate();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [searchData, setSearchData] = useState(null);

  useEffect(() => {
    const results = sessionStorage.getItem('searchResults');
    const search = sessionStorage.getItem('searchData');
    
    if (results && search) {
      setOffers(JSON.parse(results).offers);
      setSearchData(JSON.parse(search));
    } else {
      navigate('/search');
    }
  }, [navigate]);

  const handleBooking = (offer: Offer) => {
    sessionStorage.setItem('selectedOffer', JSON.stringify(offer));
    navigate('/booking');
  };

  const getVehicleEmoji = (type: string) => {
    const emojis: { [key: string]: string } = {
      bike: '🏍️',
      auto: '🚗',
      sedan: '🚙',
      suv: '🚐'
    };
    return emojis[type] || '🚗';
  };

  return (
    <div className="screen">
      <div className="screen-header">
        <button 
          className="btn btn-secondary"
          onClick={() => navigate('/search')}
          style={{ padding: '8px 16px' }}
        >
          ← Back
        </button>
        <h1 className="screen-title">Available Rides</h1>
      </div>

      {offers.length === 0 ? (
        <div className="loading">
          <div className="spinner"></div>
        </div>
      ) : (
        <div>
          {offers.map((offer) => (
            <div key={offer.driver_id} className="card" onClick={() => handleBooking(offer)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ fontSize: '32px' }}>
                    {getVehicleEmoji(offer.vehicle_type)}
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '18px', color: '#1e3c72' }}>
                      {offer.driver_name}
                    </h3>
                    <p style={{ margin: '4px 0', color: '#6c757d', fontSize: '14px' }}>
                      {offer.vehicle_type.charAt(0).toUpperCase() + offer.vehicle_type.slice(1)} • ⭐ {offer.rating}
                    </p>
                    <p style={{ margin: 0, color: '#28a745', fontSize: '14px', fontWeight: '600' }}>
                      {offer.eta_minutes} min away
                    </p>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: '#1e3c72' }}>
                    ₹{offer.fare}
                  </div>
                  <button className="btn btn-primary" style={{ padding: '8px 16px', marginTop: '8px' }}>
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResultsScreen;