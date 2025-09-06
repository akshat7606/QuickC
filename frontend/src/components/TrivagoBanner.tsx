const TrivagoBanner = () => {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
      color: 'white',
      padding: '24px 16px',
      borderRadius: '12px',
      marginBottom: '20px',
      textAlign: 'center'
    }}>
      <h2 style={{
        fontSize: '24px',
        fontWeight: '700',
        margin: '0 0 8px 0'
      }}>
        🚗 We compare rides from 5+ apps
      </h2>
      <p style={{
        fontSize: '16px',
        margin: '0 0 16px 0',
        opacity: 0.9
      }}>
        Save up to 40% on your next ride
      </p>
      
      {/* Partner Logos */}
      <div style={{ marginTop: '16px' }}>
        <p style={{ fontSize: '12px', opacity: 0.8, marginBottom: '12px' }}>Our Partners</p>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '16px',
          flexWrap: 'wrap'
        }}>
          {[
            { name: 'Uber', logo: '🚗', color: '#000000' },
            { name: 'Ola', logo: '🚕', color: '#FFE135' },
            { name: 'Rapido', logo: '🏍️', color: '#FF6B35' },
            { name: 'BluSmart', logo: '🚙', color: '#0066FF' },
            { name: 'Namma Yatri', logo: '🛺', color: '#4CAF50' }
          ].map((partner) => (
            <div
              key={partner.name}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(255,255,255,0.15)',
                padding: '6px 12px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: '500'
              }}
            >
              <span style={{ fontSize: '16px' }}>{partner.logo}</span>
              <span>{partner.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrivagoBanner;