import React from 'react';

const ProfileScreen = () => {
  return (
    <div className="screen">
      <div className="screen-header">
        <h1 className="screen-title">Profile</h1>
      </div>

      <div className="card">
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ 
            width: '80px', 
            height: '80px', 
            borderRadius: '50%', 
            background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '32px',
            color: 'white',
            margin: '0 auto 16px'
          }}>
            👤
          </div>
          <h2 style={{ margin: 0, color: '#1e3c72' }}>UCA User</h2>
          <p style={{ margin: '4px 0', color: '#6c757d' }}>Universal Cab Aggregator</p>
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: '16px', color: '#1e3c72' }}>App Features</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '20px' }}>🔍</span>
            <span>Compare rides from multiple providers</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '20px' }}>📱</span>
            <span>Book directly through the app</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '20px' }}>📞</span>
            <span>Call for voice-based booking</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '20px' }}>📋</span>
            <span>Track all your rides in one place</span>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: '16px', color: '#1e3c72' }}>Support</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <strong>Phone Support:</strong><br />
            Call +91-XXXX-XXXX for instant ride booking
          </div>
          <div>
            <strong>Email:</strong><br />
            support@uca.app
          </div>
          <div>
            <strong>Version:</strong><br />
            UCA 1.0.0 (Production Ready)
          </div>
        </div>
      </div>

      <div style={{ textAlign: 'center', padding: '20px', color: '#6c757d', fontSize: '14px' }}>
        <p>© 2024 Universal Cab Aggregator</p>
        <p>Making ride booking simple and unified</p>
      </div>
    </div>
  );
};

export default ProfileScreen;