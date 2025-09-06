import { SORT_OPTIONS, SortOption } from '../types/rides';

interface SortOptionsProps {
  selectedSort: string;
  onSortChange: (sortId: string) => void;
}

const SortOptions = ({ selectedSort, onSortChange }: SortOptionsProps) => {
  return (
    <div style={{
      display: 'flex',
      gap: '8px',
      padding: '16px',
      background: '#f8f9fa',
      borderRadius: '12px',
      marginBottom: '16px',
      overflowX: 'auto'
    }}>
      {SORT_OPTIONS.map((option: SortOption) => (
        <button
          key={option.id}
          onClick={() => onSortChange(option.id)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 12px',
            borderRadius: '20px',
            border: 'none',
            background: selectedSort === option.id ? '#007bff' : 'white',
            color: selectedSort === option.id ? 'white' : '#333',
            fontSize: '12px',
            fontWeight: '500',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            transition: 'all 0.2s',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}
        >
          <span>{option.icon}</span>
          <span>Sort by {option.name}</span>
        </button>
      ))}
    </div>
  );
};

export default SortOptions;