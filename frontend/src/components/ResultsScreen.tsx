import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SortOptions from './SortOptions';
import VehicleSelector from './VehicleSelector';
import RideCard from './RideCard';
import type { RideOffer } from '../types/rides';

const ResultsScreen = () => {
  const navigate = useNavigate();
  const [allOffers, setAllOffers] = useState<RideOffer[]>([]);
  const [filteredOffers, setFilteredOffers] = useState<RideOffer[]>([]);
  const [selectedSort, setSelectedSort] = useState('price');
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [searchData, setSearchData] = useState(null);

  useEffect(() => {
    const results = sessionStorage.getItem('searchResults');
    const search = sessionStorage.getItem('searchData');
    
    if (results && search) {
      // Convert old format to new comprehensive format
      const oldOffers = JSON.parse(results).offers;
      const enhancedOffers = oldOffers.map((offer: any, index: number) => ({
        id: offer.driver_id,
        provider: getProviderForOffer(index),
        provider_logo: getProviderLogo(getProviderForOffer(index)),
        vehicle_type: mapVehicleType(offer.vehicle_type),
        vehicle_name: `${offer.vehicle_type.charAt(0).toUpperCase() + offer.vehicle_type.slice(1)}`,
        driver_name: offer.driver_name,
        rating: offer.rating,
        distance_km: Math.random() * 5 + 1, // Mock distance
        eta_minutes: offer.eta_minutes,
        base_fare: offer.fare,
        total_fare: Math.round(offer.fare * (0.9 + Math.random() * 0.3)), // Add some variance
        surge_multiplier: Math.random() > 0.7 ? 1.2 + Math.random() * 0.8 : undefined,
        deep_link: getDeepLink(getProviderForOffer(index), offer),
        booking_link: `https://${getProviderForOffer(index).toLowerCase()}.com/book`
      }));
      
      setAllOffers(enhancedOffers);
      setSearchData(JSON.parse(search));
    } else {
      navigate('/search');
    }
  }, [navigate]);

  // Update filtered offers when sort or vehicle filter changes
  useEffect(() => {
    let filtered = [...allOffers];
    
    // Filter by vehicle type
    if (selectedVehicle) {
      filtered = filtered.filter(offer => offer.vehicle_type === selectedVehicle);
    }
    
    // Sort offers
    filtered.sort((a, b) => {
      switch (selectedSort) {
        case 'price':
          return a.total_fare - b.total_fare;
        case 'distance':
          return a.distance_km - b.distance_km;
        case 'eta':
          return a.eta_minutes - b.eta_minutes;
        case 'rating':
          return b.rating - a.rating;
        default:
          return 0;
      }
    });
    
    setFilteredOffers(filtered);
  }, [allOffers, selectedSort, selectedVehicle]);

  const handleAppRedirect = (offer: RideOffer) => {
    // Analytics tracking could be added here
    window.open(offer.deep_link, '_blank');
  };

  const getProviderForOffer = (index: number): string => {
    const providers = ['Uber', 'Ola', 'Rapido', 'BluSmart', 'Namma Yatri'];
    return providers[index % providers.length];
  };

  const getProviderLogo = (provider: string): string => {
    const logos: { [key: string]: string } = {
      'Uber': 'https://logo.clearbit.com/uber.com',
      'Ola': 'https://logo.clearbit.com/olacabs.com',
      'Rapido': 'https://logo.clearbit.com/rapido.bike',
      'BluSmart': 'https://logo.clearbit.com/blu-smart.com',
      'Namma Yatri': 'https://logo.clearbit.com/nammayatri.in'
    };
    return logos[provider] || `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="%23007bff"><text x="12" y="16" text-anchor="middle" font-size="12" fill="white">${provider[0]}</text></svg>`;
  };

  const mapVehicleType = (oldType: string): 'bike' | 'auto' | 'economy' | 'sedan' | 'premium' | 'xl' => {
    const mapping: { [key: string]: 'bike' | 'auto' | 'economy' | 'sedan' | 'premium' | 'xl' } = {
      'bike': 'bike',
      'auto': 'auto',
      'sedan': 'sedan',
      'suv': 'xl',
      'car': 'economy'
    };
    return mapping[oldType] || 'economy';
  };

  const getDeepLink = (provider: string, offer: any): string => {
    const deepLinks: { [key: string]: string } = {
      'Uber': 'uber://',
      'Ola': 'ola://',
      'Rapido': 'rapido://',
      'BluSmart': 'https://blu-smart.com',
      'Namma Yatri': 'nammayatri://'
    };
    return deepLinks[provider] || '#';
  };

  return (
    <div className="screen" style={{ paddingBottom: '160px' }}>
      <div className="screen-header">
        <button 
          className="btn btn-secondary"
          onClick={() => navigate('/search')}
          style={{ padding: '8px 16px' }}
        >
          ← Back
        </button>
        <h1 className="screen-title">Compare Rides</h1>
      </div>

      {/* Results Summary */}
      <div style={{
        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
        padding: '16px',
        borderRadius: '12px',
        marginBottom: '16px',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '24px', fontWeight: '700', color: '#1e3c72', marginBottom: '4px' }}>
          {filteredOffers.length} Rides Available
        </div>
        <div style={{ fontSize: '14px', color: '#6c757d' }}>
          From {allOffers.reduce((acc, offer) => Math.min(acc, offer.total_fare), Infinity) || 0}₹ • 
          Fastest in {allOffers.reduce((acc, offer) => Math.min(acc, offer.eta_minutes), Infinity) || 0} min
        </div>
      </div>

      {/* Sort Options */}
      <SortOptions selectedSort={selectedSort} onSortChange={setSelectedSort} />

      {/* Ride Results */}
      {allOffers.length === 0 ? (
        <div className="loading">
          <div className="spinner"></div>
          <p>Finding best rides across all apps...</p>
        </div>
      ) : filteredOffers.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: '#6c757d' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚗</div>
          <h3>No rides found</h3>
          <p>Try selecting a different vehicle type or adjusting your filters.</p>
        </div>
      ) : (
        <div>
          {filteredOffers.map((offer) => (
            <RideCard 
              key={offer.id} 
              offer={offer} 
              onAppRedirect={handleAppRedirect}
            />
          ))}
        </div>
      )}

      {/* Vehicle Type Selector - Fixed at bottom */}
      <VehicleSelector 
        selectedVehicle={selectedVehicle} 
        onVehicleSelect={setSelectedVehicle}
      />
    </div>
  );
};

export default ResultsScreen;