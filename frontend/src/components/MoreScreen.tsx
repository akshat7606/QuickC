import AppLayout from './AppLayout';

const MoreScreen = () => {
  return (
    <AppLayout title="More">
      <div className="screen" style={{ padding: '20px' }}>
        <div style={{
          background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
          borderRadius: '16px',
          padding: '24px',
          color: 'white',
          marginBottom: '24px',
          textAlign: 'center'
        }}>
          <h2 style={{ margin: '0 0 8px 0', fontSize: '24px' }}>CABA</h2>
          <p style={{ margin: 0, opacity: 0.9, fontSize: '14px' }}>Compare & Book Rides</p>
        </div>

        {/* App Information */}
        <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', marginBottom: '16px' }}>
          {[
            { icon: '📱', title: 'About CABA', subtitle: 'Learn more about our platform' },
            { icon: '🎯', title: 'How it Works', subtitle: 'Compare rides across platforms' },
            { icon: '💳', title: 'Pricing', subtitle: 'Transparent pricing model' },
            { icon: '🛡️', title: 'Safety & Security', subtitle: 'Your safety is our priority' }
          ].map((item, index) => (
            <div
              key={index}
              style={{
                padding: '16px 20px',
                borderBottom: index < 3 ? '1px solid #f0f0f0' : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => (e.target as HTMLElement).style.background = '#f8f9fa'}
              onMouseLeave={(e) => (e.target as HTMLElement).style.background = 'white'}
            >
              <div style={{ fontSize: '24px' }}>{item.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '600', color: '#333', fontSize: '16px' }}>{item.title}</div>
                <div style={{ color: '#666', fontSize: '14px' }}>{item.subtitle}</div>
              </div>
              <div style={{ color: '#ccc', fontSize: '18px' }}>›</div>
            </div>
          ))}
        </div>

        {/* Contact & Support */}
        <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', marginBottom: '16px' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #f0f0f0' }}>
            <h3 style={{ margin: '0 0 16px 0', color: '#2c3e50', fontSize: '18px' }}>Contact & Support</h3>
            
            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontWeight: '600', color: '#333', fontSize: '14px', marginBottom: '4px' }}>
                📞 Phone Support
              </div>
              <div style={{ color: '#666', fontSize: '14px' }}>
                Call +91-9981910866 for instant ride booking
              </div>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontWeight: '600', color: '#333', fontSize: '14px', marginBottom: '4px' }}>
                ✉️ Email Support
              </div>
              <div style={{ color: '#666', fontSize: '14px' }}>
                support@caba.app
              </div>
            </div>

            <div>
              <div style={{ fontWeight: '600', color: '#333', fontSize: '14px', marginBottom: '4px' }}>
                🌐 Website
              </div>
              <div style={{ color: '#666', fontSize: '14px' }}>
                www.caba.app
              </div>
            </div>
          </div>
        </div>

        {/* Legal */}
        <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', marginBottom: '16px' }}>
          {[
            { title: 'Terms of Service', subtitle: 'Platform usage terms' },
            { title: 'Privacy Policy', subtitle: 'How we protect your data' },
            { title: 'Cookie Policy', subtitle: 'Website cookies information' },
            { title: 'Refund Policy', subtitle: 'Cancellation and refunds' }
          ].map((item, index) => (
            <div
              key={index}
              style={{
                padding: '16px 20px',
                borderBottom: index < 3 ? '1px solid #f0f0f0' : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => (e.target as HTMLElement).style.background = '#f8f9fa'}
              onMouseLeave={(e) => (e.target as HTMLElement).style.background = 'white'}
            >
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '600', color: '#333', fontSize: '16px' }}>{item.title}</div>
                <div style={{ color: '#666', fontSize: '14px' }}>{item.subtitle}</div>
              </div>
              <div style={{ color: '#ccc', fontSize: '18px' }}>›</div>
            </div>
          ))}
        </div>

        <div style={{
          textAlign: 'center',
          padding: '20px',
          color: '#666',
          fontSize: '14px'
        }}>
          <p>© 2024 CABA - Compare & Book Rides</p>
          <p>Version 1.0.0</p>
        </div>
      </div>
    </AppLayout>
  );
};

export default MoreScreen;