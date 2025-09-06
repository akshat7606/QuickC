import type { RideOffer } from '../types/rides';

interface RideCardProps {
  offer: RideOffer;
  onAppRedirect: (offer: RideOffer) => void;
}

const RideCard = ({ offer, onAppRedirect }: RideCardProps) => {
  const handleRedirect = (e: React.MouseEvent) => {
    e.preventDefault();
    onAppRedirect(offer);
  };

  const getSurgeIndicator = () => {
    if (offer.surge_multiplier && offer.surge_multiplier > 1) {
      return (
        <span style={{
          background: '#ff6b6b',
          color: 'white',
          padding: '2px 6px',
          borderRadius: '10px',
          fontSize: '10px',
          fontWeight: '600'
        }}>
          {offer.surge_multiplier}x SURGE
        </span>
      );
    }
    return null;
  };

  return (
    <div 
      className="card"
      style={{ 
        marginBottom: '12px',
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        position: 'relative'
      }}
      onClick={handleRedirect}
      onMouseEnter={(e) => {
        (e.target as HTMLElement).style.transform = 'translateY(-2px)';
        (e.target as HTMLElement).style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)';
      }}
      onMouseLeave={(e) => {
        (e.target as HTMLElement).style.transform = 'translateY(0)';
        (e.target as HTMLElement).style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
      }}
    >
      {/* Provider Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '12px',
        paddingBottom: '8px',
        borderBottom: '1px solid #f0f0f0'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img 
            src={offer.provider_logo} 
            alt={offer.provider}
            style={{ width: '24px', height: '24px', borderRadius: '4px' }}
            onError={(e) => {
              (e.target as HTMLImageElement).src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="%23007bff"><text x="12" y="16" text-anchor="middle" font-size="12" fill="white">${offer.provider[0]}</text></svg>`;
            }}
          />
          <span style={{ fontWeight: '600', color: '#333' }}>{offer.provider}</span>
        </div>
        {getSurgeIndicator()}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Vehicle and Driver Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
          <div style={{ fontSize: '32px' }}>
            {VEHICLE_TYPES.find(v => v.id === offer.vehicle_type)?.icon || '🚗'}
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ margin: 0, fontSize: '16px', color: '#1e3c72', fontWeight: '600' }}>
              {offer.vehicle_name}
            </h3>
            <p style={{ margin: '2px 0', color: '#6c757d', fontSize: '14px' }}>
              {offer.driver_name} • ⭐ {offer.rating.toFixed(1)}
            </p>
            <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
              <span style={{ color: '#28a745', fontSize: '12px', fontWeight: '600' }}>
                📍 {offer.distance_km.toFixed(1)} km
              </span>
              <span style={{ color: '#17a2b8', fontSize: '12px', fontWeight: '600' }}>
                ⏱️ {offer.eta_minutes} min
              </span>
            </div>
          </div>
        </div>

        {/* Pricing and Action */}
        <div style={{ textAlign: 'right', minWidth: '100px' }}>
          {offer.base_fare !== offer.total_fare && (
            <div style={{ 
              fontSize: '12px', 
              color: '#6c757d', 
              textDecoration: 'line-through',
              marginBottom: '2px'
            }}>
              ₹{offer.base_fare}
            </div>
          )}
          <div style={{ 
            fontSize: '20px', 
            fontWeight: '700', 
            color: '#1e3c72',
            marginBottom: '8px'
          }}>
            ₹{offer.total_fare}
          </div>
          <button 
            className="btn btn-primary" 
            style={{ 
              padding: '6px 12px', 
              fontSize: '12px',
              fontWeight: '600',
              borderRadius: '6px'
            }}
            onClick={handleRedirect}
          >
            Book on {offer.provider}
          </button>
        </div>
      </div>

      {/* Bottom action strip */}
      <div style={{
        marginTop: '12px',
        paddingTop: '8px',
        borderTop: '1px solid #f0f0f0',
        fontSize: '11px',
        color: '#6c757d',
        textAlign: 'center'
      }}>
        🔗 Tap to open {offer.provider} app
      </div>
    </div>
  );
};

// Import vehicle types for the emoji lookup
import { VEHICLE_TYPES } from '../types/rides';

export default RideCard;