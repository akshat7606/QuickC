import type { RideOffer } from '../types/rides';

interface ComparisonSummaryProps {
  offers: RideOffer[];
  filteredOffers: RideOffer[];
}

const ComparisonSummary = ({ offers, filteredOffers }: ComparisonSummaryProps) => {
  const getLowestPrice = () => {
    if (offers.length === 0) return 0;
    return Math.min(...offers.map(offer => offer.total_fare));
  };

  const getHighestPrice = () => {
    if (offers.length === 0) return 0;
    return Math.max(...offers.map(offer => offer.total_fare));
  };

  const getFastestETA = () => {
    if (offers.length === 0) return 0;
    return Math.min(...offers.map(offer => offer.eta_minutes));
  };

  const getProviderCount = () => {
    return new Set(offers.map(offer => offer.provider)).size;
  };

  const getSavingsPercentage = () => {
    const lowest = getLowestPrice();
    const highest = getHighestPrice();
    if (highest === 0) return 0;
    return Math.round(((highest - lowest) / highest) * 100);
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
      padding: '20px',
      borderRadius: '12px',
      marginBottom: '20px',
      border: '1px solid #e0e0e0'
    }}>
      {/* Main Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: '16px',
        marginBottom: '16px'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#1e3c72' }}>
            {filteredOffers.length}
          </div>
          <div style={{ fontSize: '12px', color: '#6c757d', fontWeight: '500' }}>
            Rides Available
          </div>
        </div>
        
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#28a745' }}>
            ₹{getLowestPrice()}
          </div>
          <div style={{ fontSize: '12px', color: '#6c757d', fontWeight: '500' }}>
            Best Price
          </div>
        </div>
        
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#17a2b8' }}>
            {getFastestETA()}m
          </div>
          <div style={{ fontSize: '12px', color: '#6c757d', fontWeight: '500' }}>
            Fastest ETA
          </div>
        </div>
        
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#fd7e14' }}>
            {getProviderCount()}
          </div>
          <div style={{ fontSize: '12px', color: '#6c757d', fontWeight: '500' }}>
            Apps Compared
          </div>
        </div>
      </div>

      {/* Savings Highlight */}
      {getSavingsPercentage() > 0 && (
        <div style={{
          background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
          color: 'white',
          padding: '12px 16px',
          borderRadius: '8px',
          textAlign: 'center',
          fontWeight: '600',
          fontSize: '14px'
        }}>
          💰 Save up to {getSavingsPercentage()}% by choosing the best option
        </div>
      )}

      {/* Trivago-style tagline */}
      <div style={{
        textAlign: 'center',
        marginTop: '16px',
        fontSize: '14px',
        color: '#6c757d',
        fontStyle: 'italic'
      }}>
        Compare ride prices from {getProviderCount()}+ apps at once
      </div>
    </div>
  );
};

export default ComparisonSummary;