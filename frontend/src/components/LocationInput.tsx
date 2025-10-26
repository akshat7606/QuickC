import { useState, useEffect, useRef } from 'react';
import { locationService } from '../services/locationService';
import type { LocationSuggestion } from '../services/locationService';
import { useKeyboardAdjustment } from '../hooks/useKeyboardAdjustment';
import { autocomplete as mapmyindiaAutocomplete } from '../services/mapmyindiaService';

interface LocationInputProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string, location?: LocationSuggestion) => void;
  showCurrentLocation?: boolean;
}

const LocationInput = ({ label, placeholder, value, onChange, showCurrentLocation = false }: LocationInputProps) => {
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const debounceTimer = useRef<number | null>(null);
  const { isKeyboardOpen } = useKeyboardAdjustment();

  // fetchId to ignore stale async responses
  const fetchIdRef = useRef(0);

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

  const fetchSuggestions = async (query: string) => {
    // Only query autocomplete for meaningful queries
    if (!query || query.trim().length < 2) {
      setSuggestions([]);
      setIsSuggesting(false);
      setShowSuggestions(false);
      setErrorMessage(null);
      return;
    }

    const cleaned = query.trim();

    // Immediately show local suggestions so the UI feels snappy
    try {
      const local = locationService.searchLocations(cleaned);
      setSuggestions(local);
      setShowSuggestions(local.length > 0);
    } catch (e) {
      // ignore local search errors
      setSuggestions([]);
      setShowSuggestions(false);
    }

    setIsSuggesting(true);
    setErrorMessage(null);

    const thisFetchId = ++fetchIdRef.current;

    // Try MapMyIndia autocomplete
    try {
      const remote = await mapmyindiaAutocomplete(cleaned);

      // If another fetch started after this one, ignore this result (stale)
      if (fetchIdRef.current !== thisFetchId) {
        return;
      }

      if (remote && remote.length > 0) {
        setSuggestions(remote);
        setIsSuggesting(false);
        setShowSuggestions(true);
        return;
      }

      // If remote returned no results, keep local suggestions (we already set them)
      setIsSuggesting(false);
      setShowSuggestions((prev) => prev || false);
    } catch (err: any) {
      // If the request was aborted or a stale result, just return
      if (err?.name === 'CanceledError' || err?.name === 'AbortError') return;

      // Keep full details in console for debugging, but show a concise message to users
      console.warn('Remote autocomplete error (full details):', err);
      setErrorMessage('Address lookup is temporarily unavailable — showing local suggestions');

      // Keep local suggestions already shown earlier
      setIsSuggesting(false);
      setShowSuggestions((prev) => prev || false);
    }
  };

  const debouncedFetch = (query: string) => {
    if (debounceTimer.current) {
      window.clearTimeout(debounceTimer.current);
    }
    // Reduced debounce to 200ms for snappier suggestions
    debounceTimer.current = window.setTimeout(() => {
      void fetchSuggestions(query);
    }, 200);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    onChange(inputValue);

    // fetch suggestions async
    debouncedFetch(inputValue);
  };

  const handleInputFocus = () => {
    // Show suggestions only if there is a query
    if (value && value.trim().length >= 2) debouncedFetch(value);
  };

  const handleSuggestionClick = (suggestion: LocationSuggestion) => {
    const formattedLocation = `${suggestion.name}`; // keep display concise
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
        id: `current-${Date.now()}`,
        name: 'Current Location',
        description: userLocation.address || locationText,
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
          {isSuggesting && (
            <div style={{ padding: '8px 12px', color: '#666', fontSize: '13px' }}>Searching…</div>
          )}
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

      {/* Inline error when autocomplete fails (useful in debug mode) */}
      {errorMessage && (
        <div style={{ color: 'crimson', whiteSpace: 'pre-wrap', marginTop: '8px', fontSize: '13px' }}>
          ⚠️ {errorMessage}
        </div>
      )}
    </div>
  );
};

export default LocationInput;

