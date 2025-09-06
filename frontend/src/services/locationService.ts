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

// Comprehensive location database like Uber uses
const comprehensiveLocations: LocationSuggestion[] = [
  // Delhi NCR
  { id: 'cp', name: 'Connaught Place', description: 'Central Delhi', lat: 28.6315, lng: 77.2167 },
  { id: 'igi', name: 'IGI Airport', description: 'Indira Gandhi International Airport, New Delhi', lat: 28.5562, lng: 77.1000 },
  { id: 'new-delhi-station', name: 'New Delhi Railway Station', description: 'Paharganj, New Delhi', lat: 28.6431, lng: 77.2197 },
  { id: 'karol-bagh', name: 'Karol Bagh', description: 'Shopping District, Delhi', lat: 28.6507, lng: 77.1909 },
  { id: 'chandni-chowk', name: 'Chandni Chowk', description: 'Old Delhi', lat: 28.6506, lng: 77.2334 },
  { id: 'red-fort', name: 'Red Fort', description: 'Netaji Subhash Marg, Chandni Chowk, New Delhi', lat: 28.6562, lng: 77.2410 },
  { id: 'india-gate', name: 'India Gate', description: 'Rajpath, New Delhi', lat: 28.6129, lng: 77.2295 },
  { id: 'khan-market', name: 'Khan Market', description: 'Khan Market, New Delhi', lat: 28.5984, lng: 77.2319 },
  { id: 'cp-metro', name: 'Rajiv Chowk Metro Station', description: 'Connaught Place, New Delhi', lat: 28.6330, lng: 77.2196 },
  { id: 'lajpat-nagar', name: 'Lajpat Nagar', description: 'South Delhi', lat: 28.5677, lng: 77.2431 },
  { id: 'saket', name: 'Saket', description: 'Select City Walk Mall, South Delhi', lat: 28.5245, lng: 77.2066 },
  { id: 'gurgaon-cyber-city', name: 'Cyber City', description: 'DLF Cyber City, Gurgaon', lat: 28.4951, lng: 77.0890 },
  { id: 'noida-sector-18', name: 'Sector 18', description: 'Atta Market, Noida', lat: 28.5692, lng: 77.3224 },
  
  // Mumbai
  { id: 'cst', name: 'CST Station', description: 'Chhatrapati Shivaji Maharaj Terminus, Mumbai', lat: 18.9398, lng: 72.8355 },
  { id: 'bandra-west', name: 'Bandra West', description: 'Linking Road, Mumbai', lat: 19.0544, lng: 72.8081 },
  { id: 'andheri-east', name: 'Andheri East', description: 'MIDC, Andheri East, Mumbai', lat: 19.1197, lng: 72.8464 },
  { id: 'powai', name: 'Powai', description: 'Hiranandani Gardens, Mumbai', lat: 19.1176, lng: 72.9060 },
  { id: 'marine-drive', name: 'Marine Drive', description: 'Queens Necklace, South Mumbai', lat: 18.9437, lng: 72.8234 },
  { id: 'juhu-beach', name: 'Juhu Beach', description: 'Juhu, Mumbai', lat: 19.0968, lng: 72.8263 },
  { id: 'bkc', name: 'BKC', description: 'Bandra Kurla Complex, Mumbai', lat: 19.0633, lng: 72.8682 },
  { id: 'mumbai-airport', name: 'Mumbai Airport', description: 'Chhatrapati Shivaji International Airport', lat: 19.0896, lng: 72.8656 },
  { id: 'colaba', name: 'Colaba', description: 'Gateway of India, Mumbai', lat: 18.9067, lng: 72.8147 },
  { id: 'worli', name: 'Worli', description: 'Worli Sea Face, Mumbai', lat: 19.0178, lng: 72.8205 },
  
  // Bangalore
  { id: 'mg-road', name: 'MG Road', description: 'Mahatma Gandhi Road, Bangalore', lat: 12.9716, lng: 77.5946 },
  { id: 'koramangala', name: 'Koramangala', description: '5th Block, Koramangala, Bangalore', lat: 12.9352, lng: 77.6245 },
  { id: 'whitefield', name: 'Whitefield', description: 'ITPL Main Road, Bangalore', lat: 12.9698, lng: 77.7500 },
  { id: 'electronic-city', name: 'Electronic City', description: 'Phase 1, Electronic City, Bangalore', lat: 12.8456, lng: 77.6603 },
  { id: 'kempegowda-airport', name: 'Kempegowda Airport', description: 'Kempegowda International Airport, Bangalore', lat: 13.1986, lng: 77.7066 },
  { id: 'indiranagar', name: 'Indiranagar', description: '100 Feet Road, Indiranagar, Bangalore', lat: 12.9719, lng: 77.6412 },
  { id: 'btm-layout', name: 'BTM Layout', description: '2nd Stage, BTM Layout, Bangalore', lat: 12.9165, lng: 77.6101 },
  { id: 'hsr-layout', name: 'HSR Layout', description: 'Sector 1, HSR Layout, Bangalore', lat: 12.9116, lng: 77.6370 },
  { id: 'jp-nagar', name: 'JP Nagar', description: '4th Phase, JP Nagar, Bangalore', lat: 12.9077, lng: 77.5851 },
  { id: 'brigade-road', name: 'Brigade Road', description: 'Commercial Street Area, Bangalore', lat: 12.9716, lng: 77.6133 },
  
  // Pune
  { id: 'pune-station', name: 'Pune Railway Station', description: 'Pune Junction, Maharashtra', lat: 18.5290, lng: 73.8748 },
  { id: 'koregaon-park', name: 'Koregaon Park', description: 'North Main Road, Pune', lat: 18.5362, lng: 73.8984 },
  { id: 'hinjewadi', name: 'Hinjewadi', description: 'Rajiv Gandhi IT Park, Pune', lat: 18.5913, lng: 73.7389 },
  { id: 'baner', name: 'Baner', description: 'Baner Road, Pune', lat: 18.5593, lng: 73.7783 },
  { id: 'pune-airport', name: 'Pune Airport', description: 'Pune International Airport', lat: 18.5822, lng: 73.9197 },
  
  // Hyderabad
  { id: 'hitech-city', name: 'Hitech City', description: 'HITEC City, Hyderabad', lat: 17.4435, lng: 78.3772 },
  { id: 'gachibowli', name: 'Gachibowli', description: 'Financial District, Hyderabad', lat: 17.4239, lng: 78.3428 },
  { id: 'secunderabad', name: 'Secunderabad Station', description: 'Secunderabad Railway Station', lat: 17.4399, lng: 78.5017 },
  { id: 'hyderabad-airport', name: 'Hyderabad Airport', description: 'Rajiv Gandhi International Airport', lat: 17.2403, lng: 78.4294 },
  { id: 'charminar', name: 'Charminar', description: 'Old City, Hyderabad', lat: 17.3616, lng: 78.4747 },
  
  // Chennai
  { id: 'marina-beach', name: 'Marina Beach', description: 'Marina Beach Road, Chennai', lat: 13.0475, lng: 80.2824 },
  { id: 'chennai-central', name: 'Chennai Central', description: 'Chennai Central Railway Station', lat: 13.0836, lng: 80.2748 },
  { id: 't-nagar', name: 'T. Nagar', description: 'Pondy Bazaar, Chennai', lat: 13.0418, lng: 80.2341 },
  { id: 'chennai-airport', name: 'Chennai Airport', description: 'Chennai International Airport', lat: 12.9941, lng: 80.1709 },
  { id: 'omr-chennai', name: 'OMR IT Corridor', description: 'Old Mahabalipuram Road, Chennai', lat: 12.8797, lng: 80.2209 },
  
  // Kolkata
  { id: 'howrah-station', name: 'Howrah Station', description: 'Howrah Junction Railway Station', lat: 22.5851, lng: 88.3458 },
  { id: 'park-street', name: 'Park Street', description: 'Park Street, Kolkata', lat: 22.5549, lng: 88.3578 },
  { id: 'salt-lake', name: 'Salt Lake', description: 'Sector V, Salt Lake City, Kolkata', lat: 22.5726, lng: 88.4323 },
  { id: 'kolkata-airport', name: 'Kolkata Airport', description: 'Netaji Subhash Chandra Bose Airport', lat: 22.6546, lng: 88.4467 }
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

  // Search for location suggestions (Uber-style autocomplete)
  searchLocations(query: string): LocationSuggestion[] {
    if (!query || query.length < 1) {
      return comprehensiveLocations.slice(0, 8);
    }

    const searchTerm = query.toLowerCase().trim();
    
    // Multi-criteria search like Uber
    const results = comprehensiveLocations
      .filter(location => {
        const name = location.name.toLowerCase();
        const description = location.description.toLowerCase();
        
        // Check if search term matches:
        // 1. Start of location name (highest priority)
        // 2. Any part of location name
        // 3. Start of any word in description
        // 4. Any part of description
        return name.startsWith(searchTerm) ||
               name.includes(searchTerm) ||
               description.split(' ').some(word => word.startsWith(searchTerm)) ||
               description.includes(searchTerm);
      })
      .sort((a, b) => {
        const aName = a.name.toLowerCase();
        const bName = b.name.toLowerCase();
        const aDesc = a.description.toLowerCase();
        const bDesc = b.description.toLowerCase();
        
        // Priority scoring (lower score = higher priority)
        const getScore = (name: string, desc: string) => {
          if (name.startsWith(searchTerm)) return 1;
          if (name.includes(searchTerm)) return 2;
          if (desc.split(' ').some(word => word.startsWith(searchTerm))) return 3;
          if (desc.includes(searchTerm)) return 4;
          return 5;
        };
        
        return getScore(aName, aDesc) - getScore(bName, bDesc);
      })
      .slice(0, 10);
    
    return results;
  }

  // Get popular locations based on current location
  getPopularNearby(userLat?: number, userLng?: number): LocationSuggestion[] {
    if (!userLat || !userLng) {
      // Return popular locations from major cities
      return comprehensiveLocations.slice(0, 8);
    }
    
    // Find nearby locations within 50km
    const nearby = comprehensiveLocations
      .map(location => ({
        ...location,
        distance: this.calculateDistance(userLat, userLng, location.lat, location.lng)
      }))
      .filter(location => location.distance <= 50)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 8);
    
    return nearby.length > 0 ? nearby : comprehensiveLocations.slice(0, 8);
  }

  // Reverse geocoding using comprehensive location database
  private async reverseGeocode(lat: number, lng: number): Promise<string> {
    // Find the closest known location
    const closest = comprehensiveLocations
      .map(location => ({
        ...location,
        distance: this.calculateDistance(lat, lng, location.lat, location.lng)
      }))
      .sort((a, b) => a.distance - b.distance)[0];

    if (closest && closest.distance < 10) { // Within 10km
      if (closest.distance < 1) {
        return `${closest.name}, ${closest.description}`;
      } else {
        return `Near ${closest.name}, ${closest.description}`;
      }
    }

    return `Current Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
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