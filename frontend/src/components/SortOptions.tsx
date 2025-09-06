import { SORT_OPTIONS } from '../types/rides';
import type { SortOption } from '../types/rides';

interface SortOptionsProps {
  selectedSorts: string[];
  onSortChange: (sortIds: string[]) => void;
}

const SortOptions = ({ selectedSorts, onSortChange }: SortOptionsProps) => {
  const toggleSort = (sortId: string) => {
    if (selectedSorts.includes(sortId)) {
      // Remove from selection
      onSortChange(selectedSorts.filter(id => id !== sortId));
    } else {
      // Add to selection
      onSortChange([...selectedSorts, sortId]);
    }
  };

  return (
    <div style={{ marginBottom: '16px' }}>
      <div style={{
        marginBottom: '8px',
        fontSize: '14px',
        fontWeight: '600',
        color: '#333'
      }}>
        Sort by (select multiple):
      </div>
      <div style={{
        display: 'flex',
        gap: '8px',
        padding: '16px',
        background: '#f8f9fa',
        borderRadius: '12px',
        overflowX: 'auto'
      }}>
        {SORT_OPTIONS.map((option: SortOption) => {
          const isSelected = selectedSorts.includes(option.id);
          return (
            <button
              key={option.id}
              onClick={() => toggleSort(option.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 12px',
                borderRadius: '20px',
                border: 'none',
                background: isSelected ? '#007bff' : 'white',
                color: isSelected ? 'white' : '#333',
                fontSize: '12px',
                fontWeight: '500',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                position: 'relative'
              }}
            >
              <span>{option.icon}</span>
              <span>Sort by {option.name}</span>
              {isSelected && (
                <span style={{
                  marginLeft: '6px',
                  background: 'rgba(255,255,255,0.3)',
                  borderRadius: '50%',
                  width: '16px',
                  height: '16px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px'
                }}>
                  ✓
                </span>
              )}
            </button>
          );
        })}
      </div>
      {selectedSorts.length > 0 && (
        <div style={{
          marginTop: '8px',
          fontSize: '12px',
          color: '#6c757d',
          textAlign: 'center'
        }}>
          Active sorts: {selectedSorts.length}
        </div>
      )}
    </div>
  );
};

export default SortOptions;