import { VEHICLE_TYPES, VehicleType } from '../types/rides';

interface VehicleSelectorProps {
  selectedVehicle: string | null;
  onVehicleSelect: (vehicleId: string | null) => void;
}

const VehicleSelector = ({ selectedVehicle, onVehicleSelect }: VehicleSelectorProps) => {
  return (
    <div style={{
      position: 'fixed',
      bottom: '80px', // Above navigation
      left: '0',
      right: '0',
      background: 'white',
      borderTop: '1px solid #e0e0e0',
      padding: '16px',
      boxShadow: '0 -2px 8px rgba(0,0,0,0.1)',
      zIndex: 100
    }}>
      <div style={{ marginBottom: '12px', fontSize: '14px', fontWeight: '600', color: '#333' }}>
        Filter by Vehicle Type
      </div>
      
      <div style={{
        display: 'flex',
        overflowX: 'auto',
        gap: '12px',
        paddingBottom: '8px'
      }}>
        {/* All vehicles option */}
        <button
          onClick={() => onVehicleSelect(null)}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '12px 16px',
            borderRadius: '12px',
            border: selectedVehicle === null ? '2px solid #007bff' : '1px solid #ddd',
            background: selectedVehicle === null ? '#f0f8ff' : 'white',
            cursor: 'pointer',
            minWidth: '70px',
            fontSize: '12px',
            fontWeight: '500',
            transition: 'all 0.2s'
          }}
        >
          <span style={{ fontSize: '20px', marginBottom: '4px' }}>🚕</span>
          <span>All</span>
        </button>

        {VEHICLE_TYPES.map((vehicle: VehicleType) => (
          <button
            key={vehicle.id}
            onClick={() => onVehicleSelect(vehicle.id)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '12px 16px',
              borderRadius: '12px',
              border: selectedVehicle === vehicle.id ? '2px solid #007bff' : '1px solid #ddd',
              background: selectedVehicle === vehicle.id ? '#f0f8ff' : 'white',
              cursor: 'pointer',
              minWidth: '70px',
              fontSize: '12px',
              fontWeight: '500',
              transition: 'all 0.2s'
            }}
          >
            <span style={{ fontSize: '20px', marginBottom: '4px' }}>{vehicle.icon}</span>
            <span>{vehicle.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default VehicleSelector;