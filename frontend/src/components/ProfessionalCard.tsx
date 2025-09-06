import { type ReactNode } from 'react';

interface ProfessionalCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
  elevated?: boolean;
}

const ProfessionalCard = ({ 
  children, 
  className = '', 
  onClick, 
  hover = true, 
  elevated = false 
}: ProfessionalCardProps) => {
  return (
    <div
      className={className}
      onClick={onClick}
      style={{
        background: 'white',
        borderRadius: '16px',
        padding: '24px',
        border: '1px solid rgba(236,240,241,0.8)',
        boxShadow: elevated 
          ? '0 12px 24px rgba(0,0,0,0.15)' 
          : '0 4px 12px rgba(0,0,0,0.08)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: onClick ? 'pointer' : 'default',
        position: 'relative',
        overflow: 'hidden'
      }}
      onMouseEnter={(e) => {
        if (hover && onClick) {
          (e.target as HTMLElement).style.transform = 'translateY(-4px)';
          (e.target as HTMLElement).style.boxShadow = '0 16px 32px rgba(0,0,0,0.12)';
        }
      }}
      onMouseLeave={(e) => {
        if (hover && onClick) {
          (e.target as HTMLElement).style.transform = 'translateY(0)';
          (e.target as HTMLElement).style.boxShadow = elevated 
            ? '0 12px 24px rgba(0,0,0,0.15)' 
            : '0 4px 12px rgba(0,0,0,0.08)';
        }
      }}
    >
      {/* Subtle gradient overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '2px',
        background: 'linear-gradient(90deg, #3498db 0%, #2ecc71 50%, #e74c3c 100%)',
        opacity: 0.6
      }} />
      
      {children}
    </div>
  );
};

export default ProfessionalCard;