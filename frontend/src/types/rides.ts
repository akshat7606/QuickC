export interface RideOffer {
  id: string;
  provider: string;
  provider_logo: string;
  vehicle_type: 'bike' | 'auto' | 'economy' | 'sedan' | 'premium' | 'xl';
  vehicle_name: string;
  driver_name: string;
  rating: number;
  distance_km: number;
  eta_minutes: number;
  base_fare: number;
  total_fare: number;
  surge_multiplier?: number;
  deep_link: string;
  booking_link: string;
}

export interface VehicleType {
  id: 'bike' | 'auto' | 'economy' | 'sedan' | 'premium' | 'xl';
  name: string;
  icon: string;
  description: string;
}

export interface SortOption {
  id: 'price' | 'distance' | 'eta' | 'rating';
  name: string;
  icon: string;
}

export const VEHICLE_TYPES: VehicleType[] = [
  { id: 'bike', name: 'Bike', icon: '🏍️', description: '2-wheeler' },
  { id: 'auto', name: 'Auto', icon: '🛺', description: '3-wheeler' },
  { id: 'economy', name: 'Economy', icon: '🚗', description: 'Budget car' },
  { id: 'sedan', name: 'Sedan', icon: '🚙', description: 'Comfort car' },
  { id: 'premium', name: 'Premium', icon: '🚘', description: 'Luxury car' },
  { id: 'xl', name: 'XL', icon: '🚐', description: 'Large vehicle' }
];

export const SORT_OPTIONS: SortOption[] = [
  { id: 'price', name: 'Price', icon: '💰' },
  { id: 'distance', name: 'Distance', icon: '📍' },
  { id: 'eta', name: 'ETA', icon: '⏱️' },
  { id: 'rating', name: 'Rating', icon: '⭐' }
];