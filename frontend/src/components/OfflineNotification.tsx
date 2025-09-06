interface OfflineNotificationProps {
  isVisible: boolean;
  onDismiss: () => void;
  onCallIVR: () => void;
}

const OfflineNotification = ({ isVisible, onDismiss, onCallIVR }: OfflineNotificationProps) => {
  if (!isVisible) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '70px', // Below header
      left: '16px',
      right: '16px',
      background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
      color: 'white',
      padding: '16px 20px',
      borderRadius: '12px',
      boxShadow: '0 8px 24px rgba(231,76,60,0.3)',
      zIndex: 10000,
      animation: 'slideDown 0.3s ease-out'
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
        <div style={{ fontSize: '20px' }}>📶</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: '600', fontSize: '16px', marginBottom: '4px' }}>
            Internet Connection Issue
          </div>
          <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '12px' }}>
            Unable to connect to our servers. You can still book a ride by calling our IVR system.
          </div>
          
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={onCallIVR}
              style={{
                background: 'white',
                color: '#e74c3c',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 16px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              📞 Call +91-9981910866
            </button>
            
            <button
              onClick={onDismiss}
              style={{
                background: 'rgba(255,255,255,0.2)',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: '8px',
                padding: '8px 16px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes slideDown {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default OfflineNotification;