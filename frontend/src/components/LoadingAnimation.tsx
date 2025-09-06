interface LoadingAnimationProps {
  text?: string;
}

const LoadingAnimation = ({ text = "Finding best rides..." }: LoadingAnimationProps) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '60px 20px',
      minHeight: '300px'
    }}>
      {/* Sophisticated loading animation */}
      <div style={{
        position: 'relative',
        width: '80px',
        height: '80px',
        marginBottom: '24px'
      }}>
        {/* Outer ring */}
        <div style={{
          position: 'absolute',
          width: '80px',
          height: '80px',
          border: '3px solid rgba(52,152,219,0.2)',
          borderTop: '3px solid #3498db',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        
        {/* Inner ring */}
        <div style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          width: '56px',
          height: '56px',
          border: '2px solid rgba(46,204,113,0.2)',
          borderTop: '2px solid #2ecc71',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite reverse'
        }} />
        
        {/* Center dot */}
        <div style={{
          position: 'absolute',
          top: '32px',
          left: '32px',
          width: '16px',
          height: '16px',
          background: 'linear-gradient(135deg, #3498db 0%, #2ecc71 100%)',
          borderRadius: '50%',
          animation: 'pulse 1.5s ease-in-out infinite'
        }} />
      </div>
      
      {/* Loading text with typewriter effect */}
      <div style={{
        fontSize: '18px',
        fontWeight: '500',
        color: '#2c3e50',
        marginBottom: '8px',
        textAlign: 'center'
      }}>
        {text}
      </div>
      
      {/* Subtitle */}
      <div style={{
        fontSize: '14px',
        color: '#7f8c8d',
        textAlign: 'center',
        maxWidth: '280px'
      }}>
        Comparing prices across Uber, Ola, Rapido & more
      </div>
      
      {/* Progress indicators */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginTop: '24px'
      }}>
        {[0, 1, 2, 3].map((index) => (
          <div
            key={index}
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: '#3498db',
              animation: `bounce 1.4s ease-in-out ${index * 0.16}s infinite both`
            }}
          />
        ))}
      </div>
      
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.2); opacity: 0.7; }
        }
        
        @keyframes bounce {
          0%, 80%, 100% {
            transform: scale(0);
          }
          40% {
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default LoadingAnimation;