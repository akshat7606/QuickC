import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SortOptions from './SortOptions';
import VehicleSelector from './VehicleSelector';
import RideCard from './RideCard';
import ComparisonSummary from './ComparisonSummary';
import AppLayout from './AppLayout';
import type { RideOffer } from '../types/rides';

const ResultsScreen = () => {
  const navigate = useNavigate();
  const [allOffers, setAllOffers] = useState<RideOffer[]>([]);
  const [filteredOffers, setFilteredOffers] = useState<RideOffer[]>([]);
  const [selectedSorts, setSelectedSorts] = useState(['price']);
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
    
    // Sort offers with recommended rides at top
    filtered.sort((a, b) => {
      // Priority 1: Recommended rides (best value rides) go first
      const aIsRecommended = isRecommendedRide(a);
      const bIsRecommended = isRecommendedRide(b);
      
      if (aIsRecommended && !bIsRecommended) return -1;
      if (!aIsRecommended && bIsRecommended) return 1;
      
      // Priority 2: Apply user-selected sorts
      if (selectedSorts.length > 0) {
        for (const sortType of selectedSorts) {
          let comparison = 0;
          switch (sortType) {
            case 'price':
              comparison = a.total_fare - b.total_fare;
              break;
            case 'distance':
              comparison = a.distance_km - b.distance_km;
              break;
            case 'eta':
              comparison = a.eta_minutes - b.eta_minutes;
              break;
            case 'rating':
              comparison = b.rating - a.rating;
              break;
          }
          if (comparison !== 0) return comparison;
        }
      }
      
      // Priority 3: Default to price if no sorts selected
      return a.total_fare - b.total_fare;
    });
    
    setFilteredOffers(filtered);
  }, [allOffers, selectedSorts, selectedVehicle]);

  // Determine if a ride is recommended (best value)
  const isRecommendedRide = (offer: RideOffer): boolean => {
    if (allOffers.length === 0) return false;
    
    // Calculate value score: rating/price ratio with ETA consideration
    const priceScore = 1 / (offer.total_fare / Math.min(...allOffers.map(o => o.total_fare)));
    const ratingScore = offer.rating / Math.max(...allOffers.map(o => o.rating));
    const etaScore = 1 / (offer.eta_minutes / Math.min(...allOffers.map(o => o.eta_minutes)));
    
    const valueScore = (priceScore * 0.4) + (ratingScore * 0.3) + (etaScore * 0.3);
    const avgValueScore = allOffers.reduce((sum, o) => {
      const pScore = 1 / (o.total_fare / Math.min(...allOffers.map(x => x.total_fare)));
      const rScore = o.rating / Math.max(...allOffers.map(x => x.rating));
      const eScore = 1 / (o.eta_minutes / Math.min(...allOffers.map(x => x.eta_minutes)));
      return sum + ((pScore * 0.4) + (rScore * 0.3) + (eScore * 0.3));
    }, 0) / allOffers.length;
    
    return valueScore > avgValueScore * 1.1; // Top 10% above average
  };

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
    // Real deep links for ride-hailing apps
    const deepLinks: { [key: string]: string } = {
      'Uber': 'https://m.uber.com/ul/',
      'Ola': 'https://book.olacabs.com/',
      'Rapido': 'https://rapido.bike/ride',
      'BluSmart': 'https://blu-smart.com/book',
      'Namma Yatri': 'https://nammayatri.in/book'
    };
    
    // If the app is installed, try app-specific URLs
    const appSchemes: { [key: string]: string } = {
      'Uber': 'uber://pickup',
      'Ola': 'ola://book',
      'Rapido': 'rapido://ride',
      'BluSmart': 'blusmart://book',
      'Namma Yatri': 'nammayatri://book'
    };

    // Return app scheme if available, otherwise web link
    return appSchemes[provider] || deepLinks[provider] || '#';
  };

  return (
    <AppLayout title="Compare Rides">
      <div className="screen" style={{ 
        paddingBottom: '100px', // Space for vehicle selector
        minHeight: 'calc(100vh - 140px)' // Full height minus header and footer
      }}>
        <div className="screen-header">
          <button 
            className="btn btn-secondary"
            onClick={() => navigate('/search')}
            style={{ padding: '8px 16px' }}
          >
            ← Back
          </button>
        </div>

      {/* Recommended Rides Section - At Top */}
      {filteredOffers.length > 0 && (
        <div style={{
          background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
          color: 'white',
          padding: '16px',
          borderRadius: '12px',
          margin: '16px 0',
          textAlign: 'center'
        }}>
          <h2 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: '700' }}>
            ⭐ Recommended Rides
          </h2>
          <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>
            Best value rides based on price, rating & ETA
          </p>
        </div>
      )}

      {/* Trivago-style Comparison Summary */}
      <ComparisonSummary offers={allOffers} filteredOffers={filteredOffers} />

      {/* Sort Options */}
      <SortOptions selectedSorts={selectedSorts} onSortChange={setSelectedSorts} />

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
          {filteredOffers.map((offer, index) => (
            <RideCard 
              key={offer.id} 
              offer={offer} 
              onAppRedirect={handleAppRedirect}
              isRecommended={isRecommendedRide(offer)}
              isTopChoice={index === 0}
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
    </AppLayout>
  );
};

export default ResultsScreen;