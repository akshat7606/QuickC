
import AppLayout from './AppLayout';

const ProfileScreen = () => {
  return (
    <AppLayout title="Profile">
      <div className="screen" style={{ padding: '20px' }}>
        <div style={{
          background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
          borderRadius: '12px',
          padding: '24px',
          color: 'white',
          marginBottom: '24px',
          textAlign: 'center'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '32px',
            margin: '0 auto 16px'
          }}>
            👤
          </div>
          <h2 style={{ margin: '0 0 8px 0', fontSize: '24px' }}>John Doe</h2>
          <p style={{ margin: 0, opacity: 0.9 }}>john@example.com</p>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '24px',
            marginTop: '20px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '20px', fontWeight: '700' }}>47</div>
              <div style={{ fontSize: '12px', opacity: 0.8 }}>Trips</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '20px', fontWeight: '700' }}>4.8</div>
              <div style={{ fontSize: '12px', opacity: 0.8 }}>Rating</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '20px', fontWeight: '700' }}>₹2,340</div>
              <div style={{ fontSize: '12px', opacity: 0.8 }}>Saved</div>
            </div>
          </div>
        </div>

        {/* Menu Options */}
        <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', marginBottom: '16px' }}>
          {[
            { icon: '🚗', title: 'Trip History', subtitle: 'View your past rides' },
            { icon: '💳', title: 'Payment Methods', subtitle: 'Manage cards and payments' },
            { icon: '⭐', title: 'Favorites', subtitle: 'Saved locations' },
            { icon: '🎁', title: 'Offers & Rewards', subtitle: 'Available discounts' }
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

        {/* Settings */}
        <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', marginBottom: '16px' }}>
          {[
            { icon: '⚙️', title: 'Settings', subtitle: 'App preferences' },
            { icon: '🛡️', title: 'Privacy & Safety', subtitle: 'Your safety controls' },
            { icon: '❓', title: 'Help & Support', subtitle: 'Get assistance' },
            { icon: '📄', title: 'Legal', subtitle: 'Terms and policies' }
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

        {/* Logout */}
        <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden' }}>
          <div
            style={{
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              cursor: 'pointer',
              color: '#dc3545'
            }}
            onMouseEnter={(e) => (e.target as HTMLElement).style.background = '#f8f9fa'}
            onMouseLeave={(e) => (e.target as HTMLElement).style.background = 'white'}
          >
            <div style={{ fontSize: '24px' }}>🚪</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: '600', fontSize: '16px' }}>Logout</div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ProfileScreen;