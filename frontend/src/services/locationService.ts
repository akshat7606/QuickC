export interface LocationSuggestion {
  id: string;
  name: string;
  description: string;
  lat: number;
  lng: number;
}

export interface UserLocation {
  latitude: number;
  longitude: number;
  address?: string;
}

// Popular locations in major Indian cities for suggestions
const popularLocations: LocationSuggestion[] = [
  // Delhi
  { id: 'cp', name: 'Connaught Place', description: 'Central Delhi', lat: 28.6315, lng: 77.2167 },
  { id: 'igi', name: 'IGI Airport', description: 'Indira Gandhi International Airport', lat: 28.5562, lng: 77.1000 },
  { id: 'new-delhi-station', name: 'New Delhi Railway Station', description: 'Main Railway Station', lat: 28.6431, lng: 77.2197 },
  { id: 'karol-bagh', name: 'Karol Bagh', description: 'Shopping District', lat: 28.6507, lng: 77.1909 },
  { id: 'chandni-chowk', name: 'Chandni Chowk', description: 'Old Delhi Market', lat: 28.6506, lng: 77.2334 },
  
  // Mumbai
  { id: 'cst', name: 'CST Station', description: 'Chhatrapati Shivaji Terminus', lat: 18.9398, lng: 72.8355 },
  { id: 'bandra', name: 'Bandra West', description: 'Western Mumbai', lat: 19.0544, lng: 72.8081 },
  { id: 'andheri', name: 'Andheri East', description: 'Business District', lat: 19.1197, lng: 72.8464 },
  { id: 'powai', name: 'Powai', description: 'IT Hub', lat: 19.1176, lng: 72.9060 },
  { id: 'marine-drive', name: 'Marine Drive', description: 'South Mumbai', lat: 18.9437, lng: 72.8234 },
  
  // Bangalore
  { id: 'mg-road', name: 'MG Road', description: 'Central Bangalore', lat: 12.9716, lng: 77.5946 },
  { id: 'koramangala', name: 'Koramangala', description: 'Tech Hub', lat: 12.9352, lng: 77.6245 },
  { id: 'whitefield', name: 'Whitefield', description: 'IT Corridor', lat: 12.9698, lng: 77.7500 },
  { id: 'electronic-city', name: 'Electronic City', description: 'Tech Park', lat: 12.8456, lng: 77.6603 },
  { id: 'kempegowda-airport', name: 'Kempegowda Airport', description: 'Bangalore Airport', lat: 13.1986, lng: 77.7066 }
];

class LocationService {
  // Get user's current location
  async getCurrentLocation(): Promise<UserLocation> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const address = await this.reverseGeocode(latitude, longitude);
            resolve({ latitude, longitude, address });
          } catch {
            resolve({ latitude, longitude });
          }
        },
        (error) => {
          reject(new Error(`Location access denied: ${error.message}`));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    });
  }

  // Search for location suggestions
  searchLocations(query: string): LocationSuggestion[] {
    if (!query || query.length < 2) {
      return popularLocations.slice(0, 5);
    }

    const searchTerm = query.toLowerCase().trim();
    return popularLocations
      .filter(location => 
        location.name.toLowerCase().includes(searchTerm) ||
        location.description.toLowerCase().includes(searchTerm)
      )
      .slice(0, 8);
  }

  // Get popular locations based on current location (simplified)
  getPopularNearby(userLat?: number, userLng?: number): LocationSuggestion[] {
    // In a real app, this would use the user's location to find nearby popular places
    // For now, return a curated list
    return popularLocations.slice(0, 6);
  }

  // Reverse geocoding (simplified - in production use Google Maps API)
  private async reverseGeocode(lat: number, lng: number): Promise<string> {
    // Simplified reverse geocoding based on known locations
    const nearby = popularLocations.find(location => {
      const distance = this.calculateDistance(lat, lng, location.lat, location.lng);
      return distance < 5; // Within 5km
    });

    if (nearby) {
      return `Near ${nearby.name}, ${nearby.description}`;
    }

    return `Location: ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  }

  // Calculate distance between two coordinates
  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.deg2rad(lat2 - lat1);
    const dLng = this.deg2rad(lng2 - lng1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI/180);
  }

  // Format location for display
  formatLocation(location: LocationSuggestion): string {
    return `${location.name}, ${location.description}`;
  }
}

export const locationService = new LocationService();