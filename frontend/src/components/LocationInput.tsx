import { useState, useEffect, useRef } from 'react';
import { locationService } from '../services/locationService';
import type { LocationSuggestion } from '../services/locationService';
import { useKeyboardAdjustment } from '../hooks/useKeyboardAdjustment';

interface LocationInputProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string, location?: LocationSuggestion) => void;
  showCurrentLocation?: boolean;
}

const LocationInput = ({ label, placeholder, value, onChange, showCurrentLocation = false }: LocationInputProps) => {
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const { isKeyboardOpen, viewportHeight } = useKeyboardAdjustment();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    onChange(inputValue);
    
    // Show suggestions immediately like Uber does
    const locationSuggestions = locationService.searchLocations(inputValue);
    setSuggestions(locationSuggestions);
    setShowSuggestions(true);
  };

  const handleInputFocus = () => {
    // Always show suggestions when focused, like Uber
    const locationSuggestions = locationService.searchLocations(value);
    setSuggestions(locationSuggestions);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (suggestion: LocationSuggestion) => {
    const formattedLocation = locationService.formatLocation(suggestion);
    onChange(formattedLocation, suggestion);
    setShowSuggestions(false);
  };

  const handleCurrentLocation = async () => {
    if (!showCurrentLocation) return;
    
    setIsLoadingLocation(true);
    try {
      const userLocation = await locationService.getCurrentLocation();
      const locationText = userLocation.address || `Current Location (${userLocation.latitude.toFixed(4)}, ${userLocation.longitude.toFixed(4)})`;
      const locationData: LocationSuggestion = {
        name: 'Current Location',
        address: locationText,
        lat: userLocation.latitude,
        lng: userLocation.longitude,
        type: 'current'
      };
      onChange(locationText, locationData);
      setShowSuggestions(false);
    } catch (error) {
      console.error('Location error:', error);
      alert('Could not get your current location. Please ensure location access is enabled in your browser settings.');
    }
    setIsLoadingLocation(false);
  };

  return (
    <div className="form-group" style={{ position: 'relative' }}>
      <label className="form-label">{label}</label>
      <div style={{ position: 'relative' }}>
        <input
          ref={inputRef}
          type="text"
          className="form-input"
          placeholder={placeholder}
          value={value}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          style={{ paddingRight: showCurrentLocation ? '50px' : '12px' }}
        />
        
        {showCurrentLocation && (
          <button
            type="button"
            onClick={handleCurrentLocation}
            disabled={isLoadingLocation}
            style={{
              position: 'absolute',
              right: '8px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '18px',
              color: '#007bff',
              padding: '4px'
            }}
            title="Use current location"
          >
            {isLoadingLocation ? '⏳' : '📍'}
          </button>
        )}
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          style={{
            position: 'absolute',
            top: '100%',
            left: '0',
            right: '0',
            background: 'white',
            border: '1px solid #ddd',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            zIndex: 1000,
            maxHeight: isKeyboardOpen ? '200px' : '300px', // Smaller when keyboard is open
            overflowY: 'auto'
          }}
        >
          {suggestions.map((suggestion, index) => (
            <div
              key={suggestion.id}
              onClick={() => handleSuggestionClick(suggestion)}
              style={{
                padding: '12px 16px',
                cursor: 'pointer',
                borderBottom: index < suggestions.length - 1 ? '1px solid #f0f0f0' : 'none',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.backgroundColor = '#f8f9fa';
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.backgroundColor = 'white';
              }}
            >
              <div style={{ fontWeight: '500', fontSize: '14px', color: '#333' }}>
                📍 {suggestion.name}
              </div>
              <div style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>
                {suggestion.description}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationInput;