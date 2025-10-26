// Lightweight shim for MapMyIndia service used by LocationInput and LocationMap.
// This file provides two exported async functions: `autocomplete(query)` and `reverseGeocode(lat, lng)`.
// In production, replace with a real implementation that calls MapMyIndia APIs and handles credentials.

import type { LocationSuggestion } from './locationService';
import { locationService } from './locationService';

// Simple fallback autocomplete that returns an empty array or a small mock after a short delay.
export async function autocomplete(query: string): Promise<LocationSuggestion[]> {
  if (!query || query.trim().length < 2) return [];

  // Use the local search to return suggestions synchronously
  try {
    const results = locationService.searchLocations(query.trim());
    return results;
  } catch (e) {
    // If locationService is unavailable for some reason, return an empty list
    return [];
  }
}

// Fallback reverse geocode that formats coordinates; real implementation should call MapMyIndia.
export async function reverseGeocode(lat: number, lng: number): Promise<string> {
  // Lightweight heuristic: return coordinates formatted, or attempt to use locationService reverseGeocode
  try {
    // locationService.reverseGeocode is a private method; call via index access to avoid TS private checks
    // but in this codebase it exists and is safe to use.
    return await (locationService as any).reverseGeocode(lat, lng);
  } catch (e) {
    return `Current Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
  }
}
