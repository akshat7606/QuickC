const ThreeStepProcess = () => {
  const steps = [
    {
      icon: '🔍',
      title: 'Search simply',
      description: 'Enter pickup and destination to find rides in seconds'
    },
    {
      icon: '⚖️',
      title: 'Compare confidently',
      description: 'Compare ride prices from 5+ apps at once'
    },
    {
      icon: '💰',
      title: 'Save big',
      description: 'Book the best deal directly through partner apps'
    }
  ];

  return (
    <div style={{
      padding: '24px 16px',
      marginTop: '32px'
    }}>
      <h3 style={{
        textAlign: 'center',
        color: '#1e3c72',
        fontSize: '20px',
        fontWeight: '700',
        marginBottom: '24px'
      }}>
        How QuickC Works
      </h3>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '24px'
      }}>
        {steps.map((step, index) => (
          <div
            key={index}
            style={{
              textAlign: 'center',
              padding: '20px',
              background: '#fff',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              border: '1px solid #f0f0f0'
            }}
          >
            <div style={{
              fontSize: '48px',
              marginBottom: '12px'
            }}>
              {step.icon}
            </div>
            <h4 style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#1e3c72',
              marginBottom: '8px'
            }}>
              {step.title}
            </h4>
            <p style={{
              fontSize: '14px',
              color: '#6c757d',
              lineHeight: '1.4',
              margin: 0
            }}>
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ThreeStepProcess;